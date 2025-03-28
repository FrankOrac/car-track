<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Vehicle;
use App\Models\Location;
use App\Models\Geofence;
use App\Models\Alert;
use Illuminate\Support\Facades\Validator;

class LocationController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param  int  $vehicleId
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request, $vehicleId)
    {
        $vehicle = $request->user()->vehicles()->findOrFail($vehicleId);
        
        $locations = $vehicle->locations()
                            ->orderBy('created_at', 'desc')
                            ->paginate(50);
        
        return response()->json([
            'locations' => $locations
        ]);
    }

    /**
     * Get the latest location for a vehicle.
     *
     * @param  int  $vehicleId
     * @return \Illuminate\Http\Response
     */
    public function latest(Request $request, $vehicleId)
    {
        $vehicle = $request->user()->vehicles()->findOrFail($vehicleId);
        $location = $vehicle->locations()->latest()->first();
        
        if (!$location) {
            return response()->json([
                'message' => 'No location data available for this vehicle'
            ], 404);
        }
        
        return response()->json([
            'location' => $location
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $vehicleId
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request, $vehicleId)
    {
        $vehicle = $request->user()->vehicles()->findOrFail($vehicleId);
        
        $validator = Validator::make($request->all(), [
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'speed' => 'nullable|numeric|min:0',
            'address' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $location = $vehicle->locations()->create($request->all());

        // Check for speed alerts
        $this->checkSpeedAlert($vehicle, $location);
        
        // Check for geofence alerts
        $this->checkGeofenceAlerts($vehicle, $location);

        return response()->json([
            'message' => 'Location added successfully',
            'location' => $location
        ], 201);
    }

    /**
     * Check if speed limit is exceeded and create alert
     */
    protected function checkSpeedAlert($vehicle, $location)
    {
        // Example speed limit (you might want to make this configurable)
        $speedLimit = 120; // km/h
        
        if ($location->speed && $location->speed > $speedLimit) {
            Alert::create([
                'vehicle_id' => $vehicle->id,
                'type' => 'speed',
                'title' => 'Speed Limit Exceeded',
                'description' => "Vehicle exceeded speed limit of {$speedLimit} km/h. Current speed: {$location->speed} km/h.",
                'data' => [
                    'speed' => $location->speed,
                    'speed_limit' => $speedLimit,
                    'latitude' => $location->latitude,
                    'longitude' => $location->longitude,
                    'timestamp' => $location->created_at
                ]
            ]);
        }
    }

    /**
     * Check if vehicle has entered or exited any geofences and create alerts
     */
    protected function checkGeofenceAlerts($vehicle, $location)
    {
        $geofences = $vehicle->geofences;
        
        foreach ($geofences as $geofence) {
            if (!$geofence->is_active) {
                continue;
            }
            
            $isInside = $this->isInsideGeofence($location, $geofence);
            $wasInside = $this->wasInsideGeofence($vehicle, $geofence);
            
            if ($isInside && !$wasInside) {
                // Vehicle entered geofence
                Alert::create([
                    'vehicle_id' => $vehicle->id,
                    'type' => 'geofence_enter',
                    'title' => "Entered Geofence: {$geofence->name}",
                    'description' => "Vehicle entered the {$geofence->name} geofence area.",
                    'data' => [
                        'geofence_id' => $geofence->id,
                        'geofence_name' => $geofence->name,
                        'latitude' => $location->latitude,
                        'longitude' => $location->longitude,
                        'timestamp' => $location->created_at
                    ]
                ]);
            } else if (!$isInside && $wasInside) {
                // Vehicle exited geofence
                Alert::create([
                    'vehicle_id' => $vehicle->id,
                    'type' => 'geofence_exit',
                    'title' => "Exited Geofence: {$geofence->name}",
                    'description' => "Vehicle exited the {$geofence->name} geofence area.",
                    'data' => [
                        'geofence_id' => $geofence->id,
                        'geofence_name' => $geofence->name,
                        'latitude' => $location->latitude,
                        'longitude' => $location->longitude,
                        'timestamp' => $location->created_at
                    ]
                ]);
            }
        }
    }

    /**
     * Check if location is inside a geofence
     */
    protected function isInsideGeofence($location, $geofence)
    {
        if ($geofence->type === 'circle') {
            // Calculate distance from geofence center to location
            $distance = $this->calculateDistance(
                $geofence->latitude, 
                $geofence->longitude, 
                $location->latitude, 
                $location->longitude
            );
            
            // If distance is less than radius, location is inside geofence
            return $distance <= $geofence->radius;
        } else if ($geofence->type === 'polygon') {
            // Implementation for polygon geofence would go here
            // This is more complex and would need a point-in-polygon algorithm
            return false;
        }
        
        return false;
    }

    /**
     * Check if vehicle was inside geofence based on previous location
     */
    protected function wasInsideGeofence($vehicle, $geofence)
    {
        $previousLocation = $vehicle->locations()
                                ->where('id', '!=', request()->route('location'))
                                ->latest()
                                ->first();
        
        if (!$previousLocation) {
            return false;
        }
        
        return $this->isInsideGeofence($previousLocation, $geofence);
    }

    /**
     * Calculate distance between two points using Haversine formula
     */
    protected function calculateDistance($lat1, $lon1, $lat2, $lon2)
    {
        $earthRadius = 6371000; // in meters
        
        $dLat = deg2rad($lat2 - $lat1);
        $dLon = deg2rad($lon2 - $lon1);
        
        $a = sin($dLat/2) * sin($dLat/2) +
             cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
             sin($dLon/2) * sin($dLon/2);
        
        $c = 2 * atan2(sqrt($a), sqrt(1-$a));
        
        return $earthRadius * $c;
    }
} 
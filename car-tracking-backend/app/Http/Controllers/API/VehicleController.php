<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Vehicle;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class VehicleController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $vehicles = $request->user()->vehicles()->with('latestLocation')->get();
        
        return response()->json([
            'vehicles' => $vehicles
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'make' => 'required|string|max:255',
            'model' => 'required|string|max:255',
            'year' => 'required|string|max:4',
            'license_plate' => 'required|string|max:20|unique:vehicles',
            'vin' => 'required|string|max:17|unique:vehicles',
            'color' => 'nullable|string|max:50',
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $vehicleData = $request->except('image');
        
        // Handle image upload
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('vehicles', 'public');
            $vehicleData['image'] = $path;
        }

        $vehicle = $request->user()->vehicles()->create($vehicleData);

        return response()->json([
            'message' => 'Vehicle created successfully',
            'vehicle' => $vehicle
        ], 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request, $id)
    {
        $vehicle = $request->user()->vehicles()->with(['latestLocation', 'maintenanceRecords', 'geofences'])->findOrFail($id);
        
        return response()->json([
            'vehicle' => $vehicle
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $vehicle = $request->user()->vehicles()->findOrFail($id);
        
        $validator = Validator::make($request->all(), [
            'make' => 'sometimes|required|string|max:255',
            'model' => 'sometimes|required|string|max:255',
            'year' => 'sometimes|required|string|max:4',
            'license_plate' => 'sometimes|required|string|max:20|unique:vehicles,license_plate,' . $id,
            'vin' => 'sometimes|required|string|max:17|unique:vehicles,vin,' . $id,
            'color' => 'nullable|string|max:50',
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
            'is_active' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $vehicleData = $request->except('image');
        
        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($vehicle->image) {
                Storage::disk('public')->delete($vehicle->image);
            }
            
            $path = $request->file('image')->store('vehicles', 'public');
            $vehicleData['image'] = $path;
        }

        $vehicle->update($vehicleData);

        return response()->json([
            'message' => 'Vehicle updated successfully',
            'vehicle' => $vehicle
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, $id)
    {
        $vehicle = $request->user()->vehicles()->findOrFail($id);
        
        // Delete vehicle image if exists
        if ($vehicle->image) {
            Storage::disk('public')->delete($vehicle->image);
        }
        
        $vehicle->delete();

        return response()->json([
            'message' => 'Vehicle deleted successfully'
        ]);
    }
} 
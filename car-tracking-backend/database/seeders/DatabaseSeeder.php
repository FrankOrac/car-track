<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\SubscriptionPlan;
use App\Models\Vehicle;
use App\Models\Location;
use App\Models\Geofence;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // Create subscription plans
        $this->createSubscriptionPlans();
        
        // Create admin user
        $this->createAdminUser();
        
        // Create demo users
        $this->createDemoUsers();
        
        // Create demo vehicles with locations
        $this->createDemoVehiclesWithLocations();
        
        // Create demo geofences
        $this->createDemoGeofences();
    }
    
    /**
     * Create subscription plans
     */
    private function createSubscriptionPlans()
    {
        $plans = [
            [
                'name' => 'Basic',
                'description' => 'Track up to 1 vehicle with basic features',
                'price' => 9.99,
                'duration_in_days' => 30,
                'max_vehicles' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'Standard',
                'description' => 'Track up to 5 vehicles with all features',
                'price' => 29.99,
                'duration_in_days' => 30,
                'max_vehicles' => 5,
                'is_active' => true,
            ],
            [
                'name' => 'Premium',
                'description' => 'Track up to 20 vehicles with premium support',
                'price' => 99.99,
                'duration_in_days' => 30,
                'max_vehicles' => 20,
                'is_active' => true,
            ],
            [
                'name' => 'Enterprise',
                'description' => 'Custom solution for large fleets',
                'price' => 499.99,
                'duration_in_days' => 30,
                'max_vehicles' => 100,
                'is_active' => true,
            ],
        ];
        
        foreach ($plans as $plan) {
            SubscriptionPlan::create($plan);
        }
    }
    
    /**
     * Create admin user
     */
    private function createAdminUser()
    {
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
            'role' => 'admin',
        ]);
    }
    
    /**
     * Create demo users
     */
    private function createDemoUsers()
    {
        // Regular user
        User::create([
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
            'role' => 'user',
            'phone_number' => '123-456-7890',
            'address' => '123 Main St, Anytown, USA',
            'subscription_plan_id' => 1, // Basic plan
            'subscription_ends_at' => now()->addDays(30),
        ]);
        
        // Company user
        User::create([
            'name' => 'Jane Smith',
            'email' => 'jane@example.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
            'role' => 'company',
            'phone_number' => '987-654-3210',
            'address' => '456 Business Ave, Corptown, USA',
            'company_name' => 'Acme Delivery Services',
            'subscription_plan_id' => 3, // Premium plan
            'subscription_ends_at' => now()->addDays(30),
        ]);
    }
    
    /**
     * Create demo vehicles with locations
     */
    private function createDemoVehiclesWithLocations()
    {
        $john = User::where('email', 'john@example.com')->first();
        $jane = User::where('email', 'jane@example.com')->first();
        
        // Create vehicles for John
        $johnVehicle = Vehicle::create([
            'user_id' => $john->id,
            'make' => 'Toyota',
            'model' => 'Camry',
            'year' => '2020',
            'license_plate' => 'ABC123',
            'vin' => '1HGBH41JXMN109186',
            'color' => 'Blue',
            'description' => 'Personal car',
            'is_active' => true,
        ]);
        
        // Create current and historical locations for John's vehicle
        $this->createVehicleLocations($johnVehicle->id);
        
        // Create vehicles for Jane's company
        $vehicles = [
            [
                'make' => 'Ford',
                'model' => 'Transit',
                'year' => '2021',
                'license_plate' => 'DEF456',
                'vin' => '2FMZA5142XBA91486',
                'color' => 'White',
                'description' => 'Delivery van #1',
            ],
            [
                'make' => 'Ford',
                'model' => 'Transit',
                'year' => '2021',
                'license_plate' => 'GHI789',
                'vin' => '3CZRE38554G701352',
                'color' => 'White',
                'description' => 'Delivery van #2',
            ],
            [
                'make' => 'Mercedes-Benz',
                'model' => 'Sprinter',
                'year' => '2022',
                'license_plate' => 'JKL012',
                'vin' => '4F2YU08102KM24781',
                'color' => 'Silver',
                'description' => 'Executive delivery van',
            ],
        ];
        
        foreach ($vehicles as $vehicle) {
            $v = Vehicle::create(array_merge($vehicle, [
                'user_id' => $jane->id,
                'is_active' => true,
            ]));
            
            $this->createVehicleLocations($v->id);
        }
    }
    
    /**
     * Create random locations for a vehicle
     */
    private function createVehicleLocations($vehicleId)
    {
        // New York City area as base
        $baseLatitude = 40.7128;
        $baseLongitude = -74.0060;
        
        // Create 20 historical locations at 15-minute intervals
        for ($i = 20; $i >= 0; $i--) {
            $timestamp = now()->subMinutes($i * 15);
            
            // Random slight movement (this is simplified)
            $latitude = $baseLatitude + (rand(-10, 10) / 1000);
            $longitude = $baseLongitude + (rand(-10, 10) / 1000);
            
            Location::create([
                'vehicle_id' => $vehicleId,
                'latitude' => $latitude,
                'longitude' => $longitude,
                'speed' => rand(0, 80), // Random speed between 0-80 km/h
                'created_at' => $timestamp,
                'updated_at' => $timestamp,
            ]);
        }
    }
    
    /**
     * Create demo geofences
     */
    private function createDemoGeofences()
    {
        $john = User::where('email', 'john@example.com')->first();
        $jane = User::where('email', 'jane@example.com')->first();
        
        // Home geofence for John
        $johnGeofence = Geofence::create([
            'user_id' => $john->id,
            'name' => 'Home',
            'description' => 'My home area',
            'type' => 'circle',
            'latitude' => 40.7128,
            'longitude' => -74.0060,
            'radius' => 500, // 500 meters
            'is_active' => true,
        ]);
        
        // Attach John's vehicle to the geofence
        $johnVehicle = Vehicle::where('user_id', $john->id)->first();
        $johnGeofence->vehicles()->attach($johnVehicle->id);
        
        // Office geofence for Jane
        $janeGeofence = Geofence::create([
            'user_id' => $jane->id,
            'name' => 'Office',
            'description' => 'Company headquarters',
            'type' => 'circle',
            'latitude' => 40.7580,
            'longitude' => -73.9855,
            'radius' => 1000, // 1000 meters
            'is_active' => true,
        ]);
        
        // Attach all of Jane's vehicles to the geofence
        $janeVehicles = Vehicle::where('user_id', $jane->id)->get();
        foreach ($janeVehicles as $vehicle) {
            $janeGeofence->vehicles()->attach($vehicle->id);
        }
        
        // Delivery area geofence for Jane
        $deliveryGeofence = Geofence::create([
            'user_id' => $jane->id,
            'name' => 'Delivery Zone',
            'description' => 'Primary delivery area',
            'type' => 'circle',
            'latitude' => 40.7300,
            'longitude' => -73.9950,
            'radius' => 5000, // 5000 meters
            'is_active' => true,
        ]);
        
        // Attach all of Jane's vehicles to the delivery geofence
        foreach ($janeVehicles as $vehicle) {
            $deliveryGeofence->vehicles()->attach($vehicle->id);
        }
    }
}

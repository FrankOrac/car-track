<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\VehicleController;
use App\Http\Controllers\API\LocationController;
use App\Http\Controllers\API\GeofenceController;
use App\Http\Controllers\API\MaintenanceRecordController;
use App\Http\Controllers\API\AlertController;
use App\Http\Controllers\API\SubscriptionPlanController;
use App\Http\Controllers\API\PaymentController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/subscription-plans', [SubscriptionPlanController::class, 'index']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // User profile
    Route::get('/user', [AuthController::class, 'user']);
    Route::put('/user', [UserController::class, 'update']);
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Vehicles
    Route::apiResource('vehicles', VehicleController::class);
    
    // Locations
    Route::get('/vehicles/{vehicle}/locations', [LocationController::class, 'index']);
    Route::get('/vehicles/{vehicle}/locations/latest', [LocationController::class, 'latest']);
    Route::post('/vehicles/{vehicle}/locations', [LocationController::class, 'store']);
    
    // Maintenance records
    Route::apiResource('vehicles.maintenance-records', MaintenanceRecordController::class)->shallow();
    
    // Geofences
    Route::apiResource('geofences', GeofenceController::class);
    Route::post('/geofences/{geofence}/vehicles/{vehicle}', [GeofenceController::class, 'attachVehicle']);
    Route::delete('/geofences/{geofence}/vehicles/{vehicle}', [GeofenceController::class, 'detachVehicle']);
    
    // Alerts
    Route::get('/vehicles/{vehicle}/alerts', [AlertController::class, 'index']);
    Route::post('/vehicles/{vehicle}/alerts', [AlertController::class, 'store']);
    Route::put('/alerts/{alert}/mark-as-read', [AlertController::class, 'markAsRead']);
    
    // Subscriptions and payments
    Route::post('/subscribe', [PaymentController::class, 'subscribe']);
    Route::get('/user/subscription', [UserController::class, 'subscription']);
    Route::get('/user/payments', [PaymentController::class, 'userPayments']);
});

// Admin routes
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::apiResource('users', UserController::class)->except(['update']);
    Route::apiResource('subscription-plans', SubscriptionPlanController::class)->except(['index']);
    Route::get('/payments', [PaymentController::class, 'index']);
});

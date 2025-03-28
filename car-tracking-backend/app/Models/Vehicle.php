<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'make',
        'model',
        'year',
        'license_plate',
        'vin',
        'color',
        'image',
        'description',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Get the user that owns the vehicle.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the locations for the vehicle.
     */
    public function locations()
    {
        return $this->hasMany(Location::class);
    }

    /**
     * Get the latest location for the vehicle.
     */
    public function latestLocation()
    {
        return $this->hasOne(Location::class)->latest();
    }

    /**
     * Get the maintenance records for the vehicle.
     */
    public function maintenanceRecords()
    {
        return $this->hasMany(MaintenanceRecord::class);
    }

    /**
     * Get the alerts for the vehicle.
     */
    public function alerts()
    {
        return $this->hasMany(Alert::class);
    }

    /**
     * The geofences that belong to the vehicle.
     */
    public function geofences()
    {
        return $this->belongsToMany(Geofence::class);
    }
} 
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Geofence extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'name',
        'description',
        'type',
        'latitude',
        'longitude',
        'radius',
        'coordinates',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'latitude' => 'float',
        'longitude' => 'float',
        'radius' => 'float',
        'coordinates' => 'array',
        'is_active' => 'boolean',
    ];

    /**
     * Get the user that owns the geofence.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * The vehicles that belong to the geofence.
     */
    public function vehicles()
    {
        return $this->belongsToMany(Vehicle::class);
    }
} 
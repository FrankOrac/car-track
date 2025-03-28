<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubscriptionPlan extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'description',
        'price',
        'duration_in_days',
        'max_vehicles',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'price' => 'float',
        'duration_in_days' => 'integer',
        'max_vehicles' => 'integer',
        'is_active' => 'boolean',
    ];

    /**
     * Get the users for the subscription plan.
     */
    public function users()
    {
        return $this->hasMany(User::class);
    }

    /**
     * Get the payments for the subscription plan.
     */
    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
} 
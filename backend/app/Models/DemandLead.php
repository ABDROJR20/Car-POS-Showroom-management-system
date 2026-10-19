<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DemandLead extends Model
{
    use HasFactory;

    protected $fillable = [
        'demand_no',
        'customer',
        'phone',
        'city',
        'make',
        'model',
        'variant',
        'min_year',
        'max_year',
        'budget',
        'color',
        'transmission',
        'fuel_type',
        'max_mileage_km',
        'notes',
        'status',
        'matched_vehicle_id',
        'matched_vehicle_summary',
        'date',
    ];

    protected $casts = [
        'min_year' => 'integer',
        'max_year' => 'integer',
        'budget' => 'decimal:2',
        'max_mileage_km' => 'integer',
        'date' => 'date',
    ];

    public function matchedVehicle()
    {
        return $this->belongsTo(Vehicle::class, 'matched_vehicle_id');
    }
}

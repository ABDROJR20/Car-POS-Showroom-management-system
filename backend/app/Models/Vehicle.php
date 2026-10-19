<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Vehicle extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'stock_code',
        'registration_no',
        'chassis_no',
        'engine_no',
        'make',
        'model',
        'variant',
        'model_year',
        'color',
        'fuel_type',
        'transmission',
        'engine_capacity_cc',
        'mileage_km',
        'registration_city',
        'assembly',
        'ownership_type',
        'owner_name',
        'owner_phone',
        'owner_cnic',
        'owner_payable',
        'investor_profit_share_pct',
        'cost_price',
        'demand_price',
        'minimum_price',
        'sale_price',
        'total_expenses',
        'status',
        'condition_notes',
        'primary_image',
        'purchase_date',
        'sale_date',
    ];

    protected $casts = [
        'model_year' => 'integer',
        'engine_capacity_cc' => 'integer',
        'mileage_km' => 'integer',
        'owner_payable' => 'decimal:2',
        'investor_profit_share_pct' => 'decimal:2',
        'cost_price' => 'decimal:2',
        'demand_price' => 'decimal:2',
        'minimum_price' => 'decimal:2',
        'sale_price' => 'decimal:2',
        'total_expenses' => 'decimal:2',
        'purchase_date' => 'date',
        'sale_date' => 'date',
    ];

    public function images()
    {
        return $this->hasMany(VehicleImage::class);
    }

    public function documents()
    {
        return $this->hasMany(VehicleDocument::class);
    }

    public function purchases()
    {
        return $this->hasMany(Purchase::class);
    }

    public function sales()
    {
        return $this->hasMany(Sale::class);
    }

    public function expenses()
    {
        return $this->hasMany(Expense::class);
    }

    public function getTotalCostAttribute(): float
    {
        return (float) ($this->cost_price + $this->total_expenses);
    }
}

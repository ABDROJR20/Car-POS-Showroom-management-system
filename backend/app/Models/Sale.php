<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sale extends Model
{
    use HasFactory;

    protected $fillable = [
        'invoice_no',
        'vehicle_id',
        'user_id',
        'buyer_name',
        'buyer_phone',
        'buyer_cnic',
        'buyer_city',
        'buyer_address',
        'ownership_type',
        'cost_price',
        'vehicle_expenses',
        'total_vehicle_cost',
        'negotiated_price',
        'transfer_fee',
        'extra_charges',
        'discount',
        'net_sale_price',
        'amount_received',
        'remaining_balance',
        'payment_status',
        'payment_method',
        'showroom_commission',
        'broker_commission',
        'broker_name',
        'broker_phone',
        'agent_commission',
        'agent_name',
        'gross_profit',
        'owner_payable',
        'showroom_net_earnings',
        'status',
        'sale_date',
        'delivery_date',
        'terms_and_conditions',
        'notes',
    ];

    protected $casts = [
        'cost_price' => 'decimal:2',
        'vehicle_expenses' => 'decimal:2',
        'total_vehicle_cost' => 'decimal:2',
        'negotiated_price' => 'decimal:2',
        'transfer_fee' => 'decimal:2',
        'extra_charges' => 'decimal:2',
        'discount' => 'decimal:2',
        'net_sale_price' => 'decimal:2',
        'amount_received' => 'decimal:2',
        'remaining_balance' => 'decimal:2',
        'showroom_commission' => 'decimal:2',
        'broker_commission' => 'decimal:2',
        'agent_commission' => 'decimal:2',
        'gross_profit' => 'decimal:2',
        'owner_payable' => 'decimal:2',
        'showroom_net_earnings' => 'decimal:2',
        'sale_date' => 'date',
        'delivery_date' => 'date',
    ];

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function payments()
    {
        return $this->hasMany(SalePayment::class);
    }

    public function commissions()
    {
        return $this->hasMany(Commission::class);
    }
}

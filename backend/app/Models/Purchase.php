<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Purchase extends Model
{
    use HasFactory;

    protected $fillable = [
        'purchase_no',
        'vehicle_id',
        'user_id',
        'seller_name',
        'seller_phone',
        'seller_cnic',
        'seller_city',
        'seller_address',
        'ownership_type',
        'agreed_purchase_price',
        'token_advance_paid',
        'total_amount_paid',
        'remaining_payable',
        'payment_status',
        'payment_method',
        'purchase_date',
        'terms_and_conditions',
        'notes',
    ];

    protected $casts = [
        'agreed_purchase_price' => 'decimal:2',
        'token_advance_paid' => 'decimal:2',
        'total_amount_paid' => 'decimal:2',
        'remaining_payable' => 'decimal:2',
        'purchase_date' => 'date',
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
        return $this->hasMany(PurchasePayment::class);
    }
}

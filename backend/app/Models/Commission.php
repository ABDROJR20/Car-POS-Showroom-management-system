<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Commission extends Model
{
    use HasFactory;

    protected $fillable = [
        'voucher_no',
        'sale_id',
        'vehicle_id',
        'recipient_name',
        'party_type',
        'amount',
        'status',
        'date',
        'paid_date',
        'payment_account',
        'notes',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'date' => 'date',
        'paid_date' => 'date',
    ];

    public function sale()
    {
        return $this->belongsTo(Sale::class);
    }

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }
}

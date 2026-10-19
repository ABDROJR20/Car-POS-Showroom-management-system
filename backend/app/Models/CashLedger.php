<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CashLedger extends Model
{
    use HasFactory;

    protected $fillable = [
        'voucher_no',
        'cash_account_id',
        'account_name',
        'date',
        'type',
        'category',
        'amount',
        'running_balance',
        'reference_type',
        'reference_id',
        'recorded_by',
        'narration',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'running_balance' => 'decimal:2',
        'date' => 'date',
    ];

    public function account()
    {
        return $this->belongsTo(CashAccount::class, 'cash_account_id');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Expense extends Model
{
    use HasFactory;

    protected $fillable = [
        'voucher_no',
        'expense_category_id',
        'category_name',
        'amount',
        'paid_to',
        'account_name',
        'date',
        'is_vehicle_linked',
        'vehicle_id',
        'vehicle_summary',
        'recorded_by',
        'narration',
        'receipt_attachment',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'date' => 'date',
        'is_vehicle_linked' => 'boolean',
    ];

    public function category()
    {
        return $this->belongsTo(ExpenseCategory::class, 'expense_category_id');
    }

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Commission;
use App\Models\CashLedger;
use App\Models\CashAccount;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CommissionController extends Controller
{
    public function index()
    {
        $commissions = Commission::with(['sale', 'vehicle'])->orderBy('id', 'desc')->get();

        return response()->json([
            'status' => 'success',
            'data' => $commissions,
        ]);
    }

    public function pay(Request $request, $id)
    {
        $commission = Commission::with(['sale', 'vehicle'])->findOrFail($id);

        if ($commission->status === 'PAID') {
            return response()->json(['status' => 'error', 'message' => 'Commission voucher is already settled.'], 422);
        }

        $validated = $request->validate([
            'payment_account' => 'nullable|string',
            'paid_date' => 'required|date',
            'notes' => 'nullable|string',
        ]);

        return DB::transaction(function () use ($commission, $validated, $request) {
            $accountName = $validated['payment_account'] ?? 'Main Cash Safe (Counter)';
            $amount = (float) $commission->amount;

            $commission->update([
                'status' => 'PAID',
                'paid_date' => $validated['paid_date'],
                'payment_account' => $accountName,
                'notes' => $validated['notes'] ?? $commission->notes,
            ]);

            // Deduct from cash account
            $account = CashAccount::firstOrCreate(['name' => $accountName]);
            $account->current_balance -= $amount;
            $account->save();

            $ledCount = CashLedger::count();
            CashLedger::create([
                'voucher_no' => 'LED-' . date('Y') . '-' . str_pad($ledCount + 1, 3, '0', STR_PAD_LEFT),
                'cash_account_id' => $account->id,
                'account_name' => $account->name,
                'date' => $validated['paid_date'],
                'type' => 'CREDIT',
                'category' => 'COMMISSION_PAYOUT',
                'amount' => $amount,
                'running_balance' => $account->current_balance,
                'reference_type' => 'Commission',
                'reference_id' => $commission->id,
                'recorded_by' => $request->user()?->name ?? 'Admin',
                'narration' => "Commission payout to {$commission->recipient_name} ({$commission->party_type}) for voucher {$commission->voucher_no}",
            ]);

            return response()->json([
                'status' => 'success',
                'message' => "Commission voucher {$commission->voucher_no} settled and cash disbursed.",
                'data' => $commission,
            ]);
        });
    }
}

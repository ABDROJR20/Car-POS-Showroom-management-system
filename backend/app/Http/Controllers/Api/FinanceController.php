<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Expense;
use App\Models\ExpenseCategory;
use App\Models\CashLedger;
use App\Models\CashAccount;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FinanceController extends Controller
{
    public function getAccountsSummary()
    {
        $accounts = CashAccount::where('is_active', true)->get();
        $safeAccount = $accounts->firstWhere('type', 'CASH_SAFE');
        $bankAccounts = $accounts->where('type', 'BANK_ACCOUNT');

        $cashInHand = $safeAccount ? (float) $safeAccount->current_balance : 0.00;
        $totalBank = (float) $bankAccounts->sum('current_balance');
        $totalLiquidity = $cashInHand + $totalBank;

        // Inflows and Outflows
        $totalInflows = (float) CashLedger::where('type', 'DEBIT')->sum('amount');
        $totalOutflows = (float) CashLedger::where('type', 'CREDIT')->sum('amount');

        return response()->json([
            'status' => 'success',
            'data' => [
                'cashInHand' => $cashInHand,
                'bankBalance' => $totalBank,
                'totalLiquidity' => $totalLiquidity,
                'totalInflows' => $totalInflows,
                'totalOutflows' => $totalOutflows,
                'accounts' => $accounts,
            ],
        ]);
    }

    public function getLedger(Request $request)
    {
        $query = CashLedger::with('account');

        if ($request->has('type') && $request->type !== 'ALL') {
            $query->where('type', $request->type);
        }

        if ($request->has('account') && $request->account !== 'ALL') {
            $query->where('account_name', 'like', "%{$request->account}%");
        }

        if ($request->has('start_date') && !empty($request->start_date)) {
            $query->where('date', '>=', $request->start_date);
        }

        if ($request->has('end_date') && !empty($request->end_date)) {
            $query->where('date', '<=', $request->end_date);
        }

        $entries = $query->orderBy('id', 'desc')->get();

        return response()->json([
            'status' => 'success',
            'data' => $entries,
        ]);
    }

    public function getExpenses(Request $request)
    {
        $query = Expense::with(['category', 'vehicle']);

        if ($request->has('is_vehicle_linked') && $request->is_vehicle_linked !== 'ALL') {
            $query->where('is_vehicle_linked', filter_var($request->is_vehicle_linked, FILTER_VALIDATE_BOOLEAN));
        }

        if ($request->has('start_date') && !empty($request->start_date)) {
            $query->where('date', '>=', $request->start_date);
        }

        if ($request->has('end_date') && !empty($request->end_date)) {
            $query->where('date', '<=', $request->end_date);
        }

        $expenses = $query->orderBy('id', 'desc')->get();

        return response()->json([
            'status' => 'success',
            'data' => $expenses,
        ]);
    }

    public function storeExpense(Request $request)
    {
        $validated = $request->validate([
            'category_name' => 'required|string',
            'amount' => 'required|numeric|min:1',
            'paid_to' => 'required|string',
            'account_name' => 'nullable|string',
            'date' => 'required|date',
            'is_vehicle_linked' => 'nullable|boolean',
            'vehicle_id' => 'nullable|exists:vehicles,id',
            'narration' => 'nullable|string',
        ]);

        return DB::transaction(function () use ($validated, $request) {
            $amount = (float) $validated['amount'];
            $accountName = $validated['account_name'] ?? 'Main Cash Safe (Counter)';
            $isVehicleLinked = $request->boolean('is_vehicle_linked', false);
            $vehicleSummary = null;

            if ($isVehicleLinked && !empty($validated['vehicle_id'])) {
                $vehicle = Vehicle::findOrFail($validated['vehicle_id']);
                $vehicleSummary = "{$vehicle->make} {$vehicle->model} ({$vehicle->registration_no})";

                // CAPITALIZE EXPENSE TO VEHICLE TOTAL COST
                $vehicle->total_expenses += $amount;
                $vehicle->save();
            }

            $count = Expense::count();
            $voucherNo = 'EXP-' . date('Y') . '-' . str_pad($count + 1, 3, '0', STR_PAD_LEFT);

            $expense = Expense::create([
                'voucher_no' => $voucherNo,
                'category_name' => $validated['category_name'],
                'amount' => $amount,
                'paid_to' => $validated['paid_to'],
                'account_name' => $accountName,
                'date' => $validated['date'],
                'is_vehicle_linked' => $isVehicleLinked,
                'vehicle_id' => $validated['vehicle_id'] ?? null,
                'vehicle_summary' => $vehicleSummary,
                'recorded_by' => $request->user()?->name ?? 'Admin',
                'narration' => $validated['narration'] ?? null,
            ]);

            // Deduct from Cash Safe / Bank Account
            $account = CashAccount::firstOrCreate(
                ['name' => $accountName],
                ['type' => 'CASH_SAFE', 'opening_balance' => 2500000.00, 'current_balance' => 2500000.00]
            );
            $account->current_balance -= $amount;
            $account->save();

            $ledCount = CashLedger::count();
            CashLedger::create([
                'voucher_no' => 'LED-' . date('Y') . '-' . str_pad($ledCount + 1, 3, '0', STR_PAD_LEFT),
                'cash_account_id' => $account->id,
                'account_name' => $account->name,
                'date' => $validated['date'],
                'type' => 'CREDIT',
                'category' => $isVehicleLinked ? 'VEHICLE_EXPENSE' : 'OPERATING_OVERHEAD',
                'amount' => $amount,
                'running_balance' => $account->current_balance,
                'reference_type' => 'Expense',
                'reference_id' => $expense->id,
                'recorded_by' => $request->user()?->name ?? 'Admin',
                'narration' => "Expense: {$validated['category_name']} paid to {$validated['paid_to']}" . ($vehicleSummary ? " [{$vehicleSummary}]" : ""),
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Expense voucher recorded and ledger updated.',
                'data' => $expense,
            ], 201);
        });
    }

    public function transferFunds(Request $request)
    {
        $validated = $request->validate([
            'from_account' => 'required|string',
            'to_account' => 'required|string|different:from_account',
            'amount' => 'required|numeric|min:1',
            'date' => 'required|date',
            'notes' => 'nullable|string',
        ]);

        return DB::transaction(function () use ($validated, $request) {
            $amount = (float) $validated['amount'];
            $from = CashAccount::where('name', $validated['from_account'])->firstOrFail();
            $to = CashAccount::where('name', $validated['to_account'])->firstOrFail();

            if ($from->current_balance < $amount) {
                return response()->json(['status' => 'error', 'message' => 'Insufficient funds in source account.'], 422);
            }

            $from->current_balance -= $amount;
            $from->save();

            $to->current_balance += $amount;
            $to->save();

            // Debit destination
            $ledCount = CashLedger::count();
            CashLedger::create([
                'voucher_no' => 'LED-' . date('Y') . '-' . str_pad($ledCount + 1, 3, '0', STR_PAD_LEFT),
                'cash_account_id' => $to->id,
                'account_name' => $to->name,
                'date' => $validated['date'],
                'type' => 'DEBIT',
                'category' => 'TRANSFER_IN',
                'amount' => $amount,
                'running_balance' => $to->current_balance,
                'recorded_by' => $request->user()?->name ?? 'Admin',
                'narration' => "Transfer received from {$from->name}. {$validated['notes']}",
            ]);

            // Credit source
            $ledCount++;
            CashLedger::create([
                'voucher_no' => 'LED-' . date('Y') . '-' . str_pad($ledCount + 1, 3, '0', STR_PAD_LEFT),
                'cash_account_id' => $from->id,
                'account_name' => $from->name,
                'date' => $validated['date'],
                'type' => 'CREDIT',
                'category' => 'TRANSFER_OUT',
                'amount' => $amount,
                'running_balance' => $from->current_balance,
                'recorded_by' => $request->user()?->name ?? 'Admin',
                'narration' => "Transfer dispatched to {$to->name}. {$validated['notes']}",
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Internal transfer executed successfully.',
            ]);
        });
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Purchase;
use App\Models\PurchasePayment;
use App\Models\Vehicle;
use App\Models\CashLedger;
use App\Models\CashAccount;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PurchaseController extends Controller
{
    public function index()
    {
        $purchases = Purchase::with(['vehicle', 'payments', 'user'])->orderBy('id', 'desc')->get();

        return response()->json([
            'status' => 'success',
            'data' => $purchases,
        ]);
    }

    public function show($id)
    {
        $purchase = Purchase::with(['vehicle', 'payments', 'user'])->findOrFail($id);

        return response()->json([
            'status' => 'success',
            'data' => $purchase,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            // Vehicle info or existing vehicle_id
            'vehicle_id' => 'nullable|exists:vehicles,id',
            'vehicle_data' => 'nullable|array',
            'seller_name' => 'required|string',
            'seller_phone' => 'required|string',
            'seller_cnic' => 'nullable|string',
            'seller_city' => 'nullable|string',
            'seller_address' => 'nullable|string',
            'ownership_type' => 'required|in:Showroom,Client,Investor',
            'agreed_purchase_price' => 'required|numeric|min:0',
            'token_advance_paid' => 'required|numeric|min:0',
            'payment_method' => 'required|string',
            'purchase_date' => 'required|date',
            'notes' => 'nullable|string',
        ]);

        return DB::transaction(function () use ($validated, $request) {
            $vehicle = null;
            if (!empty($validated['vehicle_id'])) {
                $vehicle = Vehicle::findOrFail($validated['vehicle_id']);
            } elseif (!empty($validated['vehicle_data'])) {
                $vData = $validated['vehicle_data'];
                $count = Vehicle::count();
                $vData['stock_code'] = 'STK-' . date('Y') . '-' . str_pad($count + 1, 3, '0', STR_PAD_LEFT);
                $vData['ownership_type'] = $validated['ownership_type'];
                $vData['cost_price'] = $validated['agreed_purchase_price'];
                $vData['demand_price'] = $vData['demand_price'] ?? ($validated['agreed_purchase_price'] * 1.08);
                $vData['status'] = 'Available';
                $vData['purchase_date'] = $validated['purchase_date'];
                $vehicle = Vehicle::create($vData);
            } else {
                return response()->json(['status' => 'error', 'message' => 'Vehicle details are required.'], 422);
            }

            $price = (float) $validated['agreed_purchase_price'];
            $advance = (float) $validated['token_advance_paid'];
            $remaining = max(0, $price - $advance);
            $paymentStatus = $remaining <= 0 ? 'PAID_IN_FULL' : ($advance > 0 ? 'TOKEN_ADVANCE' : 'UNPAID');

            $count = Purchase::count();
            $purchaseNo = 'PUR-' . date('Y') . '-' . str_pad($count + 1, 3, '0', STR_PAD_LEFT);

            $purchase = Purchase::create([
                'purchase_no' => $purchaseNo,
                'vehicle_id' => $vehicle->id,
                'user_id' => $request->user()?->id,
                'seller_name' => $validated['seller_name'],
                'seller_phone' => $validated['seller_phone'],
                'seller_cnic' => $validated['seller_cnic'] ?? null,
                'seller_city' => $validated['seller_city'] ?? 'Islamabad',
                'seller_address' => $validated['seller_address'] ?? null,
                'ownership_type' => $validated['ownership_type'],
                'agreed_purchase_price' => $price,
                'token_advance_paid' => $advance,
                'total_amount_paid' => $advance,
                'remaining_payable' => $remaining,
                'payment_status' => $paymentStatus,
                'payment_method' => $validated['payment_method'],
                'purchase_date' => $validated['purchase_date'],
                'notes' => $validated['notes'] ?? null,
            ]);

            // If advance was paid, record payment and cash ledger outflow
            if ($advance > 0) {
                $payCount = PurchasePayment::count();
                $voucherNo = 'PV-' . date('Y') . '-' . str_pad($payCount + 1, 3, '0', STR_PAD_LEFT);

                PurchasePayment::create([
                    'voucher_no' => $voucherNo,
                    'purchase_id' => $purchase->id,
                    'amount' => $advance,
                    'payment_method' => $validated['payment_method'],
                    'account_name' => 'Main Cash Safe (Counter)',
                    'payment_date' => $validated['purchase_date'],
                    'recorded_by' => $request->user()?->name ?? 'Admin',
                    'notes' => "Advance token payment for {$vehicle->make} {$vehicle->model} ({$vehicle->registration_no})",
                ]);

                // Update Cash Safe Balance & Ledger
                $account = CashAccount::firstOrCreate(
                    ['name' => 'Main Cash Safe (Counter)'],
                    ['type' => 'CASH_SAFE', 'opening_balance' => 2500000.00, 'current_balance' => 2500000.00]
                );

                $account->current_balance -= $advance;
                $account->save();

                $ledCount = CashLedger::count();
                CashLedger::create([
                    'voucher_no' => 'LED-' . date('Y') . '-' . str_pad($ledCount + 1, 3, '0', STR_PAD_LEFT),
                    'cash_account_id' => $account->id,
                    'account_name' => $account->name,
                    'date' => $validated['purchase_date'],
                    'type' => 'CREDIT',
                    'category' => 'PURCHASE_OUTFLOW',
                    'amount' => $advance,
                    'running_balance' => $account->current_balance,
                    'reference_type' => 'Purchase',
                    'reference_id' => $purchase->id,
                    'recorded_by' => $request->user()?->name ?? 'Admin',
                    'narration' => "Purchase advance token disbursed to {$validated['seller_name']} for {$vehicle->make} {$vehicle->model} ({$vehicle->registration_no})",
                ]);
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Vehicle acquisition recorded and entered into showroom inventory.',
                'data' => $purchase->load(['vehicle', 'payments']),
            ], 201);
        });
    }

    public function recordPayment(Request $request, $id)
    {
        $purchase = Purchase::with('vehicle')->findOrFail($id);

        $validated = $request->validate([
            'amount' => 'required|numeric|min:1|max:' . $purchase->remaining_payable,
            'payment_method' => 'required|string',
            'account_name' => 'nullable|string',
            'payment_date' => 'required|date',
            'notes' => 'nullable|string',
        ]);

        return DB::transaction(function () use ($purchase, $validated, $request) {
            $amount = (float) $validated['amount'];
            $accountName = $validated['account_name'] ?? 'Main Cash Safe (Counter)';

            $payCount = PurchasePayment::count();
            $voucherNo = 'PV-' . date('Y') . '-' . str_pad($payCount + 1, 3, '0', STR_PAD_LEFT);

            $payment = PurchasePayment::create([
                'voucher_no' => $voucherNo,
                'purchase_id' => $purchase->id,
                'amount' => $amount,
                'payment_method' => $validated['payment_method'],
                'account_name' => $accountName,
                'payment_date' => $validated['payment_date'],
                'recorded_by' => $request->user()?->name ?? 'Admin',
                'notes' => $validated['notes'] ?? 'Partial purchase balance settlement',
            ]);

            $newTotalPaid = $purchase->total_amount_paid + $amount;
            $newRemaining = max(0, $purchase->agreed_purchase_price - $newTotalPaid);
            $newStatus = $newRemaining <= 0 ? 'PAID_IN_FULL' : 'PARTIAL_PAID';

            $purchase->update([
                'total_amount_paid' => $newTotalPaid,
                'remaining_payable' => $newRemaining,
                'payment_status' => $newStatus,
            ]);

            // Deduct from cash account
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
                'date' => $validated['payment_date'],
                'type' => 'CREDIT',
                'category' => 'PURCHASE_OUTFLOW',
                'amount' => $amount,
                'running_balance' => $account->current_balance,
                'reference_type' => 'PurchasePayment',
                'reference_id' => $payment->id,
                'recorded_by' => $request->user()?->name ?? 'Admin',
                'narration' => "Partial purchase disbursement to seller {$purchase->seller_name} for {$purchase->vehicle->make} {$purchase->vehicle->model}",
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Purchase payment recorded successfully.',
                'data' => $purchase->fresh(['vehicle', 'payments']),
            ]);
        });
    }
}

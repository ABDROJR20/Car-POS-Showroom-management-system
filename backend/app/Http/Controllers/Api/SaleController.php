<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Sale;
use App\Models\SalePayment;
use App\Models\Commission;
use App\Models\Vehicle;
use App\Models\CashLedger;
use App\Models\CashAccount;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SaleController extends Controller
{
    public function index()
    {
        $sales = Sale::with(['vehicle', 'payments', 'commissions', 'user'])->orderBy('id', 'desc')->get();

        return response()->json([
            'status' => 'success',
            'data' => $sales,
        ]);
    }

    public function show($id)
    {
        $sale = Sale::with(['vehicle', 'payments', 'commissions', 'user'])->findOrFail($id);

        return response()->json([
            'status' => 'success',
            'data' => $sale,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'vehicle_id' => 'required|exists:vehicles,id',
            'buyer_name' => 'required|string',
            'buyer_phone' => 'required|string',
            'buyer_cnic' => 'nullable|string',
            'buyer_city' => 'nullable|string',
            'buyer_address' => 'nullable|string',
            'negotiated_price' => 'required|numeric|min:0',
            'transfer_fee' => 'nullable|numeric|min:0',
            'extra_charges' => 'nullable|numeric|min:0',
            'discount' => 'nullable|numeric|min:0',
            'amount_received' => 'required|numeric|min:0',
            'payment_method' => 'required|string',
            'showroom_commission' => 'nullable|numeric|min:0',
            'broker_commission' => 'nullable|numeric|min:0',
            'broker_name' => 'nullable|string',
            'broker_phone' => 'nullable|string',
            'agent_commission' => 'nullable|numeric|min:0',
            'agent_name' => 'nullable|string',
            'sale_date' => 'required|date',
            'delivery_date' => 'nullable|date',
            'notes' => 'nullable|string',
        ]);

        return DB::transaction(function () use ($validated, $request) {
            // Lock vehicle for update
            $vehicle = Vehicle::lockForUpdate()->findOrFail($validated['vehicle_id']);

            // CRITICAL BUSINESS RULE: CANNOT SELL ALREADY SOLD VEHICLE
            if ($vehicle->status === 'Sold') {
                return response()->json([
                    'status' => 'error',
                    'message' => "Vehicle {$vehicle->registration_no} is already SOLD and cannot be sold again.",
                ], 422);
            }

            $negotiatedPrice = (float) $validated['negotiated_price'];
            $transferFee = (float) ($validated['transfer_fee'] ?? 0);
            $extraCharges = (float) ($validated['extra_charges'] ?? 0);
            $discount = (float) ($validated['discount'] ?? 0);
            $netSalePrice = $negotiatedPrice + $transferFee + $extraCharges - $discount;

            $amountReceived = (float) $validated['amount_received'];
            $remainingBalance = max(0, $netSalePrice - $amountReceived);
            $paymentStatus = $remainingBalance <= 0 ? 'PAID_IN_FULL' : ($amountReceived > 0 ? 'TOKEN_ADVANCE' : 'UNPAID');

            $costPrice = (float) $vehicle->cost_price;
            $vehicleExpenses = (float) $vehicle->total_expenses;
            $totalVehicleCost = $costPrice + $vehicleExpenses;

            $showroomComm = (float) ($validated['showroom_commission'] ?? 0);
            $brokerComm = (float) ($validated['broker_commission'] ?? 0);
            $agentComm = (float) ($validated['agent_commission'] ?? 0);

            // PROFIT FORMULA AUDITED:
            // For Showroom-Owned: Gross Profit = Net Sale - Total Cost - Broker - Agent
            // For Client/Investor Consignments: Owner Payable = Base Cost; Showroom Profit = Commission + Surplus
            $grossProfit = 0;
            $ownerPayable = 0;
            $showroomNetEarnings = 0;

            if ($vehicle->ownership_type === 'Showroom') {
                $grossProfit = $netSalePrice - $totalVehicleCost - $brokerComm - $agentComm;
                $ownerPayable = 0;
                $showroomNetEarnings = $grossProfit;
            } else {
                $ownerPayable = $costPrice;
                $surplus = max(0, $netSalePrice - $costPrice);
                $grossProfit = $surplus + $showroomComm;
                $showroomNetEarnings = max(0, $grossProfit - $brokerComm - $agentComm);
            }

            $count = Sale::count();
            $invoiceNo = 'SAL-' . date('Y') . '-' . str_pad($count + 1, 3, '0', STR_PAD_LEFT);

            $sale = Sale::create([
                'invoice_no' => $invoiceNo,
                'vehicle_id' => $vehicle->id,
                'user_id' => $request->user()?->id,
                'buyer_name' => $validated['buyer_name'],
                'buyer_phone' => $validated['buyer_phone'],
                'buyer_cnic' => $validated['buyer_cnic'] ?? null,
                'buyer_city' => $validated['buyer_city'] ?? 'Islamabad',
                'buyer_address' => $validated['buyer_address'] ?? null,
                'ownership_type' => $vehicle->ownership_type,
                'cost_price' => $costPrice,
                'vehicle_expenses' => $vehicleExpenses,
                'total_vehicle_cost' => $totalVehicleCost,
                'negotiated_price' => $negotiatedPrice,
                'transfer_fee' => $transferFee,
                'extra_charges' => $extraCharges,
                'discount' => $discount,
                'net_sale_price' => $netSalePrice,
                'amount_received' => $amountReceived,
                'remaining_balance' => $remainingBalance,
                'payment_status' => $paymentStatus,
                'payment_method' => $validated['payment_method'],
                'showroom_commission' => $showroomComm,
                'broker_commission' => $brokerComm,
                'broker_name' => $validated['broker_name'] ?? null,
                'broker_phone' => $validated['broker_phone'] ?? null,
                'agent_commission' => $agentComm,
                'agent_name' => $validated['agent_name'] ?? null,
                'gross_profit' => $grossProfit,
                'owner_payable' => $ownerPayable,
                'showroom_net_earnings' => $showroomNetEarnings,
                'status' => 'COMPLETED',
                'sale_date' => $validated['sale_date'],
                'delivery_date' => $validated['delivery_date'] ?? $validated['sale_date'],
                'notes' => $validated['notes'] ?? null,
            ]);

            // UPDATE VEHICLE STATUS TO SOLD
            $vehicle->update([
                'status' => 'Sold',
                'sale_price' => $netSalePrice,
                'sale_date' => $validated['sale_date'],
            ]);

            // RECORD SALE RECEIPT PAYMENT & INFLOW
            if ($amountReceived > 0) {
                $payCount = SalePayment::count();
                $receiptNo = 'REC-' . date('Y') . '-' . str_pad($payCount + 1, 3, '0', STR_PAD_LEFT);

                SalePayment::create([
                    'receipt_no' => $receiptNo,
                    'sale_id' => $sale->id,
                    'amount' => $amountReceived,
                    'payment_method' => $validated['payment_method'],
                    'account_name' => 'Main Cash Safe (Counter)',
                    'payment_date' => $validated['sale_date'],
                    'received_by' => $request->user()?->name ?? 'Admin',
                    'notes' => "Sale advance/payment token for {$vehicle->make} {$vehicle->model} ({$vehicle->registration_no})",
                ]);

                // Update Cash Account & Ledger
                $account = CashAccount::firstOrCreate(
                    ['name' => 'Main Cash Safe (Counter)'],
                    ['type' => 'CASH_SAFE', 'opening_balance' => 2500000.00, 'current_balance' => 2500000.00]
                );
                $account->current_balance += $amountReceived;
                $account->save();

                $ledCount = CashLedger::count();
                CashLedger::create([
                    'voucher_no' => 'LED-' . date('Y') . '-' . str_pad($ledCount + 1, 3, '0', STR_PAD_LEFT),
                    'cash_account_id' => $account->id,
                    'account_name' => $account->name,
                    'date' => $validated['sale_date'],
                    'type' => 'DEBIT',
                    'category' => $remainingBalance <= 0 ? 'SALE_FINAL' : 'SALE_ADVANCE',
                    'amount' => $amountReceived,
                    'running_balance' => $account->current_balance,
                    'reference_type' => 'Sale',
                    'reference_id' => $sale->id,
                    'recorded_by' => $request->user()?->name ?? 'Admin',
                    'narration' => "Sale payment received from {$validated['buyer_name']} for {$vehicle->make} {$vehicle->model} ({$vehicle->registration_no})",
                ]);
            }

            // GENERATE COMMISSION VOUCHERS
            if ($brokerComm > 0 && !empty($validated['broker_name'])) {
                $cCount = Commission::count();
                Commission::create([
                    'voucher_no' => 'COM-' . date('Y') . '-' . str_pad($cCount + 1, 3, '0', STR_PAD_LEFT),
                    'sale_id' => $sale->id,
                    'vehicle_id' => $vehicle->id,
                    'recipient_name' => $validated['broker_name'],
                    'party_type' => 'BROKER',
                    'amount' => $brokerComm,
                    'status' => 'PENDING',
                    'date' => $validated['sale_date'],
                    'notes' => "Broker commission for {$vehicle->make} {$vehicle->model}",
                ]);
            }

            if ($agentComm > 0 && !empty($validated['agent_name'])) {
                $cCount = Commission::count();
                Commission::create([
                    'voucher_no' => 'COM-' . date('Y') . '-' . str_pad($cCount + 1, 3, '0', STR_PAD_LEFT),
                    'sale_id' => $sale->id,
                    'vehicle_id' => $vehicle->id,
                    'recipient_name' => $validated['agent_name'],
                    'party_type' => 'SALES_AGENT',
                    'amount' => $agentComm,
                    'status' => 'PENDING',
                    'date' => $validated['sale_date'],
                    'notes' => "Agent commission reward for {$vehicle->make} {$vehicle->model}",
                ]);
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Car sale order closed successfully. Vehicle marked SOLD, ledger updated.',
                'data' => $sale->load(['vehicle', 'payments', 'commissions']),
            ], 201);
        });
    }

    public function recordPayment(Request $request, $id)
    {
        $sale = Sale::with('vehicle')->findOrFail($id);

        $validated = $request->validate([
            'amount' => 'required|numeric|min:1|max:' . $sale->remaining_balance,
            'payment_method' => 'required|string',
            'account_name' => 'nullable|string',
            'payment_date' => 'required|date',
            'notes' => 'nullable|string',
        ]);

        return DB::transaction(function () use ($sale, $validated, $request) {
            $amount = (float) $validated['amount'];
            $accountName = $validated['account_name'] ?? 'Main Cash Safe (Counter)';

            $payCount = SalePayment::count();
            $receiptNo = 'REC-' . date('Y') . '-' . str_pad($payCount + 1, 3, '0', STR_PAD_LEFT);

            $payment = SalePayment::create([
                'receipt_no' => $receiptNo,
                'sale_id' => $sale->id,
                'amount' => $amount,
                'payment_method' => $validated['payment_method'],
                'account_name' => $accountName,
                'payment_date' => $validated['payment_date'],
                'received_by' => $request->user()?->name ?? 'Admin',
                'notes' => $validated['notes'] ?? 'Partial sale balance payment',
            ]);

            $newAmountReceived = $sale->amount_received + $amount;
            $newRemaining = max(0, $sale->net_sale_price - $newAmountReceived);
            $newStatus = $newRemaining <= 0 ? 'PAID_IN_FULL' : 'PARTIAL_PAID';

            $sale->update([
                'amount_received' => $newAmountReceived,
                'remaining_balance' => $newRemaining,
                'payment_status' => $newStatus,
            ]);

            // Add to Cash Safe
            $account = CashAccount::firstOrCreate(
                ['name' => $accountName],
                ['type' => 'CASH_SAFE', 'opening_balance' => 2500000.00, 'current_balance' => 2500000.00]
            );
            $account->current_balance += $amount;
            $account->save();

            $ledCount = CashLedger::count();
            CashLedger::create([
                'voucher_no' => 'LED-' . date('Y') . '-' . str_pad($ledCount + 1, 3, '0', STR_PAD_LEFT),
                'cash_account_id' => $account->id,
                'account_name' => $account->name,
                'date' => $validated['payment_date'],
                'type' => 'DEBIT',
                'category' => $newRemaining <= 0 ? 'SALE_FINAL' : 'SALE_ADVANCE',
                'amount' => $amount,
                'running_balance' => $account->current_balance,
                'reference_type' => 'SalePayment',
                'reference_id' => $payment->id,
                'recorded_by' => $request->user()?->name ?? 'Admin',
                'narration' => "Balance collection from buyer {$sale->buyer_name} for {$sale->vehicle->make} {$sale->vehicle->model}",
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Sale payment recorded and balance cleared.',
                'data' => $sale->fresh(['vehicle', 'payments', 'commissions']),
            ]);
        });
    }

    public function voidSale(Request $request, $id)
    {
        $sale = Sale::with(['vehicle', 'payments'])->findOrFail($id);

        if ($sale->status === 'VOIDED') {
            return response()->json(['status' => 'error', 'message' => 'Sale is already voided.'], 422);
        }

        return DB::transaction(function () use ($sale, $request) {
            $sale->update(['status' => 'VOIDED']);

            // Revert vehicle to Available
            if ($sale->vehicle) {
                $sale->vehicle->update([
                    'status' => 'Available',
                    'sale_price' => null,
                    'sale_date' => null,
                ]);
            }

            // Reverse all cash collected
            if ($sale->amount_received > 0) {
                $account = CashAccount::firstOrCreate(['name' => 'Main Cash Safe (Counter)']);
                $account->current_balance -= $sale->amount_received;
                $account->save();

                $ledCount = CashLedger::count();
                CashLedger::create([
                    'voucher_no' => 'LED-' . date('Y') . '-' . str_pad($ledCount + 1, 3, '0', STR_PAD_LEFT),
                    'cash_account_id' => $account->id,
                    'account_name' => $account->name,
                    'date' => date('Y-m-d'),
                    'type' => 'CREDIT',
                    'category' => 'REVERSAL',
                    'amount' => $sale->amount_received,
                    'running_balance' => $account->current_balance,
                    'reference_type' => 'SaleVoid',
                    'reference_id' => $sale->id,
                    'recorded_by' => $request->user()?->name ?? 'Admin',
                    'narration' => "VOID REVERSAL: Sale invoice {$sale->invoice_no} cancelled. Refunded to buyer {$sale->buyer_name}",
                ]);
            }

            return response()->json([
                'status' => 'success',
                'message' => "Sale invoice {$sale->invoice_no} voided. Vehicle restored to stock and cash refunded.",
                'data' => $sale->fresh(['vehicle', 'payments']),
            ]);
        });
    }
}

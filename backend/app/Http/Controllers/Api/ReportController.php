<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Sale;
use App\Models\Purchase;
use App\Models\Vehicle;
use App\Models\Expense;
use App\Models\Commission;
use App\Models\CashLedger;
use App\Models\CashAccount;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function generate(Request $request, $reportId)
    {
        $startDate = $request->start_date;
        $endDate = $request->end_date;
        $search = strtolower($request->search ?? '');

        $data = match ($reportId) {
            'DAILY_SALES', 'SALES_BY_DATE' => $this->dailySalesReport($startDate, $endDate),
            'MONTHLY_SALES' => $this->monthlySalesReport($startDate, $endDate),
            'VEHICLE_SALES' => $this->vehicleSalesRegister($startDate, $endDate),
            'VEHICLE_PURCHASES' => $this->vehiclePurchasesRegister($startDate, $endDate),
            'INVENTORY_VALUATION', 'UNSOLD_VEHICLES' => $this->inventoryValuationReport(),
            'SOLD_VEHICLES' => $this->soldVehiclesReport($startDate, $endDate),
            'SHOWROOM_OWNED', 'CLIENT_OWNED', 'INVESTOR_OWNED' => $this->ownershipReport($reportId),
            'VEHICLE_PROFITABILITY' => $this->profitabilityReport($startDate, $endDate),
            'PROFIT_LOSS' => $this->profitLossReport($startDate, $endDate),
            'CASH_FLOW', 'CASH_IN_HAND' => $this->cashFlowReport($startDate, $endDate),
            'COMMISSIONS_REGISTER', 'BROKER_COMMISSION' => $this->commissionsReport($startDate, $endDate),
            'EXPENSES_BREAKDOWN' => $this->expensesReport($startDate, $endDate),
            'OUTSTANDING_RECEIVABLES' => $this->receivablesReport(),
            'OWNER_PAYABLES' => $this->ownerPayablesReport(),
            default => ['columns' => [], 'rows' => [], 'summaryKPIs' => []],
        };

        return response()->json([
            'status' => 'success',
            'reportId' => $reportId,
            'data' => $data,
        ]);
    }

    private function dailySalesReport($startDate, $endDate)
    {
        $query = Sale::where('status', '!=', 'VOIDED');
        if ($startDate) $query->where('sale_date', '>=', $startDate);
        if ($endDate) $query->where('sale_date', '<=', $endDate);

        $sales = $query->get();
        $grouped = [];

        foreach ($sales as $s) {
            $dt = (string) $s->sale_date;
            if (!isset($grouped[$dt])) {
                $grouped[$dt] = ['date' => $dt, 'dealsCount' => 0, 'grossVolume' => 0, 'received' => 0, 'balance' => 0, 'profit' => 0];
            }
            $grouped[$dt]['dealsCount']++;
            $grouped[$dt]['grossVolume'] += (float) $s->net_sale_price;
            $grouped[$dt]['received'] += (float) $s->amount_received;
            $grouped[$dt]['balance'] += (float) $s->remaining_balance;
            $grouped[$dt]['profit'] += (float) ($s->gross_profit ?: $s->showroom_net_earnings);
        }

        $rows = array_values($grouped);
        usort($rows, fn($a, $b) => strcmp($b['date'], $a['date']));

        return [
            'columns' => [
                ['key' => 'date', 'header' => 'Sale Date'],
                ['key' => 'dealsCount', 'header' => 'Deals Closed'],
                ['key' => 'grossVolume', 'header' => 'Gross Turnover', 'isCurrency' => true],
                ['key' => 'received', 'header' => 'Cash Collected', 'isCurrency' => true],
                ['key' => 'balance', 'header' => 'Balance Due', 'isCurrency' => true],
                ['key' => 'profit', 'header' => 'Realized Profit', 'isCurrency' => true],
            ],
            'rows' => $rows,
            'summaryKPIs' => [
                ['label' => 'Total Sales Volume', 'value' => '₨ ' . number_format(array_sum(array_column($rows, 'grossVolume')))],
                ['label' => 'Realized Deal Profit', 'value' => '₨ ' . number_format(array_sum(array_column($rows, 'profit')))],
                ['label' => 'Deals Closed', 'value' => count($sales)],
            ],
        ];
    }

    private function monthlySalesReport($startDate, $endDate)
    {
        $query = Sale::where('status', '!=', 'VOIDED');
        if ($startDate) $query->where('sale_date', '>=', $startDate);
        if ($endDate) $query->where('sale_date', '<=', $endDate);

        $sales = $query->get();
        $grouped = [];

        foreach ($sales as $s) {
            $month = substr((string) $s->sale_date, 0, 7);
            if (!isset($grouped[$month])) {
                $grouped[$month] = ['month' => $month, 'dealsCount' => 0, 'grossVolume' => 0, 'received' => 0, 'balance' => 0, 'profit' => 0];
            }
            $grouped[$month]['dealsCount']++;
            $grouped[$month]['grossVolume'] += (float) $s->net_sale_price;
            $grouped[$month]['received'] += (float) $s->amount_received;
            $grouped[$month]['balance'] += (float) $s->remaining_balance;
            $grouped[$month]['profit'] += (float) ($s->gross_profit ?: $s->showroom_net_earnings);
        }

        $rows = array_values($grouped);
        usort($rows, fn($a, $b) => strcmp($b['month'], $a['month']));

        return [
            'columns' => [
                ['key' => 'month', 'header' => 'Billing Month'],
                ['key' => 'dealsCount', 'header' => 'Vehicles Sold'],
                ['key' => 'grossVolume', 'header' => 'Total Sales Revenue', 'isCurrency' => true],
                ['key' => 'received', 'header' => 'Cash Received', 'isCurrency' => true],
                ['key' => 'balance', 'header' => 'Receivables Remaining', 'isCurrency' => true],
                ['key' => 'profit', 'header' => 'Net Deal Profit', 'isCurrency' => true],
            ],
            'rows' => $rows,
            'summaryKPIs' => [
                ['label' => 'Aggregate Turnover', 'value' => '₨ ' . number_format(array_sum(array_column($rows, 'grossVolume')))],
                ['label' => 'Aggregate Profit', 'value' => '₨ ' . number_format(array_sum(array_column($rows, 'profit')))],
            ],
        ];
    }

    private function vehicleSalesRegister($startDate, $endDate)
    {
        $query = Sale::with('vehicle');
        if ($startDate) $query->where('sale_date', '>=', $startDate);
        if ($endDate) $query->where('sale_date', '<=', $endDate);

        $sales = $query->orderBy('id', 'desc')->get();
        $rows = $sales->map(fn($s) => [
            'id' => $s->invoice_no,
            'saleDate' => (string) $s->sale_date,
            'vehicleSummary' => "{$s->vehicle?->make} {$s->vehicle?->model} ({$s->vehicle?->model_year}) • {$s->vehicle?->registration_no}",
            'ownershipType' => $s->ownership_type,
            'buyerName' => $s->buyer_name,
            'netSalePrice' => (float) $s->net_sale_price,
            'amountReceived' => (float) $s->amount_received,
            'remainingBalance' => (float) $s->remaining_balance,
            'profit' => (float) ($s->gross_profit ?: $s->showroom_net_earnings),
            'paymentStatus' => $s->payment_status,
        ]);

        return [
            'columns' => [
                ['key' => 'id', 'header' => 'Invoice #'],
                ['key' => 'saleDate', 'header' => 'Date'],
                ['key' => 'vehicleSummary', 'header' => 'Vehicle Asset'],
                ['key' => 'ownershipType', 'header' => 'Ownership'],
                ['key' => 'buyerName', 'header' => 'Buyer Name'],
                ['key' => 'netSalePrice', 'header' => 'Net Sale Price', 'isCurrency' => true],
                ['key' => 'amountReceived', 'header' => 'Paid Amount', 'isCurrency' => true],
                ['key' => 'remainingBalance', 'header' => 'Balance', 'isCurrency' => true],
                ['key' => 'profit', 'header' => 'Deal Profit', 'isCurrency' => true],
                ['key' => 'paymentStatus', 'header' => 'Status'],
            ],
            'rows' => $rows,
            'summaryKPIs' => [
                ['label' => 'Total Invoices', 'value' => count($sales)],
                ['label' => 'Total Billed', 'value' => '₨ ' . number_format($sales->sum('net_sale_price'))],
                ['label' => 'Total Collected', 'value' => '₨ ' . number_format($sales->sum('amount_received'))],
            ],
        ];
    }

    private function vehiclePurchasesRegister($startDate, $endDate)
    {
        $query = Purchase::with('vehicle');
        if ($startDate) $query->where('purchase_date', '>=', $startDate);
        if ($endDate) $query->where('purchase_date', '<=', $endDate);

        $purchases = $query->orderBy('id', 'desc')->get();
        $rows = $purchases->map(fn($p) => [
            'id' => $p->purchase_no,
            'purchaseDate' => (string) $p->purchase_date,
            'vehicleSummary' => "{$p->vehicle?->make} {$p->vehicle?->model} ({$p->vehicle?->model_year}) • {$p->vehicle?->registration_no}",
            'sellerName' => $p->seller_name,
            'sellerPhone' => $p->seller_phone,
            'ownershipType' => $p->ownership_type,
            'purchasePrice' => (float) $p->agreed_purchase_price,
            'amountPaid' => (float) $p->total_amount_paid,
            'remainingAmount' => (float) $p->remaining_payable,
            'paymentStatus' => $p->payment_status,
        ]);

        return [
            'columns' => [
                ['key' => 'id', 'header' => 'Purchase #'],
                ['key' => 'purchaseDate', 'header' => 'Date'],
                ['key' => 'vehicleSummary', 'header' => 'Vehicle Asset'],
                ['key' => 'sellerName', 'header' => 'Seller / Ex-Owner'],
                ['key' => 'ownershipType', 'header' => 'Ownership'],
                ['key' => 'purchasePrice', 'header' => 'Purchase Price', 'isCurrency' => true],
                ['key' => 'amountPaid', 'header' => 'Amount Paid', 'isCurrency' => true],
                ['key' => 'remainingAmount', 'header' => 'Balance Payable', 'isCurrency' => true],
                ['key' => 'paymentStatus', 'header' => 'Status'],
            ],
            'rows' => $rows,
            'summaryKPIs' => [
                ['label' => 'Purchases Recorded', 'value' => count($purchases)],
                ['label' => 'Total Inward Capital', 'value' => '₨ ' . number_format($purchases->sum('agreed_purchase_price'))],
                ['label' => 'Paid Outflows', 'value' => '₨ ' . number_format($purchases->sum('total_amount_paid'))],
            ],
        ];
    }

    private function inventoryValuationReport()
    {
        $cars = Vehicle::whereIn('status', ['Available', 'Reserved'])->get();
        $rows = $cars->map(fn($v) => [
            'stockCode' => $v->stock_code,
            'vehicle' => "{$v->make} {$v->model} ({$v->model_year})",
            'registrationNo' => $v->registration_no,
            'ownershipType' => $v->ownership_type,
            'costPrice' => (float) $v->cost_price,
            'demandPrice' => (float) ($v->demand_price ?: $v->cost_price * 1.08),
            'potentialMargin' => max(0, (float) ($v->demand_price - $v->cost_price)),
            'status' => $v->status,
            'purchaseDate' => (string) ($v->purchase_date ?: 'In Stock'),
        ]);

        $totalCost = $cars->sum('cost_price');
        $totalDemand = $cars->sum(fn($c) => $c->demand_price ?: $c->cost_price);

        return [
            'columns' => [
                ['key' => 'stockCode', 'header' => 'Stock #'],
                ['key' => 'vehicle', 'header' => 'Vehicle Make & Model'],
                ['key' => 'registrationNo', 'header' => 'Reg Plate'],
                ['key' => 'ownershipType', 'header' => 'Ownership'],
                ['key' => 'costPrice', 'header' => 'Acquisition Cost', 'isCurrency' => true],
                ['key' => 'demandPrice', 'header' => 'Showroom Demand', 'isCurrency' => true],
                ['key' => 'potentialMargin', 'header' => 'Target Margin', 'isCurrency' => true],
                ['key' => 'status', 'header' => 'Floor Status'],
                ['key' => 'purchaseDate', 'header' => 'Inward Date'],
            ],
            'rows' => $rows,
            'summaryKPIs' => [
                ['label' => 'Active Floor Inventory', 'value' => count($cars) . ' Cars'],
                ['label' => 'Total Stock Capital Locked', 'value' => '₨ ' . number_format($totalCost)],
                ['label' => 'Target Retail Valuation', 'value' => '₨ ' . number_format($totalDemand)],
                ['label' => 'Unrealized Margin Pipeline', 'value' => '₨ ' . number_format($totalDemand - $totalCost)],
            ],
        ];
    }

    private function soldVehiclesReport($startDate, $endDate)
    {
        $query = Vehicle::where('status', 'Sold');
        if ($startDate) $query->where('sale_date', '>=', $startDate);
        if ($endDate) $query->where('sale_date', '<=', $endDate);

        $cars = $query->get();
        $rows = $cars->map(fn($v) => [
            'registrationNo' => $v->registration_no,
            'vehicle' => "{$v->make} {$v->model} ({$v->model_year})",
            'costPrice' => (float) $v->cost_price,
            'salePrice' => (float) $v->sale_price,
            'grossProfit' => max(0, (float) ($v->sale_price - $v->cost_price)),
            'saleDate' => (string) ($v->sale_date ?: 'Delivered'),
        ]);

        return [
            'columns' => [
                ['key' => 'registrationNo', 'header' => 'Reg Plate'],
                ['key' => 'vehicle', 'header' => 'Vehicle Asset'],
                ['key' => 'costPrice', 'header' => 'Showroom Cost', 'isCurrency' => true],
                ['key' => 'salePrice', 'header' => 'Realized Sale', 'isCurrency' => true],
                ['key' => 'grossProfit', 'header' => 'Realized Margin', 'isCurrency' => true],
                ['key' => 'saleDate', 'header' => 'Sale Date'],
            ],
            'rows' => $rows,
            'summaryKPIs' => [
                ['label' => 'Total Vehicles Sold', 'value' => count($cars) . ' Cars'],
                ['label' => 'Total Sales Realized', 'value' => '₨ ' . number_format($cars->sum('sale_price'))],
            ],
        ];
    }

    private function ownershipReport($reportId)
    {
        $type = match ($reportId) {
            'SHOWROOM_OWNED' => 'Showroom',
            'CLIENT_OWNED' => 'Client',
            'INVESTOR_OWNED' => 'Investor',
        };

        $cars = Vehicle::where('ownership_type', $type)->get();
        $rows = $cars->map(fn($v) => [
            'registrationNo' => $v->registration_no,
            'vehicle' => "{$v->make} {$v->model} ({$v->model_year})",
            'ownerName' => $v->owner_name ?: "{$type} Portfolio",
            'costPrice' => (float) $v->cost_price,
            'demandPrice' => (float) ($v->demand_price ?: $v->cost_price),
            'status' => $v->status,
            'purchaseDate' => (string) ($v->purchase_date ?: 'Active'),
        ]);

        return [
            'columns' => [
                ['key' => 'registrationNo', 'header' => 'Reg Plate'],
                ['key' => 'vehicle', 'header' => 'Vehicle Asset'],
                ['key' => 'ownerName', 'header' => 'Beneficiary / Partner'],
                ['key' => 'costPrice', 'header' => 'Base / Cost Price', 'isCurrency' => true],
                ['key' => 'demandPrice', 'header' => 'Retail Target', 'isCurrency' => true],
                ['key' => 'status', 'header' => 'Current Status'],
                ['key' => 'purchaseDate', 'header' => 'Inward Date'],
            ],
            'rows' => $rows,
            'summaryKPIs' => [
                ['label' => "{$type} Vehicles", 'value' => count($cars) . ' Units'],
                ['label' => 'Portfolio Asset Value', 'value' => '₨ ' . number_format($cars->sum('cost_price'))],
            ],
        ];
    }

    private function profitabilityReport($startDate, $endDate)
    {
        $query = Sale::with('vehicle')->where('status', '!=', 'VOIDED');
        if ($startDate) $query->where('sale_date', '>=', $startDate);
        if ($endDate) $query->where('sale_date', '<=', $endDate);

        $sales = $query->get();
        $rows = $sales->map(fn($s) => [
            'id' => $s->invoice_no,
            'vehicleSummary' => "{$s->vehicle?->make} {$s->vehicle?->model} ({$s->vehicle?->model_year})",
            'ownershipType' => $s->ownership_type,
            'purchaseCost' => (float) $s->cost_price,
            'vehicleExpenses' => (float) $s->vehicle_expenses,
            'totalCost' => (float) $s->total_vehicle_cost,
            'netSalePrice' => (float) $s->net_sale_price,
            'grossProfit' => (float) $s->gross_profit,
            'commissionsDeducted' => (float) ($s->broker_commission + $s->agent_commission),
            'ownerPayable' => (float) $s->owner_payable,
            'showroomEarnings' => (float) $s->showroom_net_earnings,
        ]);

        return [
            'columns' => [
                ['key' => 'id', 'header' => 'Deal #'],
                ['key' => 'vehicleSummary', 'header' => 'Vehicle Asset'],
                ['key' => 'ownershipType', 'header' => 'Ownership'],
                ['key' => 'purchaseCost', 'header' => 'Purchase / Base', 'isCurrency' => true],
                ['key' => 'vehicleExpenses', 'header' => 'Repairs / Exp', 'isCurrency' => true],
                ['key' => 'totalCost', 'header' => 'Total Cost', 'isCurrency' => true],
                ['key' => 'netSalePrice', 'header' => 'Sale Amount', 'isCurrency' => true],
                ['key' => 'grossProfit', 'header' => 'Gross Margin', 'isCurrency' => true],
                ['key' => 'commissionsDeducted', 'header' => 'Brokerage / Comm', 'isCurrency' => true],
                ['key' => 'ownerPayable', 'header' => 'Owner Payable', 'isCurrency' => true],
                ['key' => 'showroomEarnings', 'header' => 'Showroom Earnings', 'isCurrency' => true],
            ],
            'rows' => $rows,
            'summaryKPIs' => [
                ['label' => 'Completed Deals Analyzed', 'value' => count($sales)],
                ['label' => 'Total Showroom Earnings', 'value' => '₨ ' . number_format($sales->sum('showroom_net_earnings'))],
            ],
        ];
    }

    private function profitLossReport($startDate, $endDate)
    {
        $sales = Sale::where('status', '!=', 'VOIDED')->get();
        $expenses = Expense::all();
        $commissions = Commission::where('status', 'PAID')->get();

        $grossProfits = (float) $sales->sum('gross_profit');
        $commissionsEarned = (float) $sales->sum('showroom_commission');
        $operatingExpenses = (float) $expenses->sum('amount');
        $brokerPaid = (float) $commissions->sum('amount');
        $netProfit = $grossProfits + $commissionsEarned - $operatingExpenses;

        $rows = [
            ['lineItem' => '1. Gross Deal Profits on Showroom Assets', 'category' => 'Operating Revenue', 'amount' => $grossProfits, 'impact' => 'INCOME (+)'],
            ['lineItem' => '2. Consignment & Showroom Commission Fees', 'category' => 'Fee Revenue', 'amount' => $commissionsEarned, 'impact' => 'INCOME (+)'],
            ['lineItem' => '3. Operating Showroom Overheads & Bills', 'category' => 'Operating Expense', 'amount' => $operatingExpenses, 'impact' => 'EXPENSE (-)'],
            ['lineItem' => '4. External Car Broker Commission Disbursements', 'category' => 'Brokerage Expense', 'amount' => $brokerPaid, 'impact' => 'EXPENSE (-)'],
            ['lineItem' => 'NET SHOWROOM PROFIT (EBITDA)', 'category' => 'Net Bottom Line', 'amount' => $netProfit, 'impact' => $netProfit >= 0 ? 'SURPLUS (+)' : 'DEFICIT (-)'],
        ];

        return [
            'columns' => [
                ['key' => 'lineItem', 'header' => 'Accounting P&L Line Item'],
                ['key' => 'category', 'header' => 'Classification'],
                ['key' => 'amount', 'header' => 'Amount (PKR)', 'isCurrency' => true],
                ['key' => 'impact', 'header' => 'Financial Impact'],
            ],
            'rows' => $rows,
            'summaryKPIs' => [
                ['label' => 'Gross Operating Margins', 'value' => '₨ ' . number_format($grossProfits + $commissionsEarned)],
                ['label' => 'Total Expenses Incurred', 'value' => '₨ ' . number_format($operatingExpenses)],
                ['label' => 'Net Showroom Bottom Line Profit', 'value' => '₨ ' . number_format($netProfit)],
            ],
        ];
    }

    private function cashFlowReport($startDate, $endDate)
    {
        $query = CashLedger::query();
        if ($startDate) $query->where('date', '>=', $startDate);
        if ($endDate) $query->where('date', '<=', $endDate);

        $entries = $query->orderBy('id', 'desc')->get();
        $safeAccount = CashAccount::where('type', 'CASH_SAFE')->first();

        $rows = $entries->map(fn($l) => [
            'date' => (string) $l->date,
            'id' => $l->voucher_no,
            'account' => $l->account_name,
            'category' => $l->category,
            'type' => $l->type === 'DEBIT' ? 'INFLOW (DEBIT)' : 'OUTFLOW (CREDIT)',
            'amount' => (float) $l->amount,
            'runningBalance' => (float) $l->running_balance,
            'narration' => $l->narration,
        ]);

        $inflows = $entries->where('type', 'DEBIT')->sum('amount');
        $outflows = $entries->where('type', 'CREDIT')->sum('amount');

        return [
            'columns' => [
                ['key' => 'date', 'header' => 'Timestamp'],
                ['key' => 'id', 'header' => 'Voucher #'],
                ['key' => 'account', 'header' => 'Account / Safe'],
                ['key' => 'category', 'header' => 'Activity'],
                ['key' => 'type', 'header' => 'Flow Type'],
                ['key' => 'amount', 'header' => 'Transaction Amount', 'isCurrency' => true],
                ['key' => 'runningBalance', 'header' => 'Closing Balance', 'isCurrency' => true],
                ['key' => 'narration', 'header' => 'Description'],
            ],
            'rows' => $rows,
            'summaryKPIs' => [
                ['label' => 'Total Cash Inflows (Debit)', 'value' => '₨ ' . number_format($inflows)],
                ['label' => 'Total Cash Outflows (Credit)', 'value' => '₨ ' . number_format($outflows)],
                ['label' => 'Current Cash in Hand', 'value' => '₨ ' . number_format($safeAccount?->current_balance ?? 0)],
            ],
        ];
    }

    private function commissionsReport($startDate, $endDate)
    {
        $query = Commission::with(['sale', 'vehicle']);
        if ($startDate) $query->where('date', '>=', $startDate);
        if ($endDate) $query->where('date', '<=', $endDate);

        $commissions = $query->orderBy('id', 'desc')->get();
        $rows = $commissions->map(fn($c) => [
            'id' => $c->voucher_no,
            'date' => (string) $c->date,
            'recipientName' => $c->recipient_name,
            'partyType' => $c->party_type,
            'vehicleSummary' => "{$c->vehicle?->make} {$c->vehicle?->model}",
            'saleId' => $c->sale?->invoice_no,
            'amount' => (float) $c->amount,
            'status' => $c->status,
        ]);

        return [
            'columns' => [
                ['key' => 'id', 'header' => 'Voucher #'],
                ['key' => 'date', 'header' => 'Date'],
                ['key' => 'recipientName', 'header' => 'Broker / Agent'],
                ['key' => 'partyType', 'header' => 'Type'],
                ['key' => 'vehicleSummary', 'header' => 'Linked Vehicle'],
                ['key' => 'saleId', 'header' => 'Deal Order'],
                ['key' => 'amount', 'header' => 'Commission Amount', 'isCurrency' => true],
                ['key' => 'status', 'header' => 'Payout Status'],
            ],
            'rows' => $rows,
            'summaryKPIs' => [
                ['label' => 'Total Commission Volume', 'value' => '₨ ' . number_format($commissions->sum('amount'))],
                ['label' => 'Settled Payouts', 'value' => '₨ ' . number_format($commissions->where('status', 'PAID')->sum('amount'))],
            ],
        ];
    }

    private function expensesReport($startDate, $endDate)
    {
        $query = Expense::query();
        if ($startDate) $query->where('date', '>=', $startDate);
        if ($endDate) $query->where('date', '<=', $endDate);

        $expenses = $query->orderBy('id', 'desc')->get();
        $rows = $expenses->map(fn($e) => [
            'id' => $e->voucher_no,
            'date' => (string) $e->date,
            'category' => $e->category_name,
            'paidTo' => $e->paid_to,
            'scope' => $e->is_vehicle_linked ? "🚗 {$e->vehicle_summary}" : '🏢 Showroom Overhead',
            'account' => $e->account_name,
            'amount' => (float) $e->amount,
            'narration' => $e->narration,
        ]);

        return [
            'columns' => [
                ['key' => 'id', 'header' => 'Voucher #'],
                ['key' => 'date', 'header' => 'Date'],
                ['key' => 'category', 'header' => 'Category'],
                ['key' => 'paidTo', 'header' => 'Vendor / Payee'],
                ['key' => 'scope', 'header' => 'Scope'],
                ['key' => 'account', 'header' => 'Paid From'],
                ['key' => 'amount', 'header' => 'Amount', 'isCurrency' => true],
                ['key' => 'narration', 'header' => 'Narration'],
            ],
            'rows' => $rows,
            'summaryKPIs' => [
                ['label' => 'Total Expenses Recorded', 'value' => '₨ ' . number_format($expenses->sum('amount'))],
            ],
        ];
    }

    private function receivablesReport()
    {
        $sales = Sale::with('vehicle')->where('status', '!=', 'VOIDED')->where('remaining_balance', '>', 0)->get();
        $rows = $sales->map(fn($s) => [
            'id' => $s->invoice_no,
            'saleDate' => (string) $s->sale_date,
            'buyerName' => $s->buyer_name,
            'buyerPhone' => $s->buyer_phone,
            'vehicleSummary' => "{$s->vehicle?->make} {$s->vehicle?->model}",
            'netSalePrice' => (float) $s->net_sale_price,
            'amountReceived' => (float) $s->amount_received,
            'remainingBalance' => (float) $s->remaining_balance,
        ]);

        return [
            'columns' => [
                ['key' => 'id', 'header' => 'Invoice #'],
                ['key' => 'saleDate', 'header' => 'Sale Date'],
                ['key' => 'buyerName', 'header' => 'Buyer Name'],
                ['key' => 'buyerPhone', 'header' => 'Buyer Contact'],
                ['key' => 'vehicleSummary', 'header' => 'Vehicle Asset'],
                ['key' => 'netSalePrice', 'header' => 'Agreed Price', 'isCurrency' => true],
                ['key' => 'amountReceived', 'header' => 'Advance Paid', 'isCurrency' => true],
                ['key' => 'remainingBalance', 'header' => 'Outstanding Balance', 'isCurrency' => true],
            ],
            'rows' => $rows,
            'summaryKPIs' => [
                ['label' => 'Pending Buyer Invoices', 'value' => count($sales) . ' Deals'],
                ['label' => 'Total Capital Receivable', 'value' => '₨ ' . number_format($sales->sum('remaining_balance'))],
            ],
        ];
    }

    private function ownerPayablesReport()
    {
        $purchases = Purchase::with('vehicle')->where('remaining_payable', '>', 0)->get();
        $rows = $purchases->map(fn($p) => [
            'id' => $p->purchase_no,
            'purchaseDate' => (string) $p->purchase_date,
            'sellerName' => $p->seller_name,
            'sellerPhone' => $p->seller_phone,
            'vehicleSummary' => "{$p->vehicle?->make} {$p->vehicle?->model}",
            'purchasePrice' => (float) $p->agreed_purchase_price,
            'amountPaid' => (float) $p->total_amount_paid,
            'remainingAmount' => (float) $p->remaining_payable,
        ]);

        return [
            'columns' => [
                ['key' => 'id', 'header' => 'Purchase Order'],
                ['key' => 'purchaseDate', 'header' => 'Inward Date'],
                ['key' => 'sellerName', 'header' => 'Seller / Partner'],
                ['key' => 'sellerPhone', 'header' => 'Contact'],
                ['key' => 'vehicleSummary', 'header' => 'Vehicle Asset'],
                ['key' => 'purchasePrice', 'header' => 'Agreed Purchase Price', 'isCurrency' => true],
                ['key' => 'amountPaid', 'header' => 'Amount Disbursed', 'isCurrency' => true],
                ['key' => 'remainingAmount', 'header' => 'Outstanding Payable', 'isCurrency' => true],
            ],
            'rows' => $rows,
            'summaryKPIs' => [
                ['label' => 'Pending Seller Liabilities', 'value' => count($purchases) . ' Parties'],
                ['label' => 'Total Balance Payable', 'value' => '₨ ' . number_format($purchases->sum('remaining_payable'))],
            ],
        ];
    }
}

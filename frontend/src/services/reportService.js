// Business Intelligence & 20-Report Analytics Engine for Ahsan Autos Showroom

import { salesService } from './salesService.js';
import { purchaseService } from './purchaseService.js';
import { vehicleStorage } from './vehicleStorage.js';
import { financeService } from './financeService.js';
import { settingsService } from './settingsService.js';

export const REPORT_CATEGORIES = [
  { id: 'SALES', name: 'Sales & Revenue Reports' },
  { id: 'INVENTORY', name: 'Inventory & Asset Reports' },
  { id: 'FINANCIAL', name: 'P&L, Cash Flow & Profitability' },
  { id: 'COMMISSION_EXPENSE', name: 'Commissions & Expenses' },
  { id: 'RECEIVABLES_PAYABLES', name: 'Receivables & Payables' },
];

export const ALL_REPORTS = [
  // 1-3. Sales
  { id: 'DAILY_SALES', category: 'SALES', title: '1. Daily Sales Report', desc: 'Day-by-day vehicles sold, gross revenue, advance tokens & cash collections' },
  { id: 'MONTHLY_SALES', category: 'SALES', title: '2. Monthly Sales Report', desc: 'Month-over-month volume, realized turnover & deal velocity' },
  { id: 'VEHICLE_SALES', category: 'SALES', title: '3. Vehicle Sales', desc: 'Itemized sale transactions with buyer profiles, chassis, engine & prices' },
  { id: 'VEHICLE_PURCHASES', category: 'INVENTORY', title: '4. Vehicle Purchases', desc: 'Inward inventory acquisitions, seller details, purchase costs & balances payable' },
  { id: 'INVENTORY_VALUATION', category: 'INVENTORY', title: '5. Inventory', desc: 'Active showroom floor assets with acquisition cost, target demand & total capital locked' },
  { id: 'COMMISSIONS_REGISTER', category: 'COMMISSION_EXPENSE', title: '6. Commission', desc: 'Showroom commission earned, external broker payouts & internal agent rewards' },
  { id: 'EXPENSES_BREAKDOWN', category: 'COMMISSION_EXPENSE', title: '7. Expenses', desc: '12-category expense analysis (rent, power, salaries, vehicle repairs & detailing)' },
  { id: 'PROFIT_LOSS', category: 'FINANCIAL', title: '8. Profit/Loss', desc: 'Gross deal profits + commissions vs operating overheads, rent & staff payroll' },
  { id: 'CASH_FLOW', category: 'FINANCIAL', title: '9. Cash Flow', desc: 'Inflows (Sale tokens, commissions) vs Outflows (Purchases, repairs, bills, payouts)' },
  { id: 'CASH_IN_HAND', category: 'FINANCIAL', title: '10. Cash In Hand', desc: 'Real-time cash ledger safe balance reconciliation against bank accounts' },
  { id: 'CLIENT_OWNED', category: 'INVENTORY', title: '11. Client-Owned Vehicles', desc: 'Third-party client vehicles on display, owner reserve prices & commission margin' },
  { id: 'INVESTOR_OWNED', category: 'INVENTORY', title: '12. Investor-Owned Vehicles', desc: 'Investor syndicate financed vehicles, acquisition price & profit split payouts' },
  { id: 'SHOWROOM_OWNED', category: 'INVENTORY', title: '13. Showroom-Owned Vehicles', desc: '100% Showroom capitalized assets, purchase cost, refurbishment & gross profit margin' },
  { id: 'SOLD_VEHICLES', category: 'INVENTORY', title: '14. Sold Vehicles', desc: 'Complete historical archive of vehicles sold with sale dates, buyers & realized prices' },
  { id: 'UNSOLD_VEHICLES', category: 'INVENTORY', title: '15. Unsold Vehicles', desc: 'Currently unsold vehicles, days on floor (aging), and holding cost analysis' },
  { id: 'VEHICLE_PROFITABILITY', category: 'FINANCIAL', title: '16. Vehicle Profitability', desc: 'Purchase + Expenses = Total Cost vs Sale = Gross Profit with owner payable/commission breakdown' },
  { id: 'OUTSTANDING_RECEIVABLES', category: 'RECEIVABLES_PAYABLES', title: '17. Outstanding Payments', desc: 'Pending token balances due from buyers, payment status & collection age' },
  { id: 'OWNER_PAYABLES', category: 'RECEIVABLES_PAYABLES', title: '18. Owner Payables', desc: 'Unsettled sale proceeds owed to consignment client owners & investor partners' },
  { id: 'BROKER_COMMISSION', category: 'COMMISSION_EXPENSE', title: '19. Broker Commission', desc: 'Itemized broker vouchers, settled payments & pending brokerage liabilities' },
  { id: 'SALES_BY_DATE', category: 'SALES', title: '20. Sales by Date', desc: 'Custom date interval filtered sales orders and transaction history' },
];

export const reportService = {
  /**
   * GENERATE REPORT DATASET BY ID
   */
  generateReport: (reportId, { startDate = '', endDate = '', searchTerm = '', ownershipFilter = 'ALL', statusFilter = 'ALL' }) => {
    const allSales = salesService.getAllSales();
    const allPurchases = purchaseService.getAllPurchases();
    const allVehicles = vehicleStorage.getAllVehicles();
    const allExpenses = financeService.getAllExpenses();
    const allCommissions = salesService.getAllCommissions();
    const allLedger = financeService.getAllLedgerEntries();
    const accountsSummary = financeService.getAccountsSummary();

    const isDateInRange = (dateStr) => {
      if (!dateStr) return true;
      const d = dateStr.slice(0, 10);
      if (startDate && d < startDate) return false;
      if (endDate && d > endDate) return false;
      return true;
    };

    let result = {
      reportId,
      meta: ALL_REPORTS.find((r) => r.id === reportId) || ALL_REPORTS[0],
      columns: [],
      rows: [],
      summaryKPIs: [],
      generatedAt: new Date().toLocaleString(),
    };

    switch (reportId) {
      // =========================================================================
      // 1. DAILY SALES REPORT
      // =========================================================================
      case 'DAILY_SALES':
      case 'SALES_BY_DATE': {
        const filtered = allSales.filter((s) => s.status !== 'VOIDED' && isDateInRange(s.saleDate));
        
        // Group by Date
        const grouped = {};
        filtered.forEach((s) => {
          const dt = s.saleDate || 'Unknown';
          if (!grouped[dt]) {
            grouped[dt] = { date: dt, dealsCount: 0, grossVolume: 0, received: 0, balance: 0, profit: 0 };
          }
          grouped[dt].dealsCount += 1;
          grouped[dt].grossVolume += Number(s.netSalePrice || 0);
          grouped[dt].received += Number(s.amountReceived || 0);
          grouped[dt].balance += Number(s.remainingBalance || 0);
          grouped[dt].profit += Number(s.financials?.grossProfit || s.financials?.showroomNetEarnings || 0);
        });

        const rows = Object.values(grouped).sort((a, b) => b.date.localeCompare(a.date));
        const totalVol = rows.reduce((s, r) => s + r.grossVolume, 0);
        const totalProfit = rows.reduce((s, r) => s + r.profit, 0);

        result.columns = [
          { key: 'date', header: 'Sale Date' },
          { key: 'dealsCount', header: 'Deals Closed', align: 'center' },
          { key: 'grossVolume', header: 'Gross Turnover', align: 'right', isCurrency: true },
          { key: 'received', header: 'Cash Collected', align: 'right', isCurrency: true },
          { key: 'balance', header: 'Balance Due', align: 'right', isCurrency: true },
          { key: 'profit', header: 'Realized Profit', align: 'right', isCurrency: true },
        ];
        result.rows = rows;
        result.summaryKPIs = [
          { label: 'Total Sales Volume', value: `₨ ${totalVol.toLocaleString()}` },
          { label: 'Realized Deal Profit', value: `₨ ${totalProfit.toLocaleString()}` },
          { label: 'Deals Closed', value: filtered.length },
        ];
        break;
      }

      // =========================================================================
      // 2. MONTHLY SALES REPORT
      // =========================================================================
      case 'MONTHLY_SALES': {
        const filtered = allSales.filter((s) => s.status !== 'VOIDED' && isDateInRange(s.saleDate));
        const grouped = {};
        filtered.forEach((s) => {
          const monthKey = s.saleDate?.slice(0, 7) || '2026-10';
          if (!grouped[monthKey]) {
            grouped[monthKey] = { month: monthKey, dealsCount: 0, grossVolume: 0, received: 0, balance: 0, profit: 0 };
          }
          grouped[monthKey].dealsCount += 1;
          grouped[monthKey].grossVolume += Number(s.netSalePrice || 0);
          grouped[monthKey].received += Number(s.amountReceived || 0);
          grouped[monthKey].balance += Number(s.remainingBalance || 0);
          grouped[monthKey].profit += Number(s.financials?.grossProfit || s.financials?.showroomNetEarnings || 0);
        });

        const rows = Object.values(grouped).sort((a, b) => b.month.localeCompare(a.month));
        result.columns = [
          { key: 'month', header: 'Billing Month' },
          { key: 'dealsCount', header: 'Vehicles Sold', align: 'center' },
          { key: 'grossVolume', header: 'Total Sales Revenue', align: 'right', isCurrency: true },
          { key: 'received', header: 'Cash Received', align: 'right', isCurrency: true },
          { key: 'balance', header: 'Receivables Remaining', align: 'right', isCurrency: true },
          { key: 'profit', header: 'Net Deal Profit', align: 'right', isCurrency: true },
        ];
        result.rows = rows;
        result.summaryKPIs = [
          { label: 'Total Months Active', value: rows.length },
          { label: 'Aggregate Turnover', value: `₨ ${rows.reduce((s, r) => s + r.grossVolume, 0).toLocaleString()}` },
          { label: 'Aggregate Profit', value: `₨ ${rows.reduce((s, r) => s + r.profit, 0).toLocaleString()}` },
        ];
        break;
      }

      // =========================================================================
      // 3. VEHICLE SALES REGISTER
      // =========================================================================
      case 'VEHICLE_SALES': {
        const filtered = allSales.filter((s) => isDateInRange(s.saleDate));
        result.columns = [
          { key: 'id', header: 'Invoice #' },
          { key: 'saleDate', header: 'Date' },
          { key: 'vehicleSummary', header: 'Vehicle Asset' },
          { key: 'ownershipType', header: 'Ownership' },
          { key: 'buyerName', header: 'Buyer Name' },
          { key: 'netSalePrice', header: 'Net Sale Price', align: 'right', isCurrency: true },
          { key: 'amountReceived', header: 'Paid Amount', align: 'right', isCurrency: true },
          { key: 'remainingBalance', header: 'Balance', align: 'right', isCurrency: true },
          { key: 'profit', header: 'Deal Profit', align: 'right', isCurrency: true },
          { key: 'paymentStatus', header: 'Status' },
        ];
        result.rows = filtered.map((s) => ({
          id: s.id,
          saleDate: s.saleDate,
          vehicleSummary: s.vehicleSummary,
          ownershipType: s.ownershipType,
          buyerName: s.buyer?.name || 'Walk-in Buyer',
          netSalePrice: s.netSalePrice,
          amountReceived: s.amountReceived,
          remainingBalance: s.remainingBalance,
          profit: s.status === 'VOIDED' ? 0 : Number(s.financials?.grossProfit || s.financials?.showroomNetEarnings || 0),
          paymentStatus: s.status === 'VOIDED' ? 'VOIDED' : s.paymentStatus,
        }));
        result.summaryKPIs = [
          { label: 'Total Invoices', value: filtered.length },
          { label: 'Total Billed', value: `₨ ${filtered.reduce((s, r) => s + Number(r.netSalePrice || 0), 0).toLocaleString()}` },
          { label: 'Total Collected', value: `₨ ${filtered.reduce((s, r) => s + Number(r.amountReceived || 0), 0).toLocaleString()}` },
        ];
        break;
      }

      // =========================================================================
      // 5. VEHICLE PURCHASES & INWARD ACQUISITIONS
      // =========================================================================
      case 'VEHICLE_PURCHASES': {
        const filtered = allPurchases.filter((p) => isDateInRange(p.purchaseDate));
        result.columns = [
          { key: 'id', header: 'Purchase #' },
          { key: 'purchaseDate', header: 'Date' },
          { key: 'vehicleSummary', header: 'Vehicle Asset' },
          { key: 'sellerName', header: 'Seller / Ex-Owner' },
          { key: 'sellerPhone', header: 'Seller Contact' },
          { key: 'ownershipType', header: 'Ownership' },
          { key: 'purchasePrice', header: 'Purchase Price', align: 'right', isCurrency: true },
          { key: 'amountPaid', header: 'Amount Paid', align: 'right', isCurrency: true },
          { key: 'remainingAmount', header: 'Balance Payable', align: 'right', isCurrency: true },
          { key: 'paymentStatus', header: 'Status' },
        ];
        result.rows = filtered.map((p) => ({
          id: p.id,
          purchaseDate: p.purchaseDate,
          vehicleSummary: p.vehicleSummary,
          sellerName: p.seller?.name,
          sellerPhone: p.seller?.phone,
          ownershipType: p.ownershipType,
          purchasePrice: p.purchasePrice,
          amountPaid: p.amountPaid,
          remainingAmount: p.remainingAmount,
          paymentStatus: p.paymentStatus,
        }));
        result.summaryKPIs = [
          { label: 'Purchases Recorded', value: filtered.length },
          { label: 'Total Inward Capital', value: `₨ ${filtered.reduce((s, p) => s + Number(p.purchasePrice || 0), 0).toLocaleString()}` },
          { label: 'Paid Outflows', value: `₨ ${filtered.reduce((s, p) => s + Number(p.amountPaid || 0), 0).toLocaleString()}` },
          { label: 'Outstanding Payables', value: `₨ ${filtered.reduce((s, p) => s + Number(p.remainingAmount || 0), 0).toLocaleString()}` },
        ];
        break;
      }

      // =========================================================================
      // 6. INVENTORY VALUATION & STOCK SHEET
      // =========================================================================
      case 'INVENTORY_VALUATION':
      case 'UNSOLD_VEHICLES': {
        const floorCars = allVehicles.filter((v) => ['Available', 'Reserved'].includes(v.status));
        result.columns = [
          { key: 'stockCode', header: 'Stock #' },
          { key: 'vehicle', header: 'Vehicle Make & Model' },
          { key: 'registrationNo', header: 'Reg Plate' },
          { key: 'ownershipType', header: 'Ownership' },
          { key: 'costPrice', header: 'Acquisition Cost', align: 'right', isCurrency: true },
          { key: 'demandPrice', header: 'Showroom Demand', align: 'right', isCurrency: true },
          { key: 'potentialMargin', header: 'Target Margin', align: 'right', isCurrency: true },
          { key: 'status', header: 'Floor Status' },
          { key: 'purchaseDate', header: 'Inward Date' },
        ];
        result.rows = floorCars.map((v) => {
          const cost = Number(v.costPrice || 0);
          const demand = Number(v.demandPrice || cost * 1.08);
          return {
            stockCode: v.stockCode || `STK-${v.id}`,
            vehicle: `${v.make} ${v.model} (${v.modelYear})`,
            registrationNo: v.registrationNo,
            ownershipType: v.ownershipType,
            costPrice: cost,
            demandPrice: demand,
            potentialMargin: Math.max(0, demand - cost),
            status: v.status,
            purchaseDate: v.purchaseDate || 'In Stock',
          };
        });
        const totalStockValuation = floorCars.reduce((s, v) => s + Number(v.costPrice || 0), 0);
        const totalDemandValuation = floorCars.reduce((s, v) => s + Number(v.demandPrice || v.costPrice || 0), 0);
        result.summaryKPIs = [
          { label: 'Active Floor Inventory', value: `${floorCars.length} Cars` },
          { label: 'Total Stock Capital Locked', value: `₨ ${totalStockValuation.toLocaleString()}` },
          { label: 'Target Retail Valuation', value: `₨ ${totalDemandValuation.toLocaleString()}` },
          { label: 'Unrealized Margin Pipeline', value: `₨ ${(totalDemandValuation - totalStockValuation).toLocaleString()}` },
        ];
        break;
      }

      // =========================================================================
      // 7. SOLD VEHICLES HISTORICAL PERFORMANCE
      // =========================================================================
      case 'SOLD_VEHICLES': {
        const soldCars = allVehicles.filter((v) => v.status === 'Sold' && isDateInRange(v.saleDate));
        result.columns = [
          { key: 'registrationNo', header: 'Reg Plate' },
          { key: 'vehicle', header: 'Vehicle Asset' },
          { key: 'saleId', header: 'Sale Voucher' },
          { key: 'buyerName', header: 'Buyer' },
          { key: 'costPrice', header: 'Showroom Cost', align: 'right', isCurrency: true },
          { key: 'salePrice', header: 'Realized Sale', align: 'right', isCurrency: true },
          { key: 'grossProfit', header: 'Realized Margin', align: 'right', isCurrency: true },
          { key: 'saleDate', header: 'Sale Date' },
        ];
        result.rows = soldCars.map((v) => {
          const cost = Number(v.costPrice || 0);
          const saleP = Number(v.salePrice || 0);
          return {
            registrationNo: v.registrationNo,
            vehicle: `${v.make} ${v.model} (${v.modelYear})`,
            saleId: v.saleId || 'SAL-DEAL',
            buyerName: v.buyerName || 'Verified Buyer',
            costPrice: cost,
            salePrice: saleP,
            grossProfit: Math.max(0, saleP - cost),
            saleDate: v.saleDate || 'Delivered',
          };
        });
        result.summaryKPIs = [
          { label: 'Total Vehicles Sold', value: `${soldCars.length} Cars` },
          { label: 'Total Sales Realized', value: `₨ ${soldCars.reduce((s, v) => s + Number(v.salePrice || 0), 0).toLocaleString()}` },
          { label: 'Total Margins Earned', value: `₨ ${soldCars.reduce((s, v) => s + Math.max(0, Number(v.salePrice || 0) - Number(v.costPrice || 0)), 0).toLocaleString()}` },
        ];
        break;
      }

      // =========================================================================
      // 9-11. OWNERSHIP SEGREGATION REPORTS
      // =========================================================================
      case 'SHOWROOM_OWNED':
      case 'CLIENT_OWNED':
      case 'INVESTOR_OWNED': {
        const targetOwnership = reportId === 'SHOWROOM_OWNED' ? 'Showroom' : reportId === 'CLIENT_OWNED' ? 'Client' : 'Investor';
        const cars = allVehicles.filter((v) => v.ownershipType === targetOwnership);
        result.columns = [
          { key: 'registrationNo', header: 'Reg Plate' },
          { key: 'vehicle', header: 'Vehicle Asset' },
          { key: 'ownerName', header: 'Beneficiary / Partner' },
          { key: 'costPrice', header: 'Base / Cost Price', align: 'right', isCurrency: true },
          { key: 'demandPrice', header: 'Retail Target', align: 'right', isCurrency: true },
          { key: 'status', header: 'Current Status' },
          { key: 'purchaseDate', header: 'Inward Date' },
        ];
        result.rows = cars.map((v) => ({
          registrationNo: v.registrationNo,
          vehicle: `${v.make} ${v.model} (${v.modelYear})`,
          ownerName: v.ownerName || `${targetOwnership} Portfolio`,
          costPrice: Number(v.costPrice || 0),
          demandPrice: Number(v.demandPrice || v.costPrice || 0),
          status: v.status,
          purchaseDate: v.purchaseDate || 'Active',
        }));
        result.summaryKPIs = [
          { label: `${targetOwnership} Vehicles`, value: `${cars.length} Units` },
          { label: 'Portfolio Asset Value', value: `₨ ${cars.reduce((s, v) => s + Number(v.costPrice || 0), 0).toLocaleString()}` },
        ];
        break;
      }

      // =========================================================================
      // 16. VEHICLE PROFITABILITY ANALYSIS
      // Formula for Showroom: Purchase + Vehicle Exp = Total Cost; Sale - Total Cost = Gross Profit
      // Formula for Client/Investor: Sale Amount, Owner Payable, Showroom Commission, Other Deductions, Showroom Earnings
      // =========================================================================
      case 'VEHICLE_PROFITABILITY': {
        const activeSales = allSales.filter((s) => s.status !== 'VOIDED' && isDateInRange(s.saleDate));
        result.columns = [
          { key: 'id', header: 'Deal #' },
          { key: 'vehicleSummary', header: 'Vehicle Asset' },
          { key: 'ownershipType', header: 'Ownership' },
          { key: 'purchaseCost', header: 'Purchase / Base', align: 'right', isCurrency: true },
          { key: 'vehicleExpenses', header: 'Repairs / Exp', align: 'right', isCurrency: true },
          { key: 'totalCost', header: 'Total Cost', align: 'right', isCurrency: true },
          { key: 'netSalePrice', header: 'Sale Amount', align: 'right', isCurrency: true },
          { key: 'grossProfit', header: 'Gross Margin', align: 'right', isCurrency: true },
          { key: 'commissionsDeducted', header: 'Brokerage / Comm', align: 'right', isCurrency: true },
          { key: 'ownerPayable', header: 'Owner Payable', align: 'right', isCurrency: true },
          { key: 'showroomEarnings', header: 'Showroom Earnings', align: 'right', isCurrency: true },
        ];
        result.rows = activeSales.map((s) => {
          const isShowroom = s.ownershipType === 'Showroom';
          const purchaseCost = Number(s.costPrice || 0);
          const vehicleExpenses = Number(s.vehicleExpenses || 0);
          const totalCost = purchaseCost + vehicleExpenses;
          const saleAmount = Number(s.netSalePrice || 0);
          const grossProfit = isShowroom ? saleAmount - totalCost : Math.max(0, saleAmount - purchaseCost);
          const brokerComm = Number(s.commission?.brokerAmount || 0);
          const agentComm = Number(s.commission?.agentAmount || 0);
          const totalComm = brokerComm + agentComm;
          const ownerPayable = isShowroom ? 0 : purchaseCost;
          const showroomEarnings = Number(s.financials?.showroomNetEarnings || s.financials?.grossProfit || (isShowroom ? grossProfit - totalComm : Number(s.commission?.showroomAmount || 0)));

          return {
            id: s.id,
            vehicleSummary: s.vehicleSummary,
            ownershipType: s.ownershipType,
            purchaseCost,
            vehicleExpenses,
            totalCost,
            netSalePrice: saleAmount,
            grossProfit,
            commissionsDeducted: totalComm,
            ownerPayable,
            showroomEarnings,
          };
        });
        const totalProfitRealized = result.rows.reduce((sum, r) => sum + r.showroomEarnings, 0);
        const totalTurnover = result.rows.reduce((sum, r) => sum + r.netSalePrice, 0);
        result.summaryKPIs = [
          { label: 'Completed Deals Analyzed', value: activeSales.length },
          { label: 'Total Sales Volume', value: `₨ ${totalTurnover.toLocaleString()}` },
          { label: 'Total Showroom Earnings', value: `₨ ${totalProfitRealized.toLocaleString()}` },
          { label: 'Average Margin / Deal', value: `₨ ${activeSales.length ? Math.round(totalProfitRealized / activeSales.length).toLocaleString() : 0}` },
        ];
        break;
      }

      // =========================================================================
      // 13. PROFIT & LOSS STATEMENT (P&L)
      // =========================================================================
      case 'PROFIT_LOSS': {
        const activeSales = allSales.filter((s) => s.status !== 'VOIDED' && isDateInRange(s.saleDate));
        const filteredExpenses = allExpenses.filter((e) => isDateInRange(e.date));

        const grossSaleProfits = activeSales.reduce((s, sale) => s + Number(sale.financials?.grossProfit || sale.financials?.showroomNetEarnings || 0), 0);
        const showroomCommissionsEarned = activeSales.reduce((s, sale) => s + Number(sale.commission?.showroomAmount || 0), 0);
        const totalOperatingExpenses = filteredExpenses.reduce((s, e) => s + Number(e.amount || 0), 0);
        const brokerCommissionsPaid = allCommissions.filter((c) => c.status === 'PAID').reduce((s, c) => s + Number(c.amount || 0), 0);
        const netOperatingProfit = grossSaleProfits + showroomCommissionsEarned - totalOperatingExpenses;

        result.columns = [
          { key: 'lineItem', header: 'Accounting P&L Line Item' },
          { key: 'category', header: 'Classification' },
          { key: 'amount', header: 'Amount (PKR)', align: 'right', isCurrency: true },
          { key: 'impact', header: 'Financial Impact' },
        ];

        result.rows = [
          { lineItem: '1. Gross Deal Profits on Showroom Assets', category: 'Operating Revenue', amount: grossSaleProfits, impact: 'INCOME (+)' },
          { lineItem: '2. Consignment & Showroom Commission Fees', category: 'Fee Revenue', amount: showroomCommissionsEarned, impact: 'INCOME (+)' },
          { lineItem: '3. Operating Showroom Overheads & Bills', category: 'Operating Expense', amount: totalOperatingExpenses, impact: 'EXPENSE (-)' },
          { lineItem: '4. External Car Broker Commission Disbursements', category: 'Brokerage Expense', amount: brokerCommissionsPaid, impact: 'EXPENSE (-)' },
          { lineItem: 'NET SHOWROOM PROFIT (EBITDA)', category: 'Net Bottom Line', amount: netOperatingProfit, impact: netOperatingProfit >= 0 ? 'SURPLUS (+)' : 'DEFICIT (-)' },
        ];

        result.summaryKPIs = [
          { label: 'Gross Operating Margins', value: `₨ ${(grossSaleProfits + showroomCommissionsEarned).toLocaleString()}` },
          { label: 'Total Expenses Incurred', value: `₨ ${totalOperatingExpenses.toLocaleString()}` },
          { label: 'Net Showroom Bottom Line Profit', value: `₨ ${netOperatingProfit.toLocaleString()}` },
        ];
        break;
      }

      // =========================================================================
      // 14. CASH FLOW STATEMENT
      // =========================================================================
      case 'CASH_FLOW':
      case 'CASH_IN_HAND': {
        const filteredLedger = allLedger.filter((l) => isDateInRange(l.date));
        const totalInflows = filteredLedger.filter((l) => l.type === 'DEBIT').reduce((s, l) => s + Number(l.amount || 0), 0);
        const totalOutflows = filteredLedger.filter((l) => l.type === 'CREDIT').reduce((s, l) => s + Number(l.amount || 0), 0);

        result.columns = [
          { key: 'date', header: 'Timestamp' },
          { key: 'id', header: 'Voucher #' },
          { key: 'account', header: 'Account / Safe' },
          { key: 'category', header: 'Activity' },
          { key: 'type', header: 'Flow Type' },
          { key: 'amount', header: 'Transaction Amount', align: 'right', isCurrency: true },
          { key: 'runningBalance', header: 'Closing Balance', align: 'right', isCurrency: true },
          { key: 'narration', header: 'Description' },
        ];

        result.rows = filteredLedger.map((l) => ({
          date: l.date,
          id: l.id,
          account: l.account.replace(' (Counter)', ''),
          category: l.category,
          type: l.type === 'DEBIT' ? 'INFLOW (DEBIT)' : 'OUTFLOW (CREDIT)',
          amount: Number(l.amount || 0),
          runningBalance: Number(l.runningBalance || 0),
          narration: l.narration,
        }));

        result.summaryKPIs = [
          { label: 'Total Cash Inflows (Debit)', value: `₨ ${totalInflows.toLocaleString()}` },
          { label: 'Total Cash Outflows (Credit)', value: `₨ ${totalOutflows.toLocaleString()}` },
          { label: 'Net Net Cash Position', value: `₨ ${(totalInflows - totalOutflows).toLocaleString()}` },
          { label: 'Current Cash in Hand', value: `₨ ${accountsSummary.cashInHand.toLocaleString()}` },
        ];
        break;
      }

      // =========================================================================
      // 16. COMMISSIONS & BROKER PAYOUTS
      // =========================================================================
      case 'COMMISSIONS_REGISTER':
      case 'BROKER_COMMISSION': {
        const filtered = allCommissions.filter((c) => isDateInRange(c.date));
        result.columns = [
          { key: 'id', header: 'Voucher #' },
          { key: 'date', header: 'Date' },
          { key: 'recipientName', header: 'Broker / Agent' },
          { key: 'partyType', header: 'Type' },
          { key: 'vehicleSummary', header: 'Linked Vehicle' },
          { key: 'saleId', header: 'Deal Order' },
          { key: 'amount', header: 'Commission Amount', align: 'right', isCurrency: true },
          { key: 'status', header: 'Payout Status' },
        ];
        result.rows = filtered.map((c) => ({
          id: c.id,
          date: c.date,
          recipientName: c.recipientName,
          partyType: c.partyType,
          vehicleSummary: c.vehicleSummary,
          saleId: c.saleId,
          amount: Number(c.amount || 0),
          status: c.status,
        }));
        const totalComm = filtered.reduce((s, c) => s + Number(c.amount || 0), 0);
        const paidComm = filtered.filter((c) => c.status === 'PAID').reduce((s, c) => s + Number(c.amount || 0), 0);
        result.summaryKPIs = [
          { label: 'Total Commission Volume', value: `₨ ${totalComm.toLocaleString()}` },
          { label: 'Settled Payouts', value: `₨ ${paidComm.toLocaleString()}` },
          { label: 'Pending Liabilities', value: `₨ ${(totalComm - paidComm).toLocaleString()}` },
        ];
        break;
      }

      // =========================================================================
      // 18. EXPENSES BREAKDOWN REPORT
      // =========================================================================
      case 'EXPENSES_BREAKDOWN': {
        const filtered = allExpenses.filter((e) => isDateInRange(e.date));
        result.columns = [
          { key: 'id', header: 'Voucher #' },
          { key: 'date', header: 'Date' },
          { key: 'category', header: 'Category' },
          { key: 'paidTo', header: 'Vendor / Payee' },
          { key: 'scope', header: 'Scope' },
          { key: 'account', header: 'Paid From' },
          { key: 'amount', header: 'Amount', align: 'right', isCurrency: true },
          { key: 'narration', header: 'Narration' },
        ];
        result.rows = filtered.map((e) => ({
          id: e.id,
          date: e.date,
          category: e.category,
          paidTo: e.paidTo,
          scope: e.isVehicleLinked ? `🚗 ${e.vehicleSummary}` : '🏢 Showroom Overhead',
          account: e.account.replace(' (Counter)', ''),
          amount: Number(e.amount || 0),
          narration: e.narration,
        }));
        result.summaryKPIs = [
          { label: 'Total Expenses Recorded', value: `₨ ${filtered.reduce((s, e) => s + Number(e.amount || 0), 0).toLocaleString()}` },
          { label: 'Vehicle Direct Refurbishments', value: `₨ ${filtered.filter((e) => e.isVehicleLinked).reduce((s, e) => s + Number(e.amount || 0), 0).toLocaleString()}` },
          { label: 'Showroom Overheads', value: `₨ ${filtered.filter((e) => !e.isVehicleLinked).reduce((s, e) => s + Number(e.amount || 0), 0).toLocaleString()}` },
        ];
        break;
      }

      // =========================================================================
      // 19. OUTSTANDING RECEIVABLES / PAYMENTS DUE
      // =========================================================================
      case 'OUTSTANDING_RECEIVABLES': {
        const pendingSales = allSales.filter((s) => s.status !== 'VOIDED' && Number(s.remainingBalance || 0) > 0);
        result.columns = [
          { key: 'id', header: 'Invoice #' },
          { key: 'saleDate', header: 'Sale Date' },
          { key: 'buyerName', header: 'Buyer Name' },
          { key: 'buyerPhone', header: 'Buyer Contact' },
          { key: 'vehicleSummary', header: 'Vehicle Asset' },
          { key: 'netSalePrice', header: 'Agreed Price', align: 'right', isCurrency: true },
          { key: 'amountReceived', header: 'Advance Paid', align: 'right', isCurrency: true },
          { key: 'remainingBalance', header: 'Outstanding Balance', align: 'right', isCurrency: true },
        ];
        result.rows = pendingSales.map((s) => ({
          id: s.id,
          saleDate: s.saleDate,
          buyerName: s.buyer?.name,
          buyerPhone: s.buyer?.phone,
          vehicleSummary: s.vehicleSummary,
          netSalePrice: Number(s.netSalePrice || 0),
          amountReceived: Number(s.amountReceived || 0),
          remainingBalance: Number(s.remainingBalance || 0),
        }));
        const totalReceivable = pendingSales.reduce((s, r) => s + Number(r.remainingBalance || 0), 0);
        result.summaryKPIs = [
          { label: 'Pending Buyer Invoices', value: `${pendingSales.length} Deals` },
          { label: 'Total Capital Receivable', value: `₨ ${totalReceivable.toLocaleString()}` },
        ];
        break;
      }

      // =========================================================================
      // 20. OWNER PAYABLES & CONSIGNMENT LIABILITIES
      // =========================================================================
      case 'OWNER_PAYABLES': {
        const pendingPurchases = allPurchases.filter((p) => Number(p.remainingAmount || 0) > 0);
        result.columns = [
          { key: 'id', header: 'Purchase Order' },
          { key: 'purchaseDate', header: 'Inward Date' },
          { key: 'sellerName', header: 'Seller / Partner' },
          { key: 'sellerPhone', header: 'Contact' },
          { key: 'vehicleSummary', header: 'Vehicle Asset' },
          { key: 'purchasePrice', header: 'Agreed Purchase Price', align: 'right', isCurrency: true },
          { key: 'amountPaid', header: 'Amount Disbursed', align: 'right', isCurrency: true },
          { key: 'remainingAmount', header: 'Outstanding Payable', align: 'right', isCurrency: true },
        ];
        result.rows = pendingPurchases.map((p) => ({
          id: p.id,
          purchaseDate: p.purchaseDate,
          sellerName: p.seller?.name,
          sellerPhone: p.seller?.phone,
          vehicleSummary: p.vehicleSummary,
          purchasePrice: Number(p.purchasePrice || 0),
          amountPaid: Number(p.amountPaid || 0),
          remainingAmount: Number(p.remainingAmount || 0),
        }));
        const totalPayable = pendingPurchases.reduce((s, p) => s + Number(p.remainingAmount || 0), 0);
        result.summaryKPIs = [
          { label: 'Pending Seller Liabilities', value: `${pendingPurchases.length} Parties` },
          { label: 'Total Balance Payable', value: `₨ ${totalPayable.toLocaleString()}` },
        ];
        break;
      }

      default:
        break;
    }

    // Apply Search Filter across all textual fields
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result.rows = result.rows.filter((row) =>
        Object.values(row).some((val) => String(val).toLowerCase().includes(term))
      );
    }

    return result;
  },

  /**
   * CSV EXPORT UTILITY
   */
  exportToCSV: (filename, columns, rows) => {
    if (!rows || rows.length === 0) return;

    const headers = columns.map((c) => `"${c.header.replace(/"/g, '""')}"`).join(',');
    const dataRows = rows.map((row) =>
      columns
        .map((c) => {
          const val = row[c.key];
          if (val === null || val === undefined) return '""';
          return `"${String(val).replace(/"/g, '""')}"`;
        })
        .join(',')
    );

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers, ...dataRows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename || 'Ahsan_Autos_Report'}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
};

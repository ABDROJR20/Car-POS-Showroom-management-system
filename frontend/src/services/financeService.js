// Financial Domain Engine & Double-Entry Cash Ledger Service for Ahsan Autos
// Comprehensive Phase 7 Cash in Hand, Ledger, Income, Expenses, and Payments

import { vehicleStorage } from './vehicleStorage.js';

const CASH_LEDGER_KEY = 'ahsan_cash_ledger_v1';
const EXPENSES_STORAGE_KEY = 'ahsan_expenses_v1';
const INCOMES_STORAGE_KEY = 'ahsan_incomes_v1';
const ACCOUNTS_STORAGE_KEY = 'ahsan_accounts_v1';

export const EXPENSE_CATEGORIES = [
  'Rent',
  'Electricity',
  'Internet',
  'Salaries',
  'Fuel',
  'Vehicle Repair',
  'Vehicle Detailing',
  'Advertising',
  'Commission',
  'Office Expense',
  'Maintenance',
  'Miscellaneous',
];

export const INCOME_CATEGORIES = [
  'Vehicle Sale Payment',
  'Showroom Commission Received',
  'Car Booking Token',
  'Inspection Fee Received',
  'Investor Capital Deposit',
  'Other Income',
];

// Seed initial realistic Pakistani showroom financial accounts
const DEFAULT_ACCOUNTS = [
  { id: 'acc-cash', name: 'Cash in Hand (Counter)', type: 'CASH', initialBalance: 1500000 },
  { id: 'acc-meezan', name: 'Meezan Bank Current A/C', type: 'BANK', initialBalance: 18500000 },
  { id: 'acc-hbl', name: 'HBL Business Account', type: 'BANK', initialBalance: 7200000 },
];

// Seed initial realistic cash ledger journal entries
const SEED_LEDGER = [
  {
    id: 'LED-00922',
    date: '2026-10-07 15:30',
    account: 'Cash in Hand (Counter)',
    type: 'DEBIT', // Inflow
    category: 'Vehicle Sale Payment',
    amount: 2000000,
    runningBalance: 3450000,
    referenceId: 'SAL-2026-0088',
    narration: 'Token Advance for Honda Civic RS Turbo (SAL-2026-0088)',
    authorizedBy: 'Ahsan Khan (Director)',
    recipient: 'Ahsan Autos Showroom',
  },
  {
    id: 'LED-00921',
    date: '2026-10-06 14:15',
    account: 'Meezan Bank Current A/C',
    type: 'DEBIT',
    category: 'Vehicle Sale Payment',
    amount: 7075000,
    runningBalance: 25575000,
    referenceId: 'SAL-2026-0089',
    narration: 'Full RTGS Payment for Toyota Corolla Altis Grande (SAL-2026-0089)',
    authorizedBy: 'Ahsan Khan (Director)',
    recipient: 'Ahsan Autos Showroom',
  },
  {
    id: 'LED-00920',
    date: '2026-10-05 18:00',
    account: 'Cash in Hand (Counter)',
    type: 'CREDIT', // Outflow
    category: 'Salaries',
    amount: 180000,
    runningBalance: 1450000,
    referenceId: 'EXP-2026-004',
    narration: 'Monthly showroom staff salaries and guard allowances (Oct 2026)',
    authorizedBy: 'Ahsan Khan (Director)',
    recipient: 'Showroom Staff',
  },
  {
    id: 'LED-00919',
    date: '2026-10-04 11:30',
    account: 'Cash in Hand (Counter)',
    type: 'CREDIT',
    category: 'Vehicle Repair',
    amount: 65000,
    runningBalance: 1630000,
    referenceId: 'EXP-2026-001',
    vehicleId: 1,
    vehicleSummary: 'Toyota Fortuner Sigma 4 (ICT-23-9001)',
    narration: 'Front bumper paint & detailing touchup paid to Ustad Asif Body Workshop',
    authorizedBy: 'Ahsan Khan (Director)',
    recipient: 'Ustad Asif Body Workshop',
  },
  {
    id: 'LED-00918',
    date: '2026-10-03 16:00',
    account: 'Cash in Hand (Counter)',
    type: 'CREDIT',
    category: 'Electricity',
    amount: 125000,
    runningBalance: 1695000,
    referenceId: 'EXP-2026-003',
    narration: 'IESCO Commercial Showroom Electricity Bill paid',
    authorizedBy: 'Ahsan Khan (Director)',
    recipient: 'IESCO Islamabad',
  },
  {
    id: 'LED-00917',
    date: '2026-10-02 10:00',
    account: 'Cash in Hand (Counter)',
    type: 'DEBIT',
    category: 'Investor Capital Deposit',
    amount: 1000000,
    runningBalance: 1820000,
    referenceId: 'INC-2026-001',
    narration: 'Short-term operating capital injection by Director Ahsan Khan',
    authorizedBy: 'Ahsan Khan (Director)',
    recipient: 'Ahsan Autos Showroom',
  },
];

const SEED_EXPENSES = [
  {
    id: 'EXP-2026-001',
    category: 'Vehicle Repair',
    isVehicleLinked: true,
    vehicleId: 1,
    vehicleSummary: 'Toyota Fortuner Sigma 4 (ICT-23-9001)',
    paidTo: 'Ustad Asif Body Workshop',
    amount: 65000,
    paymentMethod: 'Cash in Hand',
    account: 'Cash in Hand (Counter)',
    date: '2026-10-04',
    narration: 'Front bumper touchup & ceramic coating prep',
    receiptNo: 'RCP-ASIF-901',
    authorizedBy: 'Ahsan Khan',
  },
  {
    id: 'EXP-2026-002',
    category: 'Vehicle Detailing',
    isVehicleLinked: true,
    vehicleId: 2,
    vehicleSummary: 'Honda Civic RS Turbo (LEA-22-3412)',
    paidTo: 'Glow Detailing Center',
    amount: 25000,
    paymentMethod: 'Cash in Hand',
    account: 'Cash in Hand (Counter)',
    date: '2026-10-03',
    narration: 'Interior deep dry cleaning and leather conditioning',
    receiptNo: 'GLOW-4412',
    authorizedBy: 'Ahsan Khan',
  },
  {
    id: 'EXP-2026-003',
    category: 'Electricity',
    isVehicleLinked: false,
    paidTo: 'IESCO Commercial Bill',
    amount: 125000,
    paymentMethod: 'Cash in Hand',
    account: 'Cash in Hand (Counter)',
    date: '2026-10-03',
    narration: 'Showroom floodlights and AC power consumption bill',
    receiptNo: 'IESCO-SEP26',
    authorizedBy: 'Ahsan Khan',
  },
  {
    id: 'EXP-2026-004',
    category: 'Salaries',
    isVehicleLinked: false,
    paidTo: 'Showroom Staff (5 Persons)',
    amount: 180000,
    paymentMethod: 'Cash in Hand',
    account: 'Cash in Hand (Counter)',
    date: '2026-10-05',
    narration: 'Monthly showroom staff payroll & sales commission incentives',
    receiptNo: 'PAYROLL-OCT26',
    authorizedBy: 'Ahsan Khan',
  },
  {
    id: 'EXP-2026-005',
    category: 'Rent',
    isVehicleLinked: false,
    paidTo: 'Showroom Plaza Owner (Al-Ghani Plaza)',
    amount: 450000,
    paymentMethod: 'Bank Transfer (Meezan Bank)',
    account: 'Meezan Bank Current A/C',
    date: '2026-10-01',
    narration: 'Showroom display floor advance monthly lease rent',
    receiptNo: 'RENT-OCT26',
    authorizedBy: 'Ahsan Khan',
  },
];

export const financeService = {
  // Get all ledger entries
  getAllLedgerEntries: () => {
    try {
      const stored = localStorage.getItem(CASH_LEDGER_KEY);
      if (stored) return JSON.parse(stored);
      localStorage.setItem(CASH_LEDGER_KEY, JSON.stringify(SEED_LEDGER));
      return SEED_LEDGER;
    } catch (err) {
      console.error('Failed to read cash ledger:', err);
      return SEED_LEDGER;
    }
  },

  // Save ledger entries
  saveLedger: (entries) => {
    localStorage.setItem(CASH_LEDGER_KEY, JSON.stringify(entries));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ahsan_cash_updated'));
    }
  },

  // Get all expenses
  getAllExpenses: () => {
    try {
      const stored = localStorage.getItem(EXPENSES_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
      localStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify(SEED_EXPENSES));
      return SEED_EXPENSES;
    } catch (err) {
      console.error('Failed to read expenses:', err);
      return SEED_EXPENSES;
    }
  },

  // Save expenses
  saveExpenses: (expenses) => {
    localStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify(expenses));
  },

  // Get all accounts summary
  getAccountsSummary: () => {
    const ledger = financeService.getAllLedgerEntries();

    // Default account balances
    const accounts = {
      'Cash in Hand (Counter)': { name: 'Cash in Hand (Counter)', type: 'CASH', balance: 0, cashIn: 0, cashOut: 0 },
      'Meezan Bank Current A/C': { name: 'Meezan Bank Current A/C', type: 'BANK', balance: 18500000, cashIn: 0, cashOut: 0 },
      'HBL Business Account': { name: 'HBL Business Account', type: 'BANK', balance: 7200000, cashIn: 0, cashOut: 0 },
    };

    // Calculate dynamic balance strictly from ledger movements
    // Opening counter cash anchor: 1,500,000
    let counterBalance = 1500000;

    // Process in chronological order (oldest to newest)
    const reversed = [...ledger].reverse();
    reversed.forEach((entry) => {
      const amt = Number(entry.amount || 0);
      const acc = accounts[entry.account] || accounts['Cash in Hand (Counter)'];

      if (entry.type === 'DEBIT') {
        // Inflow
        acc.cashIn += amt;
        if (entry.account === 'Cash in Hand (Counter)') {
          counterBalance += amt;
        } else {
          acc.balance += amt;
        }
      } else {
        // Outflow (Credit)
        acc.cashOut += amt;
        if (entry.account === 'Cash in Hand (Counter)') {
          counterBalance -= amt;
        } else {
          acc.balance = Math.max(0, acc.balance - amt);
        }
      }
    });

    accounts['Cash in Hand (Counter)'].balance = Math.max(0, counterBalance);

    const totalLiquid = Object.values(accounts).reduce((sum, a) => sum + a.balance, 0);
    const totalCashIn = Object.values(accounts).reduce((sum, a) => sum + a.cashIn, 0);
    const totalCashOut = Object.values(accounts).reduce((sum, a) => sum + a.cashOut, 0);

    return {
      accounts,
      cashInHand: accounts['Cash in Hand (Counter)'].balance,
      meezanBalance: accounts['Meezan Bank Current A/C'].balance,
      hblBalance: accounts['HBL Business Account'].balance,
      totalLiquid,
      totalCashIn,
      totalCashOut,
    };
  },

  // Direct Cash in Hand value
  getCashInHand: () => {
    return financeService.getAccountsSummary().cashInHand;
  },

  /**
   * ATOMIC EXPENSE TRANSACTION
   * 1. Validates expense details
   * 2. Creates expense voucher record
   * 3. Appends CREDIT (outflow) entry to Cash Ledger
   * 4. If linked to vehicle, updates vehicle direct repair costing
   * 5. Dispatches updates
   */
  recordExpense: ({ category, amount, account, paidTo, isVehicleLinked, vehicleId, narration, date, receiptNo }) => {
    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      throw new Error('Expense amount must be greater than zero.');
    }
    if (!category) {
      throw new Error('Expense category is required.');
    }
    if (!paidTo || !paidTo.trim()) {
      throw new Error('Payee / Vendor name is required.');
    }

    const expenses = financeService.getAllExpenses();
    const newExpenseId = `EXP-2026-${String(expenses.length + 10).padStart(3, '0')}`;
    const expenseDate = date || new Date().toISOString().split('T')[0];
    const targetAccount = account || 'Cash in Hand (Counter)';

    let vehicleSummary = '';
    if (isVehicleLinked && vehicleId) {
      const v = vehicleStorage.getVehicleById(vehicleId);
      if (v) {
        vehicleSummary = `${v.make} ${v.model} (${v.modelYear}) • ${v.registrationNo}`;
        try {
          vehicleStorage.updateVehicle(vehicleId, {
            totalExpenses: Number(v.totalExpenses || 0) + numAmount,
          });
        } catch (e) {
          console.warn('Could not update vehicle totalExpenses:', e);
        }
      }
    }

    const expenseRecord = {
      id: newExpenseId,
      category,
      isVehicleLinked: !!isVehicleLinked,
      vehicleId: isVehicleLinked ? vehicleId : null,
      vehicleSummary,
      paidTo,
      amount: numAmount,
      paymentMethod: targetAccount.includes('Bank') ? 'Bank Transfer' : 'Cash in Hand',
      account: targetAccount,
      date: expenseDate,
      narration: narration || `Expense for ${category} paid to ${paidTo}`,
      receiptNo: receiptNo || `RCP-${Date.now().toString().slice(-4)}`,
      authorizedBy: 'Ahsan Khan (Director)',
      createdAt: new Date().toISOString(),
    };

    expenses.unshift(expenseRecord);
    financeService.saveExpenses(expenses);

    // Ledger Outflow Entry
    const ledger = financeService.getAllLedgerEntries();
    const currentSummary = financeService.getAccountsSummary();
    const currentAccBalance = currentSummary.accounts[targetAccount]?.balance || 0;
    const newRunningBalance = Math.max(0, currentAccBalance - numAmount);

    const ledgerEntry = {
      id: `LED-${Date.now().toString().slice(-5)}`,
      date: `${expenseDate} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}`,
      account: targetAccount,
      type: 'CREDIT', // Outflow
      category,
      amount: numAmount,
      runningBalance: newRunningBalance,
      referenceId: newExpenseId,
      vehicleId: isVehicleLinked ? vehicleId : null,
      vehicleSummary,
      narration: `[EXPENSE] ${category} payment to ${paidTo}${vehicleSummary ? ` (${vehicleSummary})` : ''}`,
      authorizedBy: 'Ahsan Khan (Director)',
      recipient: paidTo,
    };

    ledger.unshift(ledgerEntry);
    financeService.saveLedger(ledger);

    return expenseRecord;
  },

  /**
   * ATOMIC INCOME / CASH INJECTION TRANSACTION
   * Appends DEBIT (inflow) entry to Cash Ledger
   */
  recordIncome: ({ category, amount, account, receivedFrom, narration, date, receiptNo }) => {
    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      throw new Error('Income amount must be greater than zero.');
    }
    if (!receivedFrom || !receivedFrom.trim()) {
      throw new Error('Received From / Payer name is required.');
    }

    const targetAccount = account || 'Cash in Hand (Counter)';
    const incomeDate = date || new Date().toISOString().split('T')[0];
    const newIncomeId = `INC-2026-${Date.now().toString().slice(-4)}`;

    const ledger = financeService.getAllLedgerEntries();
    const currentSummary = financeService.getAccountsSummary();
    const currentAccBalance = currentSummary.accounts[targetAccount]?.balance || 0;
    const newRunningBalance = currentAccBalance + numAmount;

    const ledgerEntry = {
      id: `LED-${Date.now().toString().slice(-5)}`,
      date: `${incomeDate} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}`,
      account: targetAccount,
      type: 'DEBIT', // Inflow
      category: category || 'Other Income',
      amount: numAmount,
      runningBalance: newRunningBalance,
      referenceId: newIncomeId,
      narration: `[INCOME] ${category || 'Cash Receipt'} from ${receivedFrom}: ${narration || 'General inflow'}`,
      authorizedBy: 'Ahsan Khan (Director)',
      recipient: 'Ahsan Autos Showroom',
    };

    ledger.unshift(ledgerEntry);
    financeService.saveLedger(ledger);

    return ledgerEntry;
  },

  /**
   * ATOMIC ACCOUNT-TO-ACCOUNT TRANSFER
   * Example: Transfer from Cash Counter to Meezan Bank
   */
  recordTransfer: ({ fromAccount, toAccount, amount, narration, date }) => {
    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      throw new Error('Transfer amount must be greater than zero.');
    }
    if (fromAccount === toAccount) {
      throw new Error('Source and destination accounts must be different.');
    }

    const currentSummary = financeService.getAccountsSummary();
    const sourceBalance = currentSummary.accounts[fromAccount]?.balance || 0;
    if (numAmount > sourceBalance) {
      throw new Error(
        `Insufficient balance in ${fromAccount} (Available: ₨ ${sourceBalance.toLocaleString()})`
      );
    }

    const transferDate = date || new Date().toISOString().split('T')[0];
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    const ledger = financeService.getAllLedgerEntries();

    // 1. Credit Outflow from Source
    const creditEntry = {
      id: `LED-${Date.now().toString().slice(-5)}A`,
      date: `${transferDate} ${timeStr}`,
      account: fromAccount,
      type: 'CREDIT',
      category: 'Account Transfer',
      amount: numAmount,
      runningBalance: Math.max(0, sourceBalance - numAmount),
      referenceId: 'TRANSFER',
      narration: `[INTERNAL TRANSFER] Outflow to ${toAccount} (${narration || 'Cash deposit/transfer'})`,
      authorizedBy: 'Ahsan Khan (Director)',
      recipient: toAccount,
    };

    // 2. Debit Inflow to Destination
    const destBalance = currentSummary.accounts[toAccount]?.balance || 0;
    const debitEntry = {
      id: `LED-${Date.now().toString().slice(-5)}B`,
      date: `${transferDate} ${timeStr}`,
      account: toAccount,
      type: 'DEBIT',
      category: 'Account Transfer',
      amount: numAmount,
      runningBalance: destBalance + numAmount,
      referenceId: 'TRANSFER',
      narration: `[INTERNAL TRANSFER] Inflow from ${fromAccount} (${narration || 'Cash deposit/transfer'})`,
      authorizedBy: 'Ahsan Khan (Director)',
      recipient: toAccount,
    };

    ledger.unshift(creditEntry);
    ledger.unshift(debitEntry);
    financeService.saveLedger(ledger);

    return { creditEntry, debitEntry };
  },

  /**
   * ATOMIC OWNER / CONSIGNMENT SETTLEMENT PAYOUT
   */
  recordOwnerPayout: ({ ownerName, vehicleId, amount, account, paymentMethod, narration, date }) => {
    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      throw new Error('Payout amount must be greater than zero.');
    }
    if (!ownerName) {
      throw new Error('Owner / Investor name is required.');
    }

    const targetAccount = account || 'Cash in Hand (Counter)';
    const payoutDate = date || new Date().toISOString().split('T')[0];
    let vehicleSummary = '';

    if (vehicleId) {
      const v = vehicleStorage.getVehicleById(vehicleId);
      if (v) {
        vehicleSummary = `${v.make} ${v.model} (${v.modelYear}) • ${v.registrationNo}`;
      }
    }

    const ledger = financeService.getAllLedgerEntries();
    const currentSummary = financeService.getAccountsSummary();
    const currentAccBalance = currentSummary.accounts[targetAccount]?.balance || 0;
    const newRunningBalance = Math.max(0, currentAccBalance - numAmount);

    const ledgerEntry = {
      id: `LED-${Date.now().toString().slice(-5)}`,
      date: `${payoutDate} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}`,
      account: targetAccount,
      type: 'CREDIT', // Outflow to owner
      category: 'Owner Payment',
      amount: numAmount,
      runningBalance: newRunningBalance,
      referenceId: `PAYOUT-${Date.now().toString().slice(-4)}`,
      vehicleId,
      vehicleSummary,
      narration: `[CONSIGNMENT SETTLEMENT] Vehicle Sale Proceeds remitted to Owner ${ownerName}${vehicleSummary ? ` for ${vehicleSummary}` : ''}`,
      authorizedBy: 'Ahsan Khan (Director)',
      recipient: ownerName,
    };

    ledger.unshift(ledgerEntry);
    financeService.saveLedger(ledger);

    return ledgerEntry;
  },

  /**
   * DAILY CASH REGISTER RECONCILIATION
   */
  getDailyClosingData: (dateStr) => {
    const targetDate = dateStr || new Date().toISOString().split('T')[0];
    const ledger = financeService.getAllLedgerEntries();

    const dayEntries = ledger.filter((e) => e.date.startsWith(targetDate));
    const dayCashIn = dayEntries.filter((e) => e.type === 'DEBIT').reduce((sum, e) => sum + Number(e.amount || 0), 0);
    const dayCashOut = dayEntries.filter((e) => e.type === 'CREDIT').reduce((sum, e) => sum + Number(e.amount || 0), 0);

    const summary = financeService.getAccountsSummary();

    return {
      date: targetDate,
      dayEntries,
      dayCashIn,
      dayCashOut,
      netDayPosition: dayCashIn - dayCashOut,
      currentCashInHand: summary.cashInHand,
      totalLiquid: summary.totalLiquid,
    };
  },
};

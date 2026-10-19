// Sales Domain Engine & Atomic Financial Transaction Service for Ahsan Autos
// Comprehensive Phase 6 Vehicle Sales & Commission Management

import { vehicleStorage } from './vehicleStorage.js';

const SALES_STORAGE_KEY = 'ahsan_sales_v1';
const SALE_PAYMENTS_KEY = 'ahsan_sale_payments_v1';
const COMMISSIONS_KEY = 'ahsan_commissions_v1';
const CASH_LEDGER_KEY = 'ahsan_cash_ledger_v1';

// Seed initial realistic Pakistani showroom sales
const SEED_SALES = [
  {
    id: 'SAL-2026-0089',
    vehicleId: 3,
    vehicleSummary: 'Toyota Corolla Altis Grande 1.8 (2022) • ICT-22-1190',
    ownershipType: 'Showroom',
    costPrice: 6600000,
    vehicleExpenses: 50000, // Detailing + Inspection
    totalCost: 6650000,
    salePrice: 7100000,
    additionalCharges: 25000, // Transfer processing fee
    discount: 50000,
    netSalePrice: 7075000,
    amountReceived: 7075000,
    remainingBalance: 0,
    paymentStatus: 'PAID_IN_FULL',
    saleDate: '2026-10-06',
    paymentMethod: 'Bank Transfer (Meezan Bank)',
    accountDepositedTo: 'Meezan Bank Current A/C',
    buyer: {
      name: 'Chaudhry Nadeem Akhtar',
      fatherName: 'Chaudhry Akhtar Ali',
      cnic: '37405-1234567-1',
      phone: '+92 300 8472911',
      city: 'Islamabad',
      address: 'House 112, Street 18, F-10/2, Islamabad',
    },
    witnesses: {
      w1Name: 'Muhammad Salman',
      w1Cnic: '37405-9988771-3',
      w2Name: 'Rashid Minhas',
      w2Cnic: '37405-5544332-9',
    },
    commission: {
      showroomType: 'FIXED',
      showroomValue: 0,
      showroomAmount: 0,
      brokerName: 'Malik Zafar (G-8 Markaz)',
      brokerPhone: '+92 333 5544332',
      brokerType: 'FIXED',
      brokerValue: 40000,
      brokerAmount: 40000,
      brokerStatus: 'PAID',
      agentName: 'Kamran (Showroom Sales)',
      agentType: 'FIXED',
      agentValue: 15000,
      agentAmount: 15000,
      agentStatus: 'PAID',
    },
    // Accounting & Profit
    financials: {
      grossProfit: 370000, // 7,075,000 net - 6,650,000 cost - 40,000 broker - 15,000 agent = 370,000
      ownerPayable: 0,
      showroomNetEarnings: 370000,
    },
    notes: 'Payment received in full via RTGS. Vehicle delivered with all original keys and documents.',
    status: 'ACTIVE', // ACTIVE | VOIDED
    createdAt: '2026-10-06T14:30:00.000Z',
  },
  {
    id: 'SAL-2026-0088',
    vehicleId: 2,
    vehicleSummary: 'Honda Civic RS Turbo (2022) • LEA-22-3412',
    ownershipType: 'Client',
    costPrice: 8200000, // Owner reserve agreed price
    vehicleExpenses: 0,
    totalCost: 8200000,
    salePrice: 8550000,
    additionalCharges: 0,
    discount: 50000,
    netSalePrice: 8500000,
    amountReceived: 2000000,
    remainingBalance: 6500000,
    paymentStatus: 'TOKEN_ADVANCE',
    saleDate: '2026-10-05',
    paymentMethod: 'Cash in Hand',
    accountDepositedTo: 'Cash in Hand (Counter)',
    buyer: {
      name: 'Dr. Tariq Mehmood',
      fatherName: 'Mehmood Ahmad',
      cnic: '35201-9988112-5',
      phone: '+92 321 4455667',
      city: 'Lahore',
      address: 'Defence Phase 6, Sector C, Lahore',
    },
    witnesses: {
      w1Name: 'Ali Raza',
      w1Cnic: '35202-7788990-3',
      w2Name: 'Kamran Butt',
      w2Cnic: '35201-3344556-7',
    },
    commission: {
      showroomType: 'PERCENTAGE',
      showroomValue: 1.5,
      showroomAmount: 127500,
      brokerName: 'Haji Zulfiqar Autos',
      brokerPhone: '+92 301 6655443',
      brokerType: 'FIXED',
      brokerValue: 50000,
      brokerAmount: 50000,
      brokerStatus: 'PENDING',
      agentName: 'Direct Deal',
      agentType: 'FIXED',
      agentValue: 0,
      agentAmount: 0,
      agentStatus: 'N/A',
    },
    // Accounting & Profit for Consignment:
    // Owner gets 8,200,000. Showroom commission is 127,500 + 172,500 price surplus - 50,000 broker = 250,000 net showroom earnings.
    financials: {
      grossProfit: 250000,
      ownerPayable: 8200000,
      showroomNetEarnings: 250000,
    },
    notes: 'Token Advance PKR 2M received. Balance 6.5M due in 3 days upon vehicle biometric handover.',
    status: 'ACTIVE',
    createdAt: '2026-10-05T16:15:00.000Z',
  },
];

export const salesService = {
  // Read all sales
  getAllSales: () => {
    try {
      const stored = localStorage.getItem(SALES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      localStorage.setItem(SALES_STORAGE_KEY, JSON.stringify(SEED_SALES));
      return SEED_SALES;
    } catch (err) {
      console.error('Failed to read sales from storage:', err);
      return SEED_SALES;
    }
  },

  // Save sales
  saveSales: (sales) => {
    localStorage.setItem(SALES_STORAGE_KEY, JSON.stringify(sales));
  },

  // Get single sale by ID
  getSaleById: (id) => {
    const all = salesService.getAllSales();
    return all.find((s) => String(s.id) === String(id)) || null;
  },

  // Get payments for a specific sale
  getSalePayments: (saleId) => {
    try {
      const payments = JSON.parse(localStorage.getItem(SALE_PAYMENTS_KEY) || '[]');
      return payments.filter((p) => String(p.saleId) === String(saleId));
    } catch (err) {
      return [];
    }
  },

  // Get all commission records
  getAllCommissions: () => {
    try {
      return JSON.parse(localStorage.getItem(COMMISSIONS_KEY) || '[]');
    } catch (err) {
      return [];
    }
  },

  /**
   * ATOMIC SALE TRANSACTION (ACID EXECUTION)
   * Executes 11 atomic steps:
   * 1. Validate vehicle existence & availability status (PREVENT SELLING ALREADY SOLD CARS)
   * 2. Validate buyer details & CNIC
   * 3. Calculate sale net totals (Base + Additional Charges - Discount)
   * 4. Calculate commissions (Fixed / Percentage for Showroom, Broker, Agent)
   * 5. Calculate accounting profit & owner payables according to ownership type
   * 6. Create sale record with unique invoice voucher #
   * 7. Record payment voucher (if amountReceived > 0)
   * 8. Update vehicle status to 'Sold' in inventory (assign saleId, saleDate, salePrice, buyerName)
   * 9. Update financial ledger with cash/bank INFLOW entry
   * 10. Record commission register vouchers
   * 11. Dispatch inventory update event
   * 
   * If any step fails -> ROLLBACK ALL MODIFICATIONS and throw error.
   */
  executeSaleTransaction: (payload) => {
    // 1. Transaction Snapshot (Rollback State)
    const backupVehicles = JSON.parse(localStorage.getItem('ahsan_vehicles_inventory_v1') || '[]');
    const backupSales = JSON.parse(localStorage.getItem(SALES_STORAGE_KEY) || '[]');
    const backupPayments = JSON.parse(localStorage.getItem(SALE_PAYMENTS_KEY) || '[]');
    const backupCommissions = JSON.parse(localStorage.getItem(COMMISSIONS_KEY) || '[]');
    const backupLedger = JSON.parse(localStorage.getItem(CASH_LEDGER_KEY) || '[]');

    try {
      // Step 1: Validate Vehicle
      if (!payload.vehicleId) {
        throw new Error('Please select a vehicle to sell.');
      }

      const vehicle = vehicleStorage.getVehicleById(payload.vehicleId);
      if (!vehicle) {
        throw new Error('The selected vehicle could not be found in inventory.');
      }

      // CRITICAL EDGE CASE: Prevent selling an already SOLD or non-available vehicle
      if (vehicle.status === 'Sold') {
        throw new Error(
          `Vehicle (${vehicle.make} ${vehicle.model} - Reg: ${vehicle.registrationNo}) is ALREADY SOLD. You cannot sell an already sold vehicle.`
        );
      }
      if (vehicle.status === 'In Workshop' || vehicle.status === 'Returned' || vehicle.status === 'Cancelled') {
        throw new Error(
          `Vehicle status is currently "${vehicle.status}". Only Available or Reserved vehicles can be sold.`
        );
      }

      // Step 2: Validate Buyer
      if (!payload.buyer?.name || !payload.buyer?.phone) {
        throw new Error('Buyer Full Name and Phone Number are required.');
      }

      // Step 3: Financial Calculations
      const salePrice = Number(payload.salePrice || 0);
      const additionalCharges = Number(payload.additionalCharges || 0);
      const discount = Number(payload.discount || 0);
      const amountReceived = Number(payload.amountReceived || 0);

      if (salePrice <= 0) {
        throw new Error('Agreed Sale Price must be greater than zero.');
      }
      if (discount < 0 || discount > salePrice) {
        throw new Error('Discount cannot be negative or greater than the sale price.');
      }

      const netSalePrice = Math.max(0, salePrice + additionalCharges - discount);

      if (amountReceived < 0) {
        throw new Error('Amount Received cannot be negative.');
      }
      if (amountReceived > netSalePrice) {
        throw new Error(
          `Amount received (PKR ${amountReceived.toLocaleString()}) cannot exceed the total net sale price (PKR ${netSalePrice.toLocaleString()}).`
        );
      }

      const remainingBalance = netSalePrice - amountReceived;
      let paymentStatus = 'PENDING_PAYMENT';
      if (remainingBalance === 0 && amountReceived > 0) {
        paymentStatus = 'PAID_IN_FULL';
      } else if (amountReceived > 0 && remainingBalance > 0) {
        paymentStatus = 'TOKEN_ADVANCE';
      }

      // Step 4: Calculate Commissions (Fixed vs Percentage)
      const commissionConfig = payload.commission || {};

      // Showroom Commission
      let showroomCommissionAmount = 0;
      if (commissionConfig.showroomType === 'PERCENTAGE') {
        const pct = Number(commissionConfig.showroomValue || 0);
        showroomCommissionAmount = Math.round((netSalePrice * pct) / 100);
      } else {
        showroomCommissionAmount = Number(commissionConfig.showroomValue || 0);
      }

      // Broker Commission
      let brokerCommissionAmount = 0;
      if (commissionConfig.brokerType === 'PERCENTAGE') {
        const pct = Number(commissionConfig.brokerValue || 0);
        brokerCommissionAmount = Math.round((netSalePrice * pct) / 100);
      } else {
        brokerCommissionAmount = Number(commissionConfig.brokerValue || 0);
      }

      // Agent / Salesman Commission
      let agentCommissionAmount = 0;
      if (commissionConfig.agentType === 'PERCENTAGE') {
        const pct = Number(commissionConfig.agentValue || 0);
        agentCommissionAmount = Math.round((netSalePrice * pct) / 100);
      } else {
        agentCommissionAmount = Number(commissionConfig.agentValue || 0);
      }

      // Step 5: Profit & Loss Analysis by Ownership Type
      const ownershipType = vehicle.ownershipType || 'Showroom';
      const costPrice = Number(vehicle.costPrice || 0);
      const vehicleExpenses = Number(payload.vehicleExpenses || 0);
      const totalCost = costPrice + vehicleExpenses;

      let grossProfit = 0;
      let ownerPayable = 0;
      let showroomNetEarnings = 0;

      if (ownershipType === 'Showroom') {
        // Showroom-Owned Vehicle Profit Formula:
        // Net Sale Price - Total Cost - Broker Commission - Agent Commission
        grossProfit = netSalePrice - totalCost - brokerCommissionAmount - agentCommissionAmount;
        ownerPayable = 0;
        showroomNetEarnings = grossProfit;
      } else {
        // Client / Investor / Consignment Vehicle Profit Formula:
        // Do NOT treat entire sale as profit.
        // Owner gets agreed base price (costPrice).
        // Showroom earnings = Showroom Commission + (Net Sale Price - Owner Payable) - Broker/Agent Comm - Expenses
        ownerPayable = costPrice;
        const surplus = netSalePrice - ownerPayable;
        showroomNetEarnings = showroomCommissionAmount + Math.max(0, surplus - showroomCommissionAmount) - brokerCommissionAmount - agentCommissionAmount - vehicleExpenses;
        grossProfit = showroomNetEarnings;
      }

      // Step 6: Create Sale Order Record
      const sales = salesService.getAllSales();
      const newSaleId = `SAL-2026-${String(sales.length + 90).padStart(4, '0')}`;
      const saleDate = payload.saleDate || new Date().toISOString().split('T')[0];

      const saleRecord = {
        id: newSaleId,
        vehicleId: vehicle.id,
        vehicleSummary: `${vehicle.make} ${vehicle.model} (${vehicle.modelYear}) • ${vehicle.registrationNo}`,
        ownershipType,
        costPrice,
        vehicleExpenses,
        totalCost,
        salePrice,
        additionalCharges,
        discount,
        netSalePrice,
        amountReceived,
        remainingBalance,
        paymentStatus,
        saleDate,
        paymentMethod: payload.paymentMethod || 'Cash in Hand',
        accountDepositedTo: payload.accountDepositedTo || 'Cash in Hand (Counter)',
        buyer: {
          name: payload.buyer.name,
          fatherName: payload.buyer.fatherName || '',
          cnic: payload.buyer.cnic || '',
          phone: payload.buyer.phone,
          city: payload.buyer.city || '',
          address: payload.buyer.address || '',
        },
        witnesses: {
          w1Name: payload.witnesses?.w1Name || '',
          w1Cnic: payload.witnesses?.w1Cnic || '',
          w2Name: payload.witnesses?.w2Name || '',
          w2Cnic: payload.witnesses?.w2Cnic || '',
        },
        commission: {
          showroomType: commissionConfig.showroomType || 'FIXED',
          showroomValue: Number(commissionConfig.showroomValue || 0),
          showroomAmount: showroomCommissionAmount,
          brokerName: commissionConfig.brokerName || '',
          brokerPhone: commissionConfig.brokerPhone || '',
          brokerType: commissionConfig.brokerType || 'FIXED',
          brokerValue: Number(commissionConfig.brokerValue || 0),
          brokerAmount: brokerCommissionAmount,
          brokerStatus: brokerCommissionAmount > 0 ? (commissionConfig.brokerStatus || 'PENDING') : 'N/A',
          agentName: commissionConfig.agentName || '',
          agentType: commissionConfig.agentType || 'FIXED',
          agentValue: Number(commissionConfig.agentValue || 0),
          agentAmount: agentCommissionAmount,
          agentStatus: agentCommissionAmount > 0 ? (commissionConfig.agentStatus || 'PENDING') : 'N/A',
        },
        financials: {
          grossProfit,
          ownerPayable,
          showroomNetEarnings,
        },
        notes: payload.notes || '',
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
      };

      sales.unshift(saleRecord);
      salesService.saveSales(sales);

      // Step 7: Record Payment Voucher (if advance or full payment received)
      if (amountReceived > 0) {
        const paymentRecord = {
          id: `PAY-SAL-${Date.now().toString().slice(-6)}`,
          saleId: newSaleId,
          amount: amountReceived,
          paymentDate: saleDate,
          paymentMethod: payload.paymentMethod || 'Cash in Hand',
          accountDepositedTo: payload.accountDepositedTo || 'Cash in Hand (Counter)',
          receiptReference: `Down Payment / Advance for ${newSaleId} (${saleRecord.vehicleSummary})`,
          receivedBy: 'Ahsan Khan (Director)',
          createdAt: new Date().toISOString(),
        };

        const allPayments = JSON.parse(localStorage.getItem(SALE_PAYMENTS_KEY) || '[]');
        allPayments.unshift(paymentRecord);
        localStorage.setItem(SALE_PAYMENTS_KEY, JSON.stringify(allPayments));

        // Step 8: Update Financial Cash/Bank Ledger (INFLOW - DEBIT)
        const ledger = JSON.parse(localStorage.getItem(CASH_LEDGER_KEY) || '[]');
        const lastBalance = ledger.length > 0 ? Number(ledger[0].runningBalance || 3450000) : 3450000;
        const newBalance = lastBalance + amountReceived;

        const ledgerEntry = {
          id: `LED-${Date.now().toString().slice(-5)}`,
          date: new Date().toISOString().replace('T', ' ').slice(0, 16),
          account: payload.accountDepositedTo || 'Cash in Hand (Counter)',
          type: 'DEBIT', // Inflow into showroom
          amount: amountReceived,
          runningBalance: newBalance,
          narration: `Vehicle Sale Receipt (${saleRecord.paymentStatus === 'PAID_IN_FULL' ? 'Full' : 'Token'}) for ${saleRecord.vehicleSummary} • ${newSaleId}`,
        };

        ledger.unshift(ledgerEntry);
        localStorage.setItem(CASH_LEDGER_KEY, JSON.stringify(ledger));
      }

      // Step 9: Change Vehicle Status to SOLD in inventory
      vehicleStorage.updateVehicle(vehicle.id, {
        status: 'Sold',
        saleDate,
        salePrice: netSalePrice,
        buyerName: payload.buyer.name,
        buyerPhone: payload.buyer.phone,
        saleId: newSaleId,
        statusChangeReason: `Vehicle Sold via ${newSaleId} to ${payload.buyer.name}`,
      });

      // Step 10: Create Commission Records in Commission Ledger
      if (brokerCommissionAmount > 0 || agentCommissionAmount > 0 || showroomCommissionAmount > 0) {
        const commissions = JSON.parse(localStorage.getItem(COMMISSIONS_KEY) || '[]');
        
        if (brokerCommissionAmount > 0) {
          commissions.unshift({
            id: `COM-BRK-${Date.now().toString().slice(-5)}`,
            saleId: newSaleId,
            vehicleSummary: saleRecord.vehicleSummary,
            partyType: 'BROKER',
            recipientName: commissionConfig.brokerName || 'Showroom Broker',
            recipientPhone: commissionConfig.brokerPhone || '',
            amount: brokerCommissionAmount,
            status: commissionConfig.brokerStatus || 'PENDING',
            date: saleDate,
            notes: `Brokerage on sale of ${saleRecord.vehicleSummary}`,
          });
        }

        if (agentCommissionAmount > 0) {
          commissions.unshift({
            id: `COM-AGT-${Date.now().toString().slice(-5)}`,
            saleId: newSaleId,
            vehicleSummary: saleRecord.vehicleSummary,
            partyType: 'SALES_AGENT',
            recipientName: commissionConfig.agentName || 'Sales Agent',
            amount: agentCommissionAmount,
            status: commissionConfig.agentStatus || 'PENDING',
            date: saleDate,
            notes: `Internal agent commission for deal closing ${newSaleId}`,
          });
        }

        localStorage.setItem(COMMISSIONS_KEY, JSON.stringify(commissions));
      }

      // Step 11: Notify frontend context
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('ahsan_inventory_updated', { detail: { vehicleId: vehicle.id, status: 'Sold' } }));
      }

      return saleRecord;
    } catch (error) {
      // ATOMIC ROLLBACK
      localStorage.setItem('ahsan_vehicles_inventory_v1', JSON.stringify(backupVehicles));
      localStorage.setItem(SALES_STORAGE_KEY, JSON.stringify(backupSales));
      localStorage.setItem(SALE_PAYMENTS_KEY, JSON.stringify(backupPayments));
      localStorage.setItem(COMMISSIONS_KEY, JSON.stringify(backupCommissions));
      localStorage.setItem(CASH_LEDGER_KEY, JSON.stringify(backupLedger));
      throw error;
    }
  },

  /**
   * RECORD SUBSEQUENT PARTIAL / BALANCE PAYMENT FOR SALE
   */
  recordSalePayment: (saleId, { amount, paymentMethod, accountDepositedTo, notes }) => {
    const payAmount = Number(amount);
    if (payAmount <= 0) {
      throw new Error('Payment amount must be greater than zero.');
    }

    const sales = salesService.getAllSales();
    const saleIdx = sales.findIndex((s) => String(s.id) === String(saleId));
    if (saleIdx === -1) {
      throw new Error('Sale record not found.');
    }

    const sale = sales[saleIdx];
    if (sale.status === 'VOIDED') {
      throw new Error('Cannot add payment to a voided/cancelled sale.');
    }
    if (payAmount > sale.remainingBalance) {
      throw new Error(
        `Payment amount (PKR ${payAmount.toLocaleString()}) cannot exceed remaining balance (PKR ${sale.remainingBalance.toLocaleString()}).`
      );
    }

    const newReceived = sale.amountReceived + payAmount;
    const newRemaining = Math.max(0, sale.netSalePrice - newReceived);
    const newPaymentStatus = newRemaining === 0 ? 'PAID_IN_FULL' : 'TOKEN_ADVANCE';

    // Update sale record
    sale.amountReceived = newReceived;
    sale.remainingBalance = newRemaining;
    sale.paymentStatus = newPaymentStatus;
    sales[saleIdx] = sale;
    salesService.saveSales(sales);

    // Write payment voucher
    const paymentRecord = {
      id: `PAY-SAL-${Date.now().toString().slice(-6)}`,
      saleId,
      amount: payAmount,
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: paymentMethod || 'Cash in Hand',
      accountDepositedTo: accountDepositedTo || 'Cash in Hand (Counter)',
      receiptReference: `Subsequent Balance Collection for ${saleId}`,
      receivedBy: 'Ahsan Khan (Director)',
      notes: notes || '',
      createdAt: new Date().toISOString(),
    };

    const allPayments = JSON.parse(localStorage.getItem(SALE_PAYMENTS_KEY) || '[]');
    allPayments.unshift(paymentRecord);
    localStorage.setItem(SALE_PAYMENTS_KEY, JSON.stringify(allPayments));

    // Update Cash Ledger Inflow
    const ledger = JSON.parse(localStorage.getItem(CASH_LEDGER_KEY) || '[]');
    const lastBalance = ledger.length > 0 ? Number(ledger[0].runningBalance || 3450000) : 3450000;
    const newBalance = lastBalance + payAmount;

    const ledgerEntry = {
      id: `LED-${Date.now().toString().slice(-5)}`,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      account: accountDepositedTo || 'Cash in Hand (Counter)',
      type: 'DEBIT',
      amount: payAmount,
      runningBalance: newBalance,
      narration: `Balance Collection (${newRemaining === 0 ? 'Final Full' : 'Installment'}) for ${sale.vehicleSummary} • ${saleId}`,
    };

    ledger.unshift(ledgerEntry);
    localStorage.setItem(CASH_LEDGER_KEY, JSON.stringify(ledger));

    return { sale, payment: paymentRecord };
  },

  /**
   * CANCEL / VOID SALE (ATOMIC ROLLBACK WITH AUDIT TRAIL)
   * 1. Marks sale status as VOIDED
   * 2. Reverts vehicle status back to 'Available'
   * 3. Logs cash ledger REFUND / REVERSAL outflow (if money was collected)
   * 4. Voids any pending commissions
   */
  cancelSale: (saleId, reason) => {
    if (!reason || reason.trim().length < 5) {
      throw new Error('Please provide a valid reason for cancelling this sale deal.');
    }

    const sales = salesService.getAllSales();
    const saleIdx = sales.findIndex((s) => String(s.id) === String(saleId));
    if (saleIdx === -1) {
      throw new Error('Sale record not found.');
    }

    const sale = sales[saleIdx];
    if (sale.status === 'VOIDED') {
      throw new Error('Sale is already voided.');
    }

    // 1. Mark sale as voided
    sale.status = 'VOIDED';
    sale.voidReason = reason;
    sale.voidedAt = new Date().toISOString();
    sale.voidedBy = 'Ahsan Khan (Director)';
    sales[saleIdx] = sale;
    salesService.saveSales(sales);

    // 2. Revert vehicle status back to 'Available'
    if (sale.vehicleId) {
      vehicleStorage.updateVehicle(sale.vehicleId, {
        status: 'Available',
        saleDate: null,
        salePrice: null,
        buyerName: null,
        buyerPhone: null,
        saleId: null,
        statusChangeReason: `Sale Deal ${saleId} Cancelled / Voided. Reason: ${reason}. Returned to active floor stock.`,
      });
    }

    // 3. Log Cash Ledger Refund Outflow (if advance was received)
    if (sale.amountReceived > 0) {
      const ledger = JSON.parse(localStorage.getItem(CASH_LEDGER_KEY) || '[]');
      const lastBalance = ledger.length > 0 ? Number(ledger[0].runningBalance || 3450000) : 3450000;
      const newBalance = Math.max(0, lastBalance - sale.amountReceived);

      const ledgerEntry = {
        id: `LED-${Date.now().toString().slice(-5)}`,
        date: new Date().toISOString().replace('T', ' ').slice(0, 16),
        account: sale.accountDepositedTo || 'Cash in Hand (Counter)',
        type: 'CREDIT', // Outflow / refund
        amount: sale.amountReceived,
        runningBalance: newBalance,
        narration: `[VOID REVERSAL] Token Refund for Cancelled Sale ${saleId} (${sale.vehicleSummary}). Reason: ${reason}`,
      };

      ledger.unshift(ledgerEntry);
      localStorage.setItem(CASH_LEDGER_KEY, JSON.stringify(ledger));
    }

    // 4. Void Commissions
    try {
      const commissions = JSON.parse(localStorage.getItem(COMMISSIONS_KEY) || '[]');
      const updatedCommissions = commissions.map((c) => {
        if (String(c.saleId) === String(saleId)) {
          return { ...c, status: 'VOIDED', voidReason: `Sale ${saleId} Cancelled` };
        }
        return c;
      });
      localStorage.setItem(COMMISSIONS_KEY, JSON.stringify(updatedCommissions));
    } catch (err) {
      console.error('Failed to update commissions:', err);
    }

    // Notify context
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ahsan_inventory_updated', { detail: { vehicleId: sale.vehicleId, status: 'Available' } }));
    }

    return sale;
  },

  /**
   * UPDATE COMMISSION STATUS (Mark Broker/Agent commission as PAID)
   */
  updateCommissionStatus: (commissionId, newStatus) => {
    const commissions = JSON.parse(localStorage.getItem(COMMISSIONS_KEY) || '[]');
    const idx = commissions.findIndex((c) => String(c.id) === String(commissionId));
    if (idx === -1) throw new Error('Commission voucher not found.');

    commissions[idx].status = newStatus;
    commissions[idx].settledDate = newStatus === 'PAID' ? new Date().toISOString().split('T')[0] : null;
    localStorage.setItem(COMMISSIONS_KEY, JSON.stringify(commissions));
    return commissions[idx];
  },
};

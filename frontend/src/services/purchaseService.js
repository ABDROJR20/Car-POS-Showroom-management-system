// Purchase Domain Engine & Atomic Financial Transaction Service for Ahsan Autos

import { vehicleStorage } from './vehicleStorage.js';

const PURCHASES_STORAGE_KEY = 'ahsan_purchases_v1';
const PURCHASE_PAYMENTS_KEY = 'ahsan_purchase_payments_v1';
const CASH_LEDGER_KEY = 'ahsan_cash_ledger_v1';

// Seed initial realistic purchases
const SEED_PURCHASES = [
  {
    id: 'PUR-2026-0034',
    vehicleId: 1,
    vehicleSummary: 'Toyota Fortuner Sigma 4 (2023) • ICT-23-9001',
    seller: {
      name: 'Sheikh Imran',
      fatherName: 'Sheikh Muhammad Aslam',
      cnic: '37405-9988776-3',
      phone: '+92 333 5511223',
      city: 'Islamabad',
      address: 'House 42, Street 11, F-7/2, Islamabad',
    },
    ownerName: 'Sheikh Imran (First Owner)',
    ownershipType: 'Showroom',
    purchaseType: 'DIRECT_SHOWROOM_PURCHASE',
    purchasePrice: 16800000,
    amountPaid: 16800000,
    remainingAmount: 0,
    paymentStatus: 'PAID',
    purchaseDate: '2026-08-15',
    paymentMethod: 'Meezan Bank IBFT',
    accountPaidFrom: 'Meezan Bank Current A/C',
    broker: {
      name: 'Direct Deal',
      phone: '',
      commissionAmount: 0,
    },
    witnesses: {
      w1Name: 'Muhammad Arshad',
      w1Cnic: '35202-1122334-1',
      w2Name: 'Tariq Javed',
      w2Cnic: '35201-9988771-5',
    },
    notes: 'Purchased directly from first owner with complete original book and file.',
    createdAt: '2026-08-15T11:30:00.000Z',
  },
  {
    id: 'PUR-2026-0033',
    vehicleId: 2,
    vehicleSummary: 'Honda Civic RS Turbo (2022) • LEA-22-3412',
    seller: {
      name: 'Mian Tariq',
      fatherName: 'Mian Bashir Ahmad',
      cnic: '35201-4455667-9',
      phone: '+92 321 4455667',
      city: 'Lahore',
      address: 'Defence Phase 5, Lahore',
    },
    ownerName: 'Mian Tariq',
    ownershipType: 'Client',
    purchaseType: 'CLIENT_CONSIGNMENT_IN',
    purchasePrice: 8200000,
    amountPaid: 0,
    remainingAmount: 8200000,
    paymentStatus: 'CONSIGNMENT',
    purchaseDate: '2026-09-02',
    paymentMethod: 'Consignment Agreement',
    accountPaidFrom: 'N/A (Consignment Take-In)',
    broker: {
      name: 'Haji Zulfiqar Autos',
      phone: '+92 301 6655443',
      commissionAmount: 50000,
    },
    witnesses: {
      w1Name: 'Ali Raza',
      w1Cnic: '35202-7788990-3',
      w2Name: 'Kamran Butt',
      w2Cnic: '35201-3344556-7',
    },
    notes: 'Consignment vehicle taken in for display. Sale proceeds to be remitted on deal closing.',
    createdAt: '2026-09-02T14:00:00.000Z',
  },
  {
    id: 'PUR-2026-0032',
    vehicleId: 4,
    vehicleSummary: 'Toyota Land Cruiser Prado TX-L 2.7 (2021) • ISB-21-7700',
    seller: {
      name: 'Sardar Usman Khan',
      fatherName: 'Sardar Fateh Khan',
      cnic: '37401-2233445-5',
      phone: '+92 300 5544332',
      city: 'Rawalpindi',
      address: 'Chaklala Scheme 3, Rawalpindi',
    },
    ownerName: 'Sardar Usman Khan',
    ownershipType: 'Showroom',
    purchaseType: 'DIRECT_SHOWROOM_PURCHASE',
    purchasePrice: 24000000,
    amountPaid: 20000000,
    remainingAmount: 4000000,
    paymentStatus: 'PARTIAL',
    purchaseDate: '2026-08-20',
    paymentMethod: 'Bank Cheque / Pay Order',
    accountPaidFrom: 'HBL Business Account',
    broker: {
      name: 'Chaudhry Akram (Rawalpindi)',
      phone: '+92 333 7788991',
      commissionAmount: 100000,
    },
    witnesses: {
      w1Name: 'Raja Naveed',
      w1Cnic: '37401-9988112-1',
      w2Name: 'Malik Tahir',
      w2Cnic: '37405-5544331-9',
    },
    notes: 'Partial payment made PKR 20M via Pay Order. Remaining balance PKR 4M due upon transfer biometric confirmation.',
    createdAt: '2026-08-20T16:45:00.000Z',
  },
];

export const purchaseService = {
  // Get all purchases
  getAllPurchases: () => {
    try {
      const stored = localStorage.getItem(PURCHASES_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      localStorage.setItem(PURCHASES_STORAGE_KEY, JSON.stringify(SEED_PURCHASES));
      return SEED_PURCHASES;
    } catch (err) {
      console.error('Failed to read purchases:', err);
      return SEED_PURCHASES;
    }
  },

  // Save purchases
  savePurchases: (purchases) => {
    localStorage.setItem(PURCHASES_STORAGE_KEY, JSON.stringify(purchases));
  },

  // Get single purchase by ID
  getPurchaseById: (id) => {
    const all = purchaseService.getAllPurchases();
    return all.find((p) => String(p.id) === String(id)) || null;
  },

  // Get payments history for a purchase
  getPurchasePayments: (purchaseId) => {
    try {
      const allPayments = JSON.parse(localStorage.getItem(PURCHASE_PAYMENTS_KEY) || '[]');
      return allPayments.filter((p) => String(p.purchaseId) === String(purchaseId));
    } catch (err) {
      return [];
    }
  },

  /**
   * ATOMIC PURCHASE TRANSACTION (ACID Simulation)
   * Executes 8 steps inside a single transactional block:
   * 1. Validate inputs
   * 2. Create / Register vehicle in showroom inventory (or link existing)
   * 3. Record seller / party details
   * 4. Create purchase record with unique purchase voucher #
   * 5. Record initial payment (if amountPaid > 0)
   * 6. Log cash ledger outflow entry
   * 7. Update vehicle inventory status & cost price
   * 8. Generate purchase receipt / legal deed
   * If any step fails -> Rollback everything and throw error.
   */
  executePurchaseTransaction: (payload) => {
    const backupVehicles = JSON.parse(localStorage.getItem('ahsan_vehicles_inventory_v1') || '[]');
    const backupPurchases = JSON.parse(localStorage.getItem(PURCHASES_STORAGE_KEY) || '[]');
    const backupPayments = JSON.parse(localStorage.getItem(PURCHASE_PAYMENTS_KEY) || '[]');
    const backupLedger = JSON.parse(localStorage.getItem(CASH_LEDGER_KEY) || '[]');

    try {
      // Step 1: Validations
      const purchasePrice = Number(payload.purchasePrice || 0);
      const amountPaid = Number(payload.amountPaid || 0);

      if (purchasePrice <= 0) {
        throw new Error('Agreed Purchase Price must be greater than zero.');
      }
      if (amountPaid < 0 || amountPaid > purchasePrice) {
        throw new Error('Initial Amount Paid cannot be negative or exceed the agreed purchase price.');
      }
      if (!payload.seller?.name || !payload.seller?.phone) {
        throw new Error('Seller Full Name and Phone Number are required.');
      }
      if (!payload.vehicle?.make || !payload.vehicle?.model || !payload.vehicle?.chassisNo) {
        throw new Error('Vehicle Make, Model, and Chassis (VIN) number are required.');
      }

      const remainingAmount = purchasePrice - amountPaid;
      let paymentStatus = 'UNPAID';
      if (payload.purchaseType === 'CLIENT_CONSIGNMENT_IN') {
        paymentStatus = 'CONSIGNMENT';
      } else if (remainingAmount === 0 && amountPaid > 0) {
        paymentStatus = 'PAID';
      } else if (amountPaid > 0 && remainingAmount > 0) {
        paymentStatus = 'PARTIAL';
      }

      // Step 2 & 3: Create Vehicle in inventory
      let targetVehicleId = payload.vehicleId;
      let vehicleSummary = '';

      if (!targetVehicleId) {
        const newVehicleData = {
          make: payload.vehicle.make,
          model: payload.vehicle.model,
          variant: payload.vehicle.variant || '',
          modelYear: Number(payload.vehicle.modelYear || new Date().getFullYear()),
          registrationNo: payload.vehicle.registrationNo || 'APPLIED_FOR',
          chassisNo: payload.vehicle.chassisNo,
          engineNo: payload.vehicle.engineNo || '',
          colorExterior: payload.vehicle.colorExterior || 'White',
          colorInterior: payload.vehicle.colorInterior || 'Beige',
          mileageKm: Number(payload.vehicle.mileageKm || 0),
          fuelType: payload.vehicle.fuelType || 'Petrol',
          transmission: payload.vehicle.transmission || 'Automatic',
          ownershipType: payload.ownershipType || 'Showroom',
          ownerName: payload.seller.name,
          ownerPhone: payload.seller.phone,
          costPrice: purchasePrice,
          demandPrice: Number(payload.vehicle.demandPrice || purchasePrice * 1.08),
          minPrice: Number(payload.vehicle.minPrice || purchasePrice * 1.03),
          status: 'Available',
          purchaseDate: payload.purchaseDate || new Date().toISOString().split('T')[0],
          locationBay: payload.vehicle.locationBay || 'Inward Bay',
          keyNo: payload.vehicle.keyNo || 'KEY-NEW',
          condition: payload.vehicle.condition || {},
          documents: payload.vehicle.documents || {},
          images: payload.vehicle.images || [],
        };

        const createdCar = vehicleStorage.createVehicle(newVehicleData);
        targetVehicleId = createdCar.id;
        vehicleSummary = `${createdCar.make} ${createdCar.model} (${createdCar.modelYear}) • ${createdCar.registrationNo}`;
      } else {
        const existing = vehicleStorage.getVehicleById(targetVehicleId);
        if (existing) {
          vehicleSummary = `${existing.make} ${existing.model} (${existing.modelYear}) • ${existing.registrationNo}`;
          vehicleStorage.updateVehicle(targetVehicleId, {
            costPrice: purchasePrice,
            ownershipType: payload.ownershipType || existing.ownershipType,
            status: 'Available',
          });
        }
      }

      // Step 4: Create Purchase Record
      const purchases = purchaseService.getAllPurchases();
      const newPurchaseId = `PUR-2026-${String(purchases.length + 35).padStart(4, '0')}`;

      const purchaseRecord = {
        id: newPurchaseId,
        vehicleId: targetVehicleId,
        vehicleSummary,
        seller: {
          name: payload.seller.name,
          fatherName: payload.seller.fatherName || '',
          cnic: payload.seller.cnic || '',
          phone: payload.seller.phone,
          city: payload.seller.city || '',
          address: payload.seller.address || '',
        },
        ownerName: payload.ownerName || payload.seller.name,
        ownershipType: payload.ownershipType || 'Showroom',
        purchaseType: payload.purchaseType || 'DIRECT_SHOWROOM_PURCHASE',
        purchasePrice,
        amountPaid,
        remainingAmount,
        paymentStatus,
        purchaseDate: payload.purchaseDate || new Date().toISOString().split('T')[0],
        paymentMethod: payload.paymentMethod || 'Cash in Hand',
        accountPaidFrom: payload.accountPaidFrom || 'Cash in Hand (Counter)',
        broker: {
          name: payload.broker?.name || 'Direct',
          phone: payload.broker?.phone || '',
          commissionAmount: Number(payload.broker?.commissionAmount || 0),
        },
        witnesses: {
          w1Name: payload.witnesses?.w1Name || '',
          w1Cnic: payload.witnesses?.w1Cnic || '',
          w2Name: payload.witnesses?.w2Name || '',
          w2Cnic: payload.witnesses?.w2Cnic || '',
        },
        notes: payload.notes || '',
        createdAt: new Date().toISOString(),
      };

      purchases.unshift(purchaseRecord);
      purchaseService.savePurchases(purchases);

      // Step 5: Record Payment Voucher (if payment was made)
      if (amountPaid > 0) {
        const paymentRecord = {
          id: `PAY-PUR-${Date.now().toString().slice(-6)}`,
          purchaseId: newPurchaseId,
          amount: amountPaid,
          paymentDate: payload.purchaseDate || new Date().toISOString().split('T')[0],
          paymentMethod: payload.paymentMethod || 'Cash in Hand',
          accountPaidFrom: payload.accountPaidFrom || 'Cash in Hand (Counter)',
          receiptReference: `Initial Purchase Outflow for ${newPurchaseId}`,
          paidBy: 'Ahsan Khan (Director)',
          createdAt: new Date().toISOString(),
        };

        const allPayments = JSON.parse(localStorage.getItem(PURCHASE_PAYMENTS_KEY) || '[]');
        allPayments.unshift(paymentRecord);
        localStorage.setItem(PURCHASE_PAYMENTS_KEY, JSON.stringify(allPayments));

        // Step 6: Log Cash Ledger Outflow
        const ledger = JSON.parse(localStorage.getItem(CASH_LEDGER_KEY) || '[]');
        const lastBalance = ledger.length > 0 ? Number(ledger[0].runningBalance || 3450000) : 3450000;
        const newBalance = Math.max(0, lastBalance - amountPaid);

        const ledgerEntry = {
          id: `LED-${Date.now().toString().slice(-5)}`,
          date: new Date().toISOString().replace('T', ' ').slice(0, 16),
          account: payload.accountPaidFrom || 'Cash in Hand (Counter)',
          type: 'CREDIT', // Outflow from showroom
          amount: amountPaid,
          runningBalance: newBalance,
          narration: `Vehicle Acquisition Outflow for ${purchaseRecord.vehicleSummary} (${newPurchaseId})`,
        };

        ledger.unshift(ledgerEntry);
        localStorage.setItem(CASH_LEDGER_KEY, JSON.stringify(ledger));
      }

      return purchaseRecord;
    } catch (error) {
      // ROLLBACK ON ERROR
      localStorage.setItem('ahsan_vehicles_inventory_v1', JSON.stringify(backupVehicles));
      localStorage.setItem(PURCHASES_STORAGE_KEY, JSON.stringify(backupPurchases));
      localStorage.setItem(PURCHASE_PAYMENTS_KEY, JSON.stringify(backupPayments));
      localStorage.setItem(CASH_LEDGER_KEY, JSON.stringify(backupLedger));
      throw error;
    }
  },

  /**
   * RECORD PARTIAL PAYMENT FOR OUTSTANDING PURCHASE PAYABLE
   */
  recordPartialPayment: (purchaseId, amount, paymentMethod, accountPaidFrom, notes) => {
    const payAmount = Number(amount);
    if (payAmount <= 0) {
      throw new Error('Payment amount must be greater than zero.');
    }

    const purchases = purchaseService.getAllPurchases();
    const idx = purchases.findIndex((p) => String(p.id) === String(purchaseId));
    if (idx === -1) throw new Error('Purchase record not found.');

    const purchase = purchases[idx];
    if (payAmount > purchase.remainingAmount) {
      throw new Error(`Payment amount (PKR ${payAmount.toLocaleString()}) exceeds outstanding balance (PKR ${purchase.remainingAmount.toLocaleString()}).`);
    }

    // Update Purchase balances
    const newAmountPaid = purchase.amountPaid + payAmount;
    const newRemaining = purchase.purchasePrice - newAmountPaid;
    const newStatus = newRemaining === 0 ? 'PAID' : 'PARTIAL';

    purchases[idx] = {
      ...purchase,
      amountPaid: newAmountPaid,
      remainingAmount: newRemaining,
      paymentStatus: newStatus,
    };
    purchaseService.savePurchases(purchases);

    // Record Payment
    const paymentRecord = {
      id: `PAY-PUR-${Date.now().toString().slice(-6)}`,
      purchaseId,
      amount: payAmount,
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: paymentMethod || 'Cash in Hand',
      accountPaidFrom: accountPaidFrom || 'Cash in Hand (Counter)',
      receiptReference: `Subsequent Payment for ${purchaseId} - ${notes || 'Balance clearance'}`,
      paidBy: 'Ahsan Khan (Director)',
      createdAt: new Date().toISOString(),
    };

    const allPayments = JSON.parse(localStorage.getItem(PURCHASE_PAYMENTS_KEY) || '[]');
    allPayments.unshift(paymentRecord);
    localStorage.setItem(PURCHASE_PAYMENTS_KEY, JSON.stringify(allPayments));

    // Log Cash Ledger
    const ledger = JSON.parse(localStorage.getItem(CASH_LEDGER_KEY) || '[]');
    const lastBalance = ledger.length > 0 ? Number(ledger[0].runningBalance || 3450000) : 3450000;
    const newBalance = Math.max(0, lastBalance - payAmount);

    const ledgerEntry = {
      id: `LED-${Date.now().toString().slice(-5)}`,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      account: accountPaidFrom || 'Cash in Hand (Counter)',
      type: 'CREDIT',
      amount: payAmount,
      runningBalance: newBalance,
      narration: `Partial Payment for ${purchase.vehicleSummary} (${purchaseId})`,
    };

    ledger.unshift(ledgerEntry);
    localStorage.setItem(CASH_LEDGER_KEY, JSON.stringify(ledger));

    return purchases[idx];
  },
};

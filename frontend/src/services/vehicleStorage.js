// Vehicle Storage & Domain Engine for Ahsan Autos Showroom

const VEHICLES_STORAGE_KEY = 'ahsan_vehicles_inventory_v1';
const VEHICLE_LOGS_KEY = 'ahsan_vehicle_status_logs_v1';

// Initial Seed Data with realistic Pakistani automotive market vehicles
const SEED_VEHICLES = [
  {
    id: 1,
    stockCode: 'STK-2026-001',
    make: 'Toyota',
    model: 'Fortuner',
    variant: 'Sigma 4 (2.8 Diesel 4x4)',
    modelYear: 2023,
    registrationNo: 'ICT-23-9001',
    chassisNo: 'NZE141-9081234',
    engineNo: '1GD-8876543',
    colorExterior: 'Attitude Black',
    colorInterior: 'Chamois / Black Leather',
    mileageKm: 28000,
    fuelType: 'Diesel',
    transmission: 'Automatic',
    purchaseDate: '2026-08-15',
    saleDate: null,
    ownershipType: 'Showroom', // Showroom | Client | Investor
    ownerName: 'Ahsan Autos (Owned)',
    ownerPhone: '+92 300 1234567',
    costPrice: 16800000,
    demandPrice: 18500000,
    minPrice: 18000000,
    status: 'Available', // Available | Reserved | Sold | Purchased | Pending Documentation | In Workshop | On Commission | Returned | Cancelled
    locationBay: 'Main Display Bay A-1',
    keyNo: 'KEY-042',
    
    // Condition & 6-Seals Report
    condition: {
      overallScore: '9.2 / 10 (Grade 4.5)',
      majorAccident: 'No',
      minorAccident: 'Bumper touchup only (rest 100% genuine paint)',
      sixSeals: {
        bonnet: 'Intact Genuine',
        trunk: 'Intact Genuine',
        leftPillars: 'Intact Genuine',
        rightPillars: 'Intact Genuine',
        leftDoors: 'Intact Genuine',
        rightDoors: 'Intact Genuine',
      },
      frontCondition: 'Excellent (OEM Headlights & Grille)',
      backCondition: 'Flawless (OEM Tail lamps)',
      engine: '10/10 (Smooth Sound, 0% Smoke, High Compression)',
      suspension: '100% Solid (No rattles or bush wear)',
      ac: 'Chilling 100% (Dual Climate Control)',
      tyres: '85% Tread Life (Dunlop Grandtrek AT20)',
      interior: 'Pristine (9.5/10, No tear or wear on leather)',
      exterior: 'Total Genuine Body (Only front bumper painted for scratches)',
      notes: 'First owner vehicle, maintained throughout from Toyota Rawal. Complete service book available with 2 smart keys.',
    },

    // Documents Vault
    documents: {
      registrationBook: 'Smart Card Available (Original)',
      receiptSalesDeed: 'Complete Original Transfer Deed',
      tokenTax: 'Lifetime / Up to Date (June 2026)',
      returnFile: 'Complete Original Excise File on Hand',
      biometricStatus: 'Available on Spot (First Owner)',
      physicalLockerSafe: 'Safe #1 - Locker B-04',
      otherDocs: 'Toyota Warranty Booklet, Auction/Import Sheet',
    },

    // Gallery Images (Angle-tagged)
    images: [
      {
        id: 'img-1-1',
        url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
        viewAngle: 'Front',
        isCover: true,
      },
      {
        id: 'img-1-2',
        url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
        viewAngle: 'Left',
        isCover: false,
      },
      {
        id: 'img-1-3',
        url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80',
        viewAngle: 'Interior',
        isCover: false,
      },
    ],
  },
  {
    id: 2,
    stockCode: 'STK-2026-002',
    make: 'Honda',
    model: 'Civic',
    variant: 'RS Turbo (1.5 VTEC Oriel)',
    modelYear: 2022,
    registrationNo: 'LEA-22-3412',
    chassisNo: 'FE1-1002341',
    engineNo: 'L15B7-550912',
    colorExterior: 'Taffeta White',
    colorInterior: 'Black Red Stitching',
    mileageKm: 38500,
    fuelType: 'Petrol',
    transmission: 'CVT',
    purchaseDate: '2026-09-02',
    saleDate: null,
    ownershipType: 'Client', // Client Consignment
    ownerName: 'Mian Tariq (Client Consignor)',
    ownerPhone: '+92 321 4455667',
    costPrice: 8200000,
    demandPrice: 8950000,
    minPrice: 8700000,
    status: 'Available',
    locationBay: 'Display Bay B-3',
    keyNo: 'KEY-019',
    
    condition: {
      overallScore: '9.0 / 10 (Grade 4.5)',
      majorAccident: 'No',
      minorAccident: 'Left rear fender minor spray (scratch removal)',
      sixSeals: {
        bonnet: 'Intact Genuine',
        trunk: 'Intact Genuine',
        leftPillars: 'Intact Genuine',
        rightPillars: 'Intact Genuine',
        leftDoors: 'Intact Genuine',
        rightDoors: 'Intact Genuine',
      },
      frontCondition: 'Original RS Bumper & LED lights',
      backCondition: 'Original with RS spoiler',
      engine: 'Turbo boost optimal, no oil leaks',
      suspension: 'Smooth and responsive',
      ac: 'Chilling 100%',
      tyres: '75% (Yokohama Advan dB)',
      interior: 'Clean Black RS interior with red stitching',
      exterior: '90% genuine paint (1 touchup piece)',
      notes: 'Consignment vehicle. Owner ready for instant biometric transfer upon deal closing.',
    },

    documents: {
      registrationBook: 'Smart Card on Hand',
      receiptSalesDeed: 'Consignment Agreement Signed',
      tokenTax: 'Paid up to June 2026',
      returnFile: 'Original File with Excise Verification',
      biometricStatus: 'Biometric verified & ready',
      physicalLockerSafe: 'Safe #1 - Locker C-11',
      otherDocs: '2 Remote keys + Sunroof warranty',
    },

    images: [
      {
        id: 'img-2-1',
        url: 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=800&q=80',
        viewAngle: 'Front',
        isCover: true,
      },
      {
        id: 'img-2-2',
        url: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=800&q=80',
        viewAngle: 'Back',
        isCover: false,
      },
    ],
  },
  {
    id: 3,
    stockCode: 'STK-2026-003',
    make: 'Hyundai',
    model: 'Tucson',
    variant: 'Ultimate (2.0 AWD Panoramic)',
    modelYear: 2023,
    registrationNo: 'APPLIED_FOR',
    chassisNo: 'NX4-5509182',
    engineNo: 'G4NL-901844',
    colorExterior: 'Silver Metallic',
    colorInterior: 'Grey Leather',
    mileageKm: 14200,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    purchaseDate: '2026-09-18',
    saleDate: null,
    ownershipType: 'Investor', // Investor Funded
    ownerName: 'Mian Bilal Aslam (Investor 60%)',
    ownerPhone: '+92 321 8899001',
    costPrice: 7700000,
    demandPrice: 8400000,
    minPrice: 8200000,
    status: 'Reserved', // Token advance received
    locationBay: 'Bay C-1 (Reserved Area)',
    keyNo: 'KEY-088',
    
    condition: {
      overallScore: '9.8 / 10 (Almost Brand New)',
      majorAccident: 'No',
      minorAccident: 'Zero touchups / Total Genuine Body',
      sixSeals: {
        bonnet: 'Intact Genuine',
        trunk: 'Intact Genuine',
        leftPillars: 'Intact Genuine',
        rightPillars: 'Intact Genuine',
        leftDoors: 'Intact Genuine',
        rightDoors: 'Intact Genuine',
      },
      frontCondition: 'Scratchless Genuine',
      backCondition: 'Scratchless Genuine',
      engine: '10/10 Under factory warranty',
      suspension: '100% Brand new condition',
      ac: 'Chilling 100%',
      tyres: '95% Factory Hankook Tyres',
      interior: 'Plastics intact, zero smell or stains',
      exterior: '100% Bumper-to-Bumper Genuine',
      notes: 'Investor funded unit. Token advance PKR 500,000 received. Balance collection pending.',
    },

    documents: {
      registrationBook: 'Applied for (Original Invoice & Sales Certificate)',
      receiptSalesDeed: 'Sales Certificate & Dealership Letter',
      tokenTax: 'New Registration Token Pending',
      returnFile: 'Complete Unregistered File',
      biometricStatus: 'Company Biometric Letter Ready',
      physicalLockerSafe: 'Safe #2 - Locker A-01',
      otherDocs: 'Warranty Manual, Tool Kit & Spare Tyre Unused',
    },

    images: [
      {
        id: 'img-3-1',
        url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
        viewAngle: 'Front',
        isCover: true,
      },
    ],
  },
  {
    id: 4,
    stockCode: 'STK-2026-004',
    make: 'Toyota',
    model: 'Land Cruiser Prado',
    variant: 'TX-L (2.7 Petrol Sunroof)',
    modelYear: 2021,
    registrationNo: 'ISB-21-7700',
    chassisNo: 'GRJ150-008129',
    engineNo: '2TR-FE-771890',
    colorExterior: 'Pearl White',
    colorInterior: 'Beige Leather / 7 Seater',
    mileageKm: 52000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    purchaseDate: '2026-08-20',
    saleDate: null,
    ownershipType: 'Showroom',
    ownerName: 'Ahsan Autos (Owned)',
    ownerPhone: '+92 300 1234567',
    costPrice: 24000000,
    demandPrice: 26500000,
    minPrice: 25800000,
    status: 'Available',
    locationBay: 'VIP Hall Front Lot',
    keyNo: 'KEY-001',
    
    condition: {
      overallScore: '9.4 / 10',
      majorAccident: 'No',
      minorAccident: 'No accident. 1 minor dry dent removed on right rear door.',
      sixSeals: {
        bonnet: 'Intact Genuine',
        trunk: 'Intact Genuine',
        leftPillars: 'Intact Genuine',
        rightPillars: 'Intact Genuine',
        leftDoors: 'Intact Genuine',
        rightDoors: 'Intact Genuine',
      },
      frontCondition: 'Original Modellista Body Kit',
      backCondition: 'Original with Rear Step & Camera',
      engine: 'Powerful 2TR Engine, Zero Leakages',
      suspension: 'KDSS / Air Suspension Working Smoothly',
      ac: 'Dual AC + Coolbox Chilling',
      tyres: '80% (Michelin Primacy SUV)',
      interior: 'Clean 7-seater electric leather seats',
      exterior: 'Total Genuine paint with Ceramic Coating',
      notes: 'Top tier VIP luxury SUV. 4.5 Auction grade imported with verified sheet.',
    },

    documents: {
      registrationBook: 'Islamabad Smart Card Available',
      receiptSalesDeed: 'Original Transfer Letter',
      tokenTax: 'Paid up to June 2026',
      returnFile: 'Complete Custom Import & Return File',
      biometricStatus: 'Biometric Available Anytime',
      physicalLockerSafe: 'Safe #1 - Locker A-01 (VIP)',
      otherDocs: 'Auction Sheet Copy + 3 Keys',
    },

    images: [
      {
        id: 'img-4-1',
        url: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=800&q=80',
        viewAngle: 'Front',
        isCover: true,
      },
    ],
  },
  {
    id: 5,
    stockCode: 'STK-2026-005',
    make: 'Toyota',
    model: 'Corolla',
    variant: 'Altis Grande 1.8 CVT',
    modelYear: 2022,
    registrationNo: 'LEA-22-1144',
    chassisNo: 'ZRE172-108291',
    engineNo: '2ZR-9081244',
    colorExterior: 'Super White',
    colorInterior: 'Beige / Black',
    mileageKm: 41000,
    fuelType: 'Petrol',
    transmission: 'CVT',
    purchaseDate: '2026-09-01',
    saleDate: '2026-10-07',
    ownershipType: 'Showroom',
    ownerName: 'Sold to Chaudhry Nadeem',
    ownerPhone: '+92 300 8472911',
    costPrice: 6500000,
    demandPrice: 7150000,
    minPrice: 6950000,
    status: 'Sold', // Sold vehicle (Must not count in available stock)
    locationBay: 'Sold Area Lot',
    keyNo: 'KEY-033',
    
    condition: {
      overallScore: '8.9 / 10',
      majorAccident: 'No',
      minorAccident: 'Left front fender repainted',
      sixSeals: {
        bonnet: 'Intact Genuine',
        trunk: 'Intact Genuine',
        leftPillars: 'Intact Genuine',
        rightPillars: 'Intact Genuine',
        leftDoors: 'Intact Genuine',
        rightDoors: 'Intact Genuine',
      },
      frontCondition: 'Original Grande Sunroof Package',
      backCondition: 'Original',
      engine: '10/10 Maintenance record complete',
      suspension: 'Solid',
      ac: 'Chilling 100%',
      tyres: '70% (Dunlop)',
      interior: 'Clean leather seats',
      exterior: 'Genuine body except 1 touchup piece',
      notes: 'Sold on 07-Oct-2026 for PKR 7.10 Million.',
    },

    documents: {
      registrationBook: 'Smart Card Handed Over',
      receiptSalesDeed: 'Sale Invoice SAL-2026-0089 Executed',
      tokenTax: 'Paid up to June 2026',
      returnFile: 'Original File with Excise Verified',
      biometricStatus: 'Biometric Transferred to Buyer',
      physicalLockerSafe: 'Safe #1 - Closed File',
      otherDocs: 'Sale deed and gate pass copy',
    },

    images: [
      {
        id: 'img-5-1',
        url: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=800&q=80',
        viewAngle: 'Front',
        isCover: true,
      },
    ],
  },
];

export const vehicleStorage = {
  // Get all vehicles
  getAllVehicles: () => {
    try {
      const stored = localStorage.getItem(VEHICLES_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      // Initialize seed data if empty
      localStorage.setItem(VEHICLES_STORAGE_KEY, JSON.stringify(SEED_VEHICLES));
      return SEED_VEHICLES;
    } catch (err) {
      console.error('Failed to read vehicles from storage:', err);
      return SEED_VEHICLES;
    }
  },

  // Save vehicles array
  saveVehicles: (vehicles) => {
    localStorage.setItem(VEHICLES_STORAGE_KEY, JSON.stringify(vehicles));
  },

  // Dynamic Stock Calculation Engine
  // Note: Stock is dynamically derived from statuses, never manually stored as a static integer
  getStockMetrics: () => {
    const all = vehicleStorage.getAllVehicles();
    
    const available = all.filter((v) => v.status === 'Available');
    const reserved = all.filter((v) => v.status === 'Reserved');
    const sold = all.filter((v) => v.status === 'Sold');
    const inWorkshop = all.filter((v) => v.status === 'In Workshop');
    const pendingDocs = all.filter((v) => v.status === 'Pending Documentation');

    // Total floor active inventory = Available + Reserved
    const activeFloorStock = all.filter((v) => ['Available', 'Reserved'].includes(v.status));
    const totalValuation = activeFloorStock.reduce((acc, curr) => acc + Number(curr.demandPrice || 0), 0);
    const totalCostValuation = activeFloorStock.reduce((acc, curr) => acc + Number(curr.costPrice || 0), 0);

    // Ownership breakdown
    const showroomOwnedCount = activeFloorStock.filter((v) => v.ownershipType === 'Showroom').length;
    const clientConsignmentCount = activeFloorStock.filter((v) => v.ownershipType === 'Client').length;
    const investorFundedCount = activeFloorStock.filter((v) => v.ownershipType === 'Investor').length;

    return {
      totalVehicles: all.length,
      availableCount: available.length,
      reservedCount: reserved.length,
      soldCount: sold.length,
      inWorkshopCount: inWorkshop.length,
      pendingDocsCount: pendingDocs.length,
      activeFloorCount: activeFloorStock.length,
      totalValuation,
      totalCostValuation,
      ownershipBreakdown: {
        showroom: showroomOwnedCount,
        client: clientConsignmentCount,
        investor: investorFundedCount,
      },
    };
  },

  // Find vehicle by ID
  getVehicleById: (id) => {
    const all = vehicleStorage.getAllVehicles();
    return all.find((v) => String(v.id) === String(id)) || null;
  },

  // Create new vehicle with backend duplicate validation
  createVehicle: (data) => {
    const all = vehicleStorage.getAllVehicles();

    // 1. Validate Chassis / VIN uniqueness
    const trimmedChassis = data.chassisNo?.trim().toUpperCase();
    if (trimmedChassis) {
      const duplicateChassis = all.find(
        (v) => v.chassisNo?.trim().toUpperCase() === trimmedChassis
      );
      if (duplicateChassis) {
        throw new Error(`Duplicate Chassis / VIN: Vehicle "${duplicateChassis.make} ${duplicateChassis.model}" already registered with Chassis No ${trimmedChassis} (${duplicateChassis.stockCode}).`);
      }
    }

    // 2. Validate Registration Number uniqueness (unless APPLIED_FOR)
    const trimmedReg = data.registrationNo?.trim().toUpperCase();
    if (trimmedReg && !trimmedReg.includes('APPLIED') && trimmedReg !== 'UNREGISTERED') {
      const duplicateReg = all.find(
        (v) => v.registrationNo?.trim().toUpperCase() === trimmedReg
      );
      if (duplicateReg) {
        throw new Error(`Duplicate Registration Number: Vehicle "${duplicateReg.make} ${duplicateReg.model}" already registered with Reg Plate ${trimmedReg} (${duplicateReg.stockCode}).`);
      }
    }

    const newId = Date.now();
    const stockCode = `STK-2026-${String(all.length + 1).padStart(3, '0')}`;

    const newVehicle = {
      id: newId,
      stockCode,
      ...data,
      chassisNo: trimmedChassis,
      registrationNo: trimmedReg || 'APPLIED_FOR',
      costPrice: Number(data.costPrice || 0),
      demandPrice: Number(data.demandPrice || 0),
      minPrice: Number(data.minPrice || 0),
      mileageKm: Number(data.mileageKm || 0),
      modelYear: Number(data.modelYear || new Date().getFullYear()),
      status: data.status || 'Available',
      images: data.images || [],
      condition: data.condition || {},
      documents: data.documents || {},
    };

    all.unshift(newVehicle);
    vehicleStorage.saveVehicles(all);
    vehicleStorage.logStatusChange(newId, null, newVehicle.status, 'Initial Vehicle Entry');

    return newVehicle;
  },

  // Update existing vehicle
  updateVehicle: (id, data) => {
    const all = vehicleStorage.getAllVehicles();
    const idx = all.findIndex((v) => String(v.id) === String(id));
    if (idx === -1) throw new Error('Vehicle record not found.');

    const current = all[idx];

    // Check duplicate chassis against other vehicles
    const trimmedChassis = data.chassisNo?.trim().toUpperCase();
    if (trimmedChassis && trimmedChassis !== current.chassisNo?.toUpperCase()) {
      const duplicateChassis = all.find(
        (v) => String(v.id) !== String(id) && v.chassisNo?.trim().toUpperCase() === trimmedChassis
      );
      if (duplicateChassis) {
        throw new Error(`Duplicate Chassis / VIN: Another vehicle already exists with Chassis No ${trimmedChassis}.`);
      }
    }

    // Check duplicate reg plate
    const trimmedReg = data.registrationNo?.trim().toUpperCase();
    if (trimmedReg && !trimmedReg.includes('APPLIED') && trimmedReg !== current.registrationNo?.toUpperCase()) {
      const duplicateReg = all.find(
        (v) => String(v.id) !== String(id) && v.registrationNo?.trim().toUpperCase() === trimmedReg
      );
      if (duplicateReg) {
        throw new Error(`Duplicate Registration Number: Another vehicle already exists with Reg Plate ${trimmedReg}.`);
      }
    }

    // Check if status changed
    if (data.status && data.status !== current.status) {
      vehicleStorage.logStatusChange(id, current.status, data.status, data.statusChangeReason || 'Status Updated');
    }

    const updated = {
      ...current,
      ...data,
      chassisNo: trimmedChassis || current.chassisNo,
      registrationNo: trimmedReg || current.registrationNo,
      costPrice: Number(data.costPrice !== undefined ? data.costPrice : current.costPrice),
      demandPrice: Number(data.demandPrice !== undefined ? data.demandPrice : current.demandPrice),
      minPrice: Number(data.minPrice !== undefined ? data.minPrice : current.minPrice),
      mileageKm: Number(data.mileageKm !== undefined ? data.mileageKm : current.mileageKm),
      modelYear: Number(data.modelYear !== undefined ? data.modelYear : current.modelYear),
      condition: { ...current.condition, ...(data.condition || {}) },
      documents: { ...current.documents, ...(data.documents || {}) },
      images: data.images !== undefined ? data.images : current.images,
    };

    all[idx] = updated;
    vehicleStorage.saveVehicles(all);
    return updated;
  },

  // Delete vehicle
  deleteVehicle: (id) => {
    const all = vehicleStorage.getAllVehicles();
    const filtered = all.filter((v) => String(v.id) !== String(id));
    vehicleStorage.saveVehicles(filtered);
    return true;
  },

  // Change status directly
  changeStatus: (id, newStatus, reason = '') => {
    return vehicleStorage.updateVehicle(id, { status: newStatus, statusChangeReason: reason });
  },

  // Status Logs
  logStatusChange: (vehicleId, fromStatus, toStatus, reason) => {
    try {
      const logs = JSON.parse(localStorage.getItem(VEHICLE_LOGS_KEY) || '[]');
      const newLog = {
        id: Date.now() + Math.random().toString(36).substr(2, 4),
        vehicleId,
        fromStatus,
        toStatus,
        reason,
        changedBy: 'Ahsan Khan (Director)',
        timestamp: new Date().toISOString(),
      };
      logs.unshift(newLog);
      localStorage.setItem(VEHICLE_LOGS_KEY, JSON.stringify(logs));
    } catch (err) {
      console.error('Failed to log status transition:', err);
    }
  },

  getStatusLogs: (vehicleId) => {
    try {
      const logs = JSON.parse(localStorage.getItem(VEHICLE_LOGS_KEY) || '[]');
      if (!vehicleId) return logs;
      return logs.filter((l) => String(l.vehicleId) === String(vehicleId));
    } catch (err) {
      return [];
    }
  },
};

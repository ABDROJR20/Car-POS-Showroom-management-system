// Car Demand Domain Engine & Inventory Matchmaker Service for Ahsan Autos

import { vehicleStorage } from './vehicleStorage.js';

const DEMANDS_STORAGE_KEY = 'ahsan_car_demands_v1';

// Seed realistic Pakistani showroom car buyer demands
const SEED_DEMANDS = [
  {
    id: 'DMD-2026-001',
    customer: 'Haji Bilal Aslam',
    phone: '+92 300 1122334',
    city: 'Islamabad',
    make: 'Toyota',
    model: 'Fortuner',
    variant: 'Sigma 4 (2.8 Diesel)',
    minYear: 2022,
    maxYear: 2024,
    budget: 18500000,
    color: 'Attitude Black',
    transmission: 'Automatic',
    fuelType: 'Diesel',
    maxMileageKm: 35000,
    notes: 'Looking for total genuine bumper to bumper car with smart card on hand. Urgent buyer.',
    status: 'Matched', // Active | Matched | Purchased | Closed
    matchedVehicleId: 1,
    matchedVehicleSummary: 'Toyota Fortuner Sigma 4 (2023) • ICT-23-9001',
    date: '2026-10-06',
    createdAt: '2026-10-06T11:00:00.000Z',
  },
  {
    id: 'DMD-2026-002',
    customer: 'Usman Ghani (Advocate)',
    phone: '+92 321 5566778',
    city: 'Lahore',
    make: 'Honda',
    model: 'Civic',
    variant: 'RS Turbo',
    minYear: 2022,
    maxYear: 2023,
    budget: 8500000,
    color: 'White or Meteoroid Grey',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    maxMileageKm: 30000,
    notes: 'Sunroof essential, low mileage only. Ready cash payment.',
    status: 'Matched',
    matchedVehicleId: 2,
    matchedVehicleSummary: 'Honda Civic RS Turbo (2022) • LEA-22-3412',
    date: '2026-10-05',
    createdAt: '2026-10-05T14:30:00.000Z',
  },
  {
    id: 'DMD-2026-003',
    customer: 'Dr. Faheem Shah',
    phone: '+92 333 4488990',
    city: 'Rawalpindi',
    make: 'Toyota',
    model: 'Land Cruiser Prado',
    variant: 'TX-L 2.7 / 2.8',
    minYear: 2020,
    maxYear: 2023,
    budget: 25000000,
    color: 'Pearl White',
    transmission: 'Automatic',
    fuelType: 'Petrol / Diesel',
    maxMileageKm: 50000,
    notes: 'Sunroof, 7 seater beige interior required. Verified auction sheet preferred.',
    status: 'Active',
    matchedVehicleId: null,
    matchedVehicleSummary: '',
    date: '2026-10-07',
    createdAt: '2026-10-07T16:00:00.000Z',
  },
  {
    id: 'DMD-2026-004',
    customer: 'Chaudhry Kamran',
    phone: '+92 345 9988112',
    city: 'Gujranwala',
    make: 'Suzuki',
    model: 'Cultus',
    variant: 'VXL / Auto Gear Shift',
    minYear: 2021,
    maxYear: 2024,
    budget: 3800000,
    color: 'Silver / White',
    transmission: 'Automatic / AGS',
    fuelType: 'Petrol',
    maxMileageKm: 40000,
    notes: 'First owner family used vehicle needed. Within this week.',
    status: 'Purchased',
    matchedVehicleId: 3,
    matchedVehicleSummary: 'Suzuki Cultus VXL (2023) • Sold',
    date: '2026-10-02',
    createdAt: '2026-10-02T10:15:00.000Z',
  },
];

export const demandService = {
  // Read all customer demands
  getAllDemands: () => {
    try {
      const stored = localStorage.getItem(DEMANDS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
      localStorage.setItem(DEMANDS_STORAGE_KEY, JSON.stringify(SEED_DEMANDS));
      return SEED_DEMANDS;
    } catch (err) {
      console.error('Failed to read demands:', err);
      return SEED_DEMANDS;
    }
  },

  // Save demands
  saveDemands: (demands) => {
    localStorage.setItem(DEMANDS_STORAGE_KEY, JSON.stringify(demands));
  },

  // Get single demand by ID
  getDemandById: (id) => {
    const all = demandService.getAllDemands();
    return all.find((d) => String(d.id) === String(id)) || null;
  },

  // Create new customer demand
  createDemand: (payload) => {
    const customerName = (payload.customer || payload.customerName || '').trim();
    if (!customerName) {
      throw new Error('Customer full name is required.');
    }
    if (!payload.phone || !payload.phone.trim()) {
      throw new Error('Customer phone number is required.');
    }
    if (!payload.make || !payload.model) {
      throw new Error('Required Make and Model are mandatory.');
    }

    const demands = demandService.getAllDemands();
    const newId = `DMD-2026-${String(demands.length + 10).padStart(3, '0')}`;

    const newDemand = {
      id: newId,
      customer: customerName,
      phone: payload.phone.trim(),
      city: payload.city || 'Islamabad',
      make: payload.make,
      model: payload.model,
      variant: payload.variant || '',
      minYear: Number(payload.minYear || 2020),
      maxYear: Number(payload.maxYear || new Date().getFullYear()),
      budget: Number(payload.budget || 0),
      color: payload.color || 'Any',
      transmission: payload.transmission || 'Automatic',
      fuelType: payload.fuelType || 'Petrol',
      maxMileageKm: Number(payload.maxMileageKm || 60000),
      notes: payload.notes || '',
      status: payload.status || 'Active', // Active | Matched | Purchased | Closed
      matchedVehicleId: payload.matchedVehicleId || null,
      matchedVehicleSummary: payload.matchedVehicleSummary || '',
      date: payload.date || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
    };

    // Run Auto-Matcher immediately to check if any stock matches
    const matches = demandService.findMatchesForDemand(newDemand);
    if (matches.length > 0 && newDemand.status === 'Active') {
      newDemand.status = 'Matched';
      newDemand.matchedVehicleId = matches[0].vehicle.id;
      newDemand.matchedVehicleSummary = `${matches[0].vehicle.make} ${matches[0].vehicle.model} (${matches[0].vehicle.modelYear}) • ${matches[0].vehicle.registrationNo}`;
    }

    demands.unshift(newDemand);
    demandService.saveDemands(demands);
    return newDemand;
  },

  // Update existing demand
  updateDemand: (id, data) => {
    const demands = demandService.getAllDemands();
    const idx = demands.findIndex((d) => String(d.id) === String(id));
    if (idx === -1) throw new Error('Demand record not found.');

    const updated = {
      ...demands[idx],
      ...data,
      minYear: Number(data.minYear !== undefined ? data.minYear : demands[idx].minYear),
      maxYear: Number(data.maxYear !== undefined ? data.maxYear : demands[idx].maxYear),
      budget: Number(data.budget !== undefined ? data.budget : demands[idx].budget),
      maxMileageKm: Number(data.maxMileageKm !== undefined ? data.maxMileageKm : demands[idx].maxMileageKm),
    };

    demands[idx] = updated;
    demandService.saveDemands(demands);
    return updated;
  },

  // Delete demand
  deleteDemand: (id) => {
    const demands = demandService.getAllDemands();
    const filtered = demands.filter((d) => String(d.id) !== String(id));
    demandService.saveDemands(filtered);
    return true;
  },

  // Update status (Active, Matched, Purchased, Closed)
  updateStatus: (id, newStatus, matchedVehicleId = null, matchedVehicleSummary = '') => {
    return demandService.updateDemand(id, {
      status: newStatus,
      matchedVehicleId,
      matchedVehicleSummary,
    });
  },

  // Get matches for demand by ID or object
  getMatchesForDemand: (demandOrId) => {
    const demand = typeof demandOrId === 'object' && demandOrId !== null
      ? demandOrId
      : demandService.getDemandById(demandOrId);
    if (!demand) return [];
    return demandService.findMatchesForDemand(demand);
  },

  /**
   * AUTOMATED INVENTORY MATCHMAKER ENGINE
   * Scans showroom inventory against demand requirements
   * Calculates Match Confidence Score (0% - 100%)
   */
  findMatchesForDemand: (demand) => {
    const allVehicles = vehicleStorage.getAllVehicles();
    // Only Available or Reserved vehicles
    const floorVehicles = allVehicles.filter((v) => ['Available', 'Reserved'].includes(v.status));

    const results = [];

    floorVehicles.forEach((v) => {
      let score = 0;
      const reasons = [];

      // 1. Make match (+30 pts)
      if (v.make.toLowerCase() === demand.make.toLowerCase()) {
        score += 30;
        reasons.push('Make Matched');
      }

      // 2. Model match (+30 pts)
      if (v.model.toLowerCase().includes(demand.model.toLowerCase()) || demand.model.toLowerCase().includes(v.model.toLowerCase())) {
        score += 30;
        reasons.push('Model Matched');
      }

      // 3. Year range (+15 pts)
      const vYear = Number(v.modelYear);
      if (vYear >= Number(demand.minYear) && vYear <= Number(demand.maxYear)) {
        score += 15;
        reasons.push(`Year in range (${vYear})`);
      } else if (Math.abs(vYear - Number(demand.minYear)) <= 1 || Math.abs(vYear - Number(demand.maxYear)) <= 1) {
        score += 8;
        reasons.push(`Near year range (${vYear})`);
      }

      // 4. Budget match (+15 pts)
      const carPrice = Number(v.demandPrice || v.costPrice || 0);
      const demandBudget = Number(demand.budget || 0);
      if (demandBudget > 0) {
        if (carPrice <= demandBudget) {
          score += 15;
          reasons.push(`Within budget (₨ ${carPrice.toLocaleString()})`);
        } else if (carPrice <= demandBudget * 1.10) {
          score += 10;
          reasons.push('Negotiable price (+10% budget)');
        }
      } else {
        score += 10;
      }

      // 5. Fuel / Transmission match (+10 pts)
      if (demand.transmission === 'Any' || v.transmission?.toLowerCase() === demand.transmission?.toLowerCase()) {
        score += 5;
        reasons.push('Transmission Matched');
      }
      if (demand.fuelType === 'Any' || v.fuelType?.toLowerCase() === demand.fuelType?.toLowerCase()) {
        score += 5;
        reasons.push('Fuel Type Matched');
      }

      // Only include matches above 45% score
      if (score >= 45) {
        results.push({
          vehicle: v,
          score,
          reasons,
        });
      }
    });

    return results.sort((a, b) => b.score - a.score);
  },
};

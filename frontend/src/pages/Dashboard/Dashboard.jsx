import React, { useState } from 'react';
import {
  StatCard,
  DataTable,
  VehicleCard,
  SearchBar,
  FilterBar,
} from '../../components/ui';
import {
  Car,
  DollarSign,
  TrendingUp,
  ShoppingCart,
  Wallet,
  Clock,
  Sparkles,
  Plus,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MOCK_FEATURED_VEHICLES = [
  {
    id: 1,
    stockCode: 'STK-2026-001',
    make: 'Toyota',
    model: 'Fortuner Sigma 4',
    variant: '2.8 Diesel 4x4',
    year: 2023,
    registrationNo: 'ICT-23-9001',
    color: 'Attitude Black',
    mileageKm: 28000,
    transmission: 'Automatic',
    fuelType: 'Diesel',
    engineCc: 2800,
    demandPrice: 18500000,
    status: 'AVAILABLE',
    ownershipType: 'SHOWROOM_OWNED',
    primaryImage: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 2,
    stockCode: 'STK-2026-002',
    make: 'Honda',
    model: 'Civic RS Turbo',
    variant: '1.5 VTEC Turbo Oriel',
    year: 2022,
    registrationNo: 'LEA-22-3412',
    color: 'Taffeta White',
    mileageKm: 38500,
    transmission: 'CVT',
    fuelType: 'Petrol',
    engineCc: 1500,
    demandPrice: 8950000,
    status: 'AVAILABLE',
    ownershipType: 'CLIENT_CONSIGNMENT',
    primaryImage: 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 3,
    stockCode: 'STK-2026-003',
    make: 'Hyundai',
    model: 'Tucson AWD',
    variant: 'Ultimate 2.0 A/T',
    year: 2023,
    registrationNo: 'APPLIED_FOR',
    color: 'Silver Metallic',
    mileageKm: 14200,
    transmission: 'Automatic',
    fuelType: 'Petrol',
    engineCc: 2000,
    demandPrice: 8400000,
    status: 'BOOKED',
    ownershipType: 'INVESTOR_FUNDED',
    primaryImage: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80',
  },
];

const RECENT_SALES = [
  {
    id: 'SAL-2026-089',
    car: 'Toyota Corolla Altis Grande 2022',
    buyer: 'Chaudhry Nadeem (Lahore)',
    salePrice: 7100000,
    advance: 2000000,
    balance: 5100000,
    date: '2026-10-07',
    status: 'PARTIAL',
  },
  {
    id: 'SAL-2026-088',
    car: 'Kia Sportage FWD 2021',
    buyer: 'Dr. Tariq Mehmood (Rawalpindi)',
    salePrice: 6500000,
    advance: 6500000,
    balance: 0,
    date: '2026-10-06',
    status: 'FULL_PAID',
  },
  {
    id: 'SAL-2026-087',
    car: 'Suzuki Cultus VXL 2023',
    buyer: 'Malik Zeeshan (Gujranwala)',
    salePrice: 3800000,
    advance: 3800000,
    balance: 0,
    date: '2026-10-05',
    status: 'FULL_PAID',
  },
];

export const Dashboard = () => {
  const navigate = useNavigate();

  const saleColumns = [
    {
      key: 'id',
      header: 'Invoice #',
      render: (val) => <span style={{ fontWeight: 700, color: 'var(--brand-gold)' }}>{val}</span>,
    },
    { key: 'car', header: 'Vehicle Asset' },
    { key: 'buyer', header: 'Customer / Buyer' },
    {
      key: 'salePrice',
      header: 'Sale Amount',
      align: 'right',
      render: (val) => <span style={{ fontWeight: 700 }}>₨ {Number(val).toLocaleString()}</span>,
    },
    {
      key: 'balance',
      header: 'Pending Balance',
      align: 'right',
      render: (val) => (
        <span style={{ color: Number(val) > 0 ? 'var(--brand-rose)' : 'var(--brand-emerald)', fontWeight: 600 }}>
          {Number(val) > 0 ? `₨ ${Number(val).toLocaleString()}` : 'Cleared'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Payment Status',
      render: (val) =>
        val === 'FULL_PAID' ? (
          <span className="badge badge-available">Paid</span>
        ) : (
          <span className="badge badge-booked">Advance Token</span>
        ),
    },
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-info">
          <h1>Ahsan Autos Executive Dashboard</h1>
          <p>Live inventory valuation, cash drawer positions & automotive sales tracking</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-secondary" onClick={() => navigate('/vehicles')}>
            <Car size={16} /> View All Stock (18)
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/sales')}>
            <Plus size={16} /> New Sale Deal
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="stat-grid">
        <StatCard
          title="Active Stock Valuation"
          value="₨ 148.5M"
          subtitle="18 Cars in Showroom"
          icon={Car}
          trend="+3 New This Week"
          isPositive={true}
          accentColor="#F59E0B"
        />
        <StatCard
          title="Cash in Hand (Counter)"
          value="₨ 3,450,000"
          subtitle="Reconciled Today"
          icon={Wallet}
          trend="Reconciled"
          isPositive={true}
          accentColor="#10B981"
        />
        <StatCard
          title="Monthly Sales Volume"
          value="₨ 42.8M"
          subtitle="6 Vehicles Sold (Oct)"
          icon={ShoppingCart}
          trend="+18% vs Sep"
          isPositive={true}
          accentColor="#3B82F6"
        />
        <StatCard
          title="Receivables / Pending"
          value="₨ 7,850,000"
          subtitle="3 Buyer Balances Due"
          icon={DollarSign}
          trend="3 Overdue"
          isPositive={false}
          accentColor="#EF4444"
        />
      </div>

      {/* Live Available Vehicles Showcase */}
      <div style={{ marginBottom: '36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Hot Inventory on Floor
            </h2>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              Immediate delivery ready vehicles with verified documents
            </p>
          </div>
          <button className="btn btn-ghost" onClick={() => navigate('/vehicles')}>
            See All Vehicles &rarr;
          </button>
        </div>

        <div className="cards-grid">
          {MOCK_FEATURED_VEHICLES.map((v) => (
            <VehicleCard
              key={v.id}
              vehicle={v}
              onView={() => navigate('/vehicles')}
              onSell={() => navigate('/sales')}
              onShareWhatsApp={() => alert(`Sharing specs of ${v.make} ${v.model} via WhatsApp!`)}
            />
          ))}
        </div>
      </div>

      {/* Recent Sales Journal */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Recent Sale Deals & Bookings
            </h2>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              Latest transactions executed through the POS terminal
            </p>
          </div>
          <button className="btn btn-secondary" onClick={() => navigate('/sales')}>
            View Sales Register
          </button>
        </div>

        <DataTable
          columns={saleColumns}
          data={RECENT_SALES}
          emptyMessage="No sales recorded yet."
        />
      </div>
    </div>
  );
};

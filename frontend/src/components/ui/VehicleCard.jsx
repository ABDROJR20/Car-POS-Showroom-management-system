import React from 'react';
import { Gauge, Fuel, Cog, Calendar, Tag, ShieldCheck, Eye, ShoppingCart, Share2, Sparkles } from 'lucide-react';

export const VehicleCard = ({
  vehicle,
  onView,
  onSell,
  onShareWhatsApp,
}) => {
  const {
    stockCode = 'STK-001',
    make = 'Toyota',
    model = 'Corolla Altis',
    variant = '1.8 Grande CVT',
    year = 2023,
    registrationNo = 'LEA-23-4589',
    color = 'White',
    mileageKm = 34500,
    transmission = 'Automatic',
    fuelType = 'Petrol',
    engineCc = 1800,
    demandPrice = 7250000,
    status = 'Available',
    ownershipType = 'Showroom',
    primaryImage = 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=600&q=80',
    condition = {},
  } = vehicle || {};

  const getStatusBadge = () => {
    switch (status) {
      case 'Available':
        return <span className="badge badge-available">Available</span>;
      case 'Reserved':
        return <span className="badge badge-booked">Reserved</span>;
      case 'Sold':
        return <span className="badge badge-sold">Sold</span>;
      default:
        return <span className="badge badge-inspection">{status}</span>;
    }
  };

  const getOwnershipBadge = () => {
    switch (ownershipType) {
      case 'Showroom':
        return <span className="badge badge-ownership-showroom">Showroom Owned</span>;
      case 'Client':
        return <span className="badge badge-ownership-client">Client Consignment</span>;
      case 'Investor':
        return <span className="badge badge-ownership-investor">Investor Funded</span>;
      default:
        return null;
    }
  };

  const formatPrice = (val) => {
    const num = Number(val);
    if (!num) return 'PKR 0';
    return `₨ ${num.toLocaleString('en-US')}`;
  };

  return (
    <div
      className="surface-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 4px 16px -2px rgba(15, 23, 42, 0.06)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = '0 12px 28px -4px rgba(15, 23, 42, 0.12)';
        e.currentTarget.style.borderColor = '#CBD5E1';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 16px -2px rgba(15, 23, 42, 0.06)';
        e.currentTarget.style.borderColor = '#E2E8F0';
      }}
    >
      {/* Card Image Banner */}
      <div style={{ position: 'relative', width: '100%', height: '190px', background: '#0F172A', overflow: 'hidden' }}>
        <img
          src={primaryImage}
          alt={`${make} ${model}`}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />

        {/* Top Floating Badges */}
        <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {getStatusBadge()}
          {getOwnershipBadge()}
        </div>

        {/* Floating Stock Code & Reg Plate */}
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            right: '12px',
            background: 'rgba(15, 23, 42, 0.9)',
            backdropFilter: 'blur(4px)',
            padding: '4px 10px',
            borderRadius: '6px',
            fontSize: '0.75rem',
            fontFamily: 'monospace',
            fontWeight: 800,
            color: '#FFFFFF',
            border: '1px solid rgba(255,255,255,0.2)',
          }}
        >
          {registrationNo || 'APPLIED FOR'}
        </div>

        {/* Certified 6-Seals badge if present */}
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            background: 'rgba(5, 150, 105, 0.9)',
            backdropFilter: 'blur(4px)',
            padding: '3px 8px',
            borderRadius: '6px',
            fontSize: '0.6875rem',
            fontWeight: 800,
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <ShieldCheck size={12} /> {condition.overallScore || '6-Seals Genuine'}
        </div>
      </div>

      {/* Vehicle Info Content */}
      <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--brand-gold)', letterSpacing: '0.04em' }}>
              {stockCode} • {year}
            </span>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B' }}>
              {color}
            </span>
          </div>

          <h3 style={{ fontSize: '1.1875rem', fontWeight: 800, color: '#0F172A', marginBottom: '2px', letterSpacing: '-0.02em' }}>
            {make} {model}
          </h3>
          <p style={{ fontSize: '0.8125rem', color: '#475569', marginBottom: '14px', fontWeight: 500 }}>
            {variant}
          </p>

          {/* Key Specs Pills Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '8px',
              padding: '12px 14px',
              backgroundColor: '#F8FAFC',
              borderRadius: '10px',
              border: '1px solid #E2E8F0',
              marginBottom: '16px',
              fontSize: '0.75rem',
              color: '#334155',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Gauge size={14} color="#D97706" />
              <span style={{ fontWeight: 700 }}>{Number(mileageKm).toLocaleString()} KM</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Cog size={14} color="#2563EB" />
              <span style={{ fontWeight: 700 }}>{transmission}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Fuel size={14} color="#059669" />
              <span style={{ fontWeight: 700 }}>{fuelType}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Tag size={14} color="#7C3AED" />
              <span style={{ fontWeight: 700 }}>{engineCc ? `${engineCc} CC` : 'Verified'}</span>
            </div>
          </div>
        </div>

        {/* Pricing & Footer Actions */}
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '16px', borderTop: '1px solid #F1F5F9', paddingTop: '12px' }}>
            <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Asking Demand</span>
            <span style={{ fontSize: '1.35rem', fontWeight: 900, color: '#D97706', fontFamily: 'var(--font-heading)' }}>
              {formatPrice(demandPrice)}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: status === 'Available' ? '1fr 2fr 44px' : '1fr 44px', gap: '8px' }}>
            <button
              className="btn btn-secondary"
              style={{ padding: '9px', fontSize: '0.8125rem' }}
              onClick={() => onView && onView(vehicle)}
              title="View 360 Dossier"
            >
              <Eye size={15} /> Details
            </button>

            {status === 'Available' && (
              <button
                className="btn btn-primary"
                style={{ padding: '9px', fontSize: '0.8125rem' }}
                onClick={() => onSell && onSell(vehicle)}
              >
                <ShoppingCart size={15} /> POS Sell
              </button>
            )}

            <button
              className="btn btn-emerald"
              style={{ padding: '9px', borderRadius: '10px' }}
              onClick={() => onShareWhatsApp && onShareWhatsApp(vehicle)}
              title="Share on WhatsApp"
            >
              <Share2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

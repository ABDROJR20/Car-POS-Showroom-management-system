import React from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle, XCircle, Gauge, Activity, Snowflake, Disc, FileText } from 'lucide-react';

export const VehicleInspectionReport = ({ condition }) => {
  const {
    overallScore = '9.0 / 10',
    majorAccident = 'No',
    minorAccident = 'None',
    sixSeals = {},
    frontCondition = 'Good',
    backCondition = 'Good',
    engine = '10/10 Excellent',
    suspension = 'Solid',
    ac = 'Chilling',
    tyres = '80%',
    interior = 'Clean',
    exterior = 'Genuine Paint',
    notes = '',
  } = condition || {};

  const getSealBadge = (sealValue) => {
    const isIntact = sealValue?.toLowerCase().includes('intact') || sealValue?.toLowerCase().includes('genuine');
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          padding: '4px 8px',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.75rem',
          fontWeight: 600,
          background: isIntact ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
          color: isIntact ? '#34D399' : '#F87171',
          border: `1px solid ${isIntact ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)'}`,
        }}
      >
        {isIntact ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
        {sealValue || 'Inspected'}
      </span>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Inspection Grade Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(16, 185, 129, 0.05))',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: 'var(--radius-lg)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: 'rgba(245, 158, 11, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--brand-gold)',
            }}
          >
            <ShieldCheck size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Overall Certified Condition
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--brand-gold)', fontFamily: 'var(--font-heading)' }}>
              {overallScore}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px', fontSize: '0.8125rem' }}>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Major Accident: </span>
            <strong style={{ color: majorAccident === 'No' ? 'var(--brand-emerald)' : 'var(--brand-rose)' }}>
              {majorAccident}
            </strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Tyres Health: </span>
            <strong style={{ color: 'var(--brand-gold)' }}>{tyres}</strong>
          </div>
        </div>
      </div>

      {/* 6 Seals Pakistani Inspection Matrix */}
      <div className="surface-card" style={{ padding: '18px 20px' }}>
        <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#FFF', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={18} color="var(--brand-emerald)" />
          6-Seals Integrity Verification
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>1. Bonnet Seal:</span>
            {getSealBadge(sixSeals.bonnet)}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>2. Trunk / Diggi Seal:</span>
            {getSealBadge(sixSeals.trunk)}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>3. Left A-B-C Pillars:</span>
            {getSealBadge(sixSeals.leftPillars)}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>4. Right A-B-C Pillars:</span>
            {getSealBadge(sixSeals.rightPillars)}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>5. Left Door Seals:</span>
            {getSealBadge(sixSeals.leftDoors)}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>6. Right Door Seals:</span>
            {getSealBadge(sixSeals.rightDoors)}
          </div>
        </div>
      </div>

      {/* Mechanical & Cosmetic Health Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
        <div className="surface-card" style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: 'var(--brand-gold)' }}>
            <Gauge size={16} />
            <h5 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#FFF' }}>Engine & Transmission</h5>
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            <div><strong>Engine:</strong> {engine}</div>
            <div><strong>Suspension:</strong> {suspension}</div>
            <div><strong>Air Conditioner:</strong> {ac}</div>
          </div>
        </div>

        <div className="surface-card" style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: 'var(--brand-blue)' }}>
            <Disc size={16} />
            <h5 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#FFF' }}>Body Paint & Exterior</h5>
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            <div><strong>Exterior:</strong> {exterior}</div>
            <div><strong>Touchups:</strong> {minorAccident}</div>
            <div><strong>Front / Rear:</strong> {frontCondition} / {backCondition}</div>
          </div>
        </div>
      </div>

      {/* Inspector Notes */}
      {notes && (
        <div className="surface-card" style={{ padding: '16px 20px', backgroundColor: 'var(--bg-surface-elevated)' }}>
          <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--brand-gold)', marginBottom: '6px' }}>
            Inspector Remarks & Details:
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            {notes}
          </p>
        </div>
      )}
    </div>
  );
};

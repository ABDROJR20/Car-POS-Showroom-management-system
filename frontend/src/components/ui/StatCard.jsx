import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const COLOR_MAP = {
  blue: '#2563EB',
  emerald: '#059669',
  gold: '#D97706',
  purple: '#7C3AED',
  rose: '#DC2626',
  red: '#DC2626',
  green: '#059669',
};

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  isPositive = true,
  accentColor,
  color = 'gold',
  badgeText,
}) => {
  const finalAccent = accentColor || COLOR_MAP[color] || '#D97706';
  return (
    <div
      className="surface-card"
      style={{
        padding: '22px 24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
      }}
    >
      {/* Top ambient accent glow */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: `linear-gradient(90deg, ${finalAccent}, transparent)`,
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {title}
        </span>
        {Icon && (
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: `${finalAccent}18`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: finalAccent,
              boxShadow: `0 4px 12px ${finalAccent}20`,
            }}
          >
            <Icon size={22} />
          </div>
        )}
      </div>

      <div style={{ marginBottom: '10px' }}>
        <div style={{ fontSize: '1.875rem', fontWeight: 900, color: '#0F172A', fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em' }}>
          {value}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8125rem', borderTop: '1px solid #F1F5F9', paddingTop: '10px' }}>
        {subtitle && (
          <span style={{ color: '#64748B', fontWeight: 600 }}>
            {subtitle}
          </span>
        )}
        {trend && (() => {
          const trendText = typeof trend === 'object' ? trend.value : trend;
          const positive = typeof trend === 'object' && trend.isPositive !== undefined ? trend.isPositive : isPositive;
          return (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontWeight: 800,
                color: positive ? '#059669' : '#DC2626',
                background: positive ? '#ECFDF5' : '#FEF2F2',
                padding: '2px 8px',
                borderRadius: '9999px',
              }}
            >
              {positive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
              <span>{trendText}</span>
            </div>
          );
        })()}
        {badgeText && (
          <span className="badge badge-ownership-showroom" style={{ fontSize: '0.7rem' }}>
            {badgeText}
          </span>
        )}
      </div>
    </div>
  );
};

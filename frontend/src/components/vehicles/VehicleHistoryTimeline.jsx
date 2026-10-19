import React from 'react';
import { Clock, User, ArrowRight, ShieldCheck } from 'lucide-react';
import { vehicleStorage } from '../../services/vehicleStorage';

export const VehicleHistoryTimeline = ({ vehicleId }) => {
  const logs = vehicleStorage.getStatusLogs(vehicleId);

  if (!logs || logs.length === 0) {
    return (
      <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
        No status transitions recorded yet for this vehicle.
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', position: 'relative', paddingLeft: '16px' }}>
      {/* Timeline line */}
      <div
        style={{
          position: 'absolute',
          left: '23px',
          top: '12px',
          bottom: '12px',
          width: '2px',
          background: 'var(--border-medium)',
        }}
      />

      {logs.map((log) => (
        <div key={log.id} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', position: 'relative' }}>
          <div
            style={{
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              backgroundColor: 'var(--brand-gold)',
              boxShadow: '0 0 8px rgba(245, 158, 11, 0.6)',
              marginTop: '4px',
              zIndex: 2,
              flexShrink: 0,
            }}
          />

          <div
            className="surface-card"
            style={{
              flex: 1,
              padding: '12px 16px',
              backgroundColor: 'var(--bg-surface-elevated)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', fontWeight: 700, color: '#FFF' }}>
                {log.fromStatus ? (
                  <>
                    <span style={{ color: 'var(--text-muted)' }}>{log.fromStatus}</span>
                    <ArrowRight size={13} color="var(--brand-gold)" />
                    <span style={{ color: 'var(--brand-emerald)' }}>{log.toStatus}</span>
                  </>
                ) : (
                  <span style={{ color: 'var(--brand-emerald)' }}>Created as {log.toStatus}</span>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <Clock size={12} />
                {new Date(log.timestamp).toLocaleString()}
              </div>
            </div>

            {log.reason && (
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                {log.reason}
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.6875rem', color: 'var(--brand-gold)' }}>
              <User size={11} /> Changed by {log.changedBy}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

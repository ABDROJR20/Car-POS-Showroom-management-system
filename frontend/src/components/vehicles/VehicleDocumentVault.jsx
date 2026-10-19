import React from 'react';
import { FileText, Lock, ShieldCheck, CheckCircle2, AlertCircle, Download, UploadCloud } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const VehicleDocumentVault = ({ documents, vehicle }) => {
  const { showToast } = useToast();
  const {
    registrationBook = 'Smart Card Available',
    receiptSalesDeed = 'Original Transfer Deed',
    tokenTax = 'Up to Date',
    returnFile = 'Original Return File on Hand',
    biometricStatus = 'Biometric Available',
    physicalLockerSafe = 'Safe #1 - Locker B-04',
    otherDocs = 'Complete Manual & 2 Keys',
  } = documents || {};

  const handleDownloadDoc = (docName) => {
    showToast('info', `Opening secure document: ${docName}`, 'Document Vault');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Physical Safe Locker Location Alert */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          background: 'rgba(59, 130, 246, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: 'var(--radius-lg)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'rgba(59, 130, 246, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--brand-blue)',
            }}
          >
            <Lock size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Physical Document Storage Safe
            </div>
            <div style={{ fontSize: '1.125rem', fontWeight: 700, color: '#FFF' }}>
              {physicalLockerSafe}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', color: 'var(--brand-emerald)' }}>
          <ShieldCheck size={16} /> Verified on File
        </div>
      </div>

      {/* Document Items List */}
      <div className="surface-card" style={{ padding: '20px' }}>
        <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#FFF', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileText size={18} color="var(--brand-gold)" />
          Vehicle Legal Papers & Excise Checklist
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Item 1: Registration Book */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)' }}>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#FFF' }}>Registration Book / Smart Card</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{registrationBook}</div>
            </div>
            <button className="btn btn-secondary" style={{ padding: '6px 10px', fontSize: '0.75rem' }} onClick={() => handleDownloadDoc('Smart Card')}>
              <Download size={13} /> View Copy
            </button>
          </div>

          {/* Item 2: Token / Tax */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)' }}>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#FFF' }}>Excise Token / Road Tax</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--brand-emerald)', fontWeight: 600 }}>{tokenTax}</div>
            </div>
            <button className="btn btn-secondary" style={{ padding: '6px 10px', fontSize: '0.75rem' }} onClick={() => handleDownloadDoc('Tax Challan')}>
              <Download size={13} /> View Copy
            </button>
          </div>

          {/* Item 3: Return File / Original File */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)' }}>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#FFF' }}>Return File & Original Invoice</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{returnFile}</div>
            </div>
            <button className="btn btn-secondary" style={{ padding: '6px 10px', fontSize: '0.75rem' }} onClick={() => handleDownloadDoc('Return File')}>
              <Download size={13} /> View Copy
            </button>
          </div>

          {/* Item 4: Biometric Transfer Status */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)' }}>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#FFF' }}>Biometric Transfer Availability</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{biometricStatus}</div>
            </div>
            <span className="badge badge-available">Ready</span>
          </div>

          {/* Item 5: Other Docs */}
          {otherDocs && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)' }}>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#FFF' }}>Other Auxiliary Documents</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{otherDocs}</div>
              </div>
              <button className="btn btn-secondary" style={{ padding: '6px 10px', fontSize: '0.75rem' }} onClick={() => handleDownloadDoc('Auxiliary Documents')}>
                <Download size={13} /> View Copy
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

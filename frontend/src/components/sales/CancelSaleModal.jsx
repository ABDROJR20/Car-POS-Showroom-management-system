import React, { useState } from 'react';
import { Modal } from '../ui';
import { AlertTriangle, AlertOctagon, RotateCcw } from 'lucide-react';

export const CancelSaleModal = ({ isOpen, onClose, sale, onConfirmCancel }) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  if (!sale) return null;

  const handleConfirm = () => {
    if (!reason.trim() || reason.trim().length < 5) {
      setError('Please provide a descriptive reason for cancelling this sale deal (min 5 characters).');
      return;
    }
    onConfirmCancel(sale.id, reason);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Void / Cancel Vehicle Sale Deal"
      subtitle={`Atomic deal cancellation and inventory reversion for ${sale.id}`}
      maxWidth="540px"
      footer={
        <>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Back / Keep Deal
          </button>
          <button type="button" className="btn btn-danger" onClick={handleConfirm}>
            <RotateCcw size={16} /> Confirm Void & Revert Inventory
          </button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div
          style={{
            padding: '14px 18px',
            borderRadius: '10px',
            background: '#FEF2F2',
            border: '1px solid #FECACA',
            color: '#991B1B',
            display: 'flex',
            gap: '12px',
          }}
        >
          <AlertOctagon size={24} style={{ flexShrink: 0, color: '#DC2626' }} />
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.875rem' }}>Warning: Deal Rollback Action</div>
            <div style={{ fontSize: '0.8125rem', marginTop: '4px', lineHeight: 1.4 }}>
              Cancelling this deal will immediately:
              <ul style={{ paddingLeft: '18px', marginTop: '4px' }}>
                <li>Revert vehicle status back to <strong>Available</strong> on the showroom floor.</li>
                {sale.amountReceived > 0 && (
                  <li>
                    Log a refund outflow of <strong>₨ {Number(sale.amountReceived).toLocaleString()}</strong> in the Cash Ledger.
                  </li>
                )}
                <li>Void all associated broker/agent commissions.</li>
              </ul>
            </div>
          </div>
        </div>

        <div style={{ padding: '12px 14px', borderRadius: '8px', background: '#F8FAFC', border: '1px solid #E2E8F0', fontSize: '0.875rem' }}>
          <div><strong>Vehicle:</strong> {sale.vehicleSummary}</div>
          <div><strong>Buyer:</strong> {sale.buyer?.name} ({sale.buyer?.phone})</div>
          <div><strong>Net Deal Value:</strong> ₨ {Number(sale.netSalePrice).toLocaleString()}</div>
        </div>

        <div className="form-group">
          <label className="form-label">
            Reason for Cancellation / Return <span className="required">*</span>
          </label>
          <textarea
            className="form-textarea"
            rows="3"
            placeholder="e.g. Buyer financing rejected by bank / Deal mutually cancelled with token refund."
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              setError('');
            }}
          />
          {error && <div className="form-error">{error}</div>}
        </div>
      </div>
    </Modal>
  );
};

import React, { useState } from 'react';
import { Modal, FormInput, CurrencyInput } from '../ui';
import { financeService } from '../../services/financeService';
import { CheckCircle2, DollarSign, Printer, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const DailyClosingModal = ({ isOpen, onClose }) => {
  const [closingDate, setClosingDate] = useState(new Date().toISOString().split('T')[0]);
  const [physicalCashCounted, setPhysicalCashCounted] = useState('');
  const [closingNotes, setClosingNotes] = useState('');
  const { showToast } = useToast();

  const closingData = financeService.getDailyClosingData(closingDate);
  const systemExpectedCash = closingData.currentCashInHand;
  const discrepancy = physicalCashCounted ? Number(physicalCashCounted) - systemExpectedCash : 0;

  const handlePrint = () => {
    window.print();
  };

  const handleConfirmClosing = () => {
    showToast(
      'success',
      `Daily Register Closing for ${closingDate} verified & archived successfully!`,
      'Register Closed'
    );
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Daily Cash Register Closing & Reconciliation"
      subtitle={`End of day counter cash reconciliation statement for ${closingDate}`}
      maxWidth="680px"
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <button type="button" className="btn btn-secondary" onClick={handlePrint}>
            <Printer size={15} /> Print Closing Audit Slip
          </button>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="button" className="btn btn-emerald" onClick={handleConfirmClosing}>
              <CheckCircle2 size={16} /> Confirm & Sign Off Daily Register
            </button>
          </div>
        </div>
      }
    >
      <div id="printable-daily-closing" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Date Selector */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#475569' }}>Statement Date:</span>
          <input
            type="date"
            className="form-input"
            style={{ width: '180px', padding: '6px 10px' }}
            value={closingDate}
            onChange={(e) => setClosingDate(e.target.value)}
          />
        </div>

        {/* Daily Cash Metrics Banner */}
        <div
          style={{
            padding: '16px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #0F172A, #1E293B)',
            color: '#FFFFFF',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
          }}
        >
          <div>
            <div style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>TODAY CASH IN</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#10B981', marginTop: '4px' }}>
              + ₨ {closingData.dayCashIn.toLocaleString()}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>TODAY CASH OUT</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#F87171', marginTop: '4px' }}>
              - ₨ {closingData.dayCashOut.toLocaleString()}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>SYSTEM CASH IN HAND</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#F59E0B', marginTop: '4px' }}>
              ₨ {systemExpectedCash.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Physical Drawer Verification */}
        <div style={{ padding: '16px', borderRadius: '10px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
          <div style={{ fontWeight: 800, fontSize: '0.875rem', color: '#0F172A', marginBottom: '12px' }}>
            Physical Counter Cash Drawer Verification
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <CurrencyInput
              label="Physical Cash Counted in Safe (PKR)"
              placeholder="Enter actual cash in drawer"
              value={physicalCashCounted}
              onChange={setPhysicalCashCounted}
            />

            <div className="form-group">
              <label className="form-label">Cash Variance / Discrepancy</label>
              <input
                className="form-input"
                disabled
                value={
                  physicalCashCounted
                    ? discrepancy === 0
                      ? '✓ Exact Match (₨ 0)'
                      : discrepancy > 0
                      ? `+ ₨ ${discrepancy.toLocaleString()} (Surplus)`
                      : `- ₨ ${Math.abs(discrepancy).toLocaleString()} (Shortage)`
                    : 'Awaiting physical count'
                }
                style={{
                  fontWeight: 800,
                  backgroundColor: physicalCashCounted
                    ? discrepancy === 0
                      ? '#ECFDF5'
                      : '#FEF2F2'
                    : '#F1F5F9',
                  color: physicalCashCounted
                    ? discrepancy === 0
                      ? '#059669'
                      : '#DC2626'
                    : '#64748B',
                }}
              />
            </div>
          </div>
        </div>

        {/* Day Journal Entries Summary Table */}
        <div style={{ padding: '14px', borderRadius: '10px', background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase', marginBottom: '8px' }}>
            Transactions Executed on {closingDate} ({closingData.dayEntries.length} Records)
          </div>

          {closingData.dayEntries.length === 0 ? (
            <div style={{ fontSize: '0.8125rem', color: '#64748B', fontStyle: 'italic' }}>
              No transactions recorded for this date yet.
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #E2E8F0', textAlign: 'left', color: '#64748B' }}>
                  <th style={{ padding: '4px 0' }}>Voucher</th>
                  <th>Category</th>
                  <th>Narration</th>
                  <th>Account</th>
                  <th style={{ textAlign: 'right' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {closingData.dayEntries.map((e) => (
                  <tr key={e.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '6px 0', fontWeight: 700 }}>{e.id}</td>
                    <td>{e.category}</td>
                    <td style={{ color: '#475569' }}>{e.narration}</td>
                    <td>{e.account.replace(' (Counter)', '')}</td>
                    <td
                      style={{
                        textAlign: 'right',
                        fontWeight: 800,
                        color: e.type === 'DEBIT' ? '#059669' : '#DC2626',
                      }}
                    >
                      {e.type === 'DEBIT' ? '+' : '-'} ₨ {Number(e.amount).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <FormInput
          label="Director / Cashier Closing Remarks"
          placeholder="e.g. Counter safe reconciled and locked. All shift proceeds verified."
          value={closingNotes}
          onChange={(e) => setClosingNotes(e.target.value)}
        />
      </div>
    </Modal>
  );
};

import React, { useState, useEffect } from 'react';
import { Modal, CurrencyInput, Select, FormInput } from '../ui';
import { DollarSign, Check, AlertCircle } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const PartialPaymentModal = ({
  isOpen,
  onClose,
  purchase,
  onRecordPayment,
}) => {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash in Hand');
  const [accountPaidFrom, setAccountPaidFrom] = useState('Cash in Hand (Counter)');
  const [notes, setNotes] = useState('Subsequent balance installment payment');
  const { showToast } = useToast();

  useEffect(() => {
    if (purchase) {
      setAmount(String(purchase.remainingAmount || ''));
    }
  }, [purchase, isOpen]);

  if (!purchase) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const payNum = Number(amount);

    if (payNum <= 0) {
      showToast('error', 'Please enter a valid payment amount.', 'Invalid Amount');
      return;
    }

    if (payNum > purchase.remainingAmount) {
      showToast('error', `Payment amount exceeds remaining payable balance of PKR ${purchase.remainingAmount.toLocaleString()}`, 'Balance Exceeded');
      return;
    }

    try {
      onRecordPayment(purchase.id, payNum, paymentMethod, accountPaidFrom, notes);
      onClose();
    } catch (err) {
      showToast('error', err.message || 'Payment recording failed.', 'Error');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Record Purchase Payment: ${purchase.id}`}
      subtitle={`Seller: ${purchase.seller?.name} • Vehicle: ${purchase.vehicleSummary}`}
      maxWidth="540px"
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-emerald" onClick={handleSubmit}>
            <Check size={16} /> Disburse Payment & Update Ledger
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        {/* Balance Status Banner */}
        <div
          style={{
            padding: '14px 18px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            marginBottom: '18px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Agreed Total Cost</div>
            <div style={{ fontWeight: 700, color: '#FFF' }}>₨ {Number(purchase.purchasePrice).toLocaleString()}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Already Paid</div>
            <div style={{ fontWeight: 700, color: 'var(--brand-emerald)' }}>₨ {Number(purchase.amountPaid).toLocaleString()}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Current Payable Due</div>
            <div style={{ fontWeight: 800, color: 'var(--brand-rose)', fontSize: '1.125rem' }}>₨ {Number(purchase.remainingAmount).toLocaleString()}</div>
          </div>
        </div>

        <CurrencyInput
          label="Payment Amount (PKR)"
          required
          value={amount}
          onChange={setAmount}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '14px' }}>
          <Select
            label="Payment Channel"
            required
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            options={[
              { value: 'Cash in Hand', label: 'Cash in Hand' },
              { value: 'Meezan Bank IBFT', label: 'Meezan Bank IBFT' },
              { value: 'HBL Current Account', label: 'HBL Current Account' },
              { value: 'Bank Cheque / Pay Order', label: 'Bank Cheque / Pay Order' },
            ]}
          />
          <Select
            label="Showroom Outflow Drawer"
            required
            value={accountPaidFrom}
            onChange={(e) => setAccountPaidFrom(e.target.value)}
            options={[
              { value: 'Cash in Hand (Counter)', label: 'Cash in Hand (Counter)' },
              { value: 'Meezan Bank Current A/C', label: 'Meezan Bank Current A/C' },
              { value: 'HBL Business Account', label: 'HBL Business Account' },
            ]}
          />
        </div>

        <div style={{ marginTop: '14px' }}>
          <FormInput
            label="Payment Remarks & Voucher Ref"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </form>
    </Modal>
  );
};

import React, { useState } from 'react';
import { Modal, FormInput, CurrencyInput, Select } from '../ui';
import { DollarSign, CheckCircle2, Wallet } from 'lucide-react';

export const SalePaymentModal = ({ isOpen, onClose, sale, onSavePayment }) => {
  if (!sale) return null;

  const [amount, setAmount] = useState(String(sale.remainingBalance || ''));
  const [paymentMethod, setPaymentMethod] = useState('Cash in Hand');
  const [accountDepositedTo, setAccountDepositedTo] = useState('Cash in Hand (Counter)');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      setError('Please enter a valid payment amount.');
      return;
    }
    if (numAmount > sale.remainingBalance) {
      setError(`Amount cannot exceed the remaining balance of ₨ ${sale.remainingBalance.toLocaleString()}`);
      return;
    }

    onSavePayment(sale.id, {
      amount: numAmount,
      paymentMethod,
      accountDepositedTo,
      notes,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Collect Buyer Balance Payment"
      subtitle={`Receiving installment / balance for ${sale.id} • ${sale.vehicleSummary}`}
      maxWidth="540px"
      footer={
        <>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn btn-emerald" onClick={handleSubmit}>
            <CheckCircle2 size={16} /> Confirm Receipt & Update Ledger
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Balance Status Banner */}
        <div
          style={{
            padding: '14px 18px',
            borderRadius: '10px',
            background: '#FFFBEB',
            border: '1px solid #FDE68A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#92400E' }}>TOTAL OUTSTANDING BALANCE</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#B45309' }}>
              ₨ {Number(sale.remainingBalance).toLocaleString()}
            </div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.8125rem', color: '#78350F' }}>
            <div>Buyer: <strong>{sale.buyer?.name}</strong></div>
            <div>Phone: {sale.buyer?.phone}</div>
          </div>
        </div>

        <CurrencyInput
          label="Payment Amount to Collect (PKR)"
          required
          value={amount}
          error={error}
          onChange={(val) => {
            setAmount(val);
            setError('');
          }}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <Select
            label="Payment Method"
            required
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            options={[
              { value: 'Cash in Hand', label: 'Cash in Hand (Counter)' },
              { value: 'Bank Transfer (Meezan Bank)', label: 'Meezan Bank Transfer' },
              { value: 'Bank Transfer (HBL)', label: 'HBL Business Account IBFT' },
              { value: 'Bank Cheque / Pay Order', label: 'Bank Cheque / Pay Order' },
            ]}
          />

          <Select
            label="Deposit To Account"
            required
            value={accountDepositedTo}
            onChange={(e) => setAccountDepositedTo(e.target.value)}
            options={[
              { value: 'Cash in Hand (Counter)', label: 'Cash Drawer (Counter)' },
              { value: 'Meezan Bank Current A/C', label: 'Meezan Bank Current A/C' },
              { value: 'HBL Business Account', label: 'HBL Business Account' },
            ]}
          />
        </div>

        <FormInput
          label="Payment Remarks / Reference (Optional)"
          placeholder="e.g. Cleared via Pay Order #991244 on delivery handover"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </form>
    </Modal>
  );
};

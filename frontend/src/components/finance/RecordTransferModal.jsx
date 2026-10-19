import React, { useState } from 'react';
import { Modal, FormInput, CurrencyInput, Select } from '../ui';
import { financeService } from '../../services/financeService';
import { ArrowRightLeft, CheckCircle2 } from 'lucide-react';

export const RecordTransferModal = ({ isOpen, onClose, onSave }) => {
  const [fromAccount, setFromAccount] = useState('Cash in Hand (Counter)');
  const [toAccount, setToAccount] = useState('Meezan Bank Current A/C');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [narration, setNarration] = useState('');
  const [error, setError] = useState('');

  const accountsSummary = financeService.getAccountsSummary();
  const sourceBalance = accountsSummary.accounts[fromAccount]?.balance || 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      setError('Please enter a valid transfer amount.');
      return;
    }
    if (fromAccount === toAccount) {
      setError('Source and destination accounts must be different.');
      return;
    }
    if (numAmount > sourceBalance) {
      setError(`Amount exceeds available balance in ${fromAccount} (₨ ${sourceBalance.toLocaleString()})`);
      return;
    }

    onSave({
      fromAccount,
      toAccount,
      amount: numAmount,
      date,
      narration,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Transfer Funds Between Showroom Accounts"
      subtitle="Double-entry journal transfer between Counter Cash Drawer and Showroom Bank Accounts"
      maxWidth="560px"
      footer={
        <>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn btn-blue" onClick={handleSubmit}>
            <CheckCircle2 size={16} /> Execute Transfer
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <Select
            label="Source Account (Transfer Out)"
            required
            value={fromAccount}
            onChange={(e) => setFromAccount(e.target.value)}
            options={[
              { value: 'Cash in Hand (Counter)', label: 'Cash in Hand (Counter Drawer)' },
              { value: 'Meezan Bank Current A/C', label: 'Meezan Bank Current A/C' },
              { value: 'HBL Business Account', label: 'HBL Business Account' },
            ]}
          />
          <Select
            label="Destination Account (Transfer In)"
            required
            value={toAccount}
            onChange={(e) => setToAccount(e.target.value)}
            options={[
              { value: 'Meezan Bank Current A/C', label: 'Meezan Bank Current A/C' },
              { value: 'HBL Business Account', label: 'HBL Business Account' },
              { value: 'Cash in Hand (Counter)', label: 'Cash in Hand (Counter Drawer)' },
            ]}
          />
        </div>

        {/* Source Balance Indicator */}
        <div style={{ padding: '8px 12px', borderRadius: '6px', background: '#F8FAFC', border: '1px solid #E2E8F0', fontSize: '0.8125rem', color: '#475569' }}>
          Available in <strong>{fromAccount}</strong>: <span style={{ fontWeight: 800, color: '#059669' }}>₨ {sourceBalance.toLocaleString()}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <CurrencyInput
            label="Transfer Amount (PKR)"
            required
            value={amount}
            error={error}
            onChange={(val) => {
              setAmount(val);
              setError('');
            }}
          />
          <FormInput
            label="Transfer Date"
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <FormInput
          label="Transfer Purpose / Ref"
          placeholder="e.g. Daily cash collection deposited into Meezan Bank branch"
          value={narration}
          onChange={(e) => setNarration(e.target.value)}
        />
      </form>
    </Modal>
  );
};

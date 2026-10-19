import React, { useState } from 'react';
import { Modal, FormInput, CurrencyInput, Select } from '../ui';
import { INCOME_CATEGORIES } from '../../services/financeService';
import { ArrowDownLeft, CheckCircle2, DollarSign } from 'lucide-react';

export const RecordIncomeModal = ({ isOpen, onClose, onSave }) => {
  const [category, setCategory] = useState('Other Income');
  const [amount, setAmount] = useState('');
  const [receivedFrom, setReceivedFrom] = useState('');
  const [account, setAccount] = useState('Cash in Hand (Counter)');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [narration, setNarration] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      setError('Please enter a valid inflow amount.');
      return;
    }
    if (!receivedFrom.trim()) {
      setError('Payer / Source name is required.');
      return;
    }

    onSave({
      category,
      amount: numAmount,
      receivedFrom,
      account,
      date,
      narration,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Cash Inflow / Other Income"
      subtitle="Direct cash/bank receipt transaction with automated ledger credit entry"
      maxWidth="560px"
      footer={
        <>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn btn-emerald" onClick={handleSubmit}>
            <CheckCircle2 size={16} /> Confirm Receipt & Update Cash in Hand
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <Select
            label="Income Category"
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={INCOME_CATEGORIES.map((c) => ({ value: c, label: c }))}
          />
          <CurrencyInput
            label="Inflow Amount (PKR)"
            required
            value={amount}
            error={error}
            onChange={(val) => {
              setAmount(val);
              setError('');
            }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <FormInput
            label="Received From (Payer / Source)"
            required
            placeholder="e.g. Director Ahsan Khan / Client Tariq"
            value={receivedFrom}
            onChange={(e) => setReceivedFrom(e.target.value)}
          />
          <FormInput
            label="Receipt Date"
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <Select
          label="Deposit Into Account"
          required
          value={account}
          onChange={(e) => setAccount(e.target.value)}
          options={[
            { value: 'Cash in Hand (Counter)', label: 'Cash in Hand (Counter Drawer)' },
            { value: 'Meezan Bank Current A/C', label: 'Meezan Bank Current A/C' },
            { value: 'HBL Business Account', label: 'HBL Business Account' },
          ]}
        />

        <FormInput
          label="Narration & Reason"
          placeholder="e.g. Operating cash infusion / Car inspection evaluation fee"
          value={narration}
          onChange={(e) => setNarration(e.target.value)}
        />
      </form>
    </Modal>
  );
};

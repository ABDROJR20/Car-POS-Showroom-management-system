import React, { useState, useEffect } from 'react';
import { Modal, FormInput, CurrencyInput, Select } from '../ui';
import { EXPENSE_CATEGORIES } from '../../services/financeService';
import { vehicleStorage } from '../../services/vehicleStorage';
import { Coins, Wrench, CheckCircle2, Building, Car } from 'lucide-react';

export const RecordExpenseModal = ({ isOpen, onClose, onSave }) => {
  const [category, setCategory] = useState('Office Expense');
  const [amount, setAmount] = useState('');
  const [paidTo, setPaidTo] = useState('');
  const [account, setAccount] = useState('Cash in Hand (Counter)');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [narration, setNarration] = useState('');
  const [receiptNo, setReceiptNo] = useState('');
  const [isVehicleLinked, setIsVehicleLinked] = useState(false);
  const [vehicleId, setVehicleId] = useState('');
  const [vehicles, setVehicles] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      const allCars = vehicleStorage.getAllVehicles();
      setVehicles(allCars);
    }
  }, [isOpen]);

  // Automatically check vehicle linked if category is repair/detailing
  useEffect(() => {
    if (category === 'Vehicle Repair' || category === 'Vehicle Detailing') {
      setIsVehicleLinked(true);
    }
  }, [category]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      setError('Please enter a valid expense amount.');
      return;
    }
    if (!paidTo.trim()) {
      setError('Please provide vendor / payee name.');
      return;
    }
    if (isVehicleLinked && !vehicleId) {
      setError('Please select the linked vehicle asset.');
      return;
    }

    onSave({
      category,
      amount: numAmount,
      paidTo,
      account,
      date,
      narration,
      receiptNo,
      isVehicleLinked,
      vehicleId: isVehicleLinked ? vehicleId : null,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Showroom & Vehicle Expense Voucher"
      subtitle="Outflow transaction with automated double-entry ledger debit & vehicle cost capitalization"
      maxWidth="620px"
      footer={
        <>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary" onClick={handleSubmit}>
            <CheckCircle2 size={16} /> Confirm Expense & Post to Ledger
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <Select
            label="Expense Category"
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={EXPENSE_CATEGORIES.map((c) => ({ value: c, label: c }))}
          />
          <CurrencyInput
            label="Expense Amount (PKR)"
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
            label="Paid To (Vendor / Workshop / Payee)"
            required
            placeholder="e.g. Ustad Asif Body Workshop / LESCO"
            value={paidTo}
            onChange={(e) => setPaidTo(e.target.value)}
          />
          <FormInput
            label="Expense Date"
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <Select
            label="Paid From Account"
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
            label="External Receipt / Bill #"
            placeholder="e.g. RCP-44910"
            value={receiptNo}
            onChange={(e) => setReceiptNo(e.target.value)}
          />
        </div>

        {/* Vehicle Direct Expense Checkbox */}
        <div
          style={{
            padding: '12px 16px',
            borderRadius: '10px',
            background: isVehicleLinked ? '#EFF6FF' : '#F8FAFC',
            border: `1px solid ${isVehicleLinked ? '#93C5FD' : '#E2E8F0'}`,
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 700, color: '#0F172A' }}>
            <input
              type="checkbox"
              checked={isVehicleLinked}
              onChange={(e) => setIsVehicleLinked(e.target.checked)}
              style={{ width: '16px', height: '16px', accentColor: '#2563EB' }}
            />
            <span>Link Expense directly to a Vehicle Asset (Capitalize Repair/Detailing Cost)</span>
          </label>

          {isVehicleLinked && (
            <Select
              label="Select Linked Vehicle Asset"
              required
              value={vehicleId}
              onChange={(e) => setVehicleId(e.target.value)}
              options={[
                { value: '', label: '-- Choose Vehicle from Inventory --' },
                ...vehicles.map((v) => ({
                  value: String(v.id),
                  label: `${v.make} ${v.model} (${v.modelYear}) • ${v.registrationNo} [${v.status}]`,
                })),
              ]}
            />
          )}
        </div>

        <FormInput
          label="Journal Narration & Details (Optional)"
          placeholder="e.g. Front bumper paint touchup & buffing before showroom display"
          value={narration}
          onChange={(e) => setNarration(e.target.value)}
        />
      </form>
    </Modal>
  );
};

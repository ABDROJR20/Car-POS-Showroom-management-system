import React, { useState, useEffect } from 'react';
import { Modal, FormInput, CurrencyInput, Select } from '../ui';
import { vehicleStorage } from '../../services/vehicleStorage';
import { Users, CheckCircle2, DollarSign } from 'lucide-react';

export const OwnerPayoutModal = ({ isOpen, onClose, onSave }) => {
  const [ownerName, setOwnerName] = useState('');
  const [vehicleId, setVehicleId] = useState('');
  const [amount, setAmount] = useState('');
  const [account, setAccount] = useState('Meezan Bank Current A/C');
  const [paymentMethod, setPaymentMethod] = useState('Bank Transfer (Meezan Bank)');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [narration, setNarration] = useState('');
  const [vehicles, setVehicles] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      const allCars = vehicleStorage.getAllVehicles();
      // Filter to Client or Investor vehicles
      const consignmentCars = allCars.filter((v) => v.ownershipType === 'Client' || v.ownershipType === 'Investor');
      setVehicles(consignmentCars);
      if (consignmentCars.length > 0) {
        setVehicleId(String(consignmentCars[0].id));
        setOwnerName(consignmentCars[0].ownerName || '');
        setAmount(String(consignmentCars[0].costPrice || ''));
      }
    }
  }, [isOpen]);

  const handleSelectCar = (vId) => {
    setVehicleId(vId);
    const found = vehicles.find((v) => String(v.id) === String(vId));
    if (found) {
      setOwnerName(found.ownerName || '');
      setAmount(String(found.costPrice || ''));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      setError('Please enter a valid payout amount.');
      return;
    }
    if (!ownerName.trim()) {
      setError('Owner / Investor name is required.');
      return;
    }

    onSave({
      ownerName,
      vehicleId,
      amount: numAmount,
      account,
      paymentMethod,
      date,
      narration,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Disburse Owner / Consignment Settlement"
      subtitle="Remit net car sale proceeds to third-party client owner or investor with ledger debit"
      maxWidth="600px"
      footer={
        <>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn btn-emerald" onClick={handleSubmit}>
            <CheckCircle2 size={16} /> Confirm Payout & Post Ledger Outflow
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Select
          label="Linked Consignment Vehicle"
          required
          value={vehicleId}
          onChange={(e) => handleSelectCar(e.target.value)}
          options={vehicles.map((v) => ({
            value: String(v.id),
            label: `${v.make} ${v.model} (${v.modelYear}) • ${v.registrationNo} [Owner: ${v.ownerName || 'Client'}]`,
          }))}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <FormInput
            label="Owner / Investor Full Name"
            required
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
          />
          <CurrencyInput
            label="Settlement Payout Amount (PKR)"
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
          <Select
            label="Paid From Account"
            required
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            options={[
              { value: 'Meezan Bank Current A/C', label: 'Meezan Bank Current A/C' },
              { value: 'HBL Business Account', label: 'HBL Business Account' },
              { value: 'Cash in Hand (Counter)', label: 'Cash in Hand (Counter Drawer)' },
            ]}
          />
          <FormInput
            label="Payout Date"
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <FormInput
          label="Payment Reference / Cheque #"
          placeholder="e.g. IBFT Ref #991044 / Meezan Cheque #441029"
          value={narration}
          onChange={(e) => setNarration(e.target.value)}
        />
      </form>
    </Modal>
  );
};

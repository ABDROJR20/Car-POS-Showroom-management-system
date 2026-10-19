import React, { useState, useEffect } from 'react';
import { Modal, FormInput, CurrencyInput, Select } from '../ui';
import { ClipboardList, CheckCircle2, DollarSign, UserCheck, Car } from 'lucide-react';

const MAKES = ['Toyota', 'Honda', 'Suzuki', 'Kia', 'Hyundai', 'Changan', 'MG', 'Audi', 'BMW', 'Mercedes-Benz', 'Other'];
const TRANSMISSIONS = ['Automatic', 'Manual', 'Any'];
const FUEL_TYPES = ['Petrol', 'Diesel', 'Hybrid', 'Electric', 'Any'];
const STATUSES = ['Active', 'Matched', 'Purchased', 'Closed'];

export const DemandFormModal = ({ isOpen, onClose, onSave, initialData = null }) => {
  const [formData, setFormData] = useState({
    customer: '',
    phone: '',
    city: 'Islamabad',
    make: 'Toyota',
    model: '',
    variant: '',
    minYear: '2022',
    maxYear: '2024',
    budget: '',
    color: 'Any',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    maxMileageKm: '50000',
    notes: '',
    status: 'Active',
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        minYear: String(initialData.minYear || 2022),
        maxYear: String(initialData.maxYear || 2024),
        budget: String(initialData.budget || ''),
        maxMileageKm: String(initialData.maxMileageKm || 50000),
      });
    } else {
      setFormData({
        customer: '',
        phone: '',
        city: 'Islamabad',
        make: 'Toyota',
        model: '',
        variant: '',
        minYear: '2022',
        maxYear: '2024',
        budget: '',
        color: 'Any',
        transmission: 'Automatic',
        fuelType: 'Petrol',
        maxMileageKm: '50000',
        notes: '',
        status: 'Active',
      });
    }
    setError('');
  }, [isOpen, initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.customer.trim()) {
      setError('Customer name is required.');
      return;
    }
    if (!formData.phone.trim()) {
      setError('Customer phone number is required.');
      return;
    }
    if (!formData.model.trim()) {
      setError('Target vehicle model is required.');
      return;
    }

    onSave({
      ...formData,
      minYear: Number(formData.minYear),
      maxYear: Number(formData.maxYear),
      budget: Number(formData.budget || 0),
      maxMileageKm: Number(formData.maxMileageKm || 0),
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? `Edit Customer Demand • ${initialData.id}` : 'Register New Customer Car Demand'}
      subtitle="Prospective buyer inquiry recording with automatic showroom inventory matchmaking"
      maxWidth="680px"
      footer={
        <>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary" onClick={handleSubmit}>
            <CheckCircle2 size={16} /> {initialData ? 'Update Demand' : 'Save & Run Auto-Match'}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Customer Details */}
        <div style={{ padding: '14px', borderRadius: '10px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
          <div style={{ fontWeight: 800, fontSize: '0.8125rem', color: '#334155', textTransform: 'uppercase', marginBottom: '10px' }}>
            Prospective Buyer Contact Info
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '12px' }}>
            <FormInput
              label="Customer Full Name"
              required
              placeholder="e.g. Haji Bilal Aslam"
              value={formData.customer}
              error={error}
              onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
            />
            <FormInput
              label="Phone (WhatsApp)"
              required
              placeholder="+92 300 1234567"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <FormInput
              label="City"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />
          </div>
        </div>

        {/* Required Vehicle Specs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
          <Select
            label="Make / Manufacturer"
            required
            value={formData.make}
            onChange={(e) => setFormData({ ...formData, make: e.target.value })}
            options={MAKES.map((m) => ({ value: m, label: m }))}
          />
          <FormInput
            label="Model Name"
            required
            placeholder="e.g. Fortuner / Civic"
            value={formData.model}
            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
          />
          <FormInput
            label="Variant / Trim"
            placeholder="e.g. Sigma 4 / RS Turbo"
            value={formData.variant}
            onChange={(e) => setFormData({ ...formData, variant: e.target.value })}
          />
        </div>

        {/* Year Range & Budget */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.5fr', gap: '12px' }}>
          <FormInput
            label="Minimum Model Year"
            type="number"
            value={formData.minYear}
            onChange={(e) => setFormData({ ...formData, minYear: e.target.value })}
          />
          <FormInput
            label="Maximum Model Year"
            type="number"
            value={formData.maxYear}
            onChange={(e) => setFormData({ ...formData, maxYear: e.target.value })}
          />
          <CurrencyInput
            label="Customer Target Budget (PKR)"
            placeholder="e.g. 18500000"
            value={formData.budget}
            onChange={(val) => setFormData({ ...formData, budget: val })}
          />
        </div>

        {/* Preferences */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px' }}>
          <FormInput
            label="Color Preference"
            placeholder="e.g. Black / White"
            value={formData.color}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
          />
          <Select
            label="Transmission"
            value={formData.transmission}
            onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
            options={TRANSMISSIONS.map((t) => ({ value: t, label: t }))}
          />
          <Select
            label="Fuel Type"
            value={formData.fuelType}
            onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
            options={FUEL_TYPES.map((f) => ({ value: f, label: f }))}
          />
          <Select
            label="Inquiry Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            options={STATUSES.map((s) => ({ value: s, label: s }))}
          />
        </div>

        <FormInput
          label="Special Requirement Notes & Urgency"
          placeholder="e.g. Genuine paint condition preferred, first owner, immediate buyer within this week"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        />
      </form>
    </Modal>
  );
};

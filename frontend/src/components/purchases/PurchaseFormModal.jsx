import React, { useState } from 'react';
import { Modal, FormInput, Select, CurrencyInput, DatePicker } from '../ui';
import { ShoppingBag, Car, User, DollarSign, ShieldCheck, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const PurchaseFormModal = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    // Step 1: Purchase Type
    purchaseType: 'DIRECT_SHOWROOM_PURCHASE',
    ownershipType: 'Showroom',

    // Step 2: Vehicle Specs
    vehicle: {
      make: 'Toyota',
      model: 'Yaris',
      variant: 'ATIV X 1.5 CVT',
      modelYear: 2023,
      registrationNo: '',
      chassisNo: '',
      engineNo: '',
      colorExterior: 'Super White',
      colorInterior: 'Beige',
      mileageKm: '22000',
      fuelType: 'Petrol',
      transmission: 'CVT',
      locationBay: 'Bay B-1',
      keyNo: 'KEY-055',
    },

    // Step 3: Seller & Owner KYC
    seller: {
      name: '',
      fatherName: '',
      cnic: '',
      phone: '',
      city: 'Lahore',
      address: '',
    },
    ownerName: '',

    // Step 4: Deal Pricing & Initial Payment
    purchasePrice: '4650000',
    amountPaid: '4650000',
    purchaseDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'Cash in Hand',
    accountPaidFrom: 'Cash in Hand (Counter)',

    // Step 5: Broker & Legal Witnesses
    broker: {
      name: 'Direct Deal',
      phone: '',
      commissionAmount: '0',
    },
    witnesses: {
      w1Name: '',
      w1Cnic: '',
      w2Name: '',
      w2Cnic: '',
    },
    notes: 'Clean title vehicle. Verified excise records.',
  });

  const handleTypeChange = (type) => {
    let ownType = 'Showroom';
    if (type === 'INVESTOR_PURCHASE') ownType = 'Investor';
    if (type === 'CLIENT_CONSIGNMENT_IN') ownType = 'Client';
    setFormData((prev) => ({
      ...prev,
      purchaseType: type,
      ownershipType: ownType,
      amountPaid: type === 'CLIENT_CONSIGNMENT_IN' ? '0' : prev.amountPaid,
    }));
  };

  const updateVehicle = (field, val) => {
    setFormData((prev) => ({
      ...prev,
      vehicle: { ...prev.vehicle, [field]: val },
    }));
  };

  const updateSeller = (field, val) => {
    setFormData((prev) => ({
      ...prev,
      seller: { ...prev.seller, [field]: val },
      ownerName: field === 'name' && !prev.ownerName ? val : prev.ownerName,
    }));
  };

  const updateWitness = (field, val) => {
    setFormData((prev) => ({
      ...prev,
      witnesses: { ...prev.witnesses, [field]: val },
    }));
  };

  const remaining = Math.max(0, Number(formData.purchasePrice || 0) - Number(formData.amountPaid || 0));

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.vehicle.make || !formData.vehicle.model || !formData.vehicle.chassisNo) {
      showToast('error', 'Vehicle Make, Model, and Chassis (VIN) number are required.', 'Required Specs');
      setCurrentStep(2);
      return;
    }

    if (!formData.seller.name || !formData.seller.phone) {
      showToast('error', 'Seller Full Name and Contact Phone are required.', 'Seller KYC');
      setCurrentStep(3);
      return;
    }

    if (Number(formData.purchasePrice) <= 0) {
      showToast('error', 'Agreed purchase price must be greater than zero.', 'Pricing Error');
      setCurrentStep(4);
      return;
    }

    try {
      onSave({
        ...formData,
        purchasePrice: Number(formData.purchasePrice),
        amountPaid: Number(formData.amountPaid),
        broker: {
          ...formData.broker,
          commissionAmount: Number(formData.broker.commissionAmount || 0),
        },
      });
    } catch (err) {
      showToast('error', err.message || 'Failed to execute purchase transaction', 'Transaction Failed');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Vehicle Purchase & Inward Acquisition"
      subtitle="Atomic transaction recording vehicle asset, seller deed, ledger outflow & inventory update"
      maxWidth="780px"
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <div>
            {currentStep > 1 && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setCurrentStep(currentStep - 1)}
              >
                <ArrowLeft size={15} /> Back
              </button>
            )}
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            {currentStep < 5 ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setCurrentStep(currentStep + 1)}
              >
                Next Step <ArrowRight size={15} />
              </button>
            ) : (
              <button type="button" className="btn btn-emerald" onClick={handleSubmit}>
                <Check size={16} /> Execute Purchase & Print Deed
              </button>
            )}
          </div>
        </div>
      }
    >
      {/* Wizard Steps Navigation */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '8px',
          marginBottom: '24px',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '14px',
        }}
      >
        {[
          { step: 1, label: 'Type', icon: ShoppingBag },
          { step: 2, label: 'Vehicle Specs', icon: Car },
          { step: 3, label: 'Seller KYC', icon: User },
          { step: 4, label: 'Pricing & Pay', icon: DollarSign },
          { step: 5, label: 'Witnesses', icon: ShieldCheck },
        ].map((s) => {
          const Icon = s.icon;
          const isActive = currentStep === s.step;
          const isPassed = currentStep > s.step;
          return (
            <div
              key={s.step}
              onClick={() => setCurrentStep(s.step)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer',
                opacity: isActive ? 1 : isPassed ? 0.8 : 0.4,
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: isActive ? 'var(--brand-gold)' : isPassed ? 'var(--brand-emerald)' : 'var(--bg-surface-elevated)',
                  color: isActive ? '#000' : '#FFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                }}
              >
                {isPassed ? <Check size={14} /> : s.step}
              </div>
              <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: isActive ? '#FFF' : 'var(--text-muted)' }}>
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSubmit}>
        {/* STEP 1: Purchase Type */}
        {currentStep === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#FFF' }}>
              Select Vehicle Acquisition Model:
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div
                onClick={() => handleTypeChange('DIRECT_SHOWROOM_PURCHASE')}
                className="surface-card"
                style={{
                  padding: '16px',
                  cursor: 'pointer',
                  border: formData.purchaseType === 'DIRECT_SHOWROOM_PURCHASE' ? '2px solid var(--brand-gold)' : '1px solid var(--border-subtle)',
                  background: formData.purchaseType === 'DIRECT_SHOWROOM_PURCHASE' ? 'rgba(245, 158, 11, 0.08)' : 'var(--bg-surface)',
                }}
              >
                <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#FFF', marginBottom: '4px' }}>
                  1. Direct Showroom Purchase
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Showroom funds full CapEx. Capitalized to inventory asset. 100% net margin earned upon future sale.
                </p>
              </div>

              <div
                onClick={() => handleTypeChange('INVESTOR_PURCHASE')}
                className="surface-card"
                style={{
                  padding: '16px',
                  cursor: 'pointer',
                  border: formData.purchaseType === 'INVESTOR_PURCHASE' ? '2px solid var(--brand-purple)' : '1px solid var(--border-subtle)',
                  background: formData.purchaseType === 'INVESTOR_PURCHASE' ? 'rgba(139, 92, 246, 0.08)' : 'var(--bg-surface)',
                }}
              >
                <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#FFF', marginBottom: '4px' }}>
                  2. Investor-Funded Purchase
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Funded by registered investor syndicate. Capital principal + agreed profit split returned upon sale.
                </p>
              </div>

              <div
                onClick={() => handleTypeChange('CLIENT_CONSIGNMENT_IN')}
                className="surface-card"
                style={{
                  padding: '16px',
                  cursor: 'pointer',
                  border: formData.purchaseType === 'CLIENT_CONSIGNMENT_IN' ? '2px solid var(--brand-blue)' : '1px solid var(--border-subtle)',
                  background: formData.purchaseType === 'CLIENT_CONSIGNMENT_IN' ? 'rgba(59, 130, 246, 0.08)' : 'var(--bg-surface)',
                }}
              >
                <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#FFF', marginBottom: '4px' }}>
                  3. Client Consignment Take-In
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Zero immediate purchase outflow. Custody agreement signed; commission earned on sale.
                </p>
              </div>

              <div
                onClick={() => handleTypeChange('BROKER_DEAL_IN')}
                className="surface-card"
                style={{
                  padding: '16px',
                  cursor: 'pointer',
                  border: formData.purchaseType === 'BROKER_DEAL_IN' ? '2px solid var(--brand-emerald)' : '1px solid var(--border-subtle)',
                  background: formData.purchaseType === 'BROKER_DEAL_IN' ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-surface)',
                }}
              >
                <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#FFF', marginBottom: '4px' }}>
                  4. Commission / Broker Acquisition
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Sourced through external car broker with recorded brokerage commission terms.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Vehicle Specs */}
        {currentStep === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
              <FormInput
                label="Make / Manufacturer"
                required
                value={formData.vehicle.make}
                onChange={(e) => updateVehicle('make', e.target.value)}
              />
              <FormInput
                label="Model"
                required
                value={formData.vehicle.model}
                onChange={(e) => updateVehicle('model', e.target.value)}
              />
              <FormInput
                label="Variant / Package"
                value={formData.vehicle.variant}
                onChange={(e) => updateVehicle('variant', e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
              <FormInput
                label="Model Year"
                type="number"
                required
                value={formData.vehicle.modelYear}
                onChange={(e) => updateVehicle('modelYear', e.target.value)}
              />
              <FormInput
                label="Registration Number"
                placeholder="LEA-23-9900 or APPLIED FOR"
                value={formData.vehicle.registrationNo}
                onChange={(e) => updateVehicle('registrationNo', e.target.value)}
              />
              <FormInput
                label="Chassis Number (VIN)"
                required
                placeholder="e.g. NZE141-9081234"
                value={formData.vehicle.chassisNo}
                onChange={(e) => updateVehicle('chassisNo', e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
              <FormInput
                label="Engine Number"
                value={formData.vehicle.engineNo}
                onChange={(e) => updateVehicle('engineNo', e.target.value)}
              />
              <FormInput
                label="Mileage (KM)"
                type="number"
                value={formData.vehicle.mileageKm}
                onChange={(e) => updateVehicle('mileageKm', e.target.value)}
              />
              <FormInput
                label="Exterior Color"
                value={formData.vehicle.colorExterior}
                onChange={(e) => updateVehicle('colorExterior', e.target.value)}
              />
            </div>
          </div>
        )}

        {/* STEP 3: Seller & Owner KYC */}
        {currentStep === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <FormInput
                label="Seller Full Name"
                required
                placeholder="e.g. Sheikh Imran"
                value={formData.seller.name}
                onChange={(e) => updateSeller('name', e.target.value)}
              />
              <FormInput
                label="Father / Husband Name"
                placeholder="e.g. Sheikh Muhammad Aslam"
                value={formData.seller.fatherName}
                onChange={(e) => updateSeller('fatherName', e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <FormInput
                label="Seller CNIC Number"
                placeholder="37405-9988776-3"
                value={formData.seller.cnic}
                onChange={(e) => updateSeller('cnic', e.target.value)}
              />
              <FormInput
                label="Seller Contact Phone (WhatsApp)"
                required
                placeholder="+92 333 1234567"
                value={formData.seller.phone}
                onChange={(e) => updateSeller('phone', e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '14px' }}>
              <FormInput
                label="City"
                value={formData.seller.city}
                onChange={(e) => updateSeller('city', e.target.value)}
              />
              <FormInput
                label="Complete Residential Address"
                value={formData.seller.address}
                onChange={(e) => updateSeller('address', e.target.value)}
              />
            </div>

            <FormInput
              label="Original Vehicle Owner Name (as on Smart Card)"
              placeholder="Leave blank if seller is the first registered owner"
              value={formData.ownerName}
              onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
            />
          </div>
        )}

        {/* STEP 4: Deal Pricing & Initial Payment */}
        {currentStep === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <CurrencyInput
                label="Agreed Purchase Price (PKR)"
                required
                value={formData.purchasePrice}
                onChange={(val) => setFormData({ ...formData, purchasePrice: val })}
              />
              <CurrencyInput
                label="Amount Paid Now (Outflow)"
                required
                value={formData.amountPaid}
                onChange={(val) => setFormData({ ...formData, amountPaid: val })}
              />
            </div>

            {/* Remaining Balance Summary Pill */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                background: remaining > 0 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                border: `1px solid ${remaining > 0 ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
                borderRadius: 'var(--radius-md)',
              }}
            >
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#FFF' }}>
                Remaining Payable Balance to Seller:
              </span>
              <span style={{ fontSize: '1.125rem', fontWeight: 800, color: remaining > 0 ? 'var(--brand-rose)' : 'var(--brand-emerald)', fontFamily: 'var(--font-heading)' }}>
                ₨ {remaining.toLocaleString()}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
              <DatePicker
                label="Purchase Date"
                value={formData.purchaseDate}
                onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
              />
              <Select
                label="Payment Method"
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                options={[
                  { value: 'Cash in Hand', label: 'Cash in Hand' },
                  { value: 'Meezan Bank IBFT', label: 'Meezan Bank IBFT' },
                  { value: 'HBL Current Account', label: 'HBL Current Account' },
                  { value: 'Bank Cheque / Pay Order', label: 'Bank Cheque / Pay Order' },
                  { value: 'Consignment Agreement', label: 'Consignment Agreement (0 Outflow)' },
                ]}
              />
              <Select
                label="Account Paid Out From"
                value={formData.accountPaidFrom}
                onChange={(e) => setFormData({ ...formData, accountPaidFrom: e.target.value })}
                options={[
                  { value: 'Cash in Hand (Counter)', label: 'Cash in Hand (Counter)' },
                  { value: 'Meezan Bank Current A/C', label: 'Meezan Bank Current A/C' },
                  { value: 'HBL Business Account', label: 'HBL Business Account' },
                  { value: 'N/A (Consignment Take-In)', label: 'N/A (Consignment)' },
                ]}
              />
            </div>
          </div>
        )}

        {/* STEP 5: Broker Details & Witnesses */}
        {currentStep === 5 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="surface-card" style={{ padding: '16px', background: 'var(--bg-surface-elevated)' }}>
              <h5 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--brand-gold)', marginBottom: '10px' }}>
                Broker / Commission Agent (Optional)
              </h5>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <FormInput
                  label="Broker Name"
                  placeholder="e.g. Haji Zulfiqar Autos"
                  value={formData.broker.name}
                  onChange={(e) => setFormData({ ...formData, broker: { ...formData.broker, name: e.target.value } })}
                />
                <FormInput
                  label="Broker Contact"
                  placeholder="+92 301 6655443"
                  value={formData.broker.phone}
                  onChange={(e) => setFormData({ ...formData, broker: { ...formData.broker, phone: e.target.value } })}
                />
                <CurrencyInput
                  label="Broker Commission"
                  value={formData.broker.commissionAmount}
                  onChange={(val) => setFormData({ ...formData, broker: { ...formData.broker, commissionAmount: val } })}
                />
              </div>
            </div>

            <div className="surface-card" style={{ padding: '16px', background: 'var(--bg-surface-elevated)' }}>
              <h5 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--brand-emerald)', marginBottom: '10px' }}>
                Legal Witnesses (Pakistani Sales Deed)
              </h5>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <FormInput
                  label="Witness 1 Full Name"
                  placeholder="e.g. Muhammad Arshad"
                  value={formData.witnesses.w1Name}
                  onChange={(e) => updateWitness('w1Name', e.target.value)}
                />
                <FormInput
                  label="Witness 1 CNIC"
                  placeholder="35202-1122334-1"
                  value={formData.witnesses.w1Cnic}
                  onChange={(e) => updateWitness('w1Cnic', e.target.value)}
                />
                <FormInput
                  label="Witness 2 Full Name"
                  placeholder="e.g. Tariq Javed"
                  value={formData.witnesses.w2Name}
                  onChange={(e) => updateWitness('w2Name', e.target.value)}
                />
                <FormInput
                  label="Witness 2 CNIC"
                  placeholder="35201-9988771-5"
                  value={formData.witnesses.w2Cnic}
                  onChange={(e) => updateWitness('w2Cnic', e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Purchase Deed Notes & Terms</label>
              <textarea
                className="form-input"
                rows={2}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </div>
        )}
      </form>
    </Modal>
  );
};

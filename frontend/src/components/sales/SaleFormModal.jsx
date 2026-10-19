import React, { useState, useEffect } from 'react';
import { Modal, FormInput, CurrencyInput, Select } from '../ui';
import { vehicleStorage } from '../../services/vehicleStorage';
import {
  Car,
  UserCheck,
  Calculator,
  Percent,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  DollarSign,
  FileText,
  ShieldCheck,
  Building2,
  Users,
} from 'lucide-react';

const STEPS = [
  { id: 1, label: 'Vehicle Asset', icon: Car },
  { id: 2, label: 'Buyer & Witnesses', icon: UserCheck },
  { id: 3, label: 'Deal Pricing', icon: Calculator },
  { id: 4, label: 'Commission & Brokerage', icon: Percent },
  { id: 5, label: 'Settlement Summary', icon: CheckCircle2 },
];

export const SaleFormModal = ({ isOpen, onClose, onSave, preselectedVehicleId = null }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    vehicleId: '',
    buyer: {
      name: '',
      fatherName: '',
      cnic: '',
      phone: '',
      city: 'Islamabad',
      address: '',
    },
    witnesses: {
      w1Name: '',
      w1Cnic: '',
      w2Name: '',
      w2Cnic: '',
    },
    saleDate: new Date().toISOString().split('T')[0],
    salePrice: '',
    additionalCharges: '0',
    discount: '0',
    amountReceived: '',
    paymentMethod: 'Cash in Hand',
    accountDepositedTo: 'Cash in Hand (Counter)',
    vehicleExpenses: '0',
    commission: {
      showroomType: 'FIXED', // FIXED | PERCENTAGE
      showroomValue: '0',
      brokerName: '',
      brokerPhone: '',
      brokerType: 'FIXED',
      brokerValue: '0',
      brokerStatus: 'PENDING',
      agentName: '',
      agentType: 'FIXED',
      agentValue: '0',
      agentStatus: 'PENDING',
    },
    notes: '',
  });

  const [formErrors, setFormErrors] = useState({});

  // Load available vehicles
  useEffect(() => {
    if (isOpen) {
      const allCars = vehicleStorage.getAllVehicles();
      // Strictly Available or Reserved cars (cannot sell Sold cars)
      const availableCars = allCars.filter(
        (v) => v.status === 'Available' || v.status === 'Reserved' || String(v.id) === String(preselectedVehicleId)
      );
      setVehicles(availableCars);

      if (preselectedVehicleId) {
        const pre = allCars.find((v) => String(v.id) === String(preselectedVehicleId));
        if (pre) {
          handleSelectVehicle(pre);
        }
      } else if (availableCars.length > 0 && !formData.vehicleId) {
        handleSelectVehicle(availableCars[0]);
      }
    }
  }, [isOpen, preselectedVehicleId]);

  const handleSelectVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
    setFormData((prev) => ({
      ...prev,
      vehicleId: vehicle.id,
      salePrice: String(vehicle.demandPrice || vehicle.costPrice || 0),
      discount: '0',
      additionalCharges: '0',
      amountReceived: String(vehicle.demandPrice || vehicle.costPrice || 0), // Default to full
      vehicleExpenses: '0',
    }));
  };

  // Real-time calculations
  const salePriceNum = Number(formData.salePrice || 0);
  const additionalChargesNum = Number(formData.additionalCharges || 0);
  const discountNum = Number(formData.discount || 0);
  const netSalePrice = Math.max(0, salePriceNum + additionalChargesNum - discountNum);
  const amountReceivedNum = Number(formData.amountReceived || 0);
  const remainingBalance = Math.max(0, netSalePrice - amountReceivedNum);

  // Commission Calculations
  let showroomComm = 0;
  if (formData.commission.showroomType === 'PERCENTAGE') {
    showroomComm = Math.round((netSalePrice * Number(formData.commission.showroomValue || 0)) / 100);
  } else {
    showroomComm = Number(formData.commission.showroomValue || 0);
  }

  let brokerComm = 0;
  if (formData.commission.brokerType === 'PERCENTAGE') {
    brokerComm = Math.round((netSalePrice * Number(formData.commission.brokerValue || 0)) / 100);
  } else {
    brokerComm = Number(formData.commission.brokerValue || 0);
  }

  let agentComm = 0;
  if (formData.commission.agentType === 'PERCENTAGE') {
    agentComm = Math.round((netSalePrice * Number(formData.commission.agentValue || 0)) / 100);
  } else {
    agentComm = Number(formData.commission.agentValue || 0);
  }

  // Profit Calculations
  const isShowroomOwned = selectedVehicle?.ownershipType === 'Showroom';
  const costPriceNum = Number(selectedVehicle?.costPrice || 0);
  const vehicleExpensesNum = Number(formData.vehicleExpenses || 0);
  const totalCost = costPriceNum + vehicleExpensesNum;

  let grossProfit = 0;
  let ownerPayable = 0;
  let showroomNetEarnings = 0;

  if (isShowroomOwned) {
    grossProfit = netSalePrice - totalCost - brokerComm - agentComm;
    ownerPayable = 0;
    showroomNetEarnings = grossProfit;
  } else {
    // Client / Investor Vehicle
    ownerPayable = costPriceNum;
    const surplus = netSalePrice - ownerPayable;
    showroomNetEarnings = showroomComm + Math.max(0, surplus - showroomComm) - brokerComm - agentComm - vehicleExpensesNum;
    grossProfit = showroomNetEarnings;
  }

  // Step Validations
  const validateStep = (step) => {
    const errors = {};

    if (step === 1) {
      if (!formData.vehicleId) errors.vehicleId = 'Please choose a vehicle to sell.';
      if (selectedVehicle && selectedVehicle.status === 'Sold') {
        errors.vehicleId = 'This vehicle is already marked as SOLD.';
      }
    }

    if (step === 2) {
      if (!formData.buyer.name.trim()) errors.buyerName = 'Buyer full name is required.';
      if (!formData.buyer.phone.trim()) errors.buyerPhone = 'Buyer phone number is required.';
      if (!formData.buyer.cnic.trim()) errors.buyerCnic = 'Buyer CNIC is required for transfer deed.';
    }

    if (step === 3) {
      if (salePriceNum <= 0) errors.salePrice = 'Sale price must be greater than zero.';
      if (discountNum > salePriceNum) errors.discount = 'Discount cannot exceed the sale price.';
      if (amountReceivedNum < 0) errors.amountReceived = 'Received amount cannot be negative.';
      if (amountReceivedNum > netSalePrice) {
        errors.amountReceived = 'Received amount cannot exceed net sale price.';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateStep(3)) {
      setCurrentStep(3);
      return;
    }

    const payload = {
      ...formData,
      salePrice: salePriceNum,
      additionalCharges: additionalChargesNum,
      discount: discountNum,
      amountReceived: amountReceivedNum,
      vehicleExpenses: vehicleExpensesNum,
      commission: {
        ...formData.commission,
        showroomValue: Number(formData.commission.showroomValue || 0),
        brokerValue: Number(formData.commission.brokerValue || 0),
        agentValue: Number(formData.commission.agentValue || 0),
      },
    };

    onSave(payload);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Execute Vehicle Sale & Booking Deal"
      subtitle="Point of sale atomic transaction with automated ledger and legal deed generation"
      maxWidth="840px"
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <div>
            {currentStep > 1 && (
              <button type="button" className="btn btn-secondary" onClick={handleBack}>
                <ArrowLeft size={16} /> Back
              </button>
            )}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            {currentStep < 5 ? (
              <button type="button" className="btn btn-primary" onClick={handleNext}>
                Next: {STEPS[currentStep].label} <ArrowRight size={16} />
              </button>
            ) : (
              <button type="button" className="btn btn-emerald" onClick={handleSubmit}>
                <CheckCircle2 size={16} /> Confirm Sale & Dispatch Invoice
              </button>
            )}
          </div>
        </div>
      }
    >
      {/* 5-Step Progress Bar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '8px',
          marginBottom: '24px',
          paddingBottom: '16px',
          borderBottom: '1px solid #E2E8F0',
        }}
      >
        {STEPS.map((s) => {
          const Icon = s.icon;
          const isDone = currentStep > s.id;
          const isCurrent = currentStep === s.id;

          return (
            <div
              key={s.id}
              onClick={() => {
                if (isDone || isCurrent) setCurrentStep(s.id);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 10px',
                borderRadius: '8px',
                background: isCurrent ? '#EFF6FF' : isDone ? '#ECFDF5' : '#F8FAFC',
                border: `1px solid ${isCurrent ? '#3B82F6' : isDone ? '#10B981' : '#E2E8F0'}`,
                cursor: isDone ? 'pointer' : 'default',
                transition: 'all 0.15s ease',
              }}
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: isCurrent ? '#2563EB' : isDone ? '#059669' : '#CBD5E1',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {isDone ? '✓' : s.id}
              </div>
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    color: isCurrent ? '#1D4ED8' : isDone ? '#065F46' : '#64748B',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {s.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSubmit}>
        {/* STEP 1: VEHICLE ASSET SELECTION */}
        {currentStep === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">
                Select Vehicle from Available Inventory <span className="required">*</span>
              </label>
              {vehicles.length === 0 ? (
                <div
                  style={{
                    padding: '24px',
                    textAlign: 'center',
                    background: '#FEF2F2',
                    borderRadius: '10px',
                    border: '1px solid #FECACA',
                    color: '#991B1B',
                  }}
                >
                  <AlertTriangle size={28} style={{ margin: '0 auto 8px', color: '#DC2626' }} />
                  <div style={{ fontWeight: 800 }}>No Available Stock on Floor</div>
                  <div style={{ fontSize: '0.8125rem', marginTop: '4px' }}>
                    All vehicles are currently sold. Please acquire inward stock first from Purchases.
                  </div>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px', maxHeight: '340px', overflowY: 'auto', padding: '2px' }}>
                  {vehicles.map((car) => {
                    const isSelected = String(selectedVehicle?.id) === String(car.id);
                    return (
                      <div
                        key={car.id}
                        onClick={() => handleSelectVehicle(car)}
                        style={{
                          padding: '12px',
                          borderRadius: '10px',
                          border: `2px solid ${isSelected ? '#2563EB' : '#E2E8F0'}`,
                          background: isSelected ? '#EFF6FF' : '#FFFFFF',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          boxShadow: isSelected ? '0 4px 12px rgba(37, 99, 235, 0.15)' : 'none',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                          <span
                            style={{
                              fontSize: '0.6875rem',
                              fontWeight: 800,
                              padding: '2px 6px',
                              borderRadius: '4px',
                              background: car.ownershipType === 'Showroom' ? '#FEF3C7' : '#EFF6FF',
                              color: car.ownershipType === 'Showroom' ? '#92400E' : '#1E40AF',
                            }}
                          >
                            {car.ownershipType} Owned
                          </span>
                          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0F172A' }}>
                            {car.registrationNo}
                          </span>
                        </div>
                        <div style={{ fontWeight: 800, fontSize: '0.875rem', color: '#0F172A', marginBottom: '4px' }}>
                          {car.make} {car.model} ({car.modelYear})
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '6px' }}>
                          {car.variant} • {car.colorExterior}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed #CBD5E1', paddingTop: '6px', fontSize: '0.75rem' }}>
                          <span style={{ color: '#64748B' }}>Demand:</span>
                          <span style={{ fontWeight: 800, color: '#059669' }}>₨ {Number(car.demandPrice || car.costPrice).toLocaleString()}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              {formErrors.vehicleId && <div className="form-error">{formErrors.vehicleId}</div>}
            </div>

            {selectedVehicle && (
              <div
                style={{
                  padding: '14px 18px',
                  borderRadius: '10px',
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700 }}>SELECTED ASSET</div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A' }}>
                    {selectedVehicle.make} {selectedVehicle.model} {selectedVehicle.variant} ({selectedVehicle.modelYear})
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: '#475569', marginTop: '2px' }}>
                    Chassis: <strong>{selectedVehicle.chassisNo}</strong> | Engine: <strong>{selectedVehicle.engineNo}</strong>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700 }}>SHOWROOM COST</div>
                  <div style={{ fontSize: '1.125rem', fontWeight: 900, color: '#0F172A' }}>
                    ₨ {Number(selectedVehicle.costPrice).toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700 }}>
                    Target: ₨ {Number(selectedVehicle.demandPrice).toLocaleString()}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: BUYER & WITNESS DOSSIER */}
        {currentStep === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ fontWeight: 800, fontSize: '0.9375rem', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UserCheck size={18} color="#2563EB" /> Buyer Legal Profile (As per CNIC)
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <FormInput
                label="Buyer Full Name"
                required
                placeholder="e.g. Chaudhry Nadeem Akhtar"
                value={formData.buyer.name}
                error={formErrors.buyerName}
                onChange={(e) => setFormData({ ...formData, buyer: { ...formData.buyer, name: e.target.value } })}
              />
              <FormInput
                label="Father / Husband Name"
                placeholder="e.g. Chaudhry Akhtar Ali"
                value={formData.buyer.fatherName}
                onChange={(e) => setFormData({ ...formData, buyer: { ...formData.buyer, fatherName: e.target.value } })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <FormInput
                label="Buyer CNIC Number"
                required
                placeholder="37405-1234567-1"
                value={formData.buyer.cnic}
                error={formErrors.buyerCnic}
                onChange={(e) => setFormData({ ...formData, buyer: { ...formData.buyer, cnic: e.target.value } })}
              />
              <FormInput
                label="Buyer Phone Number (WhatsApp)"
                required
                placeholder="+92 300 8472911"
                value={formData.buyer.phone}
                error={formErrors.buyerPhone}
                onChange={(e) => setFormData({ ...formData, buyer: { ...formData.buyer, phone: e.target.value } })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '14px' }}>
              <FormInput
                label="City"
                placeholder="Islamabad"
                value={formData.buyer.city}
                onChange={(e) => setFormData({ ...formData, buyer: { ...formData.buyer, city: e.target.value } })}
              />
              <FormInput
                label="Residential / Postal Address"
                placeholder="House 112, Street 18, F-10/2, Islamabad"
                value={formData.buyer.address}
                onChange={(e) => setFormData({ ...formData, buyer: { ...formData.buyer, address: e.target.value } })}
              />
            </div>

            {/* Witnesses for Sale Deed */}
            <div style={{ marginTop: '8px', borderTop: '1px solid #E2E8F0', paddingTop: '16px' }}>
              <div style={{ fontWeight: 800, fontSize: '0.875rem', color: '#334155', marginBottom: '12px' }}>
                Legal Sale Deed Witnesses (Optional for Spot Deal, Required for Biometric Deed)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B' }}>WITNESS 1 (FIRST PARTY)</span>
                  <FormInput
                    placeholder="Witness 1 Name"
                    value={formData.witnesses.w1Name}
                    onChange={(e) => setFormData({ ...formData, witnesses: { ...formData.witnesses, w1Name: e.target.value } })}
                  />
                  <FormInput
                    placeholder="Witness 1 CNIC"
                    value={formData.witnesses.w1Cnic}
                    onChange={(e) => setFormData({ ...formData, witnesses: { ...formData.witnesses, w1Cnic: e.target.value } })}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B' }}>WITNESS 2 (SECOND PARTY)</span>
                  <FormInput
                    placeholder="Witness 2 Name"
                    value={formData.witnesses.w2Name}
                    onChange={(e) => setFormData({ ...formData, witnesses: { ...formData.witnesses, w2Name: e.target.value } })}
                  />
                  <FormInput
                    placeholder="Witness 2 CNIC"
                    value={formData.witnesses.w2Cnic}
                    onChange={(e) => setFormData({ ...formData, witnesses: { ...formData.witnesses, w2Cnic: e.target.value } })}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: DEAL PRICING & PAYMENT */}
        {currentStep === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <CurrencyInput
                label="Agreed Sale Price (PKR)"
                required
                value={formData.salePrice}
                error={formErrors.salePrice}
                onChange={(val) => setFormData({ ...formData, salePrice: val })}
              />
              <FormInput
                label="Sale Date"
                type="date"
                required
                value={formData.saleDate}
                onChange={(e) => setFormData({ ...formData, saleDate: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <CurrencyInput
                label="Additional Charges (Transfer / Detailing)"
                value={formData.additionalCharges}
                onChange={(val) => setFormData({ ...formData, additionalCharges: val })}
              />
              <CurrencyInput
                label="Special Discount / Rebate (PKR)"
                value={formData.discount}
                error={formErrors.discount}
                onChange={(val) => setFormData({ ...formData, discount: val })}
              />
            </div>

            {/* Live Net Price Calculator Banner */}
            <div
              style={{
                padding: '14px 20px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #0F172A, #1E293B)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 700 }}>NET RECEIVABLE FROM BUYER</div>
                <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#F59E0B', fontFamily: 'var(--font-heading)' }}>
                  ₨ {netSalePrice.toLocaleString()}
                </div>
              </div>
              <div style={{ textAlign: 'right', fontSize: '0.8125rem', color: '#CBD5E1' }}>
                <div>Base Price: ₨ {salePriceNum.toLocaleString()}</div>
                <div>Discount: -₨ {discountNum.toLocaleString()}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <CurrencyInput
                label="Initial Advance / Down Payment Received (PKR)"
                required
                value={formData.amountReceived}
                error={formErrors.amountReceived}
                onChange={(val) => setFormData({ ...formData, amountReceived: val })}
              />
              <div className="form-group">
                <label className="form-label">Remaining Balance Due (Auto)</label>
                <input
                  className="form-input"
                  disabled
                  value={`₨ ${remainingBalance.toLocaleString()}`}
                  style={{
                    color: remainingBalance > 0 ? '#DC2626' : '#059669',
                    fontWeight: 800,
                    backgroundColor: remainingBalance > 0 ? '#FEF2F2' : '#ECFDF5',
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <Select
                label="Payment Method"
                required
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                options={[
                  { value: 'Cash in Hand', label: 'Cash in Hand (Counter)' },
                  { value: 'Bank Transfer (Meezan Bank)', label: 'Meezan Bank IBFT / RTGS' },
                  { value: 'Bank Transfer (HBL)', label: 'HBL Business Account IBFT' },
                  { value: 'Bank Cheque / Pay Order', label: 'Bank Cheque / Pay Order' },
                  { value: 'Online Banking Deposit', label: 'Online Deposit Slip' },
                ]}
              />
              <Select
                label="Deposit To Cash / Bank Account"
                required
                value={formData.accountDepositedTo}
                onChange={(e) => setFormData({ ...formData, accountDepositedTo: e.target.value })}
                options={[
                  { value: 'Cash in Hand (Counter)', label: 'Cash Drawer / Counter Safe' },
                  { value: 'Meezan Bank Current A/C', label: 'Meezan Bank Current A/C' },
                  { value: 'HBL Business Account', label: 'HBL Business Account' },
                ]}
              />
            </div>
          </div>
        )}

        {/* STEP 4: COMMISSION & BROKERAGE */}
        {currentStep === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Showroom Commission */}
            <div style={{ padding: '14px', borderRadius: '10px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
              <div style={{ fontWeight: 800, fontSize: '0.875rem', color: '#0F172A', marginBottom: '10px' }}>
                1. Showroom Deal Commission (Standard Showroom Fee)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <Select
                  label="Commission Mode"
                  value={formData.commission.showroomType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      commission: { ...formData.commission, showroomType: e.target.value },
                    })
                  }
                  options={[
                    { value: 'FIXED', label: 'Fixed Amount (PKR)' },
                    { value: 'PERCENTAGE', label: 'Percentage (%) of Net Sale' },
                  ]}
                />
                <FormInput
                  label={formData.commission.showroomType === 'PERCENTAGE' ? 'Percentage (%)' : 'Amount (PKR)'}
                  type="number"
                  value={formData.commission.showroomValue}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      commission: { ...formData.commission, showroomValue: e.target.value },
                    })
                  }
                />
                <div className="form-group">
                  <label className="form-label">Calculated Fee</label>
                  <input className="form-input" disabled value={`₨ ${showroomComm.toLocaleString()}`} style={{ fontWeight: 800 }} />
                </div>
              </div>
            </div>

            {/* External Broker Commission */}
            <div style={{ padding: '14px', borderRadius: '10px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
              <div style={{ fontWeight: 800, fontSize: '0.875rem', color: '#0F172A', marginBottom: '10px' }}>
                2. External Car Broker / Agent Commission (Third-Party)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: '12px' }}>
                <FormInput
                  label="Broker Name"
                  placeholder="e.g. Haji Zulfiqar"
                  value={formData.commission.brokerName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      commission: { ...formData.commission, brokerName: e.target.value },
                    })
                  }
                />
                <FormInput
                  label="Broker Phone"
                  placeholder="+92 301 6655443"
                  value={formData.commission.brokerPhone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      commission: { ...formData.commission, brokerPhone: e.target.value },
                    })
                  }
                />
                <Select
                  label="Mode"
                  value={formData.commission.brokerType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      commission: { ...formData.commission, brokerType: e.target.value },
                    })
                  }
                  options={[
                    { value: 'FIXED', label: 'Fixed (PKR)' },
                    { value: 'PERCENTAGE', label: 'Percentage (%)' },
                  ]}
                />
                <FormInput
                  label="Value"
                  type="number"
                  value={formData.commission.brokerValue}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      commission: { ...formData.commission, brokerValue: e.target.value },
                    })
                  }
                />
              </div>
              {brokerComm > 0 && (
                <div style={{ marginTop: '8px', fontSize: '0.8125rem', color: '#B45309', fontWeight: 700 }}>
                  Broker Commission Payable: ₨ {brokerComm.toLocaleString()}
                </div>
              )}
            </div>

            {/* Internal Salesman Commission */}
            <div style={{ padding: '14px', borderRadius: '10px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
              <div style={{ fontWeight: 800, fontSize: '0.875rem', color: '#0F172A', marginBottom: '10px' }}>
                3. Internal Staff / Salesman Reward
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '12px' }}>
                <FormInput
                  label="Sales Staff Name"
                  placeholder="e.g. Kamran (Showroom)"
                  value={formData.commission.agentName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      commission: { ...formData.commission, agentName: e.target.value },
                    })
                  }
                />
                <CurrencyInput
                  label="Reward Amount (PKR)"
                  value={formData.commission.agentValue}
                  onChange={(val) =>
                    setFormData({
                      ...formData,
                      commission: { ...formData.commission, agentValue: val },
                    })
                  }
                />
                <div className="form-group">
                  <label className="form-label">Calculated Staff Bonus</label>
                  <input className="form-input" disabled value={`₨ ${agentComm.toLocaleString()}`} style={{ fontWeight: 800 }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: SETTLEMENT & PROFIT AUDIT */}
        {currentStep === 5 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div
              style={{
                padding: '16px',
                borderRadius: '12px',
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
              }}
            >
              <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '12px' }}>
                Financial Deal Breakdown & Accounting Audit
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div style={{ padding: '12px', borderRadius: '8px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Asset Ownership Model</div>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>
                    {selectedVehicle?.ownershipType} Owned ({selectedVehicle?.ownerName || 'Showroom'})
                  </div>
                </div>

                <div style={{ padding: '12px', borderRadius: '8px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Payment Settlement Status</div>
                  <div
                    style={{
                      fontSize: '0.9375rem',
                      fontWeight: 800,
                      color: remainingBalance === 0 ? '#059669' : '#D97706',
                      marginTop: '2px',
                    }}
                  >
                    {remainingBalance === 0 ? 'Full Payment Cleared' : `Token Advance (₨ ${remainingBalance.toLocaleString()} Due)`}
                  </div>
                </div>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '8px 0', color: '#475569' }}>Gross Sale Price</td>
                    <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 700 }}>₨ {salePriceNum.toLocaleString()}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '8px 0', color: '#475569' }}>Special Deal Discount</td>
                    <td style={{ padding: '8px 0', textAlign: 'right', color: '#DC2626', fontWeight: 700 }}>- ₨ {discountNum.toLocaleString()}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '8px 0', color: '#475569' }}>Additional Processing / Transfer</td>
                    <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 700 }}>+ ₨ {additionalChargesNum.toLocaleString()}</td>
                  </tr>
                  <tr style={{ borderBottom: '2px solid #CBD5E1', background: '#F8FAFC' }}>
                    <td style={{ padding: '10px 8px', fontWeight: 800, color: '#0F172A' }}>Net Sale Receivable</td>
                    <td style={{ padding: '10px 8px', textAlign: 'right', fontWeight: 900, color: '#2563EB', fontSize: '1rem' }}>₨ {netSalePrice.toLocaleString()}</td>
                  </tr>

                  {isShowroomOwned ? (
                    <>
                      <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '8px 0', color: '#475569' }}>Showroom Acquisition Cost</td>
                        <td style={{ padding: '8px 0', textAlign: 'right', color: '#64748B' }}>- ₨ {costPriceNum.toLocaleString()}</td>
                      </tr>
                      {brokerComm > 0 && (
                        <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                          <td style={{ padding: '8px 0', color: '#475569' }}>Brokerage Payable ({formData.commission.brokerName || 'Broker'})</td>
                          <td style={{ padding: '8px 0', textAlign: 'right', color: '#B45309' }}>- ₨ {brokerComm.toLocaleString()}</td>
                        </tr>
                      )}
                      {agentComm > 0 && (
                        <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                          <td style={{ padding: '8px 0', color: '#475569' }}>Sales Staff Commission</td>
                          <td style={{ padding: '8px 0', textAlign: 'right', color: '#B45309' }}>- ₨ {agentComm.toLocaleString()}</td>
                        </tr>
                      )}
                      <tr style={{ background: '#ECFDF5' }}>
                        <td style={{ padding: '10px 8px', fontWeight: 800, color: '#065F46' }}>Realized Showroom Gross Profit</td>
                        <td style={{ padding: '10px 8px', textAlign: 'right', fontWeight: 900, color: '#059669', fontSize: '1.1rem' }}>
                          ₨ {grossProfit.toLocaleString()}
                        </td>
                      </tr>
                    </>
                  ) : (
                    <>
                      <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '8px 0', color: '#475569' }}>Owner Payable (Consignment Base Price)</td>
                        <td style={{ padding: '8px 0', textAlign: 'right', color: '#64748B' }}>₨ {ownerPayable.toLocaleString()}</td>
                      </tr>
                      <tr style={{ background: '#F5F3FF' }}>
                        <td style={{ padding: '10px 8px', fontWeight: 800, color: '#5B21B6' }}>Showroom Consignment Earnings</td>
                        <td style={{ padding: '10px 8px', textAlign: 'right', fontWeight: 900, color: '#6D28D9', fontSize: '1.1rem' }}>
                          ₨ {showroomNetEarnings.toLocaleString()}
                        </td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>

            <div className="form-group">
              <label className="form-label">Special Deal Notes & Settlement Terms</label>
              <textarea
                className="form-textarea"
                rows="2"
                placeholder="e.g. Biometric delivery scheduled on Monday. 2 original keys handed over."
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

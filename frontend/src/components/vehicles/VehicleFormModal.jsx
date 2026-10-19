import React, { useState, useEffect } from 'react';
import { Modal, FormInput, Select, CurrencyInput, ImageUploader } from '../ui';
import { Car, DollarSign, ShieldCheck, FileText, Image as ImageIcon, Check } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const VehicleFormModal = ({
  isOpen,
  onClose,
  onSave,
  vehicleToEdit = null,
}) => {
  const [activeTab, setActiveTab] = useState('specs');
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    make: 'Toyota',
    model: 'Corolla',
    variant: 'Altis Grande 1.8 CVT',
    modelYear: 2023,
    registrationNo: '',
    chassisNo: '',
    engineNo: '',
    colorExterior: 'Super White',
    colorInterior: 'Beige / Black',
    mileageKm: '35000',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    purchaseDate: new Date().toISOString().split('T')[0],
    saleDate: '',
    ownershipType: 'Showroom',
    ownerName: 'Ahsan Autos (Owned)',
    ownerPhone: '+92 300 1234567',
    costPrice: '6200000',
    demandPrice: '6950000',
    minPrice: '6800000',
    status: 'Available',
    locationBay: 'Bay A-2',
    keyNo: 'KEY-012',

    condition: {
      overallScore: '9.0 / 10',
      majorAccident: 'No',
      minorAccident: 'None / Bumper touchup',
      sixSeals: {
        bonnet: 'Intact Genuine',
        trunk: 'Intact Genuine',
        leftPillars: 'Intact Genuine',
        rightPillars: 'Intact Genuine',
        leftDoors: 'Intact Genuine',
        rightDoors: 'Intact Genuine',
      },
      frontCondition: 'Original',
      backCondition: 'Original',
      engine: '10/10 Excellent',
      suspension: 'Solid',
      ac: 'Chilling 100%',
      tyres: '80%',
      interior: 'Clean',
      exterior: 'Genuine Paint',
      notes: '',
    },

    documents: {
      registrationBook: 'Smart Card Available',
      receiptSalesDeed: 'Complete Original Transfer Deed',
      tokenTax: 'Paid up to June 2026',
      returnFile: 'Original File with Excise Verification',
      biometricStatus: 'Available on Spot',
      physicalLockerSafe: 'Safe #1 - Locker B-05',
      otherDocs: '2 Smart Keys & Booklets',
    },

    images: [],
  });

  useEffect(() => {
    if (vehicleToEdit) {
      setFormData({
        ...vehicleToEdit,
        costPrice: String(vehicleToEdit.costPrice || ''),
        demandPrice: String(vehicleToEdit.demandPrice || ''),
        minPrice: String(vehicleToEdit.minPrice || ''),
        mileageKm: String(vehicleToEdit.mileageKm || ''),
        condition: vehicleToEdit.condition || formData.condition,
        documents: vehicleToEdit.documents || formData.documents,
        images: vehicleToEdit.images || [],
      });
    } else {
      // Default reset
      setFormData((prev) => ({
        ...prev,
        registrationNo: '',
        chassisNo: '',
        engineNo: '',
        images: [],
      }));
    }
    setActiveTab('specs');
  }, [vehicleToEdit, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.make || !formData.model || !formData.chassisNo) {
      showToast('error', 'Please fill in Make, Model, and Chassis (VIN) number.', 'Required Fields');
      setActiveTab('specs');
      return;
    }

    try {
      onSave(formData);
    } catch (err) {
      showToast('error', err.message || 'Validation error saving vehicle', 'Save Failed');
    }
  };

  const updateCondition = (field, val) => {
    setFormData((prev) => ({
      ...prev,
      condition: { ...prev.condition, [field]: val },
    }));
  };

  const updateSeal = (sealKey, val) => {
    setFormData((prev) => ({
      ...prev,
      condition: {
        ...prev.condition,
        sixSeals: { ...prev.condition.sixSeals, [sealKey]: val },
      },
    }));
  };

  const updateDocument = (docKey, val) => {
    setFormData((prev) => ({
      ...prev,
      documents: { ...prev.documents, [docKey]: val },
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={vehicleToEdit ? `Edit Vehicle Asset: ${vehicleToEdit.stockCode}` : 'Register New Vehicle Asset'}
      subtitle="Complete asset onboarding with Pakistani market 6-seals inspection & document vault"
      maxWidth="780px"
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            <Check size={16} /> {vehicleToEdit ? 'Update Vehicle Record' : 'Save Vehicle to Showroom'}
          </button>
        </>
      }
    >
      {/* 5 Tab Navigation Bar */}
      <div
        style={{
          display: 'flex',
          gap: '6px',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '12px',
          marginBottom: '20px',
          overflowX: 'auto',
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab('specs')}
          className={`btn ${activeTab === 'specs' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ fontSize: '0.8125rem', padding: '6px 12px' }}
        >
          <Car size={15} /> 1. General Specs
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('valuation')}
          className={`btn ${activeTab === 'valuation' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ fontSize: '0.8125rem', padding: '6px 12px' }}
        >
          <DollarSign size={15} /> 2. Pricing & Owner
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('inspection')}
          className={`btn ${activeTab === 'inspection' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ fontSize: '0.8125rem', padding: '6px 12px' }}
        >
          <ShieldCheck size={15} /> 3. 6-Seals & Condition
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('documents')}
          className={`btn ${activeTab === 'documents' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ fontSize: '0.8125rem', padding: '6px 12px' }}
        >
          <FileText size={15} /> 4. Document Vault
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('photos')}
          className={`btn ${activeTab === 'photos' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ fontSize: '0.8125rem', padding: '6px 12px' }}
        >
          <ImageIcon size={15} /> 5. Photo Gallery
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* TAB 1: General Specs */}
        {activeTab === 'specs' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
              <FormInput
                label="Make / Manufacturer"
                required
                placeholder="Toyota, Honda, Suzuki, etc."
                value={formData.make}
                onChange={(e) => setFormData({ ...formData, make: e.target.value })}
              />
              <FormInput
                label="Model"
                required
                placeholder="Corolla, Fortuner, Civic"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              />
              <FormInput
                label="Variant / Package"
                placeholder="1.8 Grande, RS Turbo, Sigma 4"
                value={formData.variant}
                onChange={(e) => setFormData({ ...formData, variant: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
              <FormInput
                label="Model Year"
                type="number"
                required
                value={formData.modelYear}
                onChange={(e) => setFormData({ ...formData, modelYear: e.target.value })}
              />
              <FormInput
                label="Registration Number"
                placeholder="LEA-23-4589 or APPLIED FOR"
                value={formData.registrationNo}
                onChange={(e) => setFormData({ ...formData, registrationNo: e.target.value })}
              />
              <FormInput
                label="Chassis Number (VIN)"
                required
                placeholder="e.g. NZE141-9081234"
                value={formData.chassisNo}
                onChange={(e) => setFormData({ ...formData, chassisNo: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
              <FormInput
                label="Engine Number"
                placeholder="e.g. 1GD-8876543"
                value={formData.engineNo}
                onChange={(e) => setFormData({ ...formData, engineNo: e.target.value })}
              />
              <FormInput
                label="Exterior Color"
                value={formData.colorExterior}
                onChange={(e) => setFormData({ ...formData, colorExterior: e.target.value })}
              />
              <FormInput
                label="Interior Color"
                value={formData.colorInterior}
                onChange={(e) => setFormData({ ...formData, colorInterior: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
              <FormInput
                label="Mileage (KM)"
                type="number"
                value={formData.mileageKm}
                onChange={(e) => setFormData({ ...formData, mileageKm: e.target.value })}
              />
              <Select
                label="Fuel Type"
                value={formData.fuelType}
                onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                options={[
                  { value: 'Petrol', label: 'Petrol' },
                  { value: 'Diesel', label: 'Diesel' },
                  { value: 'Hybrid', label: 'Hybrid' },
                  { value: 'Electric', label: 'Electric (EV)' },
                  { value: 'CNG', label: 'CNG' },
                ]}
              />
              <Select
                label="Transmission"
                value={formData.transmission}
                onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
                options={[
                  { value: 'Automatic', label: 'Automatic' },
                  { value: 'Manual', label: 'Manual' },
                  { value: 'CVT', label: 'CVT' },
                  { value: 'DCT', label: 'DCT' },
                ]}
              />
            </div>
          </div>
        )}

        {/* TAB 2: Valuation, Pricing & Ownership */}
        {activeTab === 'valuation' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <Select
                label="Ownership Model"
                required
                value={formData.ownershipType}
                onChange={(e) => setFormData({ ...formData, ownershipType: e.target.value })}
                options={[
                  { value: 'Showroom', label: 'Showroom Owned (Direct Purchase)' },
                  { value: 'Client', label: 'Client Consignment (Brokerage)' },
                  { value: 'Investor', label: 'Investor Funded (ROI Split)' },
                ]}
              />
              <Select
                label="Inventory Status"
                required
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                options={[
                  { value: 'Available', label: 'Available (On Display)' },
                  { value: 'Reserved', label: 'Reserved (Token Advance)' },
                  { value: 'In Workshop', label: 'In Workshop (Repairs/Detailing)' },
                  { value: 'Pending Documentation', label: 'Pending Documentation' },
                  { value: 'On Commission', label: 'On Commission' },
                  { value: 'Sold', label: 'Sold' },
                  { value: 'Purchased', label: 'Purchased' },
                  { value: 'Returned', label: 'Returned to Owner' },
                  { value: 'Cancelled', label: 'Cancelled' },
                ]}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <FormInput
                label="Owner / Consignor Name"
                value={formData.ownerName}
                onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
              />
              <FormInput
                label="Owner Phone Number"
                value={formData.ownerPhone}
                onChange={(e) => setFormData({ ...formData, ownerPhone: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
              <CurrencyInput
                label="Acquisition Cost Price"
                value={formData.costPrice}
                onChange={(val) => setFormData({ ...formData, costPrice: val })}
              />
              <CurrencyInput
                label="Demand Asking Price"
                required
                value={formData.demandPrice}
                onChange={(val) => setFormData({ ...formData, demandPrice: val })}
              />
              <CurrencyInput
                label="Floor Minimum Price"
                value={formData.minPrice}
                onChange={(val) => setFormData({ ...formData, minPrice: val })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <FormInput
                label="Showroom Display Bay / Lot"
                value={formData.locationBay}
                onChange={(e) => setFormData({ ...formData, locationBay: e.target.value })}
              />
              <FormInput
                label="Key Tag Number"
                value={formData.keyNo}
                onChange={(e) => setFormData({ ...formData, keyNo: e.target.value })}
              />
            </div>
          </div>
        )}

        {/* TAB 3: Condition & 6-Seals Checklist */}
        {activeTab === 'inspection' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
              <FormInput
                label="Overall Inspection Score"
                value={formData.condition?.overallScore}
                onChange={(e) => updateCondition('overallScore', e.target.value)}
              />
              <Select
                label="Major Accident History"
                value={formData.condition?.majorAccident}
                onChange={(e) => updateCondition('majorAccident', e.target.value)}
                options={[
                  { value: 'No', label: 'No (Accident Free)' },
                  { value: 'Yes', label: 'Yes (Accidental History)' },
                ]}
              />
              <FormInput
                label="Tyres Tread Life (%)"
                value={formData.condition?.tyres}
                onChange={(e) => updateCondition('tyres', e.target.value)}
              />
            </div>

            {/* 6 Seals Inputs */}
            <div className="surface-card" style={{ padding: '16px', background: 'var(--bg-surface-elevated)' }}>
              <h5 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--brand-emerald)', marginBottom: '12px' }}>
                6-Seals Checklist
              </h5>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <FormInput
                  label="1. Bonnet Seal"
                  value={formData.condition?.sixSeals?.bonnet}
                  onChange={(e) => updateSeal('bonnet', e.target.value)}
                />
                <FormInput
                  label="2. Trunk / Diggi Seal"
                  value={formData.condition?.sixSeals?.trunk}
                  onChange={(e) => updateSeal('trunk', e.target.value)}
                />
                <FormInput
                  label="3. Left A-B-C Pillars"
                  value={formData.condition?.sixSeals?.leftPillars}
                  onChange={(e) => updateSeal('leftPillars', e.target.value)}
                />
                <FormInput
                  label="4. Right A-B-C Pillars"
                  value={formData.condition?.sixSeals?.rightPillars}
                  onChange={(e) => updateSeal('rightPillars', e.target.value)}
                />
                <FormInput
                  label="5. Left 2 Door Seals"
                  value={formData.condition?.sixSeals?.leftDoors}
                  onChange={(e) => updateSeal('leftDoors', e.target.value)}
                />
                <FormInput
                  label="6. Right 2 Door Seals"
                  value={formData.condition?.sixSeals?.rightDoors}
                  onChange={(e) => updateSeal('rightDoors', e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <FormInput
                label="Engine Health & Compression"
                value={formData.condition?.engine}
                onChange={(e) => updateCondition('engine', e.target.value)}
              />
              <FormInput
                label="Air Conditioning (AC)"
                value={formData.condition?.ac}
                onChange={(e) => updateCondition('ac', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Inspector Remarks & Notes</label>
              <textarea
                className="form-input"
                rows={3}
                value={formData.condition?.notes}
                onChange={(e) => updateCondition('notes', e.target.value)}
              />
            </div>
          </div>
        )}

        {/* TAB 4: Document Vault */}
        {activeTab === 'documents' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <FormInput
                label="Registration Book / Smart Card"
                value={formData.documents?.registrationBook}
                onChange={(e) => updateDocument('registrationBook', e.target.value)}
              />
              <FormInput
                label="Excise Token / Road Tax Status"
                value={formData.documents?.tokenTax}
                onChange={(e) => updateDocument('tokenTax', e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <FormInput
                label="Return File / Original Invoice"
                value={formData.documents?.returnFile}
                onChange={(e) => updateDocument('returnFile', e.target.value)}
              />
              <FormInput
                label="Biometric Transfer Status"
                value={formData.documents?.biometricStatus}
                onChange={(e) => updateDocument('biometricStatus', e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <FormInput
                label="Physical Safe Locker Location"
                value={formData.documents?.physicalLockerSafe}
                onChange={(e) => updateDocument('physicalLockerSafe', e.target.value)}
                placeholder="e.g. Safe #1 - Locker B-04"
              />
              <FormInput
                label="Other Documents / Keys"
                value={formData.documents?.otherDocs}
                onChange={(e) => updateDocument('otherDocs', e.target.value)}
              />
            </div>
          </div>
        )}

        {/* TAB 5: Photo Gallery */}
        {activeTab === 'photos' && (
          <div>
            <ImageUploader
              images={formData.images}
              onChange={(imgs) => setFormData({ ...formData, images: imgs })}
              maxImages={12}
            />
          </div>
        )}
      </form>
    </Modal>
  );
};

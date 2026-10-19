import React, { useState } from 'react';
import { Modal, Select } from '../ui';
import { VehicleInspectionReport } from './VehicleInspectionReport';
import { VehicleDocumentVault } from './VehicleDocumentVault';
import { VehicleGalleryViewer } from './VehicleGalleryViewer';
import { VehicleHistoryTimeline } from './VehicleHistoryTimeline';
import { Car, ShieldCheck, FileText, Image as ImageIcon, History, Edit, Share2, Printer, CheckCircle2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const VehicleDossierModal = ({
  isOpen,
  onClose,
  vehicle,
  onEdit,
  onStatusChange,
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const { showToast } = useToast();

  if (!vehicle) return null;

  const handleShareWhatsApp = () => {
    const text = `*Ahsan Autos Showroom - Vehicle Dossier*\n*${vehicle.make} ${vehicle.model} ${vehicle.variant || ''} (${vehicle.modelYear})*\n• Reg Plate: ${vehicle.registrationNo || 'APPLIED FOR'}\n• Chassis VIN: ${vehicle.chassisNo}\n• Mileage: ${Number(vehicle.mileageKm).toLocaleString()} KM\n• Transmission: ${vehicle.transmission} | Fuel: ${vehicle.fuelType}\n• Demand Asking: PKR ${Number(vehicle.demandPrice).toLocaleString()}\n• 6-Seals Condition: ${vehicle.condition?.overallScore || 'Certified Genuine'}\n• Safe Locker: ${vehicle.documents?.physicalLockerSafe || 'Safe 1'}\n\nContact Ahsan Autos: +92 300 1234567`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    showToast('success', 'Generated WhatsApp vehicle dossier link!', 'WhatsApp Share');
  };

  const getStatusBadge = (st) => {
    switch (st) {
      case 'Available':
        return <span className="badge badge-available">Available</span>;
      case 'Reserved':
        return <span className="badge badge-booked">Reserved</span>;
      case 'Sold':
        return <span className="badge badge-sold">Sold</span>;
      case 'In Workshop':
        return <span className="badge badge-inspection">In Workshop</span>;
      default:
        return <span className="badge badge-ownership-showroom">{st}</span>;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${vehicle.make} ${vehicle.model} ${vehicle.variant || ''}`}
      subtitle={`Stock Code: ${vehicle.stockCode} • Chassis VIN: ${vehicle.chassisNo}`}
      maxWidth="860px"
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Quick Status:</span>
            <select
              className="form-select"
              style={{ width: 'auto', padding: '4px 8px', height: '32px', fontSize: '0.75rem' }}
              value={vehicle.status}
              onChange={(e) => onStatusChange(vehicle.id, e.target.value)}
            >
              <option value="Available">Available</option>
              <option value="Reserved">Reserved</option>
              <option value="In Workshop">In Workshop</option>
              <option value="Pending Documentation">Pending Documentation</option>
              <option value="On Commission">On Commission</option>
              <option value="Sold">Sold</option>
              <option value="Returned">Returned</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-emerald" onClick={handleShareWhatsApp}>
              <Share2 size={15} /> WhatsApp Specs
            </button>
            <button className="btn btn-secondary" onClick={() => onEdit(vehicle)}>
              <Edit size={15} /> Edit Record
            </button>
            <button className="btn btn-primary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      }
    >
      {/* Top Asset Summary Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '14px 18px',
          background: 'var(--bg-surface-elevated)',
          borderRadius: 'var(--radius-md)',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {getStatusBadge(vehicle.status)}
          <span className="badge badge-ownership-showroom">
            {vehicle.ownershipType} Owned
          </span>
          <span style={{ fontSize: '0.8125rem', color: 'var(--brand-gold)', fontWeight: 600 }}>
            Reg: {vehicle.registrationNo || 'APPLIED FOR'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Asking Demand:</span>
          <span style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--brand-gold)', fontFamily: 'var(--font-heading)' }}>
            ₨ {Number(vehicle.demandPrice).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '6px',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '10px',
          marginBottom: '20px',
          overflowX: 'auto',
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`btn ${activeTab === 'overview' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ fontSize: '0.8125rem', padding: '6px 12px' }}
        >
          <Car size={15} /> Vehicle Specs
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('inspection')}
          className={`btn ${activeTab === 'inspection' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ fontSize: '0.8125rem', padding: '6px 12px' }}
        >
          <ShieldCheck size={15} /> 6-Seals Inspection
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('documents')}
          className={`btn ${activeTab === 'documents' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ fontSize: '0.8125rem', padding: '6px 12px' }}
        >
          <FileText size={15} /> Documents & Locker
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('gallery')}
          className={`btn ${activeTab === 'gallery' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ fontSize: '0.8125rem', padding: '6px 12px' }}
        >
          <ImageIcon size={15} /> Photo Gallery ({vehicle.images?.length || 0})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('history')}
          className={`btn ${activeTab === 'history' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ fontSize: '0.8125rem', padding: '6px 12px' }}
        >
          <History size={15} /> Status Timeline
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', fontSize: '0.875rem' }}>
            <div className="surface-card" style={{ padding: '12px 14px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Make & Model</div>
              <div style={{ fontWeight: 700, color: '#FFF' }}>{vehicle.make} {vehicle.model}</div>
            </div>
            <div className="surface-card" style={{ padding: '12px 14px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Variant / Package</div>
              <div style={{ fontWeight: 700, color: '#FFF' }}>{vehicle.variant || 'Standard'}</div>
            </div>
            <div className="surface-card" style={{ padding: '12px 14px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Model Year</div>
              <div style={{ fontWeight: 700, color: '#FFF' }}>{vehicle.modelYear}</div>
            </div>
            <div className="surface-card" style={{ padding: '12px 14px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Chassis Number (VIN)</div>
              <div style={{ fontWeight: 700, fontFamily: 'monospace', color: 'var(--brand-gold)' }}>{vehicle.chassisNo}</div>
            </div>
            <div className="surface-card" style={{ padding: '12px 14px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Engine Number</div>
              <div style={{ fontWeight: 700, fontFamily: 'monospace', color: '#FFF' }}>{vehicle.engineNo || 'Verified'}</div>
            </div>
            <div className="surface-card" style={{ padding: '12px 14px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Mileage</div>
              <div style={{ fontWeight: 700, color: '#FFF' }}>{Number(vehicle.mileageKm).toLocaleString()} KM</div>
            </div>
            <div className="surface-card" style={{ padding: '12px 14px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Fuel & Transmission</div>
              <div style={{ fontWeight: 700, color: '#FFF' }}>{vehicle.fuelType} • {vehicle.transmission}</div>
            </div>
            <div className="surface-card" style={{ padding: '12px 14px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Colors (Ext / Int)</div>
              <div style={{ fontWeight: 700, color: '#FFF' }}>{vehicle.colorExterior} / {vehicle.colorInterior}</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="surface-card" style={{ padding: '14px 16px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--brand-gold)', marginBottom: '4px' }}>
                SHOWROOM LOGISTICS & KEYS
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                <div><strong>Location Bay:</strong> {vehicle.locationBay || 'Main Floor'}</div>
                <div><strong>Key Tag:</strong> {vehicle.keyNo || 'Key Rack'}</div>
                <div><strong>Purchase Date:</strong> {vehicle.purchaseDate || 'N/A'}</div>
                {vehicle.saleDate && <div><strong>Sale Date:</strong> {vehicle.saleDate}</div>}
              </div>
            </div>

            <div className="surface-card" style={{ padding: '14px 16px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--brand-blue)', marginBottom: '4px' }}>
                OWNER & CONSIGNOR DETAILS
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                <div><strong>Ownership:</strong> {vehicle.ownershipType}</div>
                <div><strong>Name:</strong> {vehicle.ownerName || 'Ahsan Autos'}</div>
                <div><strong>Contact:</strong> {vehicle.ownerPhone || '+92 300 1234567'}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'inspection' && (
        <VehicleInspectionReport condition={vehicle.condition} />
      )}

      {activeTab === 'documents' && (
        <VehicleDocumentVault documents={vehicle.documents} vehicle={vehicle} />
      )}

      {activeTab === 'gallery' && (
        <VehicleGalleryViewer images={vehicle.images} />
      )}

      {activeTab === 'history' && (
        <VehicleHistoryTimeline vehicleId={vehicle.id} />
      )}
    </Modal>
  );
};

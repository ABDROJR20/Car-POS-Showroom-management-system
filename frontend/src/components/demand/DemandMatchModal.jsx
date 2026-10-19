import React, { useState } from 'react';
import { Modal } from '../ui';
import { demandService } from '../../services/demandService';
import {
  Sparkles,
  CheckCircle2,
  Share2,
  Phone,
  Car,
  ShoppingCart,
  DollarSign,
  AlertCircle,
  Tag,
  ArrowRight,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const DemandMatchModal = ({
  isOpen,
  onClose,
  demand,
  onStatusChange,
  onLaunchSale,
}) => {
  const { showToast } = useToast();
  if (!demand) return null;

  const matches = demandService.findMatchesForDemand(demand);

  const handleWhatsAppFollowup = (matchedCar) => {
    const text = encodeURIComponent(
      `*AHSAN AUTOS - MATCHED VEHICLE FOUND*\n` +
      `----------------------------------------\n` +
      `Dear ${demand.customer},\n` +
      `Good news! We have an available vehicle matching your demand for *${demand.make} ${demand.model}*:\n\n` +
      `*Vehicle:* ${matchedCar.make} ${matchedCar.model} ${matchedCar.variant || ''} (${matchedCar.modelYear})\n` +
      `*Reg Plate:* ${matchedCar.registrationNo}\n` +
      `*Mileage:* ${Number(matchedCar.mileageKm).toLocaleString()} km\n` +
      `*Color:* ${matchedCar.colorExterior}\n` +
      `*Demand Price:* PKR ${Number(matchedCar.demandPrice || matchedCar.costPrice).toLocaleString()}\n` +
      `*Showroom Location:* Main Boulevard, G-8 Markaz, Islamabad\n\n` +
      `Please let us know when you would like to visit for a physical inspection & test drive.\n` +
      `Ahsan Autos Helpline: +92 300 1234567`
    );
    window.open(`https://wa.me/${demand.phone.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
    showToast('success', 'WhatsApp lead follow-up link generated!', 'WhatsApp Sent');
  };

  const handleMarkMatched = (matchedCar) => {
    demandService.updateStatus(
      demand.id,
      'Matched',
      matchedCar.id,
      `${matchedCar.make} ${matchedCar.model} (${matchedCar.modelYear}) • ${matchedCar.registrationNo}`
    );
    onStatusChange();
    showToast('success', `Demand ${demand.id} marked as MATCHED with ${matchedCar.registrationNo}!`, 'Match Recorded');
  };

  const handleMarkPurchased = () => {
    demandService.updateStatus(demand.id, 'Purchased', demand.matchedVehicleId, demand.matchedVehicleSummary);
    onStatusChange();
    showToast('success', `Demand ${demand.id} marked as PURCHASED / CLOSED!`, 'Deal Won');
  };

  const handleCloseDemand = () => {
    demandService.updateStatus(demand.id, 'Closed', null, '');
    onStatusChange();
    showToast('info', `Demand ${demand.id} marked as CLOSED.`, 'Demand Closed');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Automated Inventory Matchmaker • ${demand.id}`}
      subtitle={`Scanning available showroom stock for ${demand.customer}'s inquiry`}
      maxWidth="860px"
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {demand.status !== 'Closed' && (
              <button type="button" className="btn btn-secondary" onClick={handleCloseDemand} style={{ fontSize: '0.8125rem' }}>
                Close Inquiry
              </button>
            )}
            {demand.status !== 'Purchased' && (
              <button type="button" className="btn btn-emerald" onClick={handleMarkPurchased} style={{ fontSize: '0.8125rem' }}>
                <CheckCircle2 size={14} /> Mark as Deal Won / Purchased
              </button>
            )}
          </div>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      }
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '20px' }}>
        {/* Left Column: Customer Requirement Dossier */}
        <div
          style={{
            padding: '18px',
            borderRadius: '12px',
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>
              CUSTOMER REQUIREMENT
            </span>
            <span
              className={`badge ${
                demand.status === 'Matched'
                  ? 'badge-available'
                  : demand.status === 'Purchased'
                  ? 'badge-sold'
                  : 'badge-booked'
              }`}
            >
              {demand.status}
            </span>
          </div>

          <div>
            <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0F172A' }}>
              {demand.make} {demand.model}
            </div>
            <div style={{ fontSize: '0.8125rem', color: '#2563EB', fontWeight: 700 }}>
              {demand.variant || 'Any Variant'}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8125rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748B' }}>Model Year:</span>
              <strong>{demand.minYear} – {demand.maxYear}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748B' }}>Target Budget:</span>
              <strong style={{ color: '#059669' }}>
                {demand.budget > 0 ? `₨ ${Number(demand.budget).toLocaleString()}` : 'Flexible / Market'}
              </strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748B' }}>Transmission:</span>
              <strong>{demand.transmission}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748B' }}>Fuel Type:</span>
              <strong>{demand.fuelType}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748B' }}>Color:</span>
              <strong>{demand.color}</strong>
            </div>
          </div>

          <div style={{ borderTop: '1px dashed #CBD5E1', paddingTop: '10px' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700 }}>PROSPECTIVE BUYER</div>
            <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.9375rem', marginTop: '2px' }}>
              {demand.customer}
            </div>
            <div style={{ fontSize: '0.8125rem', color: '#059669', fontWeight: 700 }}>
              {demand.phone} ({demand.city || 'Islamabad'})
            </div>
          </div>

          {demand.notes && (
            <div style={{ padding: '8px 10px', borderRadius: '6px', background: '#FFFFFF', border: '1px solid #E2E8F0', fontSize: '0.75rem', color: '#475569' }}>
              <strong>Notes:</strong> {demand.notes}
            </div>
          )}
        </div>

        {/* Right Column: Matched Showroom Inventory */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Sparkles size={18} color="#D97706" />
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Showroom Inventory Matches ({matches.length})
            </h3>
          </div>

          {matches.length === 0 ? (
            <div
              style={{
                padding: '30px',
                textAlign: 'center',
                background: '#F8FAFC',
                borderRadius: '10px',
                border: '1px dashed #CBD5E1',
                color: '#64748B',
              }}
            >
              <AlertCircle size={32} style={{ margin: '0 auto 8px', color: '#94A3B8' }} />
              <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>No Immediate Match on Floor</div>
              <div style={{ fontSize: '0.8125rem', marginTop: '4px' }}>
                No active car in inventory currently matches {demand.make} {demand.model} ({demand.minYear}-{demand.maxYear}).
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '420px', overflowY: 'auto' }}>
              {matches.map(({ vehicle: car, score, reasons }) => {
                const isCurrentlyLinked = String(demand.matchedVehicleId) === String(car.id);
                return (
                  <div
                    key={car.id}
                    style={{
                      padding: '14px',
                      borderRadius: '10px',
                      background: isCurrentlyLinked ? '#EFF6FF' : '#FFFFFF',
                      border: `1.5px solid ${isCurrentlyLinked ? '#2563EB' : '#E2E8F0'}`,
                      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}
                  >
                    {/* Top Row: Reg No + Score Badge */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0F172A' }}>
                        {car.registrationNo}
                      </span>
                      <span
                        style={{
                          fontSize: '0.6875rem',
                          fontWeight: 800,
                          padding: '2px 8px',
                          borderRadius: '9999px',
                          background: score >= 80 ? '#ECFDF5' : '#FFFBEB',
                          color: score >= 80 ? '#065F46' : '#92400E',
                        }}
                      >
                        ⚡ {score}% Match
                      </span>
                    </div>

                    {/* Car Title & Price */}
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.9375rem', color: '#0F172A' }}>
                        {car.make} {car.model} {car.variant} ({car.modelYear})
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                        {car.colorExterior} • {car.fuelType} • {car.transmission} • {Number(car.mileageKm).toLocaleString()} km
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F1F5F9', paddingTop: '6px' }}>
                      <div>
                        <span style={{ fontSize: '0.6875rem', color: '#64748B' }}>Demand Price: </span>
                        <span style={{ fontWeight: 900, color: '#059669', fontSize: '0.9375rem' }}>
                          ₨ {Number(car.demandPrice || car.costPrice).toLocaleString()}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          type="button"
                          className="btn btn-emerald"
                          style={{ padding: '5px 8px', fontSize: '0.75rem' }}
                          title="WhatsApp Car Info to Customer"
                          onClick={() => handleWhatsAppFollowup(car)}
                        >
                          <Share2 size={12} /> WhatsApp
                        </button>

                        {!isCurrentlyLinked ? (
                          <button
                            type="button"
                            className="btn btn-primary"
                            style={{ padding: '5px 8px', fontSize: '0.75rem' }}
                            onClick={() => handleMarkMatched(car)}
                          >
                            <CheckCircle2 size={12} /> Link Match
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="btn btn-blue"
                            style={{ padding: '5px 8px', fontSize: '0.75rem' }}
                            onClick={() => onLaunchSale(car, demand)}
                          >
                            <ShoppingCart size={12} /> Sell Now
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

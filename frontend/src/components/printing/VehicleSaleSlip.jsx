import React from 'react';

export const VehicleSaleSlip = ({ sale, vehicle, settings }) => {
  if (!sale && !vehicle) return null;

  const carData = vehicle || {};
  const make = carData.make || sale?.vehicleSummary?.split(' ')[0] || 'Toyota';
  const model = carData.model || sale?.vehicleSummary?.split(' ')[1] || 'Corolla';
  const variant = carData.variant || 'Altis Grande 1.8';
  const regNo = carData.registrationNo || sale?.vehicleSummary?.split('•')[1] || 'ICT-23-9001';
  const buyerName = sale?.buyer?.name || 'Authorized Buyer';
  const saleDate = sale?.saleDate || new Date().toISOString().split('T')[0];

  return (
    <div
      className="print-document vehicle-delivery-slip"
      style={{
        width: '100%',
        maxWidth: '680px',
        margin: '0 auto',
        padding: '32px 28px',
        backgroundColor: '#FFFFFF',
        color: '#000000',
        fontFamily: 'sans-serif',
        lineHeight: 1.5,
        border: '2px solid #000000',
        borderRadius: '8px',
        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.08)',
      }}
    >
      {/* Top Showroom Header with Logo */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #000000', paddingBottom: '14px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              background: '#000000',
              color: '#FFFFFF',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '1.5rem',
            }}
          >
            A
          </div>
          <div>
            <div style={{ fontSize: '1.35rem', fontWeight: 900, letterSpacing: '1px', textTransform: 'uppercase' }}>
              {settings.showroomName || 'AHSAN AUTOS'}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#444' }}>
              {settings.address} • Ph: {settings.phone}
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div
            style={{
              display: 'inline-block',
              padding: '4px 12px',
              border: '1.5px solid #000',
              fontWeight: 800,
              fontSize: '0.8125rem',
              textTransform: 'uppercase',
            }}
          >
            VEHICLE GATE PASS / SALE SLIP
          </div>
          <div style={{ fontSize: '0.75rem', marginTop: '4px' }}>
            Slip #: <strong>{sale?.id || 'SLIP-2026'}</strong>
          </div>
        </div>
      </div>

      {/* Slip Intro */}
      <div style={{ fontSize: '0.875rem', marginBottom: '14px' }}>
        This document serves as an official physical delivery slip and showroom gate pass for the following vehicle:
      </div>

      {/* Vehicle Particulars Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', marginBottom: '18px' }}>
        <tbody>
          <tr style={{ border: '1px solid #000' }}>
            <td style={{ padding: '8px 10px', background: '#F1F5F9', fontWeight: 'bold', width: '25%' }}>Car Make / Company:</td>
            <td style={{ padding: '8px 10px', width: '25%' }}><strong>{make}</strong></td>
            <td style={{ padding: '8px 10px', background: '#F1F5F9', fontWeight: 'bold', width: '25%' }}>Model / Year:</td>
            <td style={{ padding: '8px 10px', width: '25%' }}><strong>{model} ({carData.modelYear || 2023})</strong></td>
          </tr>
          <tr style={{ border: '1px solid #000' }}>
            <td style={{ padding: '8px 10px', background: '#F1F5F9', fontWeight: 'bold' }}>Variant / Trim:</td>
            <td style={{ padding: '8px 10px' }}>{variant}</td>
            <td style={{ padding: '8px 10px', background: '#F1F5F9', fontWeight: 'bold' }}>Registration Plate:</td>
            <td style={{ padding: '8px 10px', fontWeight: 'bold', fontSize: '0.95rem' }}>{regNo}</td>
          </tr>
          <tr style={{ border: '1px solid #000' }}>
            <td style={{ padding: '8px 10px', background: '#F1F5F9', fontWeight: 'bold' }}>Chassis (VIN):</td>
            <td style={{ padding: '8px 10px' }}>{carData.chassisNo || 'OEM VERIFIED'}</td>
            <td style={{ padding: '8px 10px', background: '#F1F5F9', fontWeight: 'bold' }}>Engine Number:</td>
            <td style={{ padding: '8px 10px' }}>{carData.engineNo || 'OEM VERIFIED'}</td>
          </tr>
          <tr style={{ border: '1px solid #000' }}>
            <td style={{ padding: '8px 10px', background: '#F1F5F9', fontWeight: 'bold' }}>Buyer Name:</td>
            <td style={{ padding: '8px 10px' }}><strong>{buyerName}</strong></td>
            <td style={{ padding: '8px 10px', background: '#F1F5F9', fontWeight: 'bold' }}>Sale / Delivery Date:</td>
            <td style={{ padding: '8px 10px' }}><strong>{saleDate}</strong></td>
          </tr>
        </tbody>
      </table>

      {/* Security & Gate Pass Authorization */}
      <div style={{ padding: '12px 14px', border: '1px dashed #000', borderRadius: '6px', marginBottom: '24px', fontSize: '0.8125rem' }}>
        <strong>Gate Security Authorization:</strong> The security gate warden is authorized to permit the exit of the above mentioned vehicle. All verified documentation and keys have been officially transferred.
      </div>

      {/* Signatures Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', textAlign: 'center', fontSize: '0.75rem', marginTop: '30px' }}>
        <div>
          <div style={{ borderTop: '1.5px solid #000', paddingTop: '4px' }}>
            <strong>Showroom Manager</strong>
          </div>
        </div>
        <div>
          <div style={{ borderTop: '1.5px solid #000', paddingTop: '4px' }}>
            <strong>Buyer / Recipient</strong>
          </div>
        </div>
        <div>
          <div style={{ borderTop: '1.5px solid #000', paddingTop: '4px' }}>
            <strong>Security Gate Officer</strong>
          </div>
        </div>
      </div>

      {/* Footer Socials from Settings */}
      <div
        style={{
          borderTop: '1.5px solid #000',
          marginTop: '24px',
          paddingTop: '10px',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.8125rem',
          fontWeight: 'bold',
        }}
      >
        <div>TikTok: {settings.social?.tiktok || '@ahsan_autos'}</div>
        <div>Instagram: {settings.social?.instagram || '@ahsanautos_official'}</div>
        <div>Official Dealership Slip</div>
      </div>
    </div>
  );
};

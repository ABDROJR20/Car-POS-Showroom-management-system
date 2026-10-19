import React, { useState } from 'react';
import { Modal } from '../ui';
import { Printer, FileText, Share2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const PurchaseReceiptModal = ({
  isOpen,
  onClose,
  purchase,
}) => {
  const [printFormat, setPrintFormat] = useState('A4_DEED');
  const { showToast } = useToast();

  if (!purchase) return null;

  const handlePrint = () => {
    window.print();
    showToast('success', 'Sent acquisition deed to printer.', 'Printing');
  };

  const handleShareWhatsApp = () => {
    const text = `*Ahsan Autos - Vehicle Purchase Voucher*\n*Voucher #:* ${purchase.id}\n*Seller:* ${purchase.seller?.name} (${purchase.seller?.phone})\n*Vehicle:* ${purchase.vehicleSummary}\n*Agreed Price:* PKR ${Number(purchase.purchasePrice).toLocaleString()}\n*Amount Paid:* PKR ${Number(purchase.amountPaid).toLocaleString()}\n*Balance Due:* PKR ${Number(purchase.remainingAmount).toLocaleString()}\n*Date:* ${purchase.purchaseDate}\n\nAhsan Autos Showroom Lahore`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    showToast('success', 'WhatsApp purchase voucher link created!', 'WhatsApp Sent');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Purchase Voucher: ${purchase.id}`}
      subtitle="Official legal acquisition agreement and payment slip"
      maxWidth="820px"
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              className={printFormat === 'A4_DEED' ? 'btn btn-primary' : 'btn btn-secondary'}
              onClick={() => setPrintFormat('A4_DEED')}
              style={{ fontSize: '0.8125rem' }}
            >
              <FileText size={15} /> A4 Legal Deed
            </button>
            <button
              type="button"
              className={printFormat === 'THERMAL' ? 'btn btn-primary' : 'btn btn-secondary'}
              onClick={() => setPrintFormat('THERMAL')}
              style={{ fontSize: '0.8125rem' }}
            >
              <Printer size={15} /> 80mm Thermal Slip
            </button>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="button" className="btn btn-emerald" onClick={handleShareWhatsApp}>
              <Share2 size={15} /> Share WhatsApp
            </button>
            <button type="button" className="btn btn-primary" onClick={handlePrint}>
              <Printer size={15} /> Print Now
            </button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      }
    >
      {/* Printable Paper Canvas */}
      <div
        style={{
          background: '#FFF',
          color: '#000',
          padding: printFormat === 'A4_DEED' ? '40px 36px' : '20px 16px',
          maxWidth: printFormat === 'A4_DEED' ? '740px' : '360px',
          margin: '0 auto',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
          fontFamily: 'sans-serif',
          lineHeight: 1.5,
        }}
        id="purchase-receipt-print"
      >
        {/* Header */}
        <div style={{ textAlign: 'center', borderBottom: '2px solid #000', paddingBottom: '10px', marginBottom: '14px' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 900, letterSpacing: '1px', textTransform: 'uppercase' }}>
            AHSAN AUTOS SHOWROOM
          </h2>
          <p style={{ fontSize: '0.75rem', color: '#444' }}>
            Plot 42-B, Main Automobile Boulevard, Lahore | Ph: +92 300 1234567
          </p>
          <div style={{ marginTop: '6px', fontWeight: 700, fontSize: '0.875rem', textDecoration: 'underline' }}>
            {printFormat === 'A4_DEED' ? 'LEGAL VEHICLE PURCHASE & INWARD ACQUISITION DEED' : 'PURCHASE OUTFLOW VOUCHER'}
          </div>
        </div>

        {/* Voucher & Date */}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '10px' }}>
          <span><strong>Deed Voucher #:</strong> {purchase.id}</span>
          <span><strong>Date:</strong> {purchase.purchaseDate}</span>
        </div>

        {/* Seller Info */}
        <div style={{ background: '#F4F4F5', padding: '8px 12px', borderRadius: '4px', fontSize: '0.8125rem', marginBottom: '12px' }}>
          <div><strong>Seller (First Party):</strong> {purchase.seller?.name} {purchase.seller?.fatherName ? `S/o ${purchase.seller.fatherName}` : ''}</div>
          <div><strong>CNIC:</strong> {purchase.seller?.cnic || 'N/A'} | <strong>Contact:</strong> {purchase.seller?.phone}</div>
          {purchase.seller?.address && <div><strong>Address:</strong> {purchase.seller.address}, {purchase.seller?.city}</div>}
        </div>

        {/* Vehicle Specs */}
        <div style={{ border: '1px solid #CCC', padding: '10px 12px', borderRadius: '4px', fontSize: '0.8125rem', marginBottom: '12px' }}>
          <div style={{ fontWeight: 700, borderBottom: '1px solid #EEE', paddingBottom: '4px', marginBottom: '6px' }}>
            Vehicle Particulars
          </div>
          <div><strong>Asset:</strong> {purchase.vehicleSummary}</div>
          <div><strong>Acquisition Type:</strong> {purchase.purchaseType.replace(/_/g, ' ')}</div>
          <div><strong>Original Owner on Record:</strong> {purchase.ownerName}</div>
        </div>

        {/* Financial Breakdown */}
        <div style={{ fontSize: '0.875rem', borderTop: '1px solid #000', borderBottom: '1px solid #000', padding: '8px 0', marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
            <span>Total Agreed Purchase Price:</span>
            <span>PKR {Number(purchase.purchasePrice).toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#059669', fontSize: '0.8125rem' }}>
            <span>Amount Paid (Outflow):</span>
            <span>PKR {Number(purchase.amountPaid).toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, borderTop: '1px dashed #CCC', paddingTop: '4px', marginTop: '4px' }}>
            <span>Outstanding Payable Balance:</span>
            <span style={{ color: purchase.remainingAmount > 0 ? '#DC2626' : '#059669' }}>
              PKR {Number(purchase.remainingAmount).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Legal Signatures */}
        {printFormat === 'A4_DEED' && (
          <div style={{ marginTop: '40px', paddingTop: '16px', borderTop: '1px solid #AAA', fontSize: '0.75rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', textAlign: 'center', marginBottom: '30px' }}>
              <div>
                __________________________<br />
                <strong>Seller Signature & Thumb Impression</strong>
              </div>
              <div>
                __________________________<br />
                <strong>Ahsan Autos Authorized Signature</strong>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', textAlign: 'center' }}>
              <div>
                Witness 1: {purchase.witnesses?.w1Name || '________________'} ({purchase.witnesses?.w1Cnic || 'CNIC'})
              </div>
              <div>
                Witness 2: {purchase.witnesses?.w2Name || '________________'} ({purchase.witnesses?.w2Cnic || 'CNIC'})
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

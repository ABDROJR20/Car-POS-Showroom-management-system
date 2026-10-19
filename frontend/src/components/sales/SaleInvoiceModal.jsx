import React, { useState } from 'react';
import { Modal } from '../ui';
import { Printer, Share2, FileText, CheckCircle2, ShieldCheck, QrCode } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const SaleInvoiceModal = ({ isOpen, onClose, sale }) => {
  const [docType, setDocType] = useState('LEGAL_DEED'); // LEGAL_DEED | THERMAL_SLIP
  const { showToast } = useToast();

  if (!sale) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `*AHSAN AUTOS - SALE INVOICE & DELIVERY DEED*\n` +
      `Invoice #: ${sale.id}\n` +
      `Vehicle: ${sale.vehicleSummary}\n` +
      `Buyer: ${sale.buyer?.name} (${sale.buyer?.cnic || 'CNIC'})\n` +
      `Net Price: PKR ${Number(sale.netSalePrice).toLocaleString()}\n` +
      `Received: PKR ${Number(sale.amountReceived).toLocaleString()}\n` +
      `Remaining: PKR ${Number(sale.remainingBalance).toLocaleString()}\n` +
      `Status: ${sale.remainingBalance === 0 ? 'PAID IN FULL' : 'TOKEN ADVANCE'}\n\n` +
      `Thank you for doing business with Ahsan Autos Showroom!`
    );
    window.open(`https://wa.me/${sale.buyer?.phone?.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
    showToast('success', 'WhatsApp message link generated!', 'WhatsApp Ready');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Sale Invoice & Legal Delivery Deed"
      subtitle={`Printable A4 Stamp Paper Deed and 80mm Thermal POS Receipt • ${sale.id}`}
      maxWidth="820px"
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              className={`btn ${docType === 'LEGAL_DEED' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setDocType('LEGAL_DEED')}
              style={{ fontSize: '0.8125rem' }}
            >
              <FileText size={14} /> A4 Legal Sale Deed (Stamp Paper)
            </button>
            <button
              type="button"
              className={`btn ${docType === 'THERMAL_SLIP' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setDocType('THERMAL_SLIP')}
              style={{ fontSize: '0.8125rem' }}
            >
              <Printer size={14} /> 80mm Thermal Counter Slip
            </button>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="button" className="btn btn-emerald" onClick={handleWhatsApp}>
              <Share2 size={15} /> Send WhatsApp
            </button>
            <button type="button" className="btn btn-blue" onClick={handlePrint}>
              <Printer size={15} /> Print Document
            </button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      }
    >
      {/* Printable Area */}
      <div id="printable-sale-invoice">
        {docType === 'LEGAL_DEED' ? (
          /* =========================================================================
             A4 LEGAL SALE & DELIVERY DEED (Pakistani Stamp Paper Format)
             ========================================================================= */
          <div
            style={{
              padding: '32px',
              backgroundColor: '#FFFFFF',
              color: '#000000',
              fontFamily: 'serif',
              lineHeight: 1.5,
              border: '1px solid #CBD5E1',
              borderRadius: '8px',
            }}
          >
            {/* Header / Stamp Banner */}
            <div style={{ textAlign: 'center', borderBottom: '2px solid #000', paddingBottom: '16px', marginBottom: '20px' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase' }}>
                AHSAN AUTOS SHOWROOM
              </div>
              <div style={{ fontSize: '0.875rem', fontFamily: 'sans-serif', marginTop: '2px' }}>
                Automotive Dealership, Showroom & Commission Agent • Islamabad / Rawalpindi
              </div>
              <div style={{ fontSize: '0.75rem', fontFamily: 'sans-serif', color: '#555' }}>
                NTN: 8912344-7 | Phone: +92 300 1234567, +92 51 2233445
              </div>
              <div
                style={{
                  display: 'inline-block',
                  margin: '12px auto 0',
                  padding: '4px 16px',
                  border: '1.5px solid #000',
                  fontWeight: 'bold',
                  fontSize: '0.9375rem',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}
              >
                VEHICLE SALE & DELIVERY DEED / اقرار نامہ بیع و حوالگی گاڑی
              </div>
            </div>

            {/* Top Metadata */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '16px', fontFamily: 'sans-serif' }}>
              <div>
                <strong>Deed / Sale Voucher #:</strong> {sale.id}
              </div>
              <div>
                <strong>Execution Date:</strong> {sale.saleDate}
              </div>
            </div>

            {/* Parties Description */}
            <div style={{ fontSize: '0.9rem', textAlign: 'justify', marginBottom: '16px' }}>
              <p style={{ marginBottom: '10px' }}>
                This agreement and legal delivery deed is made and executed on this day <strong>{sale.saleDate}</strong> by and between:
              </p>

              <div style={{ padding: '10px 14px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', marginBottom: '10px', fontFamily: 'sans-serif', fontSize: '0.85rem' }}>
                <strong>FIRST PARTY (SHOWROOM / SELLER):</strong> M/s Ahsan Autos Showroom, represented by Director Ahsan Khan, holding CNIC # 37405-1122334-1.
              </div>

              <div style={{ padding: '10px 14px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', marginBottom: '14px', fontFamily: 'sans-serif', fontSize: '0.85rem' }}>
                <strong>SECOND PARTY (BUYER / VENDEE):</strong> Mr./Mrs. <strong>{sale.buyer?.name}</strong>
                {sale.buyer?.fatherName ? ` S/o ${sale.buyer?.fatherName}` : ''}, holding CNIC # <strong>{sale.buyer?.cnic || '___________________'}</strong>, Resident of {sale.buyer?.address || 'Islamabad/Rawalpindi'}, Contact # {sale.buyer?.phone}.
              </div>
            </div>

            {/* Vehicle Specifications Grid */}
            <div style={{ marginBottom: '18px' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 'bold', fontFamily: 'sans-serif', textTransform: 'uppercase', marginBottom: '6px' }}>
                1. Vehicle Asset Particulars:
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem', fontFamily: 'sans-serif' }}>
                <tbody>
                  <tr style={{ border: '1px solid #000' }}>
                    <td style={{ padding: '6px 8px', width: '25%', background: '#F1F5F9', fontWeight: 'bold' }}>Vehicle Make & Model:</td>
                    <td style={{ padding: '6px 8px', width: '25%' }}>{sale.vehicleSummary}</td>
                    <td style={{ padding: '6px 8px', width: '25%', background: '#F1F5F9', fontWeight: 'bold' }}>Registration Plate #:</td>
                    <td style={{ padding: '6px 8px', width: '25%', fontWeight: 'bold' }}>{sale.vehicleSummary?.split('•')[1] || 'REG-NO'}</td>
                  </tr>
                  <tr style={{ border: '1px solid #000' }}>
                    <td style={{ padding: '6px 8px', background: '#F1F5F9', fontWeight: 'bold' }}>Chassis (VIN) Number:</td>
                    <td style={{ padding: '6px 8px' }}>VERIFIED OEM</td>
                    <td style={{ padding: '6px 8px', background: '#F1F5F9', fontWeight: 'bold' }}>Engine Number:</td>
                    <td style={{ padding: '6px 8px' }}>VERIFIED OEM</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Financial Consideration */}
            <div style={{ marginBottom: '18px' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 'bold', fontFamily: 'sans-serif', textTransform: 'uppercase', marginBottom: '6px' }}>
                2. Financial Consideration & Payment Schedule:
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem', fontFamily: 'sans-serif' }}>
                <tbody>
                  <tr style={{ border: '1px solid #000' }}>
                    <td style={{ padding: '6px 8px', background: '#F1F5F9', fontWeight: 'bold' }}>Total Agreed Sale Price:</td>
                    <td style={{ padding: '6px 8px', fontWeight: 'bold' }}>PKR {Number(sale.netSalePrice).toLocaleString()}/-</td>
                    <td style={{ padding: '6px 8px', background: '#F1F5F9', fontWeight: 'bold' }}>Amount Received Today:</td>
                    <td style={{ padding: '6px 8px', fontWeight: 'bold', color: '#059669' }}>PKR {Number(sale.amountReceived).toLocaleString()}/-</td>
                  </tr>
                  <tr style={{ border: '1px solid #000' }}>
                    <td style={{ padding: '6px 8px', background: '#F1F5F9', fontWeight: 'bold' }}>Remaining Balance Due:</td>
                    <td style={{ padding: '6px 8px', fontWeight: 'bold', color: sale.remainingBalance > 0 ? '#DC2626' : '#000' }}>
                      PKR {Number(sale.remainingBalance).toLocaleString()}/-
                    </td>
                    <td style={{ padding: '6px 8px', background: '#F1F5F9', fontWeight: 'bold' }}>Payment Mode:</td>
                    <td style={{ padding: '6px 8px' }}>{sale.paymentMethod}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Legal Covenants */}
            <div style={{ fontSize: '0.8125rem', textAlign: 'justify', marginBottom: '24px', lineHeight: 1.4 }}>
              <ol style={{ paddingLeft: '18px' }}>
                <li>The First Party confirms that physical possession along with available original registration documents and smart keys have been handed over to the Second Party.</li>
                <li>From the execution of this deed and physical possession at {sale.saleDate}, all civil, criminal, excise, traffic challans, and third-party liabilities shall be solely borne by the Buyer (Second Party).</li>
                <li>The Buyer undertakes to complete the official excise biometric transfer into their name within 15 working days.</li>
              </ol>
            </div>

            {/* Signatures & Witnesses Block */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginTop: '30px', fontFamily: 'sans-serif', fontSize: '0.8125rem' }}>
              <div>
                <div style={{ borderTop: '1.5px solid #000', paddingTop: '6px', textAlign: 'center' }}>
                  <strong>FIRST PARTY (SELLER / SHOWROOM)</strong>
                  <div style={{ fontSize: '0.75rem', marginTop: '2px' }}>Ahsan Autos Authorized Signatory</div>
                </div>
              </div>

              <div>
                <div style={{ borderTop: '1.5px solid #000', paddingTop: '6px', textAlign: 'center' }}>
                  <strong>SECOND PARTY (BUYER)</strong>
                  <div style={{ fontSize: '0.75rem', marginTop: '2px' }}>{sale.buyer?.name}</div>
                </div>
              </div>
            </div>

            {/* Witnesses Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginTop: '24px', fontFamily: 'sans-serif', fontSize: '0.75rem' }}>
              <div>
                <strong>Witness 1:</strong> {sale.witnesses?.w1Name || '________________________'} (CNIC: {sale.witnesses?.w1Cnic || '__________________'})
              </div>
              <div>
                <strong>Witness 2:</strong> {sale.witnesses?.w2Name || '________________________'} (CNIC: {sale.witnesses?.w2Cnic || '__________________'})
              </div>
            </div>
          </div>
        ) : (
          /* =========================================================================
             80mm THERMAL POS RECEIPT (Counter Slip)
             ========================================================================= */
          <div
            style={{
              width: '320px',
              margin: '0 auto',
              padding: '16px',
              backgroundColor: '#FFFFFF',
              color: '#000000',
              fontFamily: 'monospace',
              fontSize: '0.75rem',
              border: '1px dashed #94A3B8',
              borderRadius: '6px',
            }}
          >
            <div style={{ textAlign: 'center', borderBottom: '1px dashed #000', paddingBottom: '8px', marginBottom: '8px' }}>
              <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>AHSAN AUTOS</div>
              <div>Showroom & Automotive POS</div>
              <div>Ph: 0300-1234567</div>
              <div style={{ marginTop: '4px', fontWeight: 'bold' }}>SALE TOKEN RECEIPT</div>
            </div>

            <div style={{ marginBottom: '8px', lineHeight: 1.3 }}>
              <div><strong>Voucher:</strong> {sale.id}</div>
              <div><strong>Date:</strong> {sale.saleDate}</div>
              <div><strong>Buyer:</strong> {sale.buyer?.name}</div>
              <div><strong>Phone:</strong> {sale.buyer?.phone}</div>
              <div><strong>Vehicle:</strong> {sale.vehicleSummary}</div>
            </div>

            <div style={{ borderTop: '1px dashed #000', borderBottom: '1px dashed #000', padding: '6px 0', margin: '8px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Agreed Price:</span>
                <span>₨ {Number(sale.netSalePrice).toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                <span>Paid Amount:</span>
                <span>₨ {Number(sale.amountReceived).toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: sale.remainingBalance > 0 ? '#DC2626' : '#000' }}>
                <span>Balance Due:</span>
                <span>₨ {Number(sale.remainingBalance).toLocaleString()}</span>
              </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '12px' }}>
              <div>Status: <strong>{sale.remainingBalance === 0 ? 'FULLY PAID' : 'TOKEN ADVANCE'}</strong></div>
              <div style={{ fontSize: '0.6875rem', marginTop: '4px' }}>Thank you for visiting Ahsan Autos!</div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-sale-invoice, #printable-sale-invoice * {
            visibility: visible;
          }
          #printable-sale-invoice {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </Modal>
  );
};

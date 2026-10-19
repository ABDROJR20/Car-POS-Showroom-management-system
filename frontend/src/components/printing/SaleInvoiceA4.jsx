import React from 'react';

export const SaleInvoiceA4 = ({ sale, settings }) => {
  if (!sale) return null;

  return (
    <div
      className="print-document a4-sheet"
      style={{
        width: '100%',
        maxWidth: '800px',
        margin: '0 auto',
        padding: '36px 32px',
        backgroundColor: '#FFFFFF',
        color: '#000000',
        fontFamily: 'serif',
        lineHeight: 1.5,
        border: '1px solid #CBD5E1',
        borderRadius: '6px',
        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.08)',
      }}
    >
      {/* Header Banner */}
      <div style={{ textAlign: 'center', borderBottom: '2.5px solid #000000', paddingBottom: '14px', marginBottom: '18px' }}>
        <div style={{ fontSize: '1.65rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', fontFamily: 'sans-serif' }}>
          {settings.showroomName || 'AHSAN AUTOS SHOWROOM'}
        </div>
        <div style={{ fontSize: '0.85rem', color: '#333333', fontFamily: 'sans-serif', marginTop: '2px' }}>
          {settings.tagline || 'Automotive Dealership & Commission Agent'} • {settings.address}
        </div>
        <div style={{ fontSize: '0.75rem', color: '#555555', fontFamily: 'sans-serif', marginTop: '2px' }}>
          Phone / WhatsApp: <strong>{settings.phone}</strong> | NTN: {settings.ntn}
        </div>
        <div
          style={{
            display: 'inline-block',
            margin: '10px auto 0',
            padding: '4px 18px',
            border: '2px solid #000000',
            fontWeight: 800,
            fontSize: '0.9375rem',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            fontFamily: 'sans-serif',
          }}
        >
          VEHICLE SALE & DELIVERY DEED / اقرار نامہ بیع و حوالگی گاڑی
        </div>
      </div>

      {/* Top Invoice Metadata */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '16px', fontFamily: 'sans-serif' }}>
        <div>
          <strong>Invoice / Deed #:</strong> <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{sale.id}</span>
        </div>
        <div>
          <strong>Sale Date:</strong> {sale.saleDate}
        </div>
        <div>
          <strong>Payment Status:</strong>{' '}
          <span style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
            {sale.remainingBalance === 0 ? 'Fully Paid' : 'Token Advance'}
          </span>
        </div>
      </div>

      {/* Parties Description */}
      <div style={{ fontSize: '0.875rem', textAlign: 'justify', marginBottom: '16px' }}>
        <p style={{ marginBottom: '8px' }}>
          This agreement and legal delivery deed is executed on <strong>{sale.saleDate}</strong> by and between:
        </p>

        <div style={{ padding: '8px 12px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '4px', marginBottom: '8px', fontFamily: 'sans-serif', fontSize: '0.8125rem' }}>
          <strong>FIRST PARTY (SHOWROOM / SELLER):</strong> {settings.showroomName}, represented by authorized signatory, holding CNIC # 37405-1122334-1.
        </div>

        <div style={{ padding: '8px 12px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '4px', marginBottom: '12px', fontFamily: 'sans-serif', fontSize: '0.8125rem' }}>
          <strong>SECOND PARTY (BUYER / VENDEE):</strong> Mr./Mrs. <strong>{sale.buyer?.name}</strong>
          {sale.buyer?.fatherName ? ` S/o ${sale.buyer?.fatherName}` : ''}, CNIC # <strong>{sale.buyer?.cnic || '___________________'}</strong>, Resident of {sale.buyer?.address || 'Islamabad/Rawalpindi'}, Contact # {sale.buyer?.phone}.
        </div>
      </div>

      {/* Vehicle Particulars Table */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 'bold', fontFamily: 'sans-serif', textTransform: 'uppercase', marginBottom: '4px' }}>
          1. Vehicle Asset Particulars:
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem', fontFamily: 'sans-serif' }}>
          <tbody>
            <tr style={{ border: '1px solid #000000' }}>
              <td style={{ padding: '6px 8px', width: '25%', background: '#F1F5F9', fontWeight: 'bold' }}>Vehicle Make & Model:</td>
              <td style={{ padding: '6px 8px', width: '25%' }}>{sale.vehicleSummary?.split('•')[0] || sale.vehicleSummary}</td>
              <td style={{ padding: '6px 8px', width: '25%', background: '#F1F5F9', fontWeight: 'bold' }}>Registration Plate #:</td>
              <td style={{ padding: '6px 8px', width: '25%', fontWeight: 'bold' }}>{sale.vehicleSummary?.split('•')[1] || 'REG-NO'}</td>
            </tr>
            <tr style={{ border: '1px solid #000000' }}>
              <td style={{ padding: '6px 8px', background: '#F1F5F9', fontWeight: 'bold' }}>Chassis (VIN) Number:</td>
              <td style={{ padding: '6px 8px' }}>VERIFIED OEM CHASSIS</td>
              <td style={{ padding: '6px 8px', background: '#F1F5F9', fontWeight: 'bold' }}>Engine Number:</td>
              <td style={{ padding: '6px 8px' }}>VERIFIED OEM ENGINE</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Financial Consideration Table */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 'bold', fontFamily: 'sans-serif', textTransform: 'uppercase', marginBottom: '4px' }}>
          2. Financial Consideration & Breakdown:
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem', fontFamily: 'sans-serif' }}>
          <tbody>
            <tr style={{ border: '1px solid #000000' }}>
              <td style={{ padding: '6px 8px', background: '#F1F5F9', fontWeight: 'bold' }}>Gross Agreed Price:</td>
              <td style={{ padding: '6px 8px' }}>PKR {Number(sale.salePrice).toLocaleString()}/-</td>
              <td style={{ padding: '6px 8px', background: '#F1F5F9', fontWeight: 'bold' }}>Special Discount:</td>
              <td style={{ padding: '6px 8px', color: '#DC2626' }}>- PKR {Number(sale.discount || 0).toLocaleString()}/-</td>
            </tr>
            <tr style={{ border: '1px solid #000000' }}>
              <td style={{ padding: '6px 8px', background: '#F1F5F9', fontWeight: 'bold' }}>Additional Charges:</td>
              <td style={{ padding: '6px 8px' }}>+ PKR {Number(sale.additionalCharges || 0).toLocaleString()}/-</td>
              <td style={{ padding: '6px 8px', background: '#F1F5F9', fontWeight: 'bold' }}>Net Final Amount:</td>
              <td style={{ padding: '6px 8px', fontWeight: 'bold', fontSize: '0.9rem' }}>PKR {Number(sale.netSalePrice).toLocaleString()}/-</td>
            </tr>
            <tr style={{ border: '1px solid #000000', background: '#FAFAFA' }}>
              <td style={{ padding: '6px 8px', fontWeight: 'bold' }}>Amount Received Today:</td>
              <td style={{ padding: '6px 8px', fontWeight: 'bold', color: '#059669' }}>PKR {Number(sale.amountReceived).toLocaleString()}/-</td>
              <td style={{ padding: '6px 8px', fontWeight: 'bold' }}>Remaining Balance Due:</td>
              <td style={{ padding: '6px 8px', fontWeight: 'bold', color: sale.remainingBalance > 0 ? '#DC2626' : '#059669' }}>
                PKR {Number(sale.remainingBalance).toLocaleString()}/-
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Terms & Conditions */}
      <div style={{ fontSize: '0.78rem', textAlign: 'justify', marginBottom: '20px', lineHeight: 1.4, fontFamily: 'sans-serif' }}>
        <div style={{ fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '4px' }}>Terms & Conditions:</div>
        <ol style={{ paddingLeft: '16px' }}>
          {settings.terms?.map((term, idx) => (
            <li key={idx} style={{ marginBottom: '2px' }}>{term}</li>
          ))}
        </ol>
      </div>

      {/* Signatures & Witnesses */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '24px', fontFamily: 'sans-serif', fontSize: '0.8125rem' }}>
        <div>
          <div style={{ borderTop: '1.5px solid #000000', paddingTop: '6px', textAlign: 'center' }}>
            <strong>FIRST PARTY (SHOWROOM SIGNATURE & STAMP)</strong>
            <div style={{ fontSize: '0.75rem', marginTop: '2px' }}>Ahsan Autos Authorized Signatory</div>
          </div>
        </div>

        <div>
          <div style={{ borderTop: '1.5px solid #000000', paddingTop: '6px', textAlign: 'center' }}>
            <strong>SECOND PARTY (BUYER SIGNATURE)</strong>
            <div style={{ fontSize: '0.75rem', marginTop: '2px' }}>{sale.buyer?.name}</div>
          </div>
        </div>
      </div>

      {/* Social Footer */}
      <div style={{ borderTop: '1px dashed #CBD5E1', marginTop: '20px', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#555', fontFamily: 'sans-serif' }}>
        <div>TikTok: <strong>{settings.social?.tiktok || '@ahsan_autos'}</strong></div>
        <div>Instagram: <strong>{settings.social?.instagram || '@ahsanautos_official'}</strong></div>
        <div>Software: <strong>Ahsan Autos Showroom POS</strong></div>
      </div>
    </div>
  );
};

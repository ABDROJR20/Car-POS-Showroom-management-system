import React from 'react';

/**
 * 4. PURCHASE RECEIPT (Inward Acquisition Legal Deed)
 */
export const PurchaseReceiptA4 = ({ purchase, settings }) => {
  if (!purchase) return null;

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
      }}
    >
      <div style={{ textAlign: 'center', borderBottom: '2.5px solid #000', paddingBottom: '14px', marginBottom: '18px' }}>
        <div style={{ fontSize: '1.65rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', fontFamily: 'sans-serif' }}>
          {settings.showroomName || 'AHSAN AUTOS SHOWROOM'}
        </div>
        <div style={{ fontSize: '0.85rem', color: '#333', fontFamily: 'sans-serif' }}>
          Vehicle Inward Purchase & Acquisition Deed • {settings.address}
        </div>
        <div
          style={{
            display: 'inline-block',
            margin: '10px auto 0',
            padding: '4px 18px',
            border: '2px solid #000',
            fontWeight: 800,
            fontSize: '0.9375rem',
            textTransform: 'uppercase',
            fontFamily: 'sans-serif',
          }}
        >
          VEHICLE PURCHASE DEED / اقرار نامہ خریداری گاڑی
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '16px', fontFamily: 'sans-serif' }}>
        <div><strong>Purchase Voucher #:</strong> {purchase.id}</div>
        <div><strong>Purchase Date:</strong> {purchase.purchaseDate}</div>
        <div><strong>Ownership Type:</strong> {purchase.ownershipType}</div>
      </div>

      <div style={{ fontSize: '0.875rem', marginBottom: '16px', fontFamily: 'sans-serif' }}>
        <div style={{ padding: '8px 12px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '4px', marginBottom: '8px' }}>
          <strong>SELLER / EX-OWNER:</strong> {purchase.seller?.name} {purchase.seller?.fatherName ? `S/o ${purchase.seller.fatherName}` : ''} | CNIC: {purchase.seller?.cnic || 'CNIC'} | Ph: {purchase.seller?.phone}
        </div>
        <div style={{ padding: '8px 12px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '4px' }}>
          <strong>PURCHASER (SHOWROOM):</strong> {settings.showroomName} (Director Ahsan Khan)
        </div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem', fontFamily: 'sans-serif', marginBottom: '16px' }}>
        <tbody>
          <tr style={{ border: '1px solid #000' }}>
            <td style={{ padding: '6px 8px', width: '25%', background: '#F1F5F9', fontWeight: 'bold' }}>Vehicle Summary:</td>
            <td style={{ padding: '6px 8px', width: '75%' }}>{purchase.vehicleSummary}</td>
          </tr>
          <tr style={{ border: '1px solid #000' }}>
            <td style={{ padding: '6px 8px', background: '#F1F5F9', fontWeight: 'bold' }}>Purchase Price:</td>
            <td style={{ padding: '6px 8px', fontWeight: 'bold' }}>PKR {Number(purchase.purchasePrice).toLocaleString()}/-</td>
          </tr>
          <tr style={{ border: '1px solid #000' }}>
            <td style={{ padding: '6px 8px', background: '#F1F5F9', fontWeight: 'bold' }}>Amount Paid (Outflow):</td>
            <td style={{ padding: '6px 8px', fontWeight: 'bold', color: '#059669' }}>PKR {Number(purchase.amountPaid).toLocaleString()}/-</td>
          </tr>
          <tr style={{ border: '1px solid #000' }}>
            <td style={{ padding: '6px 8px', background: '#F1F5F9', fontWeight: 'bold' }}>Remaining Payable:</td>
            <td style={{ padding: '6px 8px', fontWeight: 'bold', color: purchase.remainingAmount > 0 ? '#DC2626' : '#059669' }}>
              PKR {Number(purchase.remainingAmount).toLocaleString()}/-
            </td>
          </tr>
        </tbody>
      </table>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '30px', fontFamily: 'sans-serif', fontSize: '0.8125rem', textAlign: 'center' }}>
        <div>
          <div style={{ borderTop: '1.5px solid #000', paddingTop: '4px' }}>
            <strong>Seller Signature & Thumb Impression</strong>
          </div>
        </div>
        <div>
          <div style={{ borderTop: '1.5px solid #000', paddingTop: '4px' }}>
            <strong>Showroom Authorized Signatory</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 5. PAYMENT RECEIPT SLIP (Customer Installment / Balance Slip)
 */
export const PaymentReceiptSlip = ({ payment, sale, settings }) => {
  return (
    <div
      className="print-document thermal-receipt"
      style={{
        width: '320px',
        margin: '0 auto',
        padding: '20px 16px',
        backgroundColor: '#FFFFFF',
        color: '#000000',
        fontFamily: 'monospace',
        fontSize: '0.8125rem',
        border: '1px dashed #000',
        borderRadius: '6px',
      }}
    >
      <div style={{ textAlign: 'center', borderBottom: '1.5px dashed #000', paddingBottom: '8px', marginBottom: '8px' }}>
        <div style={{ fontWeight: 'bold', fontSize: '1.15rem' }}>{settings.showroomName?.toUpperCase()}</div>
        <div style={{ fontSize: '0.75rem' }}>PAYMENT COLLECTION RECEIPT</div>
      </div>

      <div style={{ marginBottom: '8px', lineHeight: 1.3 }}>
        <div><strong>Voucher #:</strong> {payment?.id || 'PAY-2026'}</div>
        <div><strong>Date:</strong> {payment?.paymentDate || new Date().toISOString().split('T')[0]}</div>
        <div><strong>Deal Order:</strong> {payment?.saleId || sale?.id}</div>
        <div><strong>Vehicle:</strong> {sale?.vehicleSummary || 'Vehicle Deal'}</div>
        <div><strong>Customer:</strong> {sale?.buyer?.name} ({sale?.buyer?.phone})</div>
      </div>

      <div style={{ borderTop: '1px dashed #000', borderBottom: '1px dashed #000', padding: '6px 0', margin: '8px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '0.95rem', color: '#059669' }}>
          <span>AMOUNT RECEIVED:</span>
          <span>₨ {Number(payment?.amount || sale?.amountReceived || 0).toLocaleString()}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Payment Channel:</span>
          <span>{payment?.paymentMethod || 'Cash'}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Remaining Balance:</span>
          <span>₨ {Number(sale?.remainingBalance || 0).toLocaleString()}</span>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.75rem', borderTop: '1px dashed #000', paddingTop: '6px', lineHeight: 1.4 }}>
        <div style={{ fontWeight: 'bold' }}>Powered By Rojrztech</div>
        <div style={{ fontSize: '0.7rem' }}>03132066883 / 03151210736</div>
        <div style={{ fontSize: '0.7rem' }}>website: Rojrztech.com</div>
      </div>
    </div>
  );
};

/**
 * 6. COMMISSION RECEIPT SLIP
 */
export const CommissionReceiptSlip = ({ commission, settings }) => {
  return (
    <div
      className="print-document"
      style={{
        width: '320px',
        margin: '0 auto',
        padding: '20px 16px',
        backgroundColor: '#FFFFFF',
        color: '#000000',
        fontFamily: 'monospace',
        fontSize: '0.8125rem',
        border: '1px dashed #000',
        borderRadius: '6px',
      }}
    >
      <div style={{ textAlign: 'center', borderBottom: '1.5px dashed #000', paddingBottom: '8px', marginBottom: '8px' }}>
        <div style={{ fontWeight: 'bold', fontSize: '1.15rem' }}>{settings.showroomName?.toUpperCase()}</div>
        <div style={{ fontSize: '0.75rem' }}>BROKERAGE & COMMISSION VOUCHER</div>
      </div>

      <div style={{ marginBottom: '8px' }}>
        <div><strong>Voucher #:</strong> {commission?.id}</div>
        <div><strong>Deal Order:</strong> {commission?.saleId}</div>
        <div><strong>Beneficiary:</strong> {commission?.recipientName}</div>
        <div><strong>Party Type:</strong> {commission?.partyType}</div>
        <div><strong>Linked Car:</strong> {commission?.vehicleSummary}</div>
      </div>

      <div style={{ borderTop: '1px dashed #000', borderBottom: '1px dashed #000', padding: '6px 0', margin: '8px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '0.95rem' }}>
          <span>COMMISSION AMOUNT:</span>
          <span>₨ {Number(commission?.amount || 0).toLocaleString()}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Status:</span>
          <span>{commission?.status}</span>
        </div>
      </div>

      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', textAlign: 'center' }}>
        <div>
          <div style={{ borderTop: '1px solid #000', paddingTop: '2px' }}>Authorized Sign</div>
        </div>
        <div>
          <div style={{ borderTop: '1px solid #000', paddingTop: '2px' }}>Recipient Sign</div>
        </div>
      </div>
    </div>
  );
};

/**
 * 7. EXPENSE RECEIPT SLIP
 */
export const ExpenseReceiptSlip = ({ expense, settings }) => {
  return (
    <div
      className="print-document"
      style={{
        width: '320px',
        margin: '0 auto',
        padding: '20px 16px',
        backgroundColor: '#FFFFFF',
        color: '#000000',
        fontFamily: 'monospace',
        fontSize: '0.8125rem',
        border: '1px dashed #000',
        borderRadius: '6px',
      }}
    >
      <div style={{ textAlign: 'center', borderBottom: '1.5px dashed #000', paddingBottom: '8px', marginBottom: '8px' }}>
        <div style={{ fontWeight: 'bold', fontSize: '1.15rem' }}>{settings.showroomName?.toUpperCase()}</div>
        <div style={{ fontSize: '0.75rem' }}>SHOWROOM EXPENSE VOUCHER</div>
      </div>

      <div style={{ marginBottom: '8px' }}>
        <div><strong>Voucher #:</strong> {expense?.id}</div>
        <div><strong>Date:</strong> {expense?.date}</div>
        <div><strong>Category:</strong> {expense?.category}</div>
        <div><strong>Paid To:</strong> {expense?.paidTo}</div>
        {expense?.vehicleSummary && <div><strong>Vehicle Link:</strong> {expense.vehicleSummary}</div>}
      </div>

      <div style={{ borderTop: '1px dashed #000', borderBottom: '1px dashed #000', padding: '6px 0', margin: '8px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '0.95rem', color: '#DC2626' }}>
          <span>EXPENSE AMOUNT:</span>
          <span>₨ {Number(expense?.amount || 0).toLocaleString()}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Paid From:</span>
          <span>{expense?.account}</span>
        </div>
      </div>

      <div style={{ fontSize: '0.75rem', marginTop: '6px' }}>
        <strong>Narration:</strong> {expense?.narration}
      </div>

      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', textAlign: 'center' }}>
        <div>
          <div style={{ borderTop: '1px solid #000', paddingTop: '2px' }}>Approved By</div>
        </div>
        <div>
          <div style={{ borderTop: '1px solid #000', paddingTop: '2px' }}>Payee Sign</div>
        </div>
      </div>
    </div>
  );
};

/**
 * 8. CUSTOMER STATEMENT SLIP
 */
export const CustomerStatementSlip = ({ customerName, customerSales = [], settings }) => {
  const totalBilled = customerSales.reduce((s, d) => s + Number(d.netSalePrice || 0), 0);
  const totalPaid = customerSales.reduce((s, d) => s + Number(d.amountReceived || 0), 0);
  const totalBalance = customerSales.reduce((s, d) => s + Number(d.remainingBalance || 0), 0);

  return (
    <div
      className="print-document"
      style={{
        width: '100%',
        maxWidth: '700px',
        margin: '0 auto',
        padding: '30px',
        backgroundColor: '#FFFFFF',
        color: '#000000',
        fontFamily: 'sans-serif',
        lineHeight: 1.4,
        border: '1px solid #CBD5E1',
        borderRadius: '6px',
      }}
    >
      <div style={{ textAlign: 'center', borderBottom: '2px solid #000', paddingBottom: '10px', marginBottom: '16px' }}>
        <div style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>{settings.showroomName}</div>
        <div style={{ fontSize: '0.8125rem' }}>CUSTOMER ACCOUNT STATEMENT & LEDGER</div>
        <div style={{ fontSize: '0.75rem', color: '#555' }}>Date: {new Date().toISOString().split('T')[0]}</div>
      </div>

      <div style={{ marginBottom: '14px', fontSize: '0.875rem' }}>
        <strong>Party / Customer:</strong> {customerName || 'All Valued Customers'}
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem', marginBottom: '16px' }}>
        <thead>
          <tr style={{ background: '#F1F5F9', border: '1px solid #000' }}>
            <th style={{ padding: '6px', textAlign: 'left' }}>Deal #</th>
            <th style={{ padding: '6px', textAlign: 'left' }}>Date</th>
            <th style={{ padding: '6px', textAlign: 'left' }}>Vehicle Asset</th>
            <th style={{ padding: '6px', textAlign: 'right' }}>Total</th>
            <th style={{ padding: '6px', textAlign: 'right' }}>Paid</th>
            <th style={{ padding: '6px', textAlign: 'right' }}>Balance</th>
          </tr>
        </thead>
        <tbody>
          {customerSales.map((s) => (
            <tr key={s.id} style={{ border: '1px solid #CCC' }}>
              <td style={{ padding: '6px' }}>{s.id}</td>
              <td style={{ padding: '6px' }}>{s.saleDate}</td>
              <td style={{ padding: '6px' }}>{s.vehicleSummary}</td>
              <td style={{ padding: '6px', textAlign: 'right' }}>₨ {Number(s.netSalePrice).toLocaleString()}</td>
              <td style={{ padding: '6px', textAlign: 'right', color: '#059669' }}>₨ {Number(s.amountReceived).toLocaleString()}</td>
              <td style={{ padding: '6px', textAlign: 'right', fontWeight: 'bold', color: s.remainingBalance > 0 ? '#DC2626' : '#059669' }}>
                ₨ {Number(s.remainingBalance).toLocaleString()}
              </td>
            </tr>
          ))}
          <tr style={{ border: '2px solid #000', background: '#F8FAFC', fontWeight: 'bold' }}>
            <td colSpan={3} style={{ padding: '8px' }}>TOTALS:</td>
            <td style={{ padding: '8px', textAlign: 'right' }}>₨ {totalBilled.toLocaleString()}</td>
            <td style={{ padding: '8px', textAlign: 'right', color: '#059669' }}>₨ {totalPaid.toLocaleString()}</td>
            <td style={{ padding: '8px', textAlign: 'right', color: '#DC2626' }}>₨ {totalBalance.toLocaleString()}</td>
          </tr>
        </tbody>
      </table>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginTop: '20px' }}>
        <div>Ph: {settings.phone}</div>
        <div>TikTok: {settings.social?.tiktok}</div>
        <div>Instagram: {settings.social?.instagram}</div>
      </div>
    </div>
  );
};

import React from 'react';

export const ThermalReceipt80mm = ({ sale, cartItems = [], settings = {} }) => {
  // If cartItems are passed (multiple items from POS), use them; otherwise fallback to single sale item
  const items = cartItems.length > 0 ? cartItems : [
    {
      description: sale?.vehicleSummary || 'Vehicle Asset Deal',
      qty: 1,
      price: Number(sale?.salePrice || 0),
      foc: 0,
      amount: Number(sale?.salePrice || 0),
    }
  ];

  const totalQty = items.reduce((sum, item) => sum + (Number(item.qty) || 1), 0);
  const subtotal = items.reduce((sum, item) => sum + ((Number(item.price) || 0) * (Number(item.qty) || 1)), 0);
  const discount = Number(sale?.discount || 0);
  const netTotal = Math.max(0, subtotal - discount);
  const amountPaid = Number(sale?.amountReceived !== undefined ? sale.amountReceived : netTotal);
  const balance = Math.max(0, netTotal - amountPaid);
  const paymentMode = sale?.paymentMethod || 'Cash';
  const billNo = sale?.id || sale?.invoiceNo || `11${Math.floor(Math.random() * 90) + 10}`;
  const saleDate = sale?.saleDate || new Date().toLocaleDateString('en-GB');
  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

  const showroomName = (settings.showroomName || 'AHSAN AUTOS').toUpperCase();
  const address = (settings.address || 'MAIN BOULEVARD, G-8 MARKAZ, ISLAMABAD').toUpperCase();
  const phone = settings.phone || '0300-1234567';
  const customerName = sale?.buyer?.name || sale?.customer?.name || 'Walk-in Customer';
  const tiktok = settings.social?.tiktok || '@ahsan_autos';
  const instagram = settings.social?.instagram || '@ahsanautos_official';

  return (
    <div
      className="print-document thermal-receipt"
      style={{
        width: '320px',
        margin: '0 auto',
        padding: '16px 14px 20px',
        backgroundColor: '#FFFFFF',
        color: '#000000',
        fontFamily: "'Courier New', Courier, monospace",
        fontSize: '0.78rem',
        lineHeight: 1.35,
        border: '1px solid #E2E8F0',
        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.08)',
        boxSizing: 'border-box',
      }}
    >
      {/* Top Header Logo & Store Name */}
      <div style={{ textAlign: 'center', marginBottom: '8px' }}>
        <div style={{ fontSize: '1.25rem', fontWeight: '900', letterSpacing: '1px', textTransform: 'uppercase' }}>
          {showroomName}
        </div>
        <div style={{ fontSize: '0.6875rem', fontWeight: '600', textTransform: 'uppercase', marginTop: '2px', lineHeight: 1.2 }}>
          {address}
        </div>
        <div style={{ fontSize: '0.75rem', fontWeight: '700', marginTop: '2px' }}>
          TEL: {phone}
        </div>
      </div>

      {/* Solid Divider */}
      <div style={{ borderTop: '1.5px solid #000000', margin: '8px 0' }} />

      {/* Boxed Badge: CASH INVOICE */}
      <div style={{ textAlign: 'center', margin: '6px 0' }}>
        <span
          style={{
            display: 'inline-block',
            padding: '2px 14px',
            border: '1.5px solid #000000',
            fontWeight: '900',
            fontSize: '0.8125rem',
            letterSpacing: '1px',
            textTransform: 'uppercase',
          }}
        >
          CASH INVOICE
        </span>
      </div>

      {/* Bill & Date Metadata */}
      <div style={{ margin: '8px 0', fontSize: '0.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
          <span>Bill # : {billNo}</span>
          <span>Date : {saleDate}</span>
        </div>
        <div style={{ textAlign: 'right', fontSize: '0.7rem' }}>
          {timeStr}
        </div>
        <div style={{ borderBottom: '1px solid #000', width: '45%', marginTop: '2px', marginBottom: '4px' }} />

        <div style={{ fontWeight: 'bold' }}>
          Customer : {customerName}
        </div>
        <div style={{ borderBottom: '1px solid #000', width: '60%', margin: '2px 0 4px' }} />

        <div style={{ fontWeight: 'bold' }}>
          User : Admin / Cashier
        </div>
        <div style={{ borderBottom: '1px solid #000', width: '40%', margin: '2px 0 6px' }} />
      </div>

      {/* Table Header */}
      <div style={{ borderTop: '1.5px solid #000000', borderBottom: '1.5px solid #000000', padding: '4px 0', fontWeight: '900', fontSize: '0.72rem', display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ flex: 2 }}>DESCRIPTION</span>
        <span style={{ width: '32px', textAlign: 'center' }}>QTY</span>
        <span style={{ width: '55px', textAlign: 'right' }}>PRICE</span>
        <span style={{ width: '32px', textAlign: 'center' }}>FOC</span>
        <span style={{ width: '60px', textAlign: 'right' }}>AMOUNT</span>
      </div>

      {/* Items List */}
      <div style={{ margin: '6px 0' }}>
        {items.map((item, idx) => {
          const itemAmount = (Number(item.price) || 0) * (Number(item.qty) || 1);
          return (
            <div key={idx} style={{ marginBottom: '6px', fontSize: '0.75rem' }}>
              <div style={{ fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '2px' }}>
                {item.description || item.name || item.vehicleSummary}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem' }}>
                <span style={{ flex: 2 }}></span>
                <span style={{ width: '32px', textAlign: 'center' }}>{item.qty || 1}</span>
                <span style={{ width: '55px', textAlign: 'right' }}>{Number(item.price || 0).toLocaleString()}</span>
                <span style={{ width: '32px', textAlign: 'center' }}>{item.foc || 0}</span>
                <span style={{ width: '60px', textAlign: 'right', fontWeight: 'bold' }}>{itemAmount.toLocaleString()}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dashed Separator */}
      <div style={{ borderTop: '1px dashed #000000', margin: '6px 0' }} />

      {/* Total Items Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '0.75rem', padding: '2px 0' }}>
        <span>TOTAL: {items.length}</span>
        <span>ITEMS {totalQty}</span>
        <span>{subtotal.toLocaleString()}</span>
      </div>

      {/* Dashed Separator */}
      <div style={{ borderTop: '1px dashed #000000', margin: '6px 0' }} />

      {/* Big Net Total Box */}
      <div
        style={{
          borderTop: '2px solid #000000',
          borderBottom: '2px solid #000000',
          padding: '6px 0',
          margin: '6px 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ fontSize: '1.05rem', fontWeight: '900', letterSpacing: '1px' }}>NET TOTAL</span>
        <span style={{ fontSize: '1.15rem', fontWeight: '900' }}>Rs {netTotal.toLocaleString()}</span>
      </div>

      {/* Settlement Particulars */}
      <div style={{ fontSize: '0.78rem', margin: '8px 0', lineHeight: 1.45 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
          <span>Amount Paid</span>
          <span>{amountPaid.toLocaleString()}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
          <span>Change / Balance</span>
          <span>{balance > 0 ? `Rs ${balance.toLocaleString()}` : '0'}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginTop: '2px' }}>
          <span>Payment Mode</span>
          <span>{paymentMode} ({balance === 0 ? 'COMPLETED' : 'ADVANCE TOKEN'})</span>
        </div>
      </div>

      {/* Thank you message */}
      <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '0.75rem', margin: '12px 0 6px', textTransform: 'uppercase' }}>
        THANK YOU FOR SHOPPING AT {showroomName}!
      </div>

      {/* Dashed Separator */}
      <div style={{ borderTop: '1px dashed #000000', margin: '6px 0' }} />

      {/* Footer Powered By Rojrztech (Configurable) */}
      <div style={{ textAlign: 'center', fontSize: '0.75rem', lineHeight: 1.45, color: '#000000', fontWeight: 'bold' }}>
        {(settings.receiptFooter || 'Powered By Rojrztech\n03132066883 / 03151210736\nwebsite: Rojrztech.com')
          .split('\n')
          .map((line, idx) => (
            <div key={idx}>{line}</div>
          ))}
      </div>

      {/* Solid Black Thick Bottom Bar */}
      <div style={{ height: '6px', backgroundColor: '#000000', marginTop: '10px' }} />
    </div>
  );
};

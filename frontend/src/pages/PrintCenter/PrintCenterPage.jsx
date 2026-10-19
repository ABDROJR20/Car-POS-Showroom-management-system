import React, { useState, useEffect } from 'react';
import {
  Printer,
  FileText,
  Receipt,
  Share2,
  Car,
  DollarSign,
  Percent,
  Coins,
  Users,
  Eye,
  CheckCircle2,
  Building,
} from 'lucide-react';
import { salesService } from '../../services/salesService';
import { purchaseService } from '../../services/purchaseService';
import { financeService } from '../../services/financeService';
import { vehicleStorage } from '../../services/vehicleStorage';
import { settingsService } from '../../services/settingsService';
import { SaleInvoiceA4 } from '../../components/printing/SaleInvoiceA4';
import { ThermalReceipt80mm } from '../../components/printing/ThermalReceipt80mm';
import { VehicleSaleSlip } from '../../components/printing/VehicleSaleSlip';
import {
  PurchaseReceiptA4,
  PaymentReceiptSlip,
  CommissionReceiptSlip,
  ExpenseReceiptSlip,
  CustomerStatementSlip,
} from '../../components/printing/OtherSlips';
import { useToast } from '../../context/ToastContext';

const DOCUMENT_TYPES = [
  { id: 'A4_SALE_DEED', label: '1. A4 Sale Deed & Invoice', icon: FileText, category: 'Sale' },
  { id: 'THERMAL_80MM', label: '2. 80mm Thermal POS Slip', icon: Printer, category: 'Sale' },
  { id: 'VEHICLE_SALE_SLIP', label: '3. Vehicle Gate Pass Slip', icon: Car, category: 'Delivery' },
  { id: 'PURCHASE_RECEIPT', label: '4. Purchase Inward Deed', icon: Receipt, category: 'Purchase' },
  { id: 'PAYMENT_RECEIPT', label: '5. Payment Balance Slip', icon: DollarSign, category: 'Payment' },
  { id: 'COMMISSION_RECEIPT', label: '6. Commission Voucher', icon: Percent, category: 'Commission' },
  { id: 'EXPENSE_RECEIPT', label: '7. Expense Receipt Voucher', icon: Coins, category: 'Expense' },
  { id: 'CUSTOMER_STATEMENT', label: '8. Customer Account Ledger', icon: Users, category: 'Customer' },
];

export const PrintCenterPage = () => {
  const [docType, setDocType] = useState('A4_SALE_DEED');
  const [settings, setSettings] = useState(settingsService.getSettings());

  // Data states
  const [sales, setSales] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [commissions, setCommissions] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  // Selected records
  const [selectedSaleId, setSelectedSaleId] = useState('');
  const [selectedPurchaseId, setSelectedPurchaseId] = useState('');
  const [selectedExpenseId, setSelectedExpenseId] = useState('');
  const [selectedCommissionId, setSelectedCommissionId] = useState('');
  const [selectedVehicleId, setSelectedVehicleId] = useState('');

  const { showToast } = useToast();

  useEffect(() => {
    const sList = salesService.getAllSales();
    const pList = purchaseService.getAllPurchases();
    const eList = financeService.getAllExpenses();
    const cList = salesService.getAllCommissions();
    const vList = vehicleStorage.getAllVehicles();
    const currentSettings = settingsService.getSettings();

    setSales(sList);
    setPurchases(pList);
    setExpenses(eList);
    setCommissions(cList);
    setVehicles(vList);
    setSettings(currentSettings);

    if (sList.length > 0) setSelectedSaleId(sList[0].id);
    if (pList.length > 0) setSelectedPurchaseId(pList[0].id);
    if (eList.length > 0) setSelectedExpenseId(eList[0].id);
    if (cList.length > 0) setSelectedCommissionId(cList[0].id);
    if (vList.length > 0) setSelectedVehicleId(String(vList[0].id));
  }, []);

  const currentSale = sales.find((s) => s.id === selectedSaleId) || sales[0];
  const currentPurchase = purchases.find((p) => p.id === selectedPurchaseId) || purchases[0];
  const currentExpense = expenses.find((e) => e.id === selectedExpenseId) || expenses[0];
  const currentCommission = commissions.find((c) => c.id === selectedCommissionId) || commissions[0];
  const currentVehicle = vehicles.find((v) => String(v.id) === String(selectedVehicleId)) || vehicles[0];

  // 1-Click Print
  const handlePrint = () => {
    window.print();
  };

  // 1-Click WhatsApp Share
  const handleWhatsAppShare = () => {
    if (!currentSale) {
      showToast('error', 'Please select a valid sale record first.', 'Error');
      return;
    }

    const text = encodeURIComponent(
      `*AHSAN AUTOS SHOWROOM - OFFICIAL INVOICE*\n` +
      `----------------------------------------\n` +
      `*Invoice #:* ${currentSale.id}\n` +
      `*Sale Date:* ${currentSale.saleDate}\n` +
      `*Vehicle:* ${currentSale.vehicleSummary}\n` +
      `*Buyer:* ${currentSale.buyer?.name} (${currentSale.buyer?.cnic || 'CNIC'})\n` +
      `----------------------------------------\n` +
      `*Net Agreed Price:* PKR ${Number(currentSale.netSalePrice).toLocaleString()}\n` +
      `*Amount Paid:* PKR ${Number(currentSale.amountReceived).toLocaleString()}\n` +
      `*Remaining Balance:* PKR ${Number(currentSale.remainingBalance).toLocaleString()}\n` +
      `*Status:* ${currentSale.remainingBalance === 0 ? 'FULLY PAID' : 'TOKEN ADVANCE'}\n` +
      `----------------------------------------\n` +
      `*Showroom:* ${settings.showroomName}\n` +
      `*Address:* ${settings.address}\n` +
      `*Helpline:* ${settings.phone}\n` +
      `*TikTok:* ${settings.social?.tiktok || '@ahsan_autos'}\n` +
      `*Instagram:* ${settings.social?.instagram || '@ahsanautos_official'}`
    );

    const targetPhone = currentSale.buyer?.phone?.replace(/[^0-9]/g, '') || settings.whatsapp?.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${targetPhone}?text=${text}`, '_blank');
    showToast('success', 'Official WhatsApp share window opened!', 'WhatsApp Ready');
  };

  return (
    <div>
      {/* Page Header (Hidden on Print) */}
      <div className="page-header no-print">
        <div className="page-header-info">
          <h1>Automotive Print & Document Center</h1>
          <p>Generate legal A4 stamp paper deeds, 80mm thermal counter slips, vehicle gate passes & WhatsApp receipts</p>
        </div>
        <div className="page-header-actions" style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-emerald" onClick={handleWhatsAppShare}>
            <Share2 size={16} /> WhatsApp Share
          </button>
          <button className="btn btn-primary" onClick={handlePrint}>
            <Printer size={16} /> Print Document Now
          </button>
        </div>
      </div>

      {/* Main Print Layout Grid (Responsive on Tablet & Mobile) */}
      <div className="print-center-grid" style={{ display: 'grid', gridTemplateColumns: '290px 1fr', gap: '24px', alignItems: 'start' }}>
        {/* Left Sidebar: 8 Document Types Selector & Record Picker (Hidden on Print) */}
        <div className="no-print" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Template Menu */}
          <div className="surface-card" style={{ padding: '16px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', marginBottom: '10px' }}>
              Select Document Template
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {DOCUMENT_TYPES.map((doc) => {
                const Icon = doc.icon;
                const isSelected = docType === doc.id;
                return (
                  <button
                    key={doc.id}
                    onClick={() => setDocType(doc.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: 'none',
                      background: isSelected ? '#2563EB' : 'transparent',
                      color: isSelected ? '#FFFFFF' : '#0F172A',
                      fontWeight: isSelected ? 800 : 600,
                      fontSize: '0.8125rem',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <Icon size={16} color={isSelected ? '#FFFFFF' : '#64748B'} />
                    <span>{doc.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Record Selector Card */}
          <div className="surface-card" style={{ padding: '16px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', marginBottom: '10px' }}>
              Select Source Transaction
            </div>

            {/* Sale Selector */}
            {['A4_SALE_DEED', 'THERMAL_80MM', 'PAYMENT_RECEIPT'].includes(docType) && (
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Linked Sale Order</label>
                <select
                  className="form-select"
                  value={selectedSaleId}
                  onChange={(e) => setSelectedSaleId(e.target.value)}
                >
                  {sales.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.id} • {s.buyer?.name} ({s.vehicleSummary?.split('•')[0]})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Vehicle Selector */}
            {docType === 'VEHICLE_SALE_SLIP' && (
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Select Floor Vehicle</label>
                <select
                  className="form-select"
                  value={selectedVehicleId}
                  onChange={(e) => setSelectedVehicleId(e.target.value)}
                >
                  {vehicles.map((v) => (
                    <option key={v.id} value={String(v.id)}>
                      {v.make} {v.model} ({v.registrationNo})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Purchase Selector */}
            {docType === 'PURCHASE_RECEIPT' && (
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Inward Purchase Order</label>
                <select
                  className="form-select"
                  value={selectedPurchaseId}
                  onChange={(e) => setSelectedPurchaseId(e.target.value)}
                >
                  {purchases.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.id} • {p.seller?.name} ({p.vehicleSummary?.split('•')[0]})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Commission Selector */}
            {docType === 'COMMISSION_RECEIPT' && (
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Commission Voucher</label>
                <select
                  className="form-select"
                  value={selectedCommissionId}
                  onChange={(e) => setSelectedCommissionId(e.target.value)}
                >
                  {commissions.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.id} • {c.recipientName} (₨ {Number(c.amount).toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Expense Selector */}
            {docType === 'EXPENSE_RECEIPT' && (
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Expense Voucher</label>
                <select
                  className="form-select"
                  value={selectedExpenseId}
                  onChange={(e) => setSelectedExpenseId(e.target.value)}
                >
                  {expenses.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.id} • {e.category} (₨ {Number(e.amount).toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Social Media & Branding Info */}
          <div className="surface-card" style={{ padding: '16px', fontSize: '0.8125rem' }}>
            <div style={{ fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>Active Branding Settings</div>
            <div style={{ color: '#475569', marginBottom: '4px' }}>TikTok: <strong>{settings.social?.tiktok}</strong></div>
            <div style={{ color: '#475569', marginBottom: '4px' }}>Instagram: <strong>{settings.social?.instagram}</strong></div>
            <div style={{ color: '#475569' }}>Phone: <strong>{settings.phone}</strong></div>
          </div>
        </div>

        {/* Right Area: Interactive Paper Canvas Preview & Print Target */}
        <div style={{ minWidth: 0 }}>
          {/* Top Preview Controls Bar */}
          <div
            className="no-print"
            style={{
              padding: '12px 18px',
              background: '#FFFFFF',
              borderRadius: '10px',
              border: '1px solid #E2E8F0',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', fontWeight: 700, color: '#334155' }}>
              <Eye size={16} color="#2563EB" />
              <span>Live Print Preview: {DOCUMENT_TYPES.find((d) => d.id === docType)?.label}</span>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn btn-secondary" onClick={handleWhatsAppShare} style={{ padding: '6px 12px', fontSize: '0.75rem' }}>
                <Share2 size={13} /> WhatsApp
              </button>
              <button className="btn btn-primary" onClick={handlePrint} style={{ padding: '6px 12px', fontSize: '0.75rem' }}>
                <Printer size={13} /> Print
              </button>
            </div>
          </div>

          {/* Target Printable Canvas */}
          <div id="printable-area">
            {docType === 'A4_SALE_DEED' && <SaleInvoiceA4 sale={currentSale} settings={settings} />}
            {docType === 'THERMAL_80MM' && <ThermalReceipt80mm sale={currentSale} settings={settings} />}
            {docType === 'VEHICLE_SALE_SLIP' && <VehicleSaleSlip sale={currentSale} vehicle={currentVehicle} settings={settings} />}
            {docType === 'PURCHASE_RECEIPT' && <PurchaseReceiptA4 purchase={currentPurchase} settings={settings} />}
            {docType === 'PAYMENT_RECEIPT' && <PaymentReceiptSlip payment={null} sale={currentSale} settings={settings} />}
            {docType === 'COMMISSION_RECEIPT' && <CommissionReceiptSlip commission={currentCommission} settings={settings} />}
            {docType === 'EXPENSE_RECEIPT' && <ExpenseReceiptSlip expense={currentExpense} settings={settings} />}
            {docType === 'CUSTOMER_STATEMENT' && <CustomerStatementSlip customerName={currentSale?.buyer?.name} customerSales={sales} settings={settings} />}
          </div>
        </div>
      </div>
    </div>
  );
};

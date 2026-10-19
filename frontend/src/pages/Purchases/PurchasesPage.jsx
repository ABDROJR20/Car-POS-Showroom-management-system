import React, { useState, useEffect } from 'react';
import {
  DataTable,
  SearchBar,
  StatCard,
} from '../../components/ui';
import {
  PurchaseFormModal,
  PurchaseDetailModal,
  PartialPaymentModal,
  PurchaseReceiptModal,
} from '../../components/purchases';
import { purchaseService } from '../../services/purchaseService';
import { Plus, ReceiptText, DollarSign, Printer, Eye, Share2, Wallet, Users, ShoppingBag } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const PurchasesPage = () => {
  const [purchases, setPurchases] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modals
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [detailModalPurchase, setDetailModalPurchase] = useState(null);
  const [partialPayPurchase, setPartialPayPurchase] = useState(null);
  const [receiptModalPurchase, setReceiptModalPurchase] = useState(null);

  const { showToast } = useToast();

  const loadData = () => {
    const list = purchaseService.getAllPurchases();
    setPurchases(list);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Compute Live Financial Stats
  const totalPurchasesCount = purchases.length;
  const totalAgreedCapEx = purchases.reduce((acc, curr) => acc + Number(curr.purchasePrice || 0), 0);
  const totalPaidOutflow = purchases.reduce((acc, curr) => acc + Number(curr.amountPaid || 0), 0);
  const totalRemainingPayables = purchases.reduce((acc, curr) => acc + Number(curr.remainingAmount || 0), 0);

  // Filter & Search Engine
  const filteredPurchases = purchases.filter((p) => {
    const term = searchTerm.toLowerCase().trim();
    const matchSearch =
      !term ||
      p.id.toLowerCase().includes(term) ||
      p.vehicleSummary?.toLowerCase().includes(term) ||
      p.seller?.name?.toLowerCase().includes(term) ||
      p.seller?.phone?.includes(term) ||
      p.seller?.city?.toLowerCase().includes(term);

    const matchType = filterType === 'ALL' || p.purchaseType === filterType;
    const matchStatus = filterStatus === 'ALL' || p.paymentStatus === filterStatus;

    return matchSearch && matchType && matchStatus;
  });

  // Handle New Purchase Transaction
  const handleCreatePurchase = (payload) => {
    try {
      const created = purchaseService.executePurchaseTransaction(payload);
      showToast('success', `Purchase deed ${created.id} executed successfully! Vehicle added to inventory.`, 'Purchase Executed');
      setFormModalOpen(false);
      loadData();
      setReceiptModalPurchase(created);
    } catch (err) {
      showToast('error', err.message || 'Transaction failed. All changes rolled back.', 'Transaction Rollback');
    }
  };

  // Handle Partial Payment
  const handleRecordPartialPayment = (purchaseId, amount, paymentMethod, accountPaidFrom, notes) => {
    try {
      const updated = purchaseService.recordPartialPayment(purchaseId, amount, paymentMethod, accountPaidFrom, notes);
      showToast('success', `Disbursed PKR ${Number(amount).toLocaleString()} towards ${purchaseId}. Remaining: PKR ${Number(updated.remainingAmount).toLocaleString()}`, 'Payment Recorded');
      loadData();
      if (detailModalPurchase && detailModalPurchase.id === purchaseId) {
        setDetailModalPurchase(updated);
      }
    } catch (err) {
      showToast('error', err.message || 'Payment recording failed.', 'Error');
    }
  };

  const tableColumns = [
    {
      key: 'id',
      header: 'Deed Voucher #',
      render: (val) => <span style={{ fontWeight: 700, color: 'var(--brand-gold)' }}>{val}</span>,
    },
    {
      key: 'vehicleSummary',
      header: 'Vehicle Particulars',
      render: (val) => <span style={{ fontWeight: 600, color: '#FFF' }}>{val}</span>,
    },
    {
      key: 'seller',
      header: 'Seller Particulars',
      render: (val) => (
        <div>
          <div style={{ fontWeight: 600, color: '#FFF' }}>{val?.name}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{val?.phone} • {val?.city || 'N/A'}</div>
        </div>
      ),
    },
    {
      key: 'purchaseType',
      header: 'Acquisition Type',
      render: (val) => (
        <span className={`badge ${val.includes('DIRECT') ? 'badge-ownership-showroom' : val.includes('INVESTOR') ? 'badge-ownership-investor' : 'badge-ownership-client'}`}>
          {val.replace(/_/g, ' ')}
        </span>
      ),
    },
    {
      key: 'purchasePrice',
      header: 'Agreed Price',
      align: 'right',
      render: (val) => <span style={{ fontWeight: 700 }}>₨ {Number(val).toLocaleString()}</span>,
    },
    {
      key: 'amountPaid',
      header: 'Amount Paid',
      align: 'right',
      render: (val) => <span style={{ color: 'var(--brand-emerald)', fontWeight: 600 }}>₨ {Number(val).toLocaleString()}</span>,
    },
    {
      key: 'remainingAmount',
      header: 'Payable Due',
      align: 'right',
      render: (val) => (
        <span style={{ color: Number(val) > 0 ? 'var(--brand-rose)' : 'var(--text-muted)', fontWeight: 700 }}>
          {Number(val) > 0 ? `₨ ${Number(val).toLocaleString()}` : 'Settled'}
        </span>
      ),
    },
    {
      key: 'paymentStatus',
      header: 'Status',
      render: (val) => {
        let badgeClass = 'badge-available';
        if (val === 'PARTIAL') badgeClass = 'badge-booked';
        if (val === 'CONSIGNMENT') badgeClass = 'badge-ownership-client';
        if (val === 'UNPAID') badgeClass = 'badge-sold';
        return <span className={`badge ${badgeClass}`}>{val}</span>;
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'center',
      render: (_, row) => (
        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
          <button
            className="btn btn-secondary"
            style={{ padding: '6px' }}
            title="View 360 Purchase Deed"
            onClick={() => setDetailModalPurchase(row)}
          >
            <Eye size={14} />
          </button>
          {row.remainingAmount > 0 && (
            <button
              className="btn btn-emerald"
              style={{ padding: '6px' }}
              title="Pay Outstanding Balance"
              onClick={() => setPartialPayPurchase(row)}
            >
              <DollarSign size={14} />
            </button>
          )}
          <button
            className="btn btn-secondary"
            style={{ padding: '6px' }}
            title="Print Legal Deed"
            onClick={() => setReceiptModalPurchase(row)}
          >
            <Printer size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="page-header-info">
          <h1>Vehicle Purchase & Inward Acquisition</h1>
          <p>
            Showroom asset acquisition, seller legal deeds, partial payment schedules & cash outflows
          </p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={() => setFormModalOpen(true)}>
            <Plus size={16} /> New Vehicle Purchase
          </button>
        </div>
      </div>

      {/* Financial Stats */}
      <div className="stat-grid">
        <StatCard
          title="Total Purchases Executed"
          value={totalPurchasesCount}
          subtitle="Acquisition Deeds"
          icon={ReceiptText}
          accentColor="#F59E0B"
        />
        <StatCard
          title="Total Acquisition CapEx"
          value={`₨ ${(totalAgreedCapEx / 1000000).toFixed(1)}M`}
          subtitle="Agreed Purchase Total"
          icon={ShoppingBag}
          accentColor="#3B82F6"
        />
        <StatCard
          title="Total Paid Outflow"
          value={`₨ ${(totalPaidOutflow / 1000000).toFixed(1)}M`}
          subtitle="Disbursed to Sellers"
          icon={Wallet}
          accentColor="#10B981"
        />
        <StatCard
          title="Outstanding Payables Due"
          value={`₨ ${(totalRemainingPayables / 1000000).toFixed(2)}M`}
          subtitle="Pending Seller Balances"
          icon={DollarSign}
          accentColor="#EF4444"
        />
      </div>

      {/* Filter and Search Bar */}
      <div
        className="surface-card"
        style={{
          padding: '16px 20px',
          marginBottom: '20px',
          display: 'flex',
          gap: '14px',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
        }}
      >
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by Purchase Deed #, Seller Name, Phone, or Car Model..."
          style={{ maxWidth: '480px' }}
        />

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <select
            className="form-select"
            style={{ width: 'auto', height: '38px', fontSize: '0.8125rem' }}
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="ALL">All Acquisition Types</option>
            <option value="DIRECT_SHOWROOM_PURCHASE">Direct Showroom Purchase</option>
            <option value="INVESTOR_PURCHASE">Investor Purchase</option>
            <option value="CLIENT_CONSIGNMENT_IN">Client Consignment</option>
            <option value="BROKER_DEAL_IN">Commission / Broker Acquisition</option>
          </select>

          <select
            className="form-select"
            style={{ width: 'auto', height: '38px', fontSize: '0.8125rem' }}
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="ALL">All Payment Statuses</option>
            <option value="PAID">Fully Paid</option>
            <option value="PARTIAL">Partial Balance Due</option>
            <option value="CONSIGNMENT">Consignment</option>
            <option value="UNPAID">Unpaid</option>
          </select>

          {(searchTerm || filterType !== 'ALL' || filterStatus !== 'ALL') && (
            <button
              className="btn btn-ghost"
              style={{ fontSize: '0.75rem', color: 'var(--brand-rose)' }}
              onClick={() => {
                setSearchTerm('');
                setFilterType('ALL');
                setFilterStatus('ALL');
                setCurrentPage(1);
              }}
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Purchases Data Table */}
      <DataTable
        columns={tableColumns}
        data={filteredPurchases.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
        emptyMessage="No purchase records match the selected criteria."
        pagination={{
          currentPage,
          totalPages: Math.ceil(filteredPurchases.length / pageSize) || 1,
          totalItems: filteredPurchases.length,
          pageSize,
          onPageChange: setCurrentPage,
          onPageSizeChange: (sz) => {
            setPageSize(sz);
            setCurrentPage(1);
          },
        }}
      />

      {/* New Purchase Modal Wizard */}
      <PurchaseFormModal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        onSave={handleCreatePurchase}
      />

      {/* Purchase 360 Detail Modal */}
      {detailModalPurchase && (
        <PurchaseDetailModal
          isOpen={!!detailModalPurchase}
          onClose={() => setDetailModalPurchase(null)}
          purchase={detailModalPurchase}
          onOpenPartialPayment={(p) => setPartialPayPurchase(p)}
          onOpenReceipt={(p) => setReceiptModalPurchase(p)}
        />
      )}

      {/* Partial Payment Modal */}
      {partialPayPurchase && (
        <PartialPaymentModal
          isOpen={!!partialPayPurchase}
          onClose={() => setPartialPayPurchase(null)}
          purchase={partialPayPurchase}
          onRecordPayment={handleRecordPartialPayment}
        />
      )}

      {/* Legal Purchase Receipt / Deed Modal */}
      {receiptModalPurchase && (
        <PurchaseReceiptModal
          isOpen={!!receiptModalPurchase}
          onClose={() => setReceiptModalPurchase(null)}
          purchase={receiptModalPurchase}
        />
      )}
    </div>
  );
};

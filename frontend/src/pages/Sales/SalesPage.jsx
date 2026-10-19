import React, { useState, useEffect } from 'react';
import { DataTable, SearchBar, StatCard } from '../../components/ui';
import {
  Plus,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Clock,
  Printer,
  Share2,
  Eye,
  PlusCircle,
  AlertOctagon,
  CheckCircle2,
  Filter,
  Car,
} from 'lucide-react';
import { salesService } from '../../services/salesService';
import { SaleFormModal } from '../../components/sales/SaleFormModal';
import { SaleDetailModal } from '../../components/sales/SaleDetailModal';
import { SalePaymentModal } from '../../components/sales/SalePaymentModal';
import { SaleInvoiceModal } from '../../components/sales/SaleInvoiceModal';
import { CancelSaleModal } from '../../components/sales/CancelSaleModal';
import { useToast } from '../../context/ToastContext';

export const SalesPage = () => {
  const [sales, setSales] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [ownershipFilter, setOwnershipFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modal States
  const [isNewSaleOpen, setIsNewSaleOpen] = useState(false);
  const [selectedSaleForDetail, setSelectedSaleForDetail] = useState(null);
  const [selectedSaleForPayment, setSelectedSaleForPayment] = useState(null);
  const [selectedSaleForInvoice, setSelectedSaleForInvoice] = useState(null);
  const [selectedSaleForCancel, setSelectedSaleForCancel] = useState(null);

  const { showToast } = useToast();

  const loadSales = () => {
    const data = salesService.getAllSales();
    setSales(data);
  };

  useEffect(() => {
    loadSales();

    const handleUpdate = () => {
      loadSales();
    };

    window.addEventListener('ahsan_inventory_updated', handleUpdate);
    return () => {
      window.removeEventListener('ahsan_inventory_updated', handleUpdate);
    };
  }, []);

  // Handlers
  const handleCreateSale = (payload) => {
    try {
      const created = salesService.executeSaleTransaction(payload);
      setIsNewSaleOpen(false);
      loadSales();
      showToast('success', `Sale deal ${created.id} executed successfully!`, 'Deal Closed');
      // Prompt invoice
      setSelectedSaleForInvoice(created);
    } catch (err) {
      showToast('error', err.message || 'Failed to execute sale transaction', 'Transaction Error');
    }
  };

  const handleSavePayment = (saleId, paymentData) => {
    try {
      const { sale, payment } = salesService.recordSalePayment(saleId, paymentData);
      setSelectedSaleForPayment(null);
      loadSales();
      if (selectedSaleForDetail && selectedSaleForDetail.id === saleId) {
        setSelectedSaleForDetail(sale);
      }
      showToast(
        'success',
        `Collected ₨ ${paymentData.amount.toLocaleString()} for ${saleId}. New Balance: ₨ ${sale.remainingBalance.toLocaleString()}`,
        'Payment Recorded'
      );
    } catch (err) {
      showToast('error', err.message || 'Failed to record payment', 'Error');
    }
  };

  const handleCancelSale = (saleId, reason) => {
    try {
      const cancelled = salesService.cancelSale(saleId, reason);
      setSelectedSaleForCancel(null);
      if (selectedSaleForDetail && selectedSaleForDetail.id === saleId) {
        setSelectedSaleForDetail(cancelled);
      }
      loadSales();
      showToast('warning', `Sale deal ${saleId} has been voided. Vehicle returned to stock.`, 'Deal Cancelled');
    } catch (err) {
      showToast('error', err.message || 'Failed to void sale deal', 'Error');
    }
  };

  // Metric Computations
  const activeSales = sales.filter((s) => s.status !== 'VOIDED');
  const totalSalesVolume = activeSales.reduce((sum, s) => sum + Number(s.netSalePrice || 0), 0);
  const totalAmountReceived = activeSales.reduce((sum, s) => sum + Number(s.amountReceived || 0), 0);
  const totalPendingReceivables = activeSales.reduce((sum, s) => sum + Number(s.remainingBalance || 0), 0);
  const totalGrossProfit = activeSales.reduce(
    (sum, s) => sum + Number(s.financials?.grossProfit || s.financials?.showroomNetEarnings || 0),
    0
  );

  // Filtered Sales
  const filteredSales = sales.filter((s) => {
    const matchesSearch =
      s.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.vehicleSummary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.buyer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.buyer?.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.buyer?.cnic?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'PAID_IN_FULL' && s.paymentStatus === 'PAID_IN_FULL') ||
      (statusFilter === 'TOKEN_ADVANCE' && s.paymentStatus === 'TOKEN_ADVANCE') ||
      (statusFilter === 'VOIDED' && s.status === 'VOIDED');

    const matchesOwnership =
      ownershipFilter === 'ALL' || s.ownershipType === ownershipFilter;

    return matchesSearch && matchesStatus && matchesOwnership;
  });

  const columns = [
    {
      key: 'id',
      header: 'Sale Order',
      render: (val, row) => (
        <div>
          <div style={{ fontWeight: 800, color: row.status === 'VOIDED' ? '#94A3B8' : '#D97706' }}>
            {val}
          </div>
          <div style={{ fontSize: '0.6875rem', color: '#64748B' }}>{row.saleDate}</div>
        </div>
      ),
    },
    {
      key: 'vehicleSummary',
      header: 'Vehicle Asset',
      render: (val, row) => (
        <div>
          <div style={{ fontWeight: 700, color: '#0F172A' }}>{val}</div>
          <div style={{ display: 'flex', gap: '6px', marginTop: '2px' }}>
            <span
              style={{
                fontSize: '0.6875rem',
                fontWeight: 700,
                padding: '1px 6px',
                borderRadius: '4px',
                background: row.ownershipType === 'Showroom' ? '#FEF3C7' : '#EFF6FF',
                color: row.ownershipType === 'Showroom' ? '#92400E' : '#1D4ED8',
              }}
            >
              {row.ownershipType} Owned
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'buyer',
      header: 'Buyer Details',
      render: (buyer) => (
        <div>
          <div style={{ fontWeight: 700, color: '#0F172A' }}>{buyer?.name || 'Walk-in'}</div>
          <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>{buyer?.phone}</div>
          {buyer?.cnic && <div style={{ fontSize: '0.6875rem', color: '#64748B' }}>{buyer.cnic}</div>}
        </div>
      ),
    },
    {
      key: 'netSalePrice',
      header: 'Net Price',
      align: 'right',
      render: (val) => (
        <span style={{ fontWeight: 800, color: '#0F172A' }}>₨ {Number(val).toLocaleString()}</span>
      ),
    },
    {
      key: 'amountReceived',
      header: 'Received',
      align: 'right',
      render: (val) => (
        <span style={{ fontWeight: 800, color: '#059669' }}>₨ {Number(val).toLocaleString()}</span>
      ),
    },
    {
      key: 'remainingBalance',
      header: 'Balance Due',
      align: 'right',
      render: (val, row) => (
        <div>
          {row.status === 'VOIDED' ? (
            <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Voided</span>
          ) : Number(val) > 0 ? (
            <span style={{ fontWeight: 800, color: '#DC2626' }}>₨ {Number(val).toLocaleString()}</span>
          ) : (
            <span style={{ fontWeight: 700, color: '#059669' }}>Cleared (₨ 0)</span>
          )}
        </div>
      ),
    },
    {
      key: 'financials',
      header: 'Gross Profit',
      align: 'right',
      render: (fin, row) => {
        if (row.status === 'VOIDED') return <span style={{ color: '#94A3B8' }}>₨ 0</span>;
        const profit = Number(fin?.grossProfit || fin?.showroomNetEarnings || 0);
        return (
          <span style={{ fontWeight: 800, color: profit >= 0 ? '#7C3AED' : '#DC2626' }}>
            ₨ {profit.toLocaleString()}
          </span>
        );
      },
    },
    {
      key: 'paymentStatus',
      header: 'Status',
      render: (val, row) => {
        if (row.status === 'VOIDED') {
          return <span className="badge badge-sold">Voided</span>;
        }
        if (val === 'PAID_IN_FULL' || row.remainingBalance === 0) {
          return <span className="badge badge-available">Paid in Full</span>;
        }
        return <span className="badge badge-booked">Token Advance</span>;
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'center',
      render: (_, row) => (
        <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
          <button
            className="btn btn-secondary"
            style={{ padding: '6px 8px' }}
            title="View Deal Dossier"
            onClick={() => setSelectedSaleForDetail(row)}
          >
            <Eye size={14} />
          </button>

          {row.status !== 'VOIDED' && row.remainingBalance > 0 && (
            <button
              className="btn btn-primary"
              style={{ padding: '6px 8px' }}
              title="Collect Balance"
              onClick={() => setSelectedSaleForPayment(row)}
            >
              <PlusCircle size={14} />
            </button>
          )}

          <button
            className="btn btn-blue"
            style={{ padding: '6px 8px' }}
            title="Print Sale Deed / Receipt"
            onClick={() => setSelectedSaleForInvoice(row)}
          >
            <Printer size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-info">
          <h1>Vehicle Sales & Commission Orders</h1>
          <p>Execute atomic showroom sales deals, commission registers, legal delivery deeds & balance collections</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={() => setIsNewSaleOpen(true)}>
            <Plus size={16} /> New Sale Deal
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="stat-grid">
        <StatCard
          title="Total Gross Sales Volume"
          value={`₨ ${(totalSalesVolume / 1000000).toFixed(1)}M`}
          subtitle={`${activeSales.length} Completed Deals`}
          icon={ShoppingCart}
          trend={{ value: '18% vs Sep', isPositive: true }}
          color="blue"
        />
        <StatCard
          title="Total Realized Deal Profit"
          value={`₨ ${(totalGrossProfit / 1000000).toFixed(2)}M`}
          subtitle="Net Showroom Margins"
          icon={TrendingUp}
          trend={{ value: 'High Yield', isPositive: true }}
          color="emerald"
        />
        <StatCard
          title="Pending Receivables / Balance"
          value={`₨ ${(totalPendingReceivables / 1000000).toFixed(2)}M`}
          subtitle={`${activeSales.filter((s) => s.remainingBalance > 0).length} Outstanding Balances`}
          icon={Clock}
          trend={{ value: `${activeSales.filter((s) => s.remainingBalance > 0).length} Pending`, isPositive: false }}
          color="gold"
        />
        <StatCard
          title="Cash Inflow Collected"
          value={`₨ ${(totalAmountReceived / 1000000).toFixed(1)}M`}
          subtitle="Realized in Accounts"
          icon={DollarSign}
          trend={{ value: '100% Verified', isPositive: true }}
          color="purple"
        />
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          marginBottom: '20px',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ flex: 1, minWidth: '280px' }}>
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search by Deal ID, Buyer Name, Phone, CNIC, or Vehicle Reg..."
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {/* Status Filter */}
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            style={{ width: '160px', padding: '8px 12px' }}
          >
            <option value="ALL">All Statuses</option>
            <option value="PAID_IN_FULL">Paid in Full</option>
            <option value="TOKEN_ADVANCE">Token Advance</option>
            <option value="VOIDED">Voided / Cancelled</option>
          </select>

          {/* Ownership Filter */}
          <select
            className="form-select"
            value={ownershipFilter}
            onChange={(e) => {
              setOwnershipFilter(e.target.value);
              setCurrentPage(1);
            }}
            style={{ width: '170px', padding: '8px 12px' }}
          >
            <option value="ALL">All Ownerships</option>
            <option value="Showroom">Showroom Owned</option>
            <option value="Client">Client Consignment</option>
            <option value="Investor">Investor Owned</option>
          </select>
        </div>
      </div>

      {/* Main Sales Data Table */}
      <DataTable
        columns={columns}
        data={filteredSales.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
        emptyMessage="No sale orders found matching search criteria."
        pagination={{
          currentPage,
          totalPages: Math.ceil(filteredSales.length / pageSize) || 1,
          totalItems: filteredSales.length,
          pageSize,
          onPageChange: setCurrentPage,
          onPageSizeChange: (sz) => {
            setPageSize(sz);
            setCurrentPage(1);
          },
        }}
      />

      {/* Modals */}
      {isNewSaleOpen && (
        <SaleFormModal
          isOpen={isNewSaleOpen}
          onClose={() => setIsNewSaleOpen(false)}
          onSave={handleCreateSale}
        />
      )}

      {selectedSaleForDetail && (
        <SaleDetailModal
          isOpen={!!selectedSaleForDetail}
          onClose={() => setSelectedSaleForDetail(null)}
          sale={selectedSaleForDetail}
          onAddPayment={(sale) => {
            setSelectedSaleForDetail(null);
            setSelectedSaleForPayment(sale);
          }}
          onCancelDeal={(sale) => {
            setSelectedSaleForDetail(null);
            setSelectedSaleForCancel(sale);
          }}
          onPrintInvoice={(sale) => {
            setSelectedSaleForDetail(null);
            setSelectedSaleForInvoice(sale);
          }}
        />
      )}

      {selectedSaleForPayment && (
        <SalePaymentModal
          isOpen={!!selectedSaleForPayment}
          onClose={() => setSelectedSaleForPayment(null)}
          sale={selectedSaleForPayment}
          onSavePayment={handleSavePayment}
        />
      )}

      {selectedSaleForInvoice && (
        <SaleInvoiceModal
          isOpen={!!selectedSaleForInvoice}
          onClose={() => setSelectedSaleForInvoice(null)}
          sale={selectedSaleForInvoice}
        />
      )}

      {selectedSaleForCancel && (
        <CancelSaleModal
          isOpen={!!selectedSaleForCancel}
          onClose={() => setSelectedSaleForCancel(null)}
          sale={selectedSaleForCancel}
          onConfirmCancel={handleCancelSale}
        />
      )}
    </div>
  );
};

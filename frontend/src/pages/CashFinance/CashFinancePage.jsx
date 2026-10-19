import React, { useState, useEffect } from 'react';
import { DataTable, SearchBar, StatCard } from '../../components/ui';
import {
  Wallet,
  Landmark,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  ArrowRightLeft,
  Calendar,
  Users,
  Coins,
  CheckCircle2,
  Printer,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { financeService } from '../../services/financeService';
import { RecordIncomeModal } from '../../components/finance/RecordIncomeModal';
import { RecordExpenseModal } from '../../components/finance/RecordExpenseModal';
import { RecordTransferModal } from '../../components/finance/RecordTransferModal';
import { OwnerPayoutModal } from '../../components/finance/OwnerPayoutModal';
import { DailyClosingModal } from '../../components/finance/DailyClosingModal';
import { useToast } from '../../context/ToastContext';

export const CashFinancePage = () => {
  const [ledger, setLedger] = useState([]);
  const [summary, setSummary] = useState(financeService.getAccountsSummary());
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [accountFilter, setAccountFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modals
  const [isIncomeOpen, setIsIncomeOpen] = useState(false);
  const [isExpenseOpen, setIsExpenseOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [isPayoutOpen, setIsPayoutOpen] = useState(false);
  const [isClosingOpen, setIsClosingOpen] = useState(false);

  const { showToast } = useToast();

  const loadData = () => {
    const entries = financeService.getAllLedgerEntries();
    setLedger(entries);
    setSummary(financeService.getAccountsSummary());
  };

  useEffect(() => {
    loadData();

    const handleUpdate = () => {
      loadData();
    };

    window.addEventListener('ahsan_cash_updated', handleUpdate);
    return () => {
      window.removeEventListener('ahsan_cash_updated', handleUpdate);
    };
  }, []);

  // Handlers
  const handleSaveIncome = (payload) => {
    try {
      financeService.recordIncome(payload);
      setIsIncomeOpen(false);
      loadData();
      showToast('success', `Cash inflow of ₨ ${payload.amount.toLocaleString()} posted to ledger!`, 'Inflow Recorded');
    } catch (err) {
      showToast('error', err.message || 'Failed to record income', 'Error');
    }
  };

  const handleSaveExpense = (payload) => {
    try {
      financeService.recordExpense(payload);
      setIsExpenseOpen(false);
      loadData();
      showToast('success', `Expense of ₨ ${payload.amount.toLocaleString()} recorded & debited from ledger!`, 'Expense Recorded');
    } catch (err) {
      showToast('error', err.message || 'Failed to record expense', 'Error');
    }
  };

  const handleSaveTransfer = (payload) => {
    try {
      financeService.recordTransfer(payload);
      setIsTransferOpen(false);
      loadData();
      showToast(
        'success',
        `Transferred ₨ ${payload.amount.toLocaleString()} from ${payload.fromAccount} to ${payload.toAccount}!`,
        'Transfer Completed'
      );
    } catch (err) {
      showToast('error', err.message || 'Failed to execute transfer', 'Error');
    }
  };

  const handleSavePayout = (payload) => {
    try {
      financeService.recordOwnerPayout(payload);
      setIsPayoutOpen(false);
      loadData();
      showToast(
        'success',
        `Consignment settlement payout of ₨ ${payload.amount.toLocaleString()} remitted to ${payload.ownerName}!`,
        'Settlement Payout'
      );
    } catch (err) {
      showToast('error', err.message || 'Failed to execute owner payout', 'Error');
    }
  };

  // Filtered entries
  const filtered = ledger.filter((item) => {
    const matchesSearch =
      item.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.narration?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.recipient?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.vehicleSummary?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === 'ALL' || item.type === typeFilter;
    const matchesAccount = accountFilter === 'ALL' || item.account === accountFilter;

    return matchesSearch && matchesType && matchesAccount;
  });

  const columns = [
    {
      key: 'id',
      header: 'Voucher #',
      render: (val, row) => (
        <div>
          <span style={{ fontWeight: 800, color: '#D97706' }}>{val}</span>
          <div style={{ fontSize: '0.6875rem', color: '#64748B' }}>{row.date}</div>
        </div>
      ),
    },
    {
      key: 'account',
      header: 'Account / Drawer',
      render: (val) => (
        <span style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.8125rem' }}>
          {val.replace(' (Counter)', '')}
        </span>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      render: (val, row) => (
        <div>
          <div style={{ fontWeight: 700, color: '#334155' }}>{val || 'General'}</div>
          {row.vehicleSummary && (
            <div style={{ fontSize: '0.6875rem', color: '#2563EB', fontWeight: 600 }}>
              🚗 {row.vehicleSummary}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Movement',
      render: (val) =>
        val === 'DEBIT' ? (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '3px 8px',
              borderRadius: '9999px',
              background: '#ECFDF5',
              color: '#065F46',
              fontWeight: 800,
              fontSize: '0.75rem',
            }}
          >
            <ArrowDownLeft size={13} /> Inflow (Debit)
          </span>
        ) : (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '3px 8px',
              borderRadius: '9999px',
              background: '#FEF2F2',
              color: '#991B1B',
              fontWeight: 800,
              fontSize: '0.75rem',
            }}
          >
            <ArrowUpRight size={13} /> Outflow (Credit)
          </span>
        ),
    },
    {
      key: 'amount',
      header: 'Amount',
      align: 'right',
      render: (val, row) => (
        <span
          style={{
            fontWeight: 800,
            fontSize: '0.9375rem',
            color: row.type === 'DEBIT' ? '#059669' : '#DC2626',
          }}
        >
          {row.type === 'DEBIT' ? '+' : '-'} ₨ {Number(val).toLocaleString()}
        </span>
      ),
    },
    {
      key: 'runningBalance',
      header: 'Running Balance',
      align: 'right',
      render: (val) => (
        <span style={{ fontWeight: 800, color: '#0F172A' }}>₨ {Number(val).toLocaleString()}</span>
      ),
    },
    {
      key: 'narration',
      header: 'Journal Narration',
      render: (val, row) => (
        <div style={{ maxWidth: '320px', fontSize: '0.8125rem', color: '#475569', lineHeight: 1.3 }}>
          {val}
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-info">
          <h1>Cash Ledger & Financial Treasury</h1>
          <p>Real-time cash in hand calculations, double-entry journals, bank accounts & treasury settlements</p>
        </div>
        <div className="page-header-actions" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary" onClick={() => setIsClosingOpen(true)}>
            <ShieldCheck size={16} /> Daily Cash Closing
          </button>
          <button className="btn btn-secondary" onClick={() => setIsTransferOpen(true)}>
            <ArrowRightLeft size={16} /> Account Transfer
          </button>
          <button className="btn btn-primary" onClick={() => setIsIncomeOpen(true)}>
            <Plus size={16} /> Record Cash Inflow
          </button>
          <button className="btn btn-danger" onClick={() => setIsExpenseOpen(true)} style={{ background: '#DC2626', color: '#FFF' }}>
            <Coins size={16} /> Record Expense
          </button>
          <button className="btn btn-emerald" onClick={() => setIsPayoutOpen(true)}>
            <Users size={16} /> Owner Settlement Payout
          </button>
        </div>
      </div>

      {/* Account Balances Grid */}
      <div className="stat-grid">
        <StatCard
          title="Cash In Hand (Counter Safe)"
          value={`₨ ${Number(summary.cashInHand).toLocaleString()}`}
          subtitle="Real-time Drawer Balance"
          icon={Wallet}
          trend={{ value: '100% Reconciled', isPositive: true }}
          color="emerald"
        />
        <StatCard
          title="Meezan Bank Current A/C"
          value={`₨ ${(summary.meezanBalance / 1000000).toFixed(2)}M`}
          subtitle="IBFT & Pay Orders"
          icon={Landmark}
          trend={{ value: 'Active', isPositive: true }}
          color="blue"
        />
        <StatCard
          title="HBL Business Account"
          value={`₨ ${(summary.hblBalance / 1000000).toFixed(2)}M`}
          subtitle="Secondary Reserve"
          icon={Building}
          trend={{ value: 'Active', isPositive: true }}
          color="gold"
        />
        <StatCard
          title="Total Liquid Capital"
          value={`₨ ${(summary.totalLiquid / 1000000).toFixed(2)}M`}
          subtitle="Combined Cash & Bank"
          icon={Coins}
          trend={{ value: 'Healthy Treasury', isPositive: true }}
          color="purple"
        />
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '14px',
          marginBottom: '20px',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ flex: 1, minWidth: '280px' }}>
          <SearchBar
            value={searchTerm}
            onChange={(val) => {
              setSearchTerm(val);
              setCurrentPage(1);
            }}
            placeholder="Search by Voucher #, Category, Narration, Car, or Payee..."
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <select
            className="form-select"
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setCurrentPage(1);
            }}
            style={{ width: '160px', padding: '8px 12px' }}
          >
            <option value="ALL">All Movements</option>
            <option value="DEBIT">Inflow (Debit)</option>
            <option value="CREDIT">Outflow (Credit)</option>
          </select>

          <select
            className="form-select"
            value={accountFilter}
            onChange={(e) => {
              setAccountFilter(e.target.value);
              setCurrentPage(1);
            }}
            style={{ width: '180px', padding: '8px 12px' }}
          >
            <option value="ALL">All Accounts</option>
            <option value="Cash in Hand (Counter)">Cash in Hand (Counter)</option>
            <option value="Meezan Bank Current A/C">Meezan Bank Current</option>
            <option value="HBL Business Account">HBL Business Account</option>
          </select>
        </div>
      </div>

      {/* Main Double-Entry Journal Table */}
      <DataTable
        columns={columns}
        data={filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
        emptyMessage="No ledger transactions found matching search criteria."
        pagination={{
          currentPage,
          totalPages: Math.ceil(filtered.length / pageSize) || 1,
          totalItems: filtered.length,
          pageSize,
          onPageChange: setCurrentPage,
          onPageSizeChange: (sz) => {
            setPageSize(sz);
            setCurrentPage(1);
          },
        }}
      />

      {/* Modals */}
      {isIncomeOpen && (
        <RecordIncomeModal
          isOpen={isIncomeOpen}
          onClose={() => setIsIncomeOpen(false)}
          onSave={handleSaveIncome}
        />
      )}

      {isExpenseOpen && (
        <RecordExpenseModal
          isOpen={isExpenseOpen}
          onClose={() => setIsExpenseOpen(false)}
          onSave={handleSaveExpense}
        />
      )}

      {isTransferOpen && (
        <RecordTransferModal
          isOpen={isTransferOpen}
          onClose={() => setIsTransferOpen(false)}
          onSave={handleSaveTransfer}
        />
      )}

      {isPayoutOpen && (
        <OwnerPayoutModal
          isOpen={isPayoutOpen}
          onClose={() => setIsPayoutOpen(false)}
          onSave={handleSavePayout}
        />
      )}

      {isClosingOpen && (
        <DailyClosingModal
          isOpen={isClosingOpen}
          onClose={() => setIsClosingOpen(false)}
        />
      )}
    </div>
  );
};

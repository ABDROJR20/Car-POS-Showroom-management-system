import React, { useState, useEffect } from 'react';
import { DataTable, SearchBar, StatCard } from '../../components/ui';
import { Coins, Wrench, Building, Plus, Filter, Car, Tag } from 'lucide-react';
import { financeService, EXPENSE_CATEGORIES } from '../../services/financeService';
import { RecordExpenseModal } from '../../components/finance/RecordExpenseModal';
import { useToast } from '../../context/ToastContext';

export const ExpensesPage = () => {
  const [expenses, setExpenses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const { showToast } = useToast();

  const loadExpenses = () => {
    const data = financeService.getAllExpenses();
    setExpenses(data);
  };

  useEffect(() => {
    loadExpenses();

    const handleUpdate = () => loadExpenses();
    window.addEventListener('ahsan_cash_updated', handleUpdate);
    return () => window.removeEventListener('ahsan_cash_updated', handleUpdate);
  }, []);

  const handleSaveExpense = (payload) => {
    try {
      financeService.recordExpense(payload);
      setIsRecordModalOpen(false);
      loadExpenses();
      showToast('success', `Expense voucher of ₨ ${payload.amount.toLocaleString()} posted to ledger!`, 'Expense Recorded');
    } catch (err) {
      showToast('error', err.message || 'Failed to record expense', 'Error');
    }
  };

  const totalExpenseVolume = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const vehicleDirectRepairs = expenses
    .filter((e) => e.isVehicleLinked)
    .reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const showroomOverheads = expenses
    .filter((e) => !e.isVehicleLinked)
    .reduce((sum, e) => sum + Number(e.amount || 0), 0);

  const filtered = expenses.filter((e) => {
    const matchesSearch =
      e.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.paidTo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.vehicleSummary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.narration?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'ALL' || e.category === categoryFilter;
    const matchesType =
      typeFilter === 'ALL' ||
      (typeFilter === 'VEHICLE_LINKED' && e.isVehicleLinked) ||
      (typeFilter === 'OVERHEAD' && !e.isVehicleLinked);

    return matchesSearch && matchesCategory && matchesType;
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
      key: 'category',
      header: 'Expense Category',
      render: (val) => <span style={{ fontWeight: 700, color: '#0F172A' }}>{val}</span>,
    },
    {
      key: 'scope',
      header: 'Scope / Asset Link',
      render: (_, row) =>
        row.isVehicleLinked ? (
          <div>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.6875rem',
                fontWeight: 800,
                padding: '2px 6px',
                borderRadius: '4px',
                background: '#FEF3C7',
                color: '#92400E',
                marginBottom: '2px',
              }}
            >
              🚗 Vehicle Direct Repair
            </span>
            <div style={{ fontSize: '0.75rem', color: '#2563EB', fontWeight: 600 }}>{row.vehicleSummary}</div>
          </div>
        ) : (
          <span
            style={{
              fontSize: '0.6875rem',
              fontWeight: 800,
              padding: '2px 6px',
              borderRadius: '4px',
              background: '#F1F5F9',
              color: '#475569',
            }}
          >
            🏢 Showroom Overhead
          </span>
        ),
    },
    {
      key: 'paidTo',
      header: 'Vendor / Payee',
      render: (val) => <span style={{ fontWeight: 600, color: '#334155' }}>{val}</span>,
    },
    {
      key: 'account',
      header: 'Paid From',
      render: (val) => <span style={{ fontSize: '0.8125rem' }}>{val.replace(' (Counter)', '')}</span>,
    },
    {
      key: 'amount',
      header: 'Amount',
      align: 'right',
      render: (val) => (
        <span style={{ fontWeight: 800, color: '#DC2626', fontSize: '0.9375rem' }}>
          ₨ {Number(val).toLocaleString()}
        </span>
      ),
    },
    {
      key: 'narration',
      header: 'Details & Bill #',
      render: (val, row) => (
        <div style={{ maxWidth: '280px', fontSize: '0.8125rem', color: '#64748B' }}>
          {val} {row.receiptNo ? `(Ref: ${row.receiptNo})` : ''}
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="page-header">
        <div className="page-header-info">
          <h1>Expenses & Refurbishment Manager</h1>
          <p>Vehicle-capitalized repair vouchers, showroom utilities, staff payroll & operating overheads</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={() => setIsRecordModalOpen(true)}>
            <Plus size={16} /> Record Expense Voucher
          </button>
        </div>
      </div>

      <div className="stat-grid">
        <StatCard
          title="Total Monthly Expenses"
          value={`₨ ${(totalExpenseVolume / 1000).toFixed(0)}k`}
          subtitle={`${expenses.length} Vouchers Recorded`}
          icon={Coins}
          color="rose"
        />
        <StatCard
          title="Vehicle Direct Repairs"
          value={`₨ ${(vehicleDirectRepairs / 1000).toFixed(0)}k`}
          subtitle="Capitalized to vehicle cost"
          icon={Wrench}
          color="gold"
        />
        <StatCard
          title="Showroom General Overheads"
          value={`₨ ${(showroomOverheads / 1000).toFixed(0)}k`}
          subtitle="Rent, Power, Salaries"
          icon={Building}
          color="blue"
        />
      </div>

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
            placeholder="Search by Voucher #, Vendor, Category, Vehicle Reg..."
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <select
            className="form-select"
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            style={{ width: '180px', padding: '8px 12px' }}
          >
            <option value="ALL">All Categories</option>
            {EXPENSE_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            className="form-select"
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setCurrentPage(1);
            }}
            style={{ width: '170px', padding: '8px 12px' }}
          >
            <option value="ALL">All Scopes</option>
            <option value="VEHICLE_LINKED">Vehicle Capitalized</option>
            <option value="OVERHEAD">Showroom Overhead</option>
          </select>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
        emptyMessage="No expense records match the selected filter."
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

      {isRecordModalOpen && (
        <RecordExpenseModal
          isOpen={isRecordModalOpen}
          onClose={() => setIsRecordModalOpen(false)}
          onSave={handleSaveExpense}
        />
      )}
    </div>
  );
};

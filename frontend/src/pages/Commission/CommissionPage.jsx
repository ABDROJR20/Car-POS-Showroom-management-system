import React, { useState, useEffect } from 'react';
import { DataTable, SearchBar, StatCard } from '../../components/ui';
import { Percent, Wallet, DollarSign, Plus, CheckCircle2, Clock, Users, Building2 } from 'lucide-react';
import { salesService } from '../../services/salesService';
import { useToast } from '../../context/ToastContext';

export const CommissionPage = () => {
  const [commissions, setCommissions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { showToast } = useToast();

  const loadCommissions = () => {
    const data = salesService.getAllCommissions();
    if (data.length === 0) {
      // Seed default commissions if empty
      const initial = [
        {
          id: 'COM-2026-0012',
          saleId: 'SAL-2026-0089',
          partyType: 'BROKER',
          recipientName: 'Malik Zafar (G-8 Markaz)',
          recipientPhone: '+92 333 5544332',
          vehicleSummary: 'Toyota Corolla Altis Grande (2022) • ICT-22-1190',
          amount: 40000,
          status: 'PAID',
          date: '2026-10-06',
          notes: 'Direct broker payment upon buyer deal signing',
        },
        {
          id: 'COM-2026-0011',
          saleId: 'SAL-2026-0088',
          partyType: 'BROKER',
          recipientName: 'Haji Zulfiqar Autos',
          recipientPhone: '+92 301 6655443',
          vehicleSummary: 'Honda Civic RS Turbo (2022) • LEA-22-3412',
          amount: 50000,
          status: 'PENDING',
          date: '2026-10-05',
          notes: 'Payable upon buyer clearance of remaining 6.5M balance',
        },
        {
          id: 'COM-2026-0010',
          saleId: 'SAL-2026-0089',
          partyType: 'SALES_AGENT',
          recipientName: 'Kamran (Showroom Sales Staff)',
          vehicleSummary: 'Toyota Corolla Altis Grande (2022) • ICT-22-1190',
          amount: 15000,
          status: 'PAID',
          date: '2026-10-06',
          notes: 'Internal deal closing bonus',
        },
      ];
      localStorage.setItem('ahsan_commissions_v1', JSON.stringify(initial));
      setCommissions(initial);
    } else {
      setCommissions(data);
    }
  };

  useEffect(() => {
    loadCommissions();
  }, []);

  const handleToggleStatus = (id, currentStatus) => {
    try {
      const nextStatus = currentStatus === 'PAID' ? 'PENDING' : 'PAID';
      salesService.updateCommissionStatus(id, nextStatus);
      loadCommissions();
      showToast('success', `Commission voucher ${id} status updated to ${nextStatus}`, 'Status Updated');
    } catch (err) {
      showToast('error', err.message || 'Failed to update commission', 'Error');
    }
  };

  const totalCommissions = commissions.reduce((sum, c) => sum + Number(c.amount || 0), 0);
  const paidCommissions = commissions.filter((c) => c.status === 'PAID').reduce((sum, c) => sum + Number(c.amount || 0), 0);
  const pendingCommissions = commissions.filter((c) => c.status === 'PENDING').reduce((sum, c) => sum + Number(c.amount || 0), 0);

  const filtered = commissions.filter((c) => {
    const matchesSearch =
      c.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.recipientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.vehicleSummary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.saleId?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === 'ALL' || c.partyType === filterType;
    return matchesSearch && matchesType;
  });

  const columns = [
    {
      key: 'id',
      header: 'Voucher #',
      render: (val, row) => (
        <div>
          <span style={{ fontWeight: 800, color: '#D97706' }}>{val}</span>
          <div style={{ fontSize: '0.6875rem', color: '#64748B' }}>Deal: {row.saleId}</div>
        </div>
      ),
    },
    {
      key: 'recipientName',
      header: 'Beneficiary / Broker',
      render: (val, row) => (
        <div>
          <div style={{ fontWeight: 700, color: '#0F172A' }}>{val}</div>
          <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
            {row.partyType === 'BROKER' ? '🏢 External Broker' : '👤 Internal Sales Staff'}
          </div>
        </div>
      ),
    },
    {
      key: 'vehicleSummary',
      header: 'Linked Vehicle Asset',
      render: (val) => <span style={{ fontWeight: 600, color: '#334155' }}>{val}</span>,
    },
    {
      key: 'date',
      header: 'Date',
      render: (val) => <span>{val}</span>,
    },
    {
      key: 'amount',
      header: 'Commission Amount',
      align: 'right',
      render: (val) => (
        <span style={{ fontWeight: 800, color: '#059669', fontSize: '0.9375rem' }}>
          ₨ {Number(val).toLocaleString()}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Payout Status',
      render: (val, row) => (
        <button
          onClick={() => handleToggleStatus(row.id, val)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
          }}
          title="Click to toggle Paid / Pending"
        >
          <span className={`badge ${val === 'PAID' ? 'badge-available' : 'badge-booked'}`}>
            {val === 'PAID' ? '✓ Paid' : '⏳ Pending'}
          </span>
        </button>
      ),
    },
  ];

  return (
    <div>
      <div className="page-header">
        <div className="page-header-info">
          <h1>Commission & Brokerage Register</h1>
          <p>Automated car dealer brokerage payouts, agent commissions & consignment revenue ledger</p>
        </div>
      </div>

      <div className="stat-grid">
        <StatCard
          title="Total Commission Volume"
          value={`₨ ${(totalCommissions / 1000).toFixed(0)}k`}
          subtitle={`${commissions.length} Total Vouchers`}
          icon={Percent}
          color="blue"
        />
        <StatCard
          title="Disbursed / Paid Payouts"
          value={`₨ ${(paidCommissions / 1000).toFixed(0)}k`}
          subtitle="Cleared from Cash Ledger"
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Pending Broker Liabilities"
          value={`₨ ${(pendingCommissions / 1000).toFixed(0)}k`}
          subtitle={`${commissions.filter((c) => c.status === 'PENDING').length} Pending Deals`}
          icon={Clock}
          color="gold"
        />
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '280px' }}>
          <SearchBar
            value={searchTerm}
            onChange={(val) => {
              setSearchTerm(val);
              setCurrentPage(1);
            }}
            placeholder="Search by Voucher, Broker Name, Linked Deal, or Vehicle..."
          />
        </div>

        <select
          className="form-select"
          value={filterType}
          onChange={(e) => {
            setFilterType(e.target.value);
            setCurrentPage(1);
          }}
          style={{ width: '180px', padding: '8px 12px' }}
        >
          <option value="ALL">All Beneficiaries</option>
          <option value="BROKER">External Brokers</option>
          <option value="SALES_AGENT">Internal Staff</option>
        </select>
      </div>

      <DataTable
        columns={columns}
        data={filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
        emptyMessage="No commission vouchers found matching search criteria."
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
    </div>
  );
};

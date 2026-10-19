import React, { useState, useEffect } from 'react';
import { DataTable, SearchBar, StatCard } from '../../components/ui';
import {
  Plus,
  Sparkles,
  Phone,
  CheckCircle2,
  ClipboardList,
  Edit2,
  Trash2,
  Eye,
  Share2,
  Car,
  DollarSign,
  Users,
} from 'lucide-react';
import { demandService } from '../../services/demandService';
import { DemandFormModal } from '../../components/demand/DemandFormModal';
import { DemandMatchModal } from '../../components/demand/DemandMatchModal';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';

export const CarDemandPage = () => {
  const [demands, setDemands] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [makeFilter, setMakeFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDemand, setEditingDemand] = useState(null);
  const [selectedDemandForMatch, setSelectedDemandForMatch] = useState(null);

  const navigate = useNavigate();
  const { showToast } = useToast();

  const loadDemands = () => {
    const data = demandService.getAllDemands();
    setDemands(data);
  };

  useEffect(() => {
    loadDemands();

    const handleUpdate = () => loadDemands();
    window.addEventListener('ahsan_inventory_updated', handleUpdate);
    return () => window.removeEventListener('ahsan_inventory_updated', handleUpdate);
  }, []);

  const handleSaveDemand = (payload) => {
    try {
      if (editingDemand) {
        demandService.updateDemand(editingDemand.id, payload);
        showToast('success', `Demand ${editingDemand.id} updated successfully!`, 'Demand Updated');
      } else {
        const created = demandService.createDemand(payload);
        showToast(
          'success',
          `Customer demand registered for ${created.make} ${created.model}! Status: ${created.status}`,
          'Demand Created'
        );
      }
      setIsFormOpen(false);
      setEditingDemand(null);
      loadDemands();
    } catch (err) {
      showToast('error', err.message || 'Failed to save demand', 'Error');
    }
  };

  const handleDelete = (id) => {
    if (window.confirm(`Are you sure you want to delete inquiry ${id}?`)) {
      demandService.deleteDemand(id);
      loadDemands();
      showToast('info', `Inquiry ${id} removed.`, 'Deleted');
    }
  };

  const handleLaunchSale = (matchedCar, demand) => {
    navigate('/sales', { state: { preselectedVehicleId: matchedCar.id, buyerName: demand.customer, buyerPhone: demand.phone } });
  };

  // Metrics
  const activeDemands = demands.filter((d) => d.status === 'Active');
  const matchedDemands = demands.filter((d) => d.status === 'Matched');
  const purchasedDemands = demands.filter((d) => d.status === 'Purchased');
  const potentialVolume = demands
    .filter((d) => ['Active', 'Matched'].includes(d.status))
    .reduce((sum, d) => sum + Number(d.budget || 0), 0);

  // Filtered List
  const filtered = demands.filter((d) => {
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !term ||
      d.id?.toLowerCase().includes(term) ||
      d.customer?.toLowerCase().includes(term) ||
      d.phone?.toLowerCase().includes(term) ||
      d.make?.toLowerCase().includes(term) ||
      d.model?.toLowerCase().includes(term) ||
      d.variant?.toLowerCase().includes(term);

    const matchesStatus = statusFilter === 'ALL' || d.status === statusFilter;
    const matchesMake = makeFilter === 'ALL' || d.make === makeFilter;

    return matchesSearch && matchesStatus && matchesMake;
  });

  const columns = [
    {
      key: 'id',
      header: 'Demand #',
      render: (val, row) => (
        <div>
          <span style={{ fontWeight: 800, color: '#D97706' }}>{val}</span>
          <div style={{ fontSize: '0.6875rem', color: '#64748B' }}>{row.date}</div>
        </div>
      ),
    },
    {
      key: 'customer',
      header: 'Prospective Buyer',
      render: (val, row) => (
        <div>
          <div style={{ fontWeight: 800, color: '#0F172A' }}>{val}</div>
          <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>{row.phone}</div>
          {row.city && <div style={{ fontSize: '0.6875rem', color: '#64748B' }}>{row.city}</div>}
        </div>
      ),
    },
    {
      key: 'requiredVehicle',
      header: 'Vehicle Requirement',
      render: (_, row) => (
        <div>
          <div style={{ fontWeight: 800, color: '#0F172A' }}>
            {row.make} {row.model}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#475569' }}>
            {row.variant || 'Any Trim'} • {row.minYear}-{row.maxYear}
          </div>
        </div>
      ),
    },
    {
      key: 'budget',
      header: 'Budget Limit',
      align: 'right',
      render: (val) => (
        <div>
          {Number(val) > 0 ? (
            <span style={{ fontWeight: 800, color: '#059669', fontSize: '0.875rem' }}>
              ₨ {Number(val).toLocaleString()}
            </span>
          ) : (
            <span style={{ color: '#64748B', fontSize: '0.75rem' }}>Market Rate</span>
          )}
        </div>
      ),
    },
    {
      key: 'matchedVehicle',
      header: 'Auto-Matched Floor Stock',
      render: (_, row) => (
        <div>
          {row.matchedVehicleSummary ? (
            <div
              onClick={() => setSelectedDemandForMatch(row)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 8px',
                borderRadius: '6px',
                background: '#EFF6FF',
                border: '1px solid #BFDBFE',
                cursor: 'pointer',
              }}
              title="Click to view matchmaker"
            >
              <Sparkles size={13} color="#2563EB" />
              <span style={{ fontSize: '0.75rem', color: '#1D4ED8', fontWeight: 700 }}>
                {row.matchedVehicleSummary}
              </span>
            </div>
          ) : (
            <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Searching Stock...</span>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (val) => (
        <span
          className={`badge ${
            val === 'Matched'
              ? 'badge-available'
              : val === 'Purchased'
              ? 'badge-sold'
              : val === 'Active'
              ? 'badge-booked'
              : 'badge-inspection'
          }`}
        >
          {val}
        </span>
      ),
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
            title="Open Auto-Matchmaker & WhatsApp Lead"
            onClick={() => setSelectedDemandForMatch(row)}
          >
            <Sparkles size={14} color="#2563EB" />
          </button>
          <button
            className="btn btn-secondary"
            style={{ padding: '6px 8px' }}
            title="Edit Demand"
            onClick={() => {
              setEditingDemand(row);
              setIsFormOpen(true);
            }}
          >
            <Edit2 size={14} />
          </button>
          <button
            className="btn btn-danger"
            style={{ padding: '6px 8px' }}
            title="Delete Inquiry"
            onClick={() => handleDelete(row.id)}
          >
            <Trash2 size={14} />
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
          <h1>Car Demand Sheet & AI Matchmaker</h1>
          <p>Prospective customer vehicle requirements automatically matched against floor inventory & WhatsApp lead follow-ups</p>
        </div>
        <div className="page-header-actions">
          <button
            className="btn btn-primary"
            onClick={() => {
              setEditingDemand(null);
              setIsFormOpen(true);
            }}
          >
            <Plus size={16} /> Register Customer Demand
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="stat-grid">
        <StatCard
          title="Active Customer Demands"
          value={String(activeDemands.length)}
          subtitle="Open buyer leads"
          icon={ClipboardList}
          color="blue"
        />
        <StatCard
          title="Auto-Matched to Stock"
          value={String(matchedDemands.length)}
          subtitle="Cars available on floor"
          icon={Sparkles}
          color="emerald"
        />
        <StatCard
          title="Deals Closed / Won"
          value={String(purchasedDemands.length)}
          subtitle="Completed sales"
          icon={CheckCircle2}
          color="gold"
        />
        <StatCard
          title="Potential Inquiries Pipeline"
          value={`₨ ${(potentialVolume / 1000000).toFixed(1)}M`}
          subtitle="Aggregate buyer budget"
          icon={DollarSign}
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
            onChange={setSearchTerm}
            placeholder="Search by Demand #, Customer Name, Phone, Make, or Model..."
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
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
            <option value="Active">Active Leads</option>
            <option value="Matched">Auto-Matched</option>
            <option value="Purchased">Purchased / Won</option>
            <option value="Closed">Closed</option>
          </select>

          <select
            className="form-select"
            value={makeFilter}
            onChange={(e) => {
              setMakeFilter(e.target.value);
              setCurrentPage(1);
            }}
            style={{ width: '160px', padding: '8px 12px' }}
          >
            <option value="ALL">All Makes</option>
            <option value="Toyota">Toyota</option>
            <option value="Honda">Honda</option>
            <option value="Suzuki">Suzuki</option>
            <option value="Kia">Kia</option>
            <option value="Hyundai">Hyundai</option>
          </select>
        </div>
      </div>

      {/* Main Demands Table */}
      <DataTable
        columns={columns}
        data={filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
        emptyMessage="No customer demands match the selected criteria."
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
      {isFormOpen && (
        <DemandFormModal
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingDemand(null);
          }}
          onSave={handleSaveDemand}
          initialData={editingDemand}
        />
      )}

      {selectedDemandForMatch && (
        <DemandMatchModal
          isOpen={!!selectedDemandForMatch}
          onClose={() => setSelectedDemandForMatch(null)}
          demand={selectedDemandForMatch}
          onStatusChange={() => {
            loadDemands();
            if (selectedDemandForMatch) {
              const updated = demandService.getDemandById(selectedDemandForMatch.id);
              setSelectedDemandForMatch(updated);
            }
          }}
          onLaunchSale={handleLaunchSale}
        />
      )}
    </div>
  );
};

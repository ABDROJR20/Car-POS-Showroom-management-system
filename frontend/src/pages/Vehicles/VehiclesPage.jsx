import React, { useState, useEffect } from 'react';
import {
  VehicleCard,
  DataTable,
  SearchBar,
  StatCard,
  ConfirmDialog,
  Pagination,
} from '../../components/ui';
import {
  VehicleFormModal,
  VehicleDossierModal,
} from '../../components/vehicles';
import { vehicleStorage } from '../../services/vehicleStorage';
import { Plus, LayoutGrid, List, Car, ShieldCheck, Eye, Edit, Trash2, Share2, ShoppingCart, RefreshCw, Filter } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const VehiclesPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [metrics, setMetrics] = useState({
    availableCount: 0,
    reservedCount: 0,
    soldCount: 0,
    inWorkshopCount: 0,
    totalValuation: 0,
    activeFloorCount: 0,
  });

  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOwnership, setFilterOwnership] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterMake, setFilterMake] = useState('ALL');
  const [filterFuel, setFilterFuel] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  // Modals
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [vehicleToEdit, setVehicleToEdit] = useState(null);
  const [dossierVehicle, setDossierVehicle] = useState(null);
  const [deleteConfirmVehicle, setDeleteConfirmVehicle] = useState(null);

  const { showToast } = useToast();

  const refreshData = () => {
    const list = vehicleStorage.getAllVehicles();
    const stats = vehicleStorage.getStockMetrics();
    setVehicles(list);
    setMetrics(stats);
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Multi-Field Search & Filter Engine
  const filteredVehicles = vehicles.filter((v) => {
    const term = searchTerm.toLowerCase().trim();
    const matchSearch =
      !term ||
      v.stockCode?.toLowerCase().includes(term) ||
      v.registrationNo?.toLowerCase().includes(term) ||
      v.chassisNo?.toLowerCase().includes(term) ||
      v.engineNo?.toLowerCase().includes(term) ||
      v.make?.toLowerCase().includes(term) ||
      v.model?.toLowerCase().includes(term) ||
      v.variant?.toLowerCase().includes(term) ||
      v.ownerName?.toLowerCase().includes(term) ||
      v.status?.toLowerCase().includes(term);

    const matchOwnership = filterOwnership === 'ALL' || v.ownershipType === filterOwnership;
    const matchStatus = filterStatus === 'ALL' || v.status === filterStatus;
    const matchMake = filterMake === 'ALL' || v.make === filterMake;
    const matchFuel = filterFuel === 'ALL' || v.fuelType === filterFuel;

    return matchSearch && matchOwnership && matchStatus && matchMake && matchFuel;
  });

  // Handle Save (Add / Edit)
  const handleSaveVehicle = (data) => {
    try {
      if (vehicleToEdit) {
        const updated = vehicleStorage.updateVehicle(vehicleToEdit.id, data);
        showToast('success', `${updated.make} ${updated.model} updated successfully!`, 'Vehicle Updated');
      } else {
        const created = vehicleStorage.createVehicle(data);
        showToast('success', `${created.make} ${created.model} registered with Stock Code ${created.stockCode}!`, 'Vehicle Registered');
      }
      setFormModalOpen(false);
      setVehicleToEdit(null);
      refreshData();
      if (dossierVehicle) {
        setDossierVehicle(vehicleStorage.getVehicleById(dossierVehicle.id));
      }
    } catch (err) {
      showToast('error', err.message || 'Failed to save vehicle.', 'Validation Error');
    }
  };

  // Handle Status Quick Change
  const handleStatusChange = (vehicleId, newStatus) => {
    try {
      const updated = vehicleStorage.changeStatus(vehicleId, newStatus, `Status updated to ${newStatus}`);
      refreshData();
      if (dossierVehicle && dossierVehicle.id === vehicleId) {
        setDossierVehicle(updated);
      }
      showToast('info', `Status of ${updated.stockCode} changed to "${newStatus}"`, 'Status Updated');
    } catch (err) {
      showToast('error', err.message || 'Failed to update status', 'Error');
    }
  };

  // Handle Delete
  const handleDelete = () => {
    if (!deleteConfirmVehicle) return;
    vehicleStorage.deleteVehicle(deleteConfirmVehicle.id);
    setDeleteConfirmVehicle(null);
    refreshData();
    showToast('info', 'Vehicle record deleted from inventory.', 'Deleted');
  };

  // Table Columns
  const tableColumns = [
    {
      key: 'stockCode',
      header: 'Stock Code',
      render: (val) => <span style={{ fontWeight: 700, color: 'var(--brand-gold)' }}>{val}</span>,
    },
    {
      key: 'vehicle',
      header: 'Vehicle Description',
      render: (_, row) => (
        <div>
          <div style={{ fontWeight: 700, color: '#FFF' }}>{row.make} {row.model} ({row.modelYear})</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{row.variant || ''} • {row.colorExterior}</div>
        </div>
      ),
    },
    {
      key: 'registrationNo',
      header: 'Reg Plate / VIN',
      render: (val, row) => (
        <div>
          <div style={{ fontFamily: 'monospace', fontWeight: 700 }}>{val || 'APPLIED FOR'}</div>
          <div style={{ fontSize: '0.6875rem', color: 'var(--brand-gold)', fontFamily: 'monospace' }}>{row.chassisNo}</div>
        </div>
      ),
    },
    {
      key: 'engineNo',
      header: 'Engine No',
      render: (val) => <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{val || 'N/A'}</span>,
    },
    {
      key: 'ownershipType',
      header: 'Ownership',
      render: (val) => (
        <span className={`badge badge-ownership-${val === 'Showroom' ? 'showroom' : val === 'Client' ? 'client' : 'investor'}`}>
          {val}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (val) => {
        let badgeClass = 'badge-available';
        if (val === 'Reserved') badgeClass = 'badge-booked';
        if (val === 'Sold') badgeClass = 'badge-sold';
        if (val === 'In Workshop') badgeClass = 'badge-inspection';
        return <span className={`badge ${badgeClass}`}>{val}</span>;
      },
    },
    {
      key: 'demandPrice',
      header: 'Demand Asking',
      align: 'right',
      render: (val) => <span style={{ fontWeight: 700, color: 'var(--brand-gold)' }}>₨ {Number(val).toLocaleString()}</span>,
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
            title="View 360 Dossier"
            onClick={() => setDossierVehicle(row)}
          >
            <Eye size={14} />
          </button>
          <button
            className="btn btn-secondary"
            style={{ padding: '6px' }}
            title="Edit Vehicle"
            onClick={() => {
              setVehicleToEdit(row);
              setFormModalOpen(true);
            }}
          >
            <Edit size={14} />
          </button>
          <button
            className="btn btn-danger"
            style={{ padding: '6px' }}
            title="Delete Vehicle"
            onClick={() => setDeleteConfirmVehicle(row)}
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  const uniqueMakes = Array.from(new Set(vehicles.map((v) => v.make).filter(Boolean)));

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="page-header-info">
          <h1>Vehicle Management & Inventory</h1>
          <p>
            Asset-traceable used car registry with 6-seals inspection & document vault
          </p>
        </div>
        <div className="page-header-actions">
          {/* Grid / Table View Switcher */}
          <div style={{ display: 'flex', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', padding: '3px' }}>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                padding: '6px 10px',
                border: 'none',
                background: viewMode === 'grid' ? 'var(--bg-surface)' : 'transparent',
                color: viewMode === 'grid' ? '#FFF' : 'var(--text-muted)',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
              }}
              title="Grid View"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setViewMode('table')}
              style={{
                padding: '6px 10px',
                border: 'none',
                background: viewMode === 'table' ? 'var(--bg-surface)' : 'transparent',
                color: viewMode === 'table' ? '#FFF' : 'var(--text-muted)',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
              }}
              title="Table View"
            >
              <List size={16} />
            </button>
          </div>

          <button
            className="btn btn-primary"
            onClick={() => {
              setVehicleToEdit(null);
              setFormModalOpen(true);
            }}
          >
            <Plus size={16} /> Add Vehicle Asset
          </button>
        </div>
      </div>

      {/* Dynamic Derived Stock KPI Counters (Zero static counter storage) */}
      <div className="stat-grid">
        <StatCard
          title="Available on Floor"
          value={metrics.availableCount}
          subtitle="Ready for Immediate Sale"
          icon={Car}
          accentColor="#10B981"
          badgeText="Active Stock"
        />
        <StatCard
          title="Reserved (Token Paid)"
          value={metrics.reservedCount}
          subtitle="Deal in Progress"
          icon={Car}
          accentColor="#F59E0B"
        />
        <StatCard
          title="In Workshop / Detailing"
          value={metrics.inWorkshopCount}
          subtitle="Pre-sale Refurbishment"
          icon={Car}
          accentColor="#3B82F6"
        />
        <StatCard
          title="Active Stock Valuation"
          value={`₨ ${(metrics.totalValuation / 1000000).toFixed(1)}M`}
          subtitle={`${metrics.activeFloorCount} Floor Cars Total`}
          icon={Car}
          accentColor="#8B5CF6"
        />
      </div>

      {/* Multi-Field Search and Filter Controls */}
      <div
        className="surface-card"
        style={{
          padding: '16px 20px',
          marginBottom: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}
      >
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search by Reg Plate, VIN Chassis, Engine No, Make, Model, or Owner..."
            style={{ maxWidth: '520px' }}
          />

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <select
              className="form-select"
              style={{ width: 'auto', height: '38px', fontSize: '0.8125rem' }}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="ALL">All Statuses ({vehicles.length})</option>
              <option value="Available">Available ({metrics.availableCount})</option>
              <option value="Reserved">Reserved ({metrics.reservedCount})</option>
              <option value="In Workshop">In Workshop</option>
              <option value="Pending Documentation">Pending Documentation</option>
              <option value="Sold">Sold ({metrics.soldCount})</option>
            </select>

            <select
              className="form-select"
              style={{ width: 'auto', height: '38px', fontSize: '0.8125rem' }}
              value={filterOwnership}
              onChange={(e) => setFilterOwnership(e.target.value)}
            >
              <option value="ALL">All Ownerships</option>
              <option value="Showroom">Showroom Owned</option>
              <option value="Client">Client Consignment</option>
              <option value="Investor">Investor Funded</option>
            </select>

            <select
              className="form-select"
              style={{ width: 'auto', height: '38px', fontSize: '0.8125rem' }}
              value={filterMake}
              onChange={(e) => setFilterMake(e.target.value)}
            >
              <option value="ALL">All Makes</option>
              {uniqueMakes.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>

            {(searchTerm || filterStatus !== 'ALL' || filterOwnership !== 'ALL' || filterMake !== 'ALL') && (
              <button
                className="btn btn-ghost"
                style={{ fontSize: '0.75rem', color: 'var(--brand-rose)' }}
                onClick={() => {
                  setSearchTerm('');
                  setFilterStatus('ALL');
                  setFilterOwnership('ALL');
                  setFilterMake('ALL');
                }}
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid or Table View */}
      {viewMode === 'grid' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="cards-grid">
            {filteredVehicles.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((v) => (
              <VehicleCard
                key={v.id}
                vehicle={{
                  ...v,
                  variant: v.variant || '',
                  year: v.modelYear,
                  color: v.colorExterior,
                  primaryImage: v.images?.[0]?.url || 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=600&q=80',
                }}
                onView={() => setDossierVehicle(v)}
                onSell={() => {
                  handleStatusChange(v.id, 'Sold');
                  showToast('success', `${v.make} ${v.model} marked as SOLD. Stock updated dynamically.`, 'Vehicle Sold');
                }}
                onShareWhatsApp={() => {
                  const text = `*Ahsan Autos Showroom - Vehicle Dossier*\n*${v.make} ${v.model} (${v.modelYear})*\n• Reg Plate: ${v.registrationNo || 'APPLIED FOR'}\n• Chassis VIN: ${v.chassisNo}\n• Demand Price: PKR ${Number(v.demandPrice).toLocaleString()}\n• 6-Seals Condition: ${v.condition?.overallScore || 'Certified'}\n\nCall/WhatsApp: +92 300 1234567`;
                  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                }}
              />
            ))}
          </div>

          {filteredVehicles.length > pageSize && (
            <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(filteredVehicles.length / pageSize) || 1}
                totalItems={filteredVehicles.length}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
                onPageSizeChange={(sz) => {
                  setPageSize(sz);
                  setCurrentPage(1);
                }}
              />
            </div>
          )}
        </div>
      ) : (
        <DataTable
          columns={tableColumns}
          data={filteredVehicles.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
          emptyMessage="No vehicles found matching search criteria."
          pagination={{
            currentPage,
            totalPages: Math.ceil(filteredVehicles.length / pageSize) || 1,
            totalItems: filteredVehicles.length,
            pageSize,
            onPageChange: setCurrentPage,
            onPageSizeChange: (sz) => {
              setPageSize(sz);
              setCurrentPage(1);
            },
          }}
        />
      )}

      {/* Add / Edit Vehicle Modal */}
      <VehicleFormModal
        isOpen={formModalOpen}
        onClose={() => {
          setFormModalOpen(false);
          setVehicleToEdit(null);
        }}
        onSave={handleSaveVehicle}
        vehicleToEdit={vehicleToEdit}
      />

      {/* 360 Vehicle Dossier Modal */}
      {dossierVehicle && (
        <VehicleDossierModal
          isOpen={!!dossierVehicle}
          onClose={() => setDossierVehicle(null)}
          vehicle={dossierVehicle}
          onEdit={(v) => {
            setDossierVehicle(null);
            setVehicleToEdit(v);
            setFormModalOpen(true);
          }}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmVehicle && (
        <ConfirmDialog
          isOpen={!!deleteConfirmVehicle}
          onClose={() => setDeleteConfirmVehicle(null)}
          onConfirm={handleDelete}
          title="Delete Vehicle Asset"
          message={`Are you sure you want to delete ${deleteConfirmVehicle.make} ${deleteConfirmVehicle.model} (${deleteConfirmVehicle.stockCode}) from the showroom inventory? This action cannot be undone.`}
          confirmText="Delete Vehicle"
          type="danger"
        />
      )}
    </div>
  );
};

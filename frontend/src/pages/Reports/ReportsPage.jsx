import React, { useState, useEffect, useMemo } from 'react';
import { DataTable, SearchBar, StatCard } from '../../components/ui';
import {
  FileBarChart2,
  TrendingUp,
  DollarSign,
  Car,
  Download,
  Printer,
  Calendar,
  Filter,
  Layers,
  ChevronRight,
  Sparkles,
  Wallet,
  Coins,
  Percent,
  CheckCircle2,
} from 'lucide-react';
import { reportService, ALL_REPORTS, REPORT_CATEGORIES } from '../../services/reportService';
import { useToast } from '../../context/ToastContext';

export const ReportsPage = () => {
  const [selectedReportId, setSelectedReportId] = useState('VEHICLE_PROFITABILITY');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  const { showToast } = useToast();

  // Quick Date Preset Handlers
  const handleSetDatePreset = (preset) => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    if (preset === 'TODAY') {
      setStartDate(todayStr);
      setEndDate(todayStr);
    } else if (preset === 'THIS_MONTH') {
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
      setStartDate(firstDay);
      setEndDate(todayStr);
    } else if (preset === 'LAST_30') {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      setStartDate(thirtyDaysAgo);
      setEndDate(todayStr);
    } else if (preset === 'ALL_TIME') {
      setStartDate('');
      setEndDate('');
    }
  };

  // Generate Active Report Dataset
  const reportData = useMemo(() => {
    return reportService.generateReport(selectedReportId, {
      startDate,
      endDate,
      searchTerm,
    });
  }, [selectedReportId, startDate, endDate, searchTerm]);

  // Export to CSV
  const handleExportCSV = () => {
    if (!reportData.rows || reportData.rows.length === 0) {
      showToast('error', 'No data available in current report to export.', 'Export Failed');
      return;
    }
    reportService.exportToCSV(reportData.meta.id, reportData.columns, reportData.rows);
    showToast('success', `Exported ${reportData.meta.title} to CSV successfully!`, 'CSV Exported');
  };

  // Print Report
  const handlePrintReport = () => {
    window.print();
  };

  // Filter report menu
  const visibleReports = ALL_REPORTS.filter((r) =>
    selectedCategory === 'ALL' ? true : r.category === selectedCategory
  );

  // Pagination
  const totalPages = Math.ceil(reportData.rows.length / pageSize) || 1;
  const paginatedRows = reportData.rows.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // DataTable column formatting
  const tableColumns = reportData.columns.map((col) => ({
    key: col.key,
    header: col.header,
    align: col.align || 'left',
    render: (val) => {
      if (col.isCurrency) {
        return <span style={{ fontWeight: 700 }}>₨ {Number(val || 0).toLocaleString()}</span>;
      }
      if (col.key === 'status' || col.key === 'paymentStatus') {
        const isSuccess = ['Paid in Full', 'Matched', 'Active', 'Sold', 'Available'].includes(val);
        return (
          <span className={`badge ${isSuccess ? 'badge-available' : 'badge-booked'}`}>
            {val}
          </span>
        );
      }
      return <span>{val !== null && val !== undefined ? String(val) : '—'}</span>;
    },
  }));

  return (
    <div>
      {/* Page Header (Hidden during Print) */}
      <div className="page-header no-print">
        <div className="page-header-info">
          <h1>Automotive Financial & Stock Analytics Suite</h1>
          <p>20 specialized showroom reports covering deal profitability, stock valuation, P&L & cash flows</p>
        </div>
        <div className="page-header-actions" style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-secondary" onClick={handleExportCSV}>
            <Download size={16} /> Export to CSV (Excel)
          </button>
          <button className="btn btn-primary" onClick={handlePrintReport}>
            <Printer size={16} /> Print Report
          </button>
        </div>
      </div>

      {/* Main 2-Column BI Layout Grid (Responsive on Tablet & Mobile) */}
      <div className="reports-grid-layout" style={{ display: 'grid', gridTemplateColumns: '290px 1fr', gap: '24px', alignItems: 'start' }}>
        
        {/* =========================================================================
            LEFT COLUMN: 20 REPORTS CATALOG & CATEGORY BROWSER (Hidden during Print)
            ========================================================================= */}
        <div className="no-print" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Category Filter Pills */}
          <div className="surface-card" style={{ padding: '14px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', marginBottom: '8px' }}>
              Report Category
            </div>
            <select
              className="form-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ fontSize: '0.8125rem', padding: '8px 10px' }}
            >
              <option value="ALL">All Categories (20 Reports)</option>
              {REPORT_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* 20 Reports Menu List */}
          <div className="surface-card" style={{ padding: '12px', maxHeight: '680px', overflowY: 'auto' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', padding: '0 8px 8px' }}>
              Available Reports ({visibleReports.length})
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              {visibleReports.map((report) => {
                const isSelected = selectedReportId === report.id;
                return (
                  <button
                    key={report.id}
                    onClick={() => {
                      setSelectedReportId(report.id);
                      setCurrentPage(1);
                    }}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: 'none',
                      background: isSelected ? '#2563EB' : 'transparent',
                      color: isSelected ? '#FFFFFF' : '#0F172A',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ fontWeight: isSelected ? 800 : 700, fontSize: '0.8125rem', lineHeight: 1.2 }}>
                      {report.title}
                    </div>
                    <div
                      style={{
                        fontSize: '0.6875rem',
                        color: isSelected ? '#BFDBFE' : '#64748B',
                        marginTop: '2px',
                        lineHeight: 1.2,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '240px',
                      }}
                    >
                      {report.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* =========================================================================
            RIGHT COLUMN: ACTIVE REPORT CANVAS & DATA TABLE
            ========================================================================= */}
        <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* Active Report Header & KPI Ribbon */}
          <div className="surface-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
              <div>
                <span
                  style={{
                    fontSize: '0.6875rem',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    background: '#EFF6FF',
                    color: '#1D4ED8',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  {reportData.meta.category}
                </span>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0F172A', marginTop: '6px', marginBottom: '2px' }}>
                  {reportData.meta.title}
                </h2>
                <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: 0 }}>
                  {reportData.meta.desc}
                </p>
              </div>

              <div style={{ textAlign: 'right', fontSize: '0.75rem', color: '#64748B' }}>
                <div>Generated: <strong>{reportData.generatedAt}</strong></div>
                <div>Status: <span style={{ color: '#059669', fontWeight: 700 }}>Audited & Verified</span></div>
              </div>
            </div>

            {/* Dynamic Summary KPI Tiles */}
            {reportData.summaryKPIs && reportData.summaryKPIs.length > 0 && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(auto-fit, minmax(180px, 1fr))`,
                  gap: '12px',
                  borderTop: '1px solid #E2E8F0',
                  paddingTop: '14px',
                }}
              >
                {reportData.summaryKPIs.map((kpi, idx) => (
                  <div key={idx} style={{ padding: '10px 14px', borderRadius: '8px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>
                      {kpi.label}
                    </div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0F172A', marginTop: '2px' }}>
                      {kpi.value}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Filter & Date Range Bar (Hidden during Print) */}
          <div
            className="no-print"
            style={{
              padding: '14px 18px',
              background: '#FFFFFF',
              borderRadius: '12px',
              border: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            {/* Left: Quick Date Presets & Inputs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: '4px' }}>
                {[
                  { id: 'ALL_TIME', label: 'All Time' },
                  { id: 'TODAY', label: 'Today' },
                  { id: 'THIS_MONTH', label: 'This Month' },
                  { id: 'LAST_30', label: 'Last 30 Days' },
                ].map((btn) => (
                  <button
                    key={btn.id}
                    onClick={() => handleSetDatePreset(btn.id)}
                    style={{
                      padding: '5px 10px',
                      borderRadius: '6px',
                      border: '1px solid #CBD5E1',
                      background: '#FFFFFF',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem' }}>
                <input
                  type="date"
                  className="form-input"
                  style={{ width: '135px', padding: '5px 8px', fontSize: '0.75rem' }}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <span style={{ color: '#64748B' }}>to</span>
                <input
                  type="date"
                  className="form-input"
                  style={{ width: '135px', padding: '5px 8px', fontSize: '0.75rem' }}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            {/* Right: Search Filter */}
            <div style={{ width: '240px' }}>
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search within report..."
              />
            </div>
          </div>

          {/* Report Data Table Target */}
          <div id="printable-area">
            {reportData.rows.length === 0 ? (
              <div
                style={{
                  padding: '40px',
                  textAlign: 'center',
                  background: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px dashed #CBD5E1',
                  color: '#64748B',
                }}
              >
                <FileBarChart2 size={36} style={{ margin: '0 auto 8px', color: '#94A3B8' }} />
                <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0F172A' }}>No Records Found</div>
                <div style={{ fontSize: '0.8125rem', marginTop: '4px' }}>
                  No transaction records match the selected date range or search query.
                </div>
              </div>
            ) : (
              <DataTable columns={tableColumns} data={paginatedRows} />
            )}
          </div>

          {/* Pagination Controls (Hidden during Print) */}
          {totalPages > 1 && (
            <div
              className="no-print"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 16px',
                background: '#FFFFFF',
                borderRadius: '10px',
                border: '1px solid #E2E8F0',
                fontSize: '0.8125rem',
              }}
            >
              <div style={{ color: '#64748B' }}>
                Showing {(currentPage - 1) * pageSize + 1} – {Math.min(currentPage * pageSize, reportData.rows.length)} of {reportData.rows.length} records
              </div>

              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  className="btn btn-secondary"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                >
                  Previous
                </button>
                <span style={{ padding: '4px 10px', fontWeight: 800 }}>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  className="btn btn-secondary"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

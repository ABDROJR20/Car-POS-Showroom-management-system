import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { LoadingSpinner } from './LoadingSpinner';
import { EmptyState } from './EmptyState';

export const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 20px',
        borderTop: '1px solid var(--border-subtle)',
        fontSize: '0.8125rem',
        color: 'var(--text-secondary)',
        flexWrap: 'wrap',
        gap: '12px',
        backgroundColor: '#FFFFFF',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>Showing {Math.min((currentPage - 1) * pageSize + 1, totalItems)} to {Math.min(currentPage * pageSize, totalItems)} of {totalItems} entries</span>
        {onPageSizeChange && (
          <select
            className="form-select"
            style={{ width: 'auto', padding: '4px 8px', height: '30px', fontSize: '0.75rem', marginLeft: '12px' }}
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
          >
            <option value={10}>10 / page</option>
            <option value={25}>25 / page</option>
            <option value={50}>50 / page</option>
            <option value={100}>100 / page</option>
          </select>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <button
          className="btn btn-secondary"
          style={{ padding: '6px 8px', height: '32px' }}
          onClick={() => onPageChange(1)}
          disabled={currentPage <= 1}
          title="First Page"
        >
          <ChevronsLeft size={14} />
        </button>
        <button
          className="btn btn-secondary"
          style={{ padding: '6px 8px', height: '32px' }}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          title="Previous Page"
        >
          <ChevronLeft size={14} />
        </button>

        <span style={{ padding: '0 8px', fontWeight: 700, color: 'var(--text-primary)' }}>
          Page {currentPage} of {totalPages || 1}
        </span>

        <button
          className="btn btn-secondary"
          style={{ padding: '6px 8px', height: '32px' }}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          title="Next Page"
        >
          <ChevronRight size={14} />
        </button>
        <button
          className="btn btn-secondary"
          style={{ padding: '6px 8px', height: '32px' }}
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage >= totalPages}
          title="Last Page"
        >
          <ChevronsRight size={14} />
        </button>
      </div>
    </div>
  );
};

export const DataTable = ({
  columns = [],
  data = [],
  loading = false,
  emptyMessage = 'No data available',
  sortColumn,
  sortDirection = 'asc',
  onSort,
  pagination,
}) => {
  if (loading) {
    return (
      <div className="surface-card">
        <LoadingSpinner text="Loading records..." />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="surface-card">
        <EmptyState description={emptyMessage} />
      </div>
    );
  }

  return (
    <div className="surface-card" style={{ overflow: 'hidden', backgroundColor: '#FFFFFF' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid var(--border-subtle)' }}>
              {columns.map((col, idx) => (
                <th
                  key={col.key || idx}
                  style={{
                    padding: '14px 18px',
                    fontWeight: 700,
                    color: 'var(--text-secondary)',
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    cursor: col.sortable ? 'pointer' : 'default',
                    whiteSpace: 'nowrap',
                    width: col.width || 'auto',
                    textAlign: col.align || 'left',
                  }}
                  onClick={() => col.sortable && onSort && onSort(col.key)}
                >
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    {col.header}
                    {col.sortable && (
                      <span style={{ color: sortColumn === col.key ? 'var(--brand-gold)' : 'var(--text-muted)' }}>
                        {sortColumn === col.key ? (
                          sortDirection === 'asc' ? <ArrowUp size={13} /> : <ArrowDown size={13} />
                        ) : (
                          <ArrowUpDown size={13} />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIdx) => (
              <tr
                key={row.id || rowIdx}
                style={{
                  borderBottom: '1px solid var(--border-subtle)',
                  transition: 'background var(--transition-fast)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#F8FAFC')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                {columns.map((col, colIdx) => (
                  <td
                    key={col.key || colIdx}
                    style={{
                      padding: '14px 18px',
                      color: 'var(--text-primary)',
                      textAlign: col.align || 'left',
                      whiteSpace: col.nowrap ? 'nowrap' : 'normal',
                    }}
                  >
                    {col.render ? col.render(row[col.key], row, rowIdx) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && <Pagination {...pagination} />}
    </div>
  );
};

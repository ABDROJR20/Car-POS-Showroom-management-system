import React from 'react';
import { Search, X, Filter } from 'lucide-react';

export const SearchBar = ({
  value = '',
  onChange,
  onClear,
  placeholder = 'Search by VIN, Make, Model, Reg No, or Customer...',
  style = {},
}) => {
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        maxWidth: '440px',
        ...style,
      }}
    >
      <Search
        size={16}
        color="var(--text-muted)"
        style={{ position: 'absolute', left: '12px', pointerEvents: 'none' }}
      />
      <input
        type="text"
        className="form-input"
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          paddingLeft: '38px',
          paddingRight: value ? '34px' : '14px',
          height: '40px',
        }}
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            if (onClear) onClear();
            else if (onChange) onChange('');
          }}
          style={{
            position: 'absolute',
            right: '10px',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '2px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
};

export const FilterBar = ({
  filters = [],
  activeFilters = {},
  onFilterChange,
  onReset,
  children,
}) => {
  const hasActiveFilters = Object.values(activeFilters).some((val) => val && val !== 'ALL');

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexWrap: 'wrap',
        margin: '16px 0',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.8125rem', fontWeight: 600 }}>
        <Filter size={15} color="#F59E0B" />
        <span>FILTERS:</span>
      </div>

      {filters.map((filter) => (
        <select
          key={filter.key}
          className="form-select"
          style={{ width: 'auto', minWidth: '140px', height: '38px', fontSize: '0.8125rem' }}
          value={activeFilters[filter.key] || 'ALL'}
          onChange={(e) => onFilterChange(filter.key, e.target.value)}
        >
          <option value="ALL">All {filter.label}</option>
          {filter.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ))}

      {children}

      {hasActiveFilters && (
        <button
          className="btn btn-ghost"
          style={{ height: '38px', padding: '0 10px', fontSize: '0.75rem', color: 'var(--brand-rose)' }}
          onClick={onReset}
        >
          <X size={14} /> Clear All
        </button>
      )}
    </div>
  );
};

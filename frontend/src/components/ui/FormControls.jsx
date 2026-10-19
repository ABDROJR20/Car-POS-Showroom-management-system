import React, { useState } from 'react';

export const FormInput = ({
  label,
  required = false,
  error,
  helperText,
  icon: Icon,
  type = 'text',
  className = '',
  style = {},
  ...props
}) => {
  return (
    <div className="form-group" style={style}>
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {Icon && (
          <div
            style={{
              position: 'absolute',
              left: '12px',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              pointerEvents: 'none',
            }}
          >
            <Icon size={16} />
          </div>
        )}
        <input
          type={type}
          className={`form-input ${className}`}
          style={{
            paddingLeft: Icon ? '38px' : '14px',
            borderColor: error ? 'var(--brand-rose)' : undefined,
          }}
          {...props}
        />
      </div>
      {error && <span className="form-error">{error}</span>}
      {helperText && !error && (
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '3px' }}>
          {helperText}
        </span>
      )}
    </div>
  );
};

export const Select = ({
  label,
  required = false,
  error,
  options = [],
  placeholder = 'Select an option',
  className = '',
  style = {},
  ...props
}) => {
  return (
    <div className="form-group" style={style}>
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <select
        className={`form-select ${className}`}
        style={{
          borderColor: error ? 'var(--brand-rose)' : undefined,
        }}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="form-error">{error}</span>}
    </div>
  );
};

export const DatePicker = ({
  label,
  required = false,
  error,
  className = '',
  style = {},
  ...props
}) => {
  return (
    <div className="form-group" style={style}>
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <input
        type="date"
        className={`form-input ${className}`}
        style={{
          borderColor: error ? 'var(--brand-rose)' : undefined,
          colorScheme: 'dark',
        }}
        {...props}
      />
      {error && <span className="form-error">{error}</span>}
    </div>
  );
};

// Pakistani Rupee formatter helper: converts 4500000 -> "45 Lakhs / 4.5M PKR"
const formatPKRWords = (num) => {
  const n = Number(num);
  if (!n || isNaN(n)) return '';
  if (n >= 10000000) {
    const crore = (n / 10000000).toFixed(2);
    return `≈ ${crore} Crore PKR`;
  }
  if (n >= 100000) {
    const lac = (n / 100000).toFixed(2);
    return `≈ ${lac} Lac / Lakh PKR`;
  }
  if (n >= 1000) {
    return `≈ ${(n / 1000).toFixed(1)} Thousand PKR`;
  }
  return '';
};

export const CurrencyInput = ({
  label,
  required = false,
  error,
  value = '',
  onChange,
  currency = 'PKR (₨)',
  placeholder = '0.00',
  style = {},
  ...props
}) => {
  const words = formatPKRWords(value);

  const handleChange = (e) => {
    const rawVal = e.target.value.replace(/[^0-9.]/g, '');
    if (onChange) onChange(rawVal);
  };

  return (
    <div className="form-group" style={style}>
      {label && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <label className="form-label">
            {label}
            {required && <span className="required">*</span>}
          </label>
          {words && (
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--brand-gold)' }}>
              {words}
            </span>
          )}
        </div>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <div
          style={{
            position: 'absolute',
            left: '12px',
            fontSize: '0.8125rem',
            fontWeight: 700,
            color: 'var(--brand-gold)',
            pointerEvents: 'none',
          }}
        >
          ₨
        </div>
        <input
          type="text"
          className="form-input"
          value={value ? Number(value).toLocaleString('en-US') : ''}
          onChange={handleChange}
          placeholder={placeholder}
          style={{
            paddingLeft: '32px',
            fontFamily: 'monospace',
            fontWeight: 600,
            fontSize: '0.9375rem',
            borderColor: error ? 'var(--brand-rose)' : undefined,
          }}
          {...props}
        />
      </div>
      {error && <span className="form-error">{error}</span>}
    </div>
  );
};

import React, { useEffect } from 'react';
import { X, AlertTriangle, AlertCircle, Info } from 'lucide-react';

export const Modal = ({
  isOpen = false,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxWidth = '560px',
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && onClose) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        zIndex: 999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.2s ease',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) onClose();
      }}
    >
      <div
        className="surface-card modal-container"
        style={{
          width: '100%',
          maxWidth,
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#FFFFFF',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--border-medium)',
          borderRadius: '14px',
          overflow: 'hidden',
        }}
      >
        {/* Modal Header */}
        <div
          className="modal-header-responsive"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '18px 24px',
            borderBottom: '1px solid var(--border-subtle)',
            backgroundColor: '#FFFFFF',
          }}
        >
          <div style={{ minWidth: 0, paddingRight: '12px' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              {title}
            </h3>
            {subtitle && (
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '2px', marginBottom: 0 }}>
                {subtitle}
              </p>
            )}
          </div>
          <button
            className="btn btn-ghost"
            style={{ padding: '6px', borderRadius: '50%', color: 'var(--text-muted)', flexShrink: 0 }}
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body-responsive" style={{ padding: '24px', overflowY: 'auto', flex: 1, backgroundColor: '#FFFFFF' }}>
          {children}
        </div>

        {/* Modal Footer */}
        {footer && (
          <div
            className="modal-footer-responsive"
            style={{
              padding: '14px 24px',
              borderTop: '1px solid var(--border-subtle)',
              background: '#F8FAFC',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '10px',
              flexWrap: 'wrap',
            }}
          >
            {footer}
          </div>
        )}
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
        @media (max-width: 640px) {
          .modal-backdrop {
            padding: 8px !important;
          }
          .modal-container {
            max-height: 96vh !important;
            border-radius: 10px !important;
          }
          .modal-header-responsive {
            padding: 14px 16px !important;
          }
          .modal-body-responsive {
            padding: 16px !important;
          }
          .modal-footer-responsive {
            padding: 12px 16px !important;
          }
        }
      `}</style>
    </div>
  );
};

export const ConfirmDialog = ({
  isOpen = false,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed with this action?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger',
  loading = false,
}) => {
  const getIcon = () => {
    switch (type) {
      case 'danger':
        return <AlertCircle size={28} color="#DC2626" />;
      case 'warning':
        return <AlertTriangle size={28} color="#D97706" />;
      default:
        return <Info size={28} color="#2563EB" />;
    }
  };

  const getConfirmBtnClass = () => {
    switch (type) {
      case 'danger':
        return 'btn btn-danger';
      case 'warning':
        return 'btn btn-primary';
      default:
        return 'btn btn-blue';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="460px"
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose} disabled={loading}>
            {cancelText}
          </button>
          <button className={getConfirmBtnClass()} onClick={onConfirm} disabled={loading}>
            {loading ? 'Processing...' : confirmText}
          </button>
        </>
      }
    >
      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: type === 'danger' ? '#FEF2F2' : '#FFFBEB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {getIcon()}
        </div>
        <div>
          <h4 style={{ fontSize: '1.0625rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
            {title}
          </h4>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            {message}
          </p>
        </div>
      </div>
    </Modal>
  );
};

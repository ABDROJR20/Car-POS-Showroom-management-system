import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { rbacService, ROLES } from '../../services/rbacService';
import { User, LogOut, ChevronDown, ShieldCheck, Key, Check } from 'lucide-react';

export const UserMenu = () => {
  const { user, logout, switchUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const allUsers = rbacService.getAllUsers();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const roleDef = rbacService.getRoleDefinition(user?.role || ROLES.ADMIN);

  return (
    <div style={{ position: 'relative' }} ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '6px 12px',
          borderRadius: 'var(--radius-md)',
          background: '#F8FAFC',
          border: '1px solid #CBD5E1',
          cursor: 'pointer',
          color: 'var(--text-primary)',
          transition: 'all var(--transition-fast)',
        }}
      >
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: roleDef.badgeColor || '#D97706',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontWeight: 800,
            fontSize: '0.8125rem',
          }}
        >
          {user?.avatar || (user?.name ? user.name.charAt(0) : 'A')}
        </div>
        <div style={{ textAlign: 'left', display: 'none', flexDirection: 'column' }} className="user-text">
          <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {user?.name || 'Administrator'}
          </span>
          <span style={{ fontSize: '0.6875rem', color: roleDef.badgeColor, fontWeight: 800 }}>
            {user?.role || 'ADMIN'}
          </span>
        </div>
        <ChevronDown size={14} color="#64748B" />
      </button>

      {isOpen && (
        <div
          className="surface-card"
          style={{
            position: 'absolute',
            top: '48px',
            right: 0,
            width: '240px',
            backgroundColor: '#FFFFFF',
            zIndex: 100,
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--border-medium)',
            padding: '6px',
            animation: 'fadeIn 0.15s ease-out',
            borderRadius: '12px',
          }}
        >
          <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '4px' }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0F172A' }}>
              {user?.name || 'Ahsan Khan'}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
              {user?.email || 'admin@ahsanautos.com'}
            </div>
            <div style={{ marginTop: '4px' }}>
              <span
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '4px',
                  background: `${roleDef.badgeColor}18`,
                  color: roleDef.badgeColor,
                }}
              >
                ROLE: {user?.role}
              </span>
            </div>
          </div>

          {/* Quick RBAC Role Test Switcher */}
          <div style={{ padding: '6px 12px 4px', fontSize: '0.6875rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>
            Test As Different Role:
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', padding: '0 4px 6px' }}>
            {allUsers.map((u) => {
              const isSelected = user?.id === u.id;
              return (
                <button
                  key={u.id}
                  onClick={() => {
                    switchUser(u.id);
                    setIsOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '6px 8px',
                    borderRadius: '6px',
                    border: 'none',
                    background: isSelected ? '#EFF6FF' : 'transparent',
                    color: isSelected ? '#1D4ED8' : '#334155',
                    fontSize: '0.75rem',
                    fontWeight: isSelected ? 800 : 600,
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>{u.avatar || '👤'}</span>
                    <span>{u.name.split(' ')[0]} ({u.role})</span>
                  </div>
                  {isSelected && <Check size={12} color="#1D4ED8" />}
                </button>
              );
            })}
          </div>

          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '4px' }}>
            <button
              onClick={() => {
                setIsOpen(false);
                logout();
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                background: 'transparent',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                color: 'var(--brand-rose)',
                fontSize: '0.8125rem',
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background var(--transition-fast)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#FEF2F2')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .user-text {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
};

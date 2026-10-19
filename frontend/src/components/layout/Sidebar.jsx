import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Zap,
  Car,
  ShoppingCart,
  ReceiptText,
  Users,
  ClipboardList,
  Percent,
  Coins,
  Wallet,
  FileBarChart2,
  Printer,
  Settings,
  X,
  ShieldCheck,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

const MENU_GROUPS = [
  {
    title: 'OVERVIEW & POS',
    items: [
      { path: '/dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
      { path: '/pos-terminal', label: 'POS Sale Terminal', icon: Zap, badge: '⚡ Quick' },
    ],
  },
  {
    title: 'INVENTORY & ASSETS',
    items: [
      { path: '/vehicles', label: 'Vehicles Stock', icon: Car, badge: 'Floor' },
      { path: '/car-demand', label: 'Car Demand Leads', icon: ClipboardList, badge: 'Hot' },
    ],
  },
  {
    title: 'DEALS & TRANSACTIONS',
    items: [
      { path: '/sales', label: 'Sales Orders', icon: ShoppingCart },
      { path: '/purchases', label: 'Purchases & Inward', icon: ReceiptText },
      { path: '/customers', label: 'Parties & Customers', icon: Users },
    ],
  },
  {
    title: 'FINANCE & ACCOUNTS',
    items: [
      { path: '/cash-finance', label: 'Cash & Bank Ledger', icon: Wallet },
      { path: '/expenses', label: 'Expenses & Repairs', icon: Coins },
      { path: '/commission', label: 'Commission Register', icon: Percent },
    ],
  },
  {
    title: 'REPORTS & PRINT',
    items: [
      { path: '/reports', label: 'P&L & Analytics', icon: FileBarChart2 },
      { path: '/print-center', label: 'Print Center', icon: Printer },
      { path: '/settings', label: 'Showroom Settings', icon: Settings },
    ],
  },
];

export const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 90,
            display: 'block',
          }}
          className="sidebar-backdrop"
        />
      )}

      <aside
        style={{
          width: '275px',
          backgroundColor: '#0A101D', // Ultra Deep Luxury Navy/Obsidian
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 95,
          transition: 'transform 0.25s ease',
          flexShrink: 0,
          color: '#FFFFFF',
          overflow: 'hidden', // Prevent outer container scrollbar
        }}
        className={`app-sidebar ${isOpen ? 'open' : ''}`}
      >
        {/* Dealership Logo & Branding Header */}
        <div
          style={{
            padding: '20px 22px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            background: '#0F172A',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                fontWeight: 900,
                fontSize: '1.35rem',
                fontFamily: 'var(--font-heading)',
                boxShadow: '0 4px 14px rgba(217, 119, 6, 0.45)',
                flexShrink: 0,
              }}
            >
              A
            </div>
            <div>
              <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                AHSAN <span style={{ color: '#F59E0B' }}>AUTOS</span>
              </div>
              <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '2px' }}>
                Showroom Management
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="mobile-close-btn"
            style={{
              display: 'none',
              background: 'transparent',
              border: 'none',
              color: '#94A3B8',
              cursor: 'pointer',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Navigation List with Sleek Hidden/Custom Scrollbar */}
        <nav
          className="sidebar-scrollable-nav"
          style={{
            flex: 1,
            padding: '16px 12px',
            overflowY: 'auto',
            overflowX: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {MENU_GROUPS.map((group) => (
            <div key={group.title}>
              <div
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 800,
                  color: '#94A3B8', // High visibility crisp slate color
                  letterSpacing: '0.08em',
                  padding: '0 12px',
                  marginBottom: '6px',
                  textTransform: 'uppercase',
                }}
              >
                {group.title}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname.startsWith(item.path);
                  const isPos = item.path === '/pos-terminal';

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => onClose && onClose()}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        borderRadius: '9px',
                        textDecoration: 'none',
                        fontSize: '0.875rem',
                        fontWeight: isActive ? 800 : 600,
                        color: isActive ? '#FFFFFF' : '#E2E8F0', // Ultra visible text
                        backgroundColor: isActive
                          ? isPos ? '#D97706' : '#2563EB'
                          : 'transparent',
                        boxShadow: isActive
                          ? isPos ? '0 4px 14px rgba(217, 119, 6, 0.4)' : '0 4px 14px rgba(37, 99, 235, 0.4)'
                          : 'none',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                          e.currentTarget.style.color = '#FFFFFF';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '#E2E8F0';
                        }
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Icon
                          size={18}
                          color={isActive ? '#FFFFFF' : isPos ? '#F59E0B' : '#94A3B8'}
                        />
                        <span>{item.label}</span>
                      </div>

                      {item.badge ? (
                        <span
                          style={{
                            fontSize: '0.6875rem',
                            fontWeight: 800,
                            padding: '2px 8px',
                            borderRadius: '9999px',
                            background: isPos ? '#FEF3C7' : item.badge === 'Hot' ? '#DC2626' : 'rgba(255, 255, 255, 0.15)',
                            color: isPos ? '#92400E' : '#FFFFFF',
                          }}
                        >
                          {item.badge}
                        </span>
                      ) : isActive ? (
                        <ChevronRight size={14} color="#FFFFFF" />
                      ) : null}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div
          style={{
            padding: '14px 20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            background: '#070B14',
            fontSize: '0.75rem',
            color: '#94A3B8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 8px #10B981' }} />
            <span style={{ fontWeight: 600, color: '#E2E8F0' }}>POS Terminal Active</span>
          </div>
          <span style={{ fontWeight: 800, color: '#F59E0B' }}>v2.4</span>
        </div>
      </aside>

      {/* Clean Modern Custom Dark Scrollbar (No Ugly White Scrollbar) */}
      <style>{`
        .sidebar-scrollable-nav {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.15) transparent;
        }
        .sidebar-scrollable-nav::-webkit-scrollbar {
          width: 4px;
        }
        .sidebar-scrollable-nav::-webkit-scrollbar-track {
          background: transparent;
        }
        .sidebar-scrollable-nav::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.15);
          border-radius: 9999px;
        }
        .sidebar-scrollable-nav::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        @media (max-width: 1024px) {
          .app-sidebar {
            position: fixed !important;
            left: 0;
            top: 0;
            bottom: 0;
            transform: translateX(-100%);
          }
          .app-sidebar.open {
            transform: translateX(0);
          }
          .mobile-close-btn {
            display: block !important;
          }
        }
      `}</style>
    </>
  );
};

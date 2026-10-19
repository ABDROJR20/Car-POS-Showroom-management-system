import React, { useState, useEffect } from 'react';
import { Menu, Plus, Wallet, Sparkles, Search, Command, Zap } from 'lucide-react';
import { NotificationsDropdown } from './NotificationsDropdown';
import { UserMenu } from './UserMenu';
import { useNavigate, useLocation } from 'react-router-dom';
import { financeService } from '../../services/financeService';



export const Header = ({ onOpenSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [liveCash, setLiveCash] = useState(() => {
    try {
      return financeService.getCashInHand();
    } catch (e) {
      return 3450000;
    }
  });

  useEffect(() => {
    const updateCash = () => {
      try {
        setLiveCash(financeService.getCashInHand());
      } catch (e) {
        console.error('Failed to get cash in hand:', e);
      }
    };

    updateCash();
    window.addEventListener('ahsan_cash_updated', updateCash);
    return () => window.removeEventListener('ahsan_cash_updated', updateCash);
  }, []);

  return (
    <header
      className="app-header"
      style={{
        height: '70px',
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 80,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
      }}
    >
      {/* Left: Mobile Toggle & Page Title Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
        <button
          onClick={onOpenSidebar}
          style={{
            display: 'none',
            background: '#F1F5F9',
            border: '1px solid #CBD5E1',
            borderRadius: '8px',
            color: '#0F172A',
            cursor: 'pointer',
            padding: '7px',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
          className="header-mobile-toggle"
          aria-label="Toggle Navigation Menu"
        >
          <Menu size={20} />
        </button>

        <div style={{ minWidth: 0 }}>
          <h2
            style={{
              fontSize: '1.15rem',
              fontWeight: 900,
              color: '#0F172A',
              letterSpacing: '-0.02em',
              margin: 0,
              fontFamily: 'var(--font-heading)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
            className="header-title-text"
          >
            Ahsan Autos POS Terminal
          </h2>
        </div>
      </div>

      {/* Right: Cash in Hand Ticker + Quick POS Action + Notifications + User Menu */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
        {/* Live Cash In Hand Ticker Widget */}
        <div
          onClick={() => navigate('/cash-finance')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 12px',
            borderRadius: '10px',
            background: '#ECFDF5',
            border: '1px solid #A7F3D0',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          className="cash-ticker"
          title="Click to view Cash Drawer & Ledger"
        >
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#059669',
              boxShadow: '0 0 6px rgba(5, 150, 105, 0.7)',
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.625rem', fontWeight: 800, color: '#065F46', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Cash in Hand
            </span>
            <span style={{ fontSize: '0.875rem', fontWeight: 900, color: '#047857', fontFamily: 'var(--font-heading)' }}>
              ₨ {Number(liveCash).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Quick New Sale POS Button */}
        <button
          className="btn btn-primary header-pos-btn"
          onClick={() => navigate('/pos-terminal')}
          style={{ padding: '7px 14px', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Zap size={15} /> <span className="pos-btn-label">POS Terminal</span>
        </button>

        <NotificationsDropdown />
        <UserMenu />
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .header-mobile-toggle {
            display: inline-flex !important;
          }
          .app-header {
            padding: 0 16px !important;
          }
        }
        @media (max-width: 768px) {
          .header-title-text {
            font-size: 1rem !important;
          }
        }
        @media (max-width: 640px) {
          .cash-ticker {
            display: none !important;
          }
          .pos-btn-label {
            display: none !important;
          }
          .header-pos-btn {
            padding: 8px !important;
          }
        }
      `}</style>
    </header>
  );
};

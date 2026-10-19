import React, { useState, useEffect } from 'react';
import { FormInput, Select, DataTable } from '../../components/ui';
import {
  Settings,
  ShieldCheck,
  Printer,
  Bell,
  Save,
  Share2,
  Building2,
  Users,
  KeyRound,
  FileText,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Trash2,
  Edit2,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { settingsService } from '../../services/settingsService';
import { rbacService, ROLES, ROLE_DEFINITIONS } from '../../services/rbacService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('GENERAL'); // GENERAL | SOCIAL | INVOICING | TERMS | RBAC
  const [settings, setSettings] = useState(settingsService.getSettings());
  const [users, setUsers] = useState(rbacService.getAllUsers());
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    role: ROLES.SALES_STAFF,
  });

  const { user: currentUser, switchUser } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    setSettings(settingsService.getSettings());
    setUsers(rbacService.getAllUsers());
  }, []);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    settingsService.saveSettings(settings);
    showToast('success', 'Showroom configuration & branding settings updated successfully!', 'Settings Saved');
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) {
      showToast('error', 'Please enter staff name and email.', 'Validation Error');
      return;
    }
    const created = rbacService.createUser(newUser);
    setUsers(rbacService.getAllUsers());
    setIsAddUserOpen(false);
    setNewUser({ name: '', email: '', phone: '', role: ROLES.SALES_STAFF });
    showToast('success', `Created staff account for ${created.name} with role ${created.role}!`, 'User Registered');
  };

  const handleDeleteUser = (userId) => {
    if (userId === currentUser?.id) {
      showToast('error', 'Cannot delete your own active account.', 'Operation Denied');
      return;
    }
    rbacService.deleteUser(userId);
    setUsers(rbacService.getAllUsers());
    showToast('info', 'Staff user account removed.', 'User Deleted');
  };

  const handleUpdateTerm = (index, value) => {
    const newTerms = [...(settings.terms || [])];
    newTerms[index] = value;
    setSettings({ ...settings, terms: newTerms });
  };

  const handleAddTerm = () => {
    setSettings({
      ...settings,
      terms: [...(settings.terms || []), 'New legal delivery condition clause...'],
    });
  };

  const handleRemoveTerm = (index) => {
    const newTerms = (settings.terms || []).filter((_, i) => i !== index);
    setSettings({ ...settings, terms: newTerms });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-info">
          <h1>Showroom Settings & Access Control (RBAC)</h1>
          <p>Manage dealership branding, invoice sequences, thermal templates, terms & conditions and 4 user roles</p>
        </div>
      </div>

      {/* Role Testing Ribbon */}
      <div
        style={{
          background: '#0F172A',
          color: '#FFFFFF',
          borderRadius: '12px',
          padding: '14px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <KeyRound size={20} color="#F59E0B" />
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#FCD34D', textTransform: 'uppercase' }}>
              Active RBAC Test Session
            </div>
            <div style={{ fontSize: '0.875rem' }}>
              Logged In As: <strong>{currentUser?.name}</strong> • Role: <span style={{ color: '#60A5FA', fontWeight: 800 }}>{currentUser?.role}</span>
            </div>
          </div>
        </div>

        {/* Live Role Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Switch Role:</span>
          {users.map((u) => {
            const isCurrent = currentUser?.id === u.id;
            return (
              <button
                key={u.id}
                onClick={() => switchUser(u.id)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: isCurrent ? '1px solid #F59E0B' : '1px solid #334155',
                  background: isCurrent ? '#D97706' : '#1E293B',
                  color: '#FFFFFF',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>{u.avatar || '👤'}</span>
                <span>{u.role}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Settings Navigation Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #E2E8F0', paddingBottom: '8px', flexWrap: 'wrap' }}>
        {[
          { id: 'GENERAL', label: '1. Dealership Branding & Identity', icon: Building2 },
          { id: 'SOCIAL', label: '2. Contact & Social Channels', icon: Share2 },
          { id: 'INVOICING', label: '3. Invoicing & Thermal Printing', icon: Printer },
          { id: 'TERMS', label: '4. Legal Terms & Conditions', icon: FileText },
          { id: 'RBAC', label: '5. Staff & Role Permissions', icon: ShieldCheck },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 16px',
                borderRadius: '8px',
                border: 'none',
                background: isActive ? '#2563EB' : 'transparent',
                color: isActive ? '#FFFFFF' : '#475569',
                fontWeight: 700,
                fontSize: '0.8125rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Settings Body */}
      <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* =========================================================================
            TAB 1: GENERAL DEALERSHIP IDENTITY
            ========================================================================= */}
        {activeTab === 'GENERAL' && (
          <div className="surface-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building2 size={18} color="#2563EB" /> Showroom Legal Identity & Location
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              <FormInput
                label="Showroom Trade Name"
                required
                value={settings.showroomName}
                onChange={(e) => setSettings({ ...settings, showroomName: e.target.value })}
              />
              <FormInput
                label="Marketing Tagline / Moto"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              <FormInput
                label="Showroom Logo URL (Optional)"
                placeholder="https://example.com/logo.png"
                value={settings.logoUrl || ''}
                onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
              />
              <FormInput
                label="Logo Heading Text"
                value={settings.logoText || 'AHSAN AUTOS'}
                onChange={(e) => setSettings({ ...settings, logoText: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
              <FormInput
                label="Physical Showroom Address"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              />
              <FormInput
                label="City / Jurisdiction"
                value={settings.city || 'Islamabad'}
                onChange={(e) => setSettings({ ...settings, city: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <FormInput
                label="NTN / Tax Registration Number"
                value={settings.ntn || ''}
                onChange={(e) => setSettings({ ...settings, ntn: e.target.value })}
              />
              <FormInput
                label="Official Contact Phone"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              />
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: CONTACT & SOCIAL CHANNELS
            ========================================================================= */}
        {activeTab === 'SOCIAL' && (
          <div className="surface-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Share2 size={18} color="#059669" /> Official Communication & Social Handles
            </h3>
            <p style={{ fontSize: '0.8125rem', color: '#64748B', marginTop: '-8px' }}>
              These handles are automatically rendered on customer sales slips, thermal receipts, and WhatsApp share buttons.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              <FormInput
                label="Official WhatsApp Hotline"
                value={settings.whatsapp}
                onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
              />
              <FormInput
                label="Customer Inquiries Email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              <FormInput
                label="TikTok Handle"
                placeholder="@ahsan_autos"
                value={settings.social?.tiktok || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    social: { ...settings.social, tiktok: e.target.value },
                  })
                }
              />
              <FormInput
                label="Instagram Handle"
                placeholder="@ahsanautos_official"
                value={settings.social?.instagram || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    social: { ...settings.social, instagram: e.target.value },
                  })
                }
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              <FormInput
                label="Facebook Page URL"
                placeholder="facebook.com/ahsanautosofficial"
                value={settings.social?.facebook || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    social: { ...settings.social, facebook: e.target.value },
                  })
                }
              />
              <FormInput
                label="Official Website"
                placeholder="Rojrztech.com"
                value={settings.social?.website || 'Rojrztech.com'}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    social: { ...settings.social, website: e.target.value },
                  })
                }
              />
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: INVOICING & THERMAL PRINTING
            ========================================================================= */}
        {activeTab === 'INVOICING' && (
          <div className="surface-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Printer size={18} color="#D97706" /> Invoice Prefixes, Sequence Numbering & Thermal Layout
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              <FormInput
                label="Sales Invoice Prefix"
                value={settings.invoicePrefix || 'SAL-2026-'}
                onChange={(e) => setSettings({ ...settings, invoicePrefix: e.target.value })}
              />
              <FormInput
                label="Purchase Order Prefix"
                value={settings.purchasePrefix || 'PUR-2026-'}
                onChange={(e) => setSettings({ ...settings, purchasePrefix: e.target.value })}
              />
              <FormInput
                label="POS Bill Prefix"
                value={settings.posReceiptPrefix || 'BILL-'}
                onChange={(e) => setSettings({ ...settings, posReceiptPrefix: e.target.value })}
              />
              <FormInput
                label="Next Sequence Counter"
                type="number"
                value={settings.nextInvoiceSequence || 90}
                onChange={(e) => setSettings({ ...settings, nextInvoiceSequence: Number(e.target.value) })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              <Select
                label="Base Currency"
                value={settings.currency || 'PKR'}
                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                options={[
                  { value: 'PKR', label: 'Pakistani Rupee (₨ / PKR)' },
                  { value: 'USD', label: 'US Dollar ($ / USD)' },
                ]}
              />
              <Select
                label="Thermal Roll Paper Width"
                value={settings.thermalWidth || '80mm'}
                onChange={(e) => setSettings({ ...settings, thermalWidth: e.target.value })}
                options={[
                  { value: '80mm', label: '80mm Standard POS Thermal Receipt' },
                  { value: '58mm', label: '58mm Compact POS Receipt' },
                ]}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Thermal Receipt Footer Text
              </label>
              <textarea
                rows={4}
                className="form-input"
                style={{ width: '100%', fontFamily: 'monospace', fontSize: '0.8125rem', padding: '10px' }}
                value={settings.receiptFooter || ''}
                onChange={(e) => setSettings({ ...settings, receiptFooter: e.target.value })}
              />
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: LEGAL TERMS & CONDITIONS
            ========================================================================= */}
        {activeTab === 'TERMS' && (
          <div className="surface-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileText size={18} color="#7C3AED" /> Legal Sale Deed & Stamp Paper Conditions
                </h3>
                <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: 0 }}>
                  These binding legal clauses are printed directly on the A4 Vehicle Delivery Deed Stamp Paper.
                </p>
              </div>

              <button type="button" className="btn btn-secondary" onClick={handleAddTerm} style={{ fontSize: '0.75rem' }}>
                <Plus size={14} /> Add Condition Clause
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(settings.terms || []).map((term, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontWeight: 800, color: '#64748B', width: '24px', textAlign: 'center' }}>
                    {index + 1}.
                  </span>
                  <input
                    type="text"
                    className="form-input"
                    style={{ flex: 1 }}
                    value={term}
                    onChange={(e) => handleUpdateTerm(index, e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveTerm(index)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#DC2626',
                      cursor: 'pointer',
                      padding: '4px',
                    }}
                    title="Remove Clause"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Counter Thermal Slip Short Disclaimer
              </label>
              <input
                type="text"
                className="form-input"
                style={{ width: '100%' }}
                value={settings.receiptDisclaimer || ''}
                onChange={(e) => setSettings({ ...settings, receiptDisclaimer: e.target.value })}
              />
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 5: ROLE-BASED ACCESS CONTROL (RBAC) & USER MANAGEMENT
            ========================================================================= */}
        {activeTab === 'RBAC' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* 4 Roles Overview Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
              {ROLE_DEFINITIONS.map((r) => (
                <div
                  key={r.id}
                  className="surface-card"
                  style={{
                    padding: '18px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    borderTop: `4px solid ${r.badgeColor}`,
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.9375rem', color: '#0F172A' }}>{r.name}</span>
                      <span
                        style={{
                          fontSize: '0.6875rem',
                          fontWeight: 800,
                          padding: '2px 8px',
                          borderRadius: '9999px',
                          background: `${r.badgeColor}18`,
                          color: r.badgeColor,
                        }}
                      >
                        {r.id}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: '#64748B', lineHeight: 1.4 }}>
                      {r.description}
                    </p>
                  </div>

                  <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '10px', marginTop: '10px', fontSize: '0.6875rem', color: '#64748B' }}>
                    Permissions: <strong>{r.permissions.includes('*') ? 'All Full Master (Unrestricted)' : `${r.permissions.length} Modules Authorized`}</strong>
                  </div>
                </div>
              ))}
            </div>

            {/* Staff Accounts Management Section */}
            <div className="surface-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Users size={18} color="#2563EB" /> Registered Showroom Staff & Active Accounts
                  </h3>
                  <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: 0 }}>
                    Manage authorized personnel for Director, Manager, Sales Desk, and Treasury Accountants
                  </p>
                </div>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setIsAddUserOpen(true)}
                  style={{ fontSize: '0.75rem' }}
                >
                  <Plus size={14} /> Add New Staff Member
                </button>
              </div>

              {/* Users Table */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
                  <thead>
                    <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', textAlign: 'left' }}>
                      <th style={{ padding: '10px 14px' }}>Staff Name</th>
                      <th style={{ padding: '10px 14px' }}>Email</th>
                      <th style={{ padding: '10px 14px' }}>Phone</th>
                      <th style={{ padding: '10px 14px' }}>Assigned Role</th>
                      <th style={{ padding: '10px 14px' }}>Account Status</th>
                      <th style={{ padding: '10px 14px', textAlign: 'center' }}>Test Switch</th>
                      <th style={{ padding: '10px 14px', textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => {
                      const isCurrent = currentUser?.id === u.id;
                      const roleDef = rbacService.getRoleDefinition(u.role);
                      return (
                        <tr key={u.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                          <td style={{ padding: '12px 14px', fontWeight: 800, color: '#0F172A' }}>
                            <span style={{ marginRight: '6px' }}>{u.avatar || '👤'}</span>
                            {u.name}
                            {isCurrent && (
                              <span style={{ marginLeft: '8px', fontSize: '0.6875rem', color: '#D97706', fontWeight: 800 }}>
                                (Active)
                              </span>
                            )}
                          </td>
                          <td style={{ padding: '12px 14px', color: '#64748B' }}>{u.email}</td>
                          <td style={{ padding: '12px 14px', color: '#64748B' }}>{u.phone || '—'}</td>
                          <td style={{ padding: '12px 14px' }}>
                            <span
                              style={{
                                padding: '2px 8px',
                                borderRadius: '6px',
                                fontWeight: 800,
                                fontSize: '0.75rem',
                                background: `${roleDef.badgeColor}18`,
                                color: roleDef.badgeColor,
                              }}
                            >
                              {u.role}
                            </span>
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <span className="badge badge-available">Active</span>
                          </td>
                          <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                            <button
                              type="button"
                              onClick={() => switchUser(u.id)}
                              disabled={isCurrent}
                              style={{
                                padding: '4px 10px',
                                borderRadius: '6px',
                                border: '1px solid #CBD5E1',
                                background: isCurrent ? '#F1F5F9' : '#FFFFFF',
                                color: isCurrent ? '#94A3B8' : '#0F172A',
                                fontWeight: 700,
                                fontSize: '0.6875rem',
                                cursor: isCurrent ? 'default' : 'pointer',
                              }}
                            >
                              {isCurrent ? 'Current' : 'Switch To'}
                            </button>
                          </td>
                          <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                            <button
                              type="button"
                              onClick={() => handleDeleteUser(u.id)}
                              disabled={isCurrent || u.role === ROLES.ADMIN}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: isCurrent || u.role === ROLES.ADMIN ? '#CBD5E1' : '#DC2626',
                                cursor: isCurrent || u.role === ROLES.ADMIN ? 'not-allowed' : 'pointer',
                                padding: '4px',
                              }}
                              title="Delete Account"
                            >
                              <Trash2 size={15} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Save Footer Button (For Settings Tabs) */}
        {activeTab !== 'RBAC' && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '10px' }}>
            <button type="submit" className="btn btn-primary" style={{ padding: '10px 24px' }}>
              <Save size={16} /> Save Showroom Configuration
            </button>
          </div>
        )}
      </form>

      {/* Add Staff User Modal */}
      {isAddUserOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '20px',
          }}
        >
          <div
            className="surface-card"
            style={{ width: '100%', maxWidth: '480px', padding: '24px', borderRadius: '16px' }}
          >
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '14px' }}>
              Register Showroom Staff Member
            </h3>

            <form onSubmit={handleCreateUser} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <FormInput
                label="Full Name"
                required
                placeholder="e.g. Asad Ali"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              />

              <FormInput
                label="Email Address (Login ID)"
                type="email"
                required
                placeholder="staff@ahsanautos.com"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />

              <FormInput
                label="Contact Number"
                placeholder="+92 300 0000000"
                value={newUser.phone}
                onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
              />

              <Select
                label="Assigned System Role"
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                options={[
                  { value: ROLES.ADMIN, label: 'Admin (Full Director Master Access)' },
                  { value: ROLES.MANAGER, label: 'Manager (Inventory, Sales & Reports)' },
                  { value: ROLES.SALES_STAFF, label: 'Sales Staff (POS Terminal & Leads)' },
                  { value: ROLES.ACCOUNTANT, label: 'Accountant (Cash Ledger & Treasury)' },
                ]}
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsAddUserOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Staff Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

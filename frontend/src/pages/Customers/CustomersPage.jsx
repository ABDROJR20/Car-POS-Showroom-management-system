import React, { useState } from 'react';
import { DataTable, SearchBar, Modal, FormInput, Select } from '../../components/ui';
import { Plus, Users, Phone, MessageSquare } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const INITIAL_PARTIES = [
  {
    id: 'PRT-001',
    name: 'Chaudhry Nadeem',
    cnic: '35201-1234567-1',
    phone: '+92 300 8472911',
    city: 'Lahore',
    types: ['BUYER'],
    balance: 5050000,
  },
  {
    id: 'PRT-002',
    name: 'Sheikh Imran',
    cnic: '37405-9988776-3',
    phone: '+92 333 5511223',
    city: 'Islamabad',
    types: ['SELLER'],
    balance: 0,
  },
  {
    id: 'PRT-003',
    name: 'Mian Bilal Aslam',
    cnic: '35202-4433221-5',
    phone: '+92 321 8899001',
    city: 'Lahore',
    types: ['INVESTOR'],
    balance: -12500000,
  },
  {
    id: 'PRT-004',
    name: 'Haji Zulfiqar Autos (Broker)',
    cnic: '35404-7766554-9',
    phone: '+92 301 6655443',
    city: 'Gujranwala',
    types: ['BROKER'],
    balance: 75000,
  },
];

export const CustomersPage = () => {
  const [parties, setParties] = useState(INITIAL_PARTIES);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { showToast } = useToast();

  const filteredParties = parties.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.phone.includes(searchTerm) ||
    p.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      key: 'id',
      header: 'Party Code',
      render: (val) => <span style={{ fontWeight: 700, color: 'var(--brand-gold)' }}>{val}</span>,
    },
    {
      key: 'name',
      header: 'Customer / Party Name',
      render: (val, row) => (
        <div>
          <div style={{ fontWeight: 700, color: '#0F172A' }}>{val}</div>
          <div style={{ fontSize: '0.75rem', color: '#64748B' }}>CNIC: {row.cnic}</div>
        </div>
      ),
    },
    {
      key: 'phone',
      header: 'Phone & WhatsApp',
      render: (val) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Phone size={14} color="var(--brand-emerald)" />
          <span>{val}</span>
        </div>
      ),
    },
    { key: 'city', header: 'City' },
    {
      key: 'types',
      header: 'Party Type',
      render: (val) => (
        <span className="badge badge-ownership-showroom">
          {val.join(', ')}
        </span>
      ),
    },
    {
      key: 'balance',
      header: 'Current Ledger Balance',
      align: 'right',
      render: (val) => (
        <span style={{ fontWeight: 700, color: Number(val) > 0 ? 'var(--brand-rose)' : Number(val) < 0 ? 'var(--brand-emerald)' : 'var(--text-muted)' }}>
          {Number(val) > 0 ? `₨ ${Number(val).toLocaleString()} (Receivable)` : Number(val) < 0 ? `₨ ${Math.abs(Number(val)).toLocaleString()} (Payable)` : 'Zero Balance'}
        </span>
      ),
    },
  ];

  return (
    <div>
      <div className="page-header">
        <div className="page-header-info">
          <h1>Customer & Counterparty Directory</h1>
          <p>Unified master for Buyers, Sellers, Consignors, Investors & Deal Brokers</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={() => showToast('info', 'Opening Customer Registration Modal', 'New Party')}>
            <Plus size={16} /> Register New Party
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <SearchBar
          value={searchTerm}
          onChange={(val) => {
            setSearchTerm(val);
            setCurrentPage(1);
          }}
          placeholder="Search by Name, Phone, CNIC, or City..."
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredParties.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
        emptyMessage="No party records found matching search criteria."
        pagination={{
          currentPage,
          totalPages: Math.ceil(filteredParties.length / pageSize) || 1,
          totalItems: filteredParties.length,
          pageSize,
          onPageChange: setCurrentPage,
          onPageSizeChange: (sz) => {
            setPageSize(sz);
            setCurrentPage(1);
          },
        }}
      />
    </div>
  );
};

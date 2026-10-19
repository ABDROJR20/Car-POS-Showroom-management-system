import React from 'react';
import { Modal } from '../ui';
import { Printer, DollarSign, User, ShieldCheck, FileText, CheckCircle2, Clock, Share2 } from 'lucide-react';
import { purchaseService } from '../../services/purchaseService';
import { useToast } from '../../context/ToastContext';

export const PurchaseDetailModal = ({
  isOpen,
  onClose,
  purchase,
  onOpenPartialPayment,
  onOpenReceipt,
}) => {
  const { showToast } = useToast();

  if (!purchase) return null;

  const payments = purchaseService.getPurchasePayments(purchase.id);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PAID':
        return <span className="badge badge-available">Fully Settled</span>;
      case 'PARTIAL':
        return <span className="badge badge-booked">Partial Paid</span>;
      case 'CONSIGNMENT':
        return <span className="badge badge-ownership-client">Consignment (0 Outflow)</span>;
      default:
        return <span className="badge badge-sold">Unpaid</span>;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Purchase Deed: ${purchase.id}`}
      subtitle={`Vehicle: ${purchase.vehicleSummary}`}
      maxWidth="780px"
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <div>
            {purchase.remainingAmount > 0 && (
              <button
                type="button"
                className="btn btn-emerald"
                onClick={() => {
                  onClose();
                  onOpenPartialPayment(purchase);
                }}
              >
                <DollarSign size={15} /> Pay Remaining Balance
              </button>
            )}
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                onClose();
                onOpenReceipt(purchase);
              }}
            >
              <Printer size={15} /> Print Legal Deed & Voucher
            </button>
            <button type="button" className="btn btn-primary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {/* Top Summary Banner */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 20px',
            background: 'var(--bg-surface-elevated)',
            borderRadius: 'var(--radius-md)',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {getStatusBadge(purchase.paymentStatus)}
            <span className="badge badge-ownership-showroom">
              {purchase.purchaseType.replace(/_/g, ' ')}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '20px', alignItems: 'baseline' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Agreed Price: </span>
              <strong style={{ fontSize: '1.125rem', color: '#FFF' }}>₨ {Number(purchase.purchasePrice).toLocaleString()}</strong>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Remaining: </span>
              <strong style={{ fontSize: '1.25rem', color: purchase.remainingAmount > 0 ? 'var(--brand-rose)' : 'var(--brand-emerald)', fontFamily: 'var(--font-heading)' }}>
                ₨ {Number(purchase.remainingAmount).toLocaleString()}
              </strong>
            </div>
          </div>
        </div>

        {/* 2-Column Info: Seller KYC & Acquisition Terms */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          {/* Seller Details */}
          <div className="surface-card" style={{ padding: '16px' }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--brand-gold)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={15} /> SELLER & ORIGINAL OWNER KYC
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              <div><strong>Seller:</strong> {purchase.seller?.name}</div>
              {purchase.seller?.fatherName && <div><strong>S/o:</strong> {purchase.seller.fatherName}</div>}
              <div><strong>CNIC:</strong> {purchase.seller?.cnic || 'N/A'}</div>
              <div><strong>Phone:</strong> {purchase.seller?.phone}</div>
              <div><strong>City:</strong> {purchase.seller?.city || 'N/A'}</div>
              {purchase.seller?.address && <div><strong>Address:</strong> {purchase.seller.address}</div>}
              <div><strong>Original Owner:</strong> {purchase.ownerName}</div>
            </div>
          </div>

          {/* Deal & Broker Particulars */}
          <div className="surface-card" style={{ padding: '16px' }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--brand-blue)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FileText size={15} /> TRANSACTION & LEGAL TERMS
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              <div><strong>Purchase Date:</strong> {purchase.purchaseDate}</div>
              <div><strong>Payment Channel:</strong> {purchase.paymentMethod}</div>
              <div><strong>Outflow Drawer:</strong> {purchase.accountPaidFrom}</div>
              <div><strong>Broker Sourced:</strong> {purchase.broker?.name || 'Direct Deal'}</div>
              {purchase.broker?.commissionAmount > 0 && (
                <div><strong>Broker Commission:</strong> ₨ {Number(purchase.broker.commissionAmount).toLocaleString()}</div>
              )}
              {purchase.witnesses?.w1Name && (
                <div><strong>Witness 1:</strong> {purchase.witnesses.w1Name} ({purchase.witnesses.w1Cnic})</div>
              )}
              {purchase.witnesses?.w2Name && (
                <div><strong>Witness 2:</strong> {purchase.witnesses.w2Name} ({purchase.witnesses.w2Cnic})</div>
              )}
            </div>
          </div>
        </div>

        {/* Payments History Ledger for this Purchase */}
        <div className="surface-card" style={{ padding: '16px' }}>
          <h5 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#FFF', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={16} color="var(--brand-emerald)" />
            Payment Outflow History ({payments.length} Vouchers)
          </h5>

          {payments.length === 0 ? (
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              No payments disbursed yet (Consignment agreement).
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {payments.map((p) => (
                <div
                  key={p.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    background: 'var(--bg-surface-elevated)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8125rem',
                  }}
                >
                  <div>
                    <span style={{ fontWeight: 700, color: 'var(--brand-gold)', marginRight: '8px' }}>{p.id}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>{p.receiptReference || p.paymentMethod}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-muted)' }}>{p.paymentDate}</span>
                    <span style={{ fontWeight: 700, color: 'var(--brand-emerald)' }}>
                      - ₨ {Number(p.amount).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notes */}
        {purchase.notes && (
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
            * Notes: {purchase.notes}
          </div>
        )}
      </div>
    </Modal>
  );
};

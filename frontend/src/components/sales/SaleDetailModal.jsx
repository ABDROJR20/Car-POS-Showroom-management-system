import React, { useState } from 'react';
import { Modal } from '../ui';
import { salesService } from '../../services/salesService';
import {
  Car,
  User,
  DollarSign,
  Receipt,
  Calendar,
  Phone,
  MapPin,
  FileText,
  Printer,
  Share2,
  AlertOctagon,
  CheckCircle2,
  TrendingUp,
  Percent,
  PlusCircle,
  Building2,
} from 'lucide-react';

export const SaleDetailModal = ({
  isOpen,
  onClose,
  sale,
  onAddPayment,
  onCancelDeal,
  onPrintInvoice,
}) => {
  if (!sale) return null;

  const payments = salesService.getSalePayments(sale.id);
  const isVoided = sale.status === 'VOIDED';
  const isPaidInFull = sale.paymentStatus === 'PAID_IN_FULL' || sale.remainingBalance === 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Sale Deal Dossier • ${sale.id}`}
      subtitle={`Closed on ${sale.saleDate} • ${sale.vehicleSummary}`}
      maxWidth="860px"
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <div>
            {!isVoided && (
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => onCancelDeal(sale)}
                style={{ fontSize: '0.8125rem', padding: '6px 14px' }}
              >
                <AlertOctagon size={14} /> Void / Cancel Sale
              </button>
            )}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {!isVoided && !isPaidInFull && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => onAddPayment(sale)}
              >
                <PlusCircle size={15} /> Collect Balance (₨ {sale.remainingBalance.toLocaleString()})
              </button>
            )}
            <button
              type="button"
              className="btn btn-blue"
              onClick={() => onPrintInvoice(sale)}
            >
              <Printer size={15} /> Print Sale Deed & Slip
            </button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Deal Status & Void Banner */}
        {isVoided && (
          <div
            style={{
              padding: '14px 18px',
              borderRadius: '10px',
              background: '#FEF2F2',
              border: '1px solid #FECACA',
              color: '#991B1B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.9375rem' }}>DEAL VOIDED / CANCELLED</div>
              <div style={{ fontSize: '0.8125rem', marginTop: '2px' }}>
                Reason: {sale.voidReason || 'Cancelled by administration'}. Vehicle returned to active floor stock.
              </div>
            </div>
            <span className="badge badge-sold">Voided</span>
          </div>
        )}

        {/* Top Highlight Metric Tiles */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
          <div style={{ padding: '14px', borderRadius: '10px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B' }}>NET SALE AMOUNT</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0F172A', marginTop: '4px' }}>
              ₨ {Number(sale.netSalePrice).toLocaleString()}
            </div>
            <div style={{ fontSize: '0.6875rem', color: '#64748B', marginTop: '2px' }}>
              Base: ₨ {Number(sale.salePrice).toLocaleString()}
            </div>
          </div>

          <div style={{ padding: '14px', borderRadius: '10px', background: '#ECFDF5', border: '1px solid #A7F3D0' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#065F46' }}>AMOUNT RECEIVED</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#059669', marginTop: '4px' }}>
              ₨ {Number(sale.amountReceived).toLocaleString()}
            </div>
            <div style={{ fontSize: '0.6875rem', color: '#047857', marginTop: '2px' }}>
              Via {sale.paymentMethod}
            </div>
          </div>

          <div
            style={{
              padding: '14px',
              borderRadius: '10px',
              background: sale.remainingBalance > 0 ? '#FFFBEB' : '#F1F5F9',
              border: `1px solid ${sale.remainingBalance > 0 ? '#FDE68A' : '#E2E8F0'}`,
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: sale.remainingBalance > 0 ? '#92400E' : '#475569' }}>
              REMAINING BALANCE
            </div>
            <div
              style={{
                fontSize: '1.25rem',
                fontWeight: 900,
                color: sale.remainingBalance > 0 ? '#B45309' : '#059669',
                marginTop: '4px',
              }}
            >
              {sale.remainingBalance > 0 ? `₨ ${Number(sale.remainingBalance).toLocaleString()}` : 'CLEARED (₨ 0)'}
            </div>
            <div style={{ fontSize: '0.6875rem', color: '#64748B', marginTop: '2px' }}>
              {isPaidInFull ? '100% Cleared' : 'Pending from Buyer'}
            </div>
          </div>

          <div style={{ padding: '14px', borderRadius: '10px', background: '#F5F3FF', border: '1px solid #DDD6FE' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6D28D9' }}>SHOWROOM NET PROFIT</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#7C3AED', marginTop: '4px' }}>
              ₨ {Number(sale.financials?.grossProfit || sale.financials?.showroomNetEarnings || 0).toLocaleString()}
            </div>
            <div style={{ fontSize: '0.6875rem', color: '#5B21B6', marginTop: '2px' }}>
              {sale.ownershipType} Ownership
            </div>
          </div>
        </div>

        {/* Section: Buyer Profile & Legal Information */}
        <div
          style={{
            padding: '16px',
            borderRadius: '10px',
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
          }}
        >
          <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={16} color="#2563EB" /> Buyer & Legal Witnesses Dossier
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', fontSize: '0.875rem' }}>
            <div>
              <span style={{ color: '#64748B', fontSize: '0.75rem' }}>Buyer Full Name:</span>
              <div style={{ fontWeight: 800, color: '#0F172A' }}>{sale.buyer?.name}</div>
              {sale.buyer?.fatherName && <div style={{ fontSize: '0.75rem', color: '#475569' }}>S/o {sale.buyer?.fatherName}</div>}
            </div>

            <div>
              <span style={{ color: '#64748B', fontSize: '0.75rem' }}>CNIC Number:</span>
              <div style={{ fontWeight: 800, color: '#0F172A' }}>{sale.buyer?.cnic || 'N/A'}</div>
            </div>

            <div>
              <span style={{ color: '#64748B', fontSize: '0.75rem' }}>Contact Phone:</span>
              <div style={{ fontWeight: 800, color: '#059669' }}>{sale.buyer?.phone}</div>
            </div>

            <div>
              <span style={{ color: '#64748B', fontSize: '0.75rem' }}>City / Address:</span>
              <div style={{ fontWeight: 600, color: '#0F172A' }}>
                {sale.buyer?.city ? `${sale.buyer.city}, ` : ''}{sale.buyer?.address || 'N/A'}
              </div>
            </div>
          </div>

          {(sale.witnesses?.w1Name || sale.witnesses?.w2Name) && (
            <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px dashed #E2E8F0', display: 'flex', gap: '20px', fontSize: '0.8125rem' }}>
              {sale.witnesses?.w1Name && (
                <div>
                  <span style={{ color: '#64748B', fontSize: '0.75rem' }}>Witness 1:</span>
                  <div style={{ fontWeight: 700 }}>{sale.witnesses.w1Name} ({sale.witnesses.w1Cnic || 'CNIC'})</div>
                </div>
              )}
              {sale.witnesses?.w2Name && (
                <div>
                  <span style={{ color: '#64748B', fontSize: '0.75rem' }}>Witness 2:</span>
                  <div style={{ fontWeight: 700 }}>{sale.witnesses.w2Name} ({sale.witnesses.w2Cnic || 'CNIC'})</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Section: Accounting & Profit & Loss Statement */}
        <div
          style={{
            padding: '16px',
            borderRadius: '10px',
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
          }}
        >
          <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={16} color="#059669" /> Accounting & Profit Breakdown
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <tbody>
              <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                <td style={{ padding: '6px 0', color: '#475569' }}>Gross Sale Price</td>
                <td style={{ padding: '6px 0', textAlign: 'right', fontWeight: 700 }}>₨ {Number(sale.salePrice).toLocaleString()}</td>
              </tr>
              {Number(sale.discount) > 0 && (
                <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '6px 0', color: '#DC2626' }}>Special Deal Discount</td>
                  <td style={{ padding: '6px 0', textAlign: 'right', color: '#DC2626', fontWeight: 700 }}>- ₨ {Number(sale.discount).toLocaleString()}</td>
                </tr>
              )}
              {Number(sale.additionalCharges) > 0 && (
                <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '6px 0', color: '#475569' }}>Additional Processing Fees</td>
                  <td style={{ padding: '6px 0', textAlign: 'right', fontWeight: 700 }}>+ ₨ {Number(sale.additionalCharges).toLocaleString()}</td>
                </tr>
              )}
              <tr style={{ borderBottom: '2px solid #CBD5E1', background: '#F1F5F9' }}>
                <td style={{ padding: '8px 6px', fontWeight: 800 }}>Net Contract Value</td>
                <td style={{ padding: '8px 6px', textAlign: 'right', fontWeight: 900, color: '#2563EB' }}>₨ {Number(sale.netSalePrice).toLocaleString()}</td>
              </tr>
              {sale.ownershipType === 'Showroom' ? (
                <>
                  <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                    <td style={{ padding: '6px 0', color: '#475569' }}>Showroom Acquisition Cost</td>
                    <td style={{ padding: '6px 0', textAlign: 'right', color: '#64748B' }}>- ₨ {Number(sale.costPrice).toLocaleString()}</td>
                  </tr>
                  {Number(sale.commission?.brokerAmount) > 0 && (
                    <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                      <td style={{ padding: '6px 0', color: '#B45309' }}>Brokerage Fee ({sale.commission.brokerName || 'Broker'})</td>
                      <td style={{ padding: '6px 0', textAlign: 'right', color: '#B45309' }}>- ₨ {Number(sale.commission.brokerAmount).toLocaleString()}</td>
                    </tr>
                  )}
                  {Number(sale.commission?.agentAmount) > 0 && (
                    <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                      <td style={{ padding: '6px 0', color: '#B45309' }}>Sales Staff Bonus ({sale.commission.agentName})</td>
                      <td style={{ padding: '6px 0', textAlign: 'right', color: '#B45309' }}>- ₨ {Number(sale.commission.agentAmount).toLocaleString()}</td>
                    </tr>
                  )}
                  <tr style={{ background: '#ECFDF5' }}>
                    <td style={{ padding: '8px 6px', fontWeight: 800, color: '#065F46' }}>Realized Net Deal Profit</td>
                    <td style={{ padding: '8px 6px', textAlign: 'right', fontWeight: 900, color: '#059669', fontSize: '1rem' }}>
                      ₨ {Number(sale.financials?.grossProfit || 0).toLocaleString()}
                    </td>
                  </tr>
                </>
              ) : (
                <>
                  <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                    <td style={{ padding: '6px 0', color: '#475569' }}>Client/Owner Payable Amount</td>
                    <td style={{ padding: '6px 0', textAlign: 'right', color: '#64748B' }}>₨ {Number(sale.financials?.ownerPayable || sale.costPrice).toLocaleString()}</td>
                  </tr>
                  <tr style={{ background: '#F5F3FF' }}>
                    <td style={{ padding: '8px 6px', fontWeight: 800, color: '#5B21B6' }}>Showroom Commission Earnings</td>
                    <td style={{ padding: '8px 6px', textAlign: 'right', fontWeight: 900, color: '#6D28D9', fontSize: '1rem' }}>
                      ₨ {Number(sale.financials?.showroomNetEarnings || 0).toLocaleString()}
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>

        {/* Section: Payments & Receipts History */}
        <div
          style={{
            padding: '16px',
            borderRadius: '10px',
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
          }}
        >
          <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Receipt size={16} color="#D97706" /> Payment Receipts & Ledger History
          </div>

          {payments.length === 0 ? (
            <div style={{ fontSize: '0.875rem', color: '#64748B', fontStyle: 'italic' }}>
              No payments recorded yet. Initial payment mode: {sale.paymentMethod}.
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #E2E8F0', textAlign: 'left', color: '#64748B' }}>
                  <th style={{ padding: '6px 0' }}>Voucher #</th>
                  <th>Date</th>
                  <th>Channel</th>
                  <th>Account</th>
                  <th>Received By</th>
                  <th style={{ textAlign: 'right' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '8px 0', fontWeight: 700, color: '#D97706' }}>{p.id}</td>
                    <td>{p.paymentDate}</td>
                    <td>{p.paymentMethod}</td>
                    <td>{p.accountDepositedTo}</td>
                    <td>{p.receivedBy}</td>
                    <td style={{ textAlign: 'right', fontWeight: 800, color: '#059669' }}>
                      ₨ {Number(p.amount).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Notes */}
        {sale.notes && (
          <div style={{ padding: '12px 16px', borderRadius: '8px', background: '#F8FAFC', border: '1px solid #E2E8F0', fontSize: '0.8125rem', color: '#475569' }}>
            <strong>Deal Notes:</strong> {sale.notes}
          </div>
        )}
      </div>
    </Modal>
  );
};

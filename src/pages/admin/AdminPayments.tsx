import React, { useState, useEffect } from 'react';
import { CreditCard, CheckCircle2, XCircle, Search, ExternalLink, Eye, ShieldCheck, X } from 'lucide-react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { db } from '../../services/db';
import { useToast } from '../../contexts/ToastContext';
import { Payment } from '../../types';
import { formatRupiah, formatDateTime } from '../../utils';

export const AdminPayments: React.FC = () => {
  const { showToast } = useToast();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [search, setSearch] = useState('');
  const [selectedProof, setSelectedProof] = useState<string | null>(null);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = () => {
    setPayments(db.getPayments());
  };

  const handleVerify = (payment: Payment) => {
    try {
      db.updatePayment(payment.id, {
        status: 'verified',
        verified_at: new Date().toISOString(),
        verified_by: 'Admin PanggilKami',
        notes: 'Diverifikasi manual oleh Admin setelah pengecekan mutasi GoPay/QRIS'
      });
      loadPayments();
      showToast(`Transaksi ${payment.order_code} berhasil diverifikasi Lunas!`, 'success');
    } catch (e: any) {
      showToast('Gagal memverifikasi pembayaran', 'error');
    }
  };

  const handleReject = (payment: Payment) => {
    try {
      db.updatePayment(payment.id, {
        status: 'failed',
        notes: 'Pembayaran ditolak / bukti transfer tidak valid'
      });
      loadPayments();
      showToast(`Transaksi ${payment.order_code} ditandai Gagal.`, 'info');
    } catch (e: any) {
      showToast('Gagal memperbarui status', 'error');
    }
  };

  const filtered = payments.filter(p => 
    p.order_code.toLowerCase().includes(search.toLowerCase()) ||
    p.transaction_id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout 
      title="Manajemen Pembayaran" 
      subtitle="Verifikasi transaksi GoPay, QRIS, dan riwayat mutasi pembayaran pesanan"
    >
      {/* Search Header */}
      <div className="card" style={{ backgroundColor: '#FFFFFF', marginBottom: '1.5rem', padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Cari berdasarkan Kode Pesanan atau ID Transaksi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', color: '#0F172A', marginBottom: '1.25rem' }}>
          Daftar Transaksi Pembayaran ({filtered.length})
        </h3>

        {filtered.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)', color: '#64748B' }}>
                  <th style={{ padding: '0.75rem 0.5rem' }}>ID Transaksi</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Kode Pesanan</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Metode</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Nominal</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Status</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Bukti Transfer</th>
                  <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>Aksi Verifikasi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.85rem 0.5rem', fontWeight: 600, color: '#334155' }}>
                      {p.transaction_id}
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem', fontWeight: 700, color: '#0F172A' }}>
                      {p.order_code}
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem' }}>
                      <span className="badge badge-teal" style={{ textTransform: 'uppercase' }}>
                        {p.method.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem', fontWeight: 800, color: '#1D4ED8' }}>
                      {formatRupiah(p.amount)}
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem' }}>
                      <span className={`badge ${
                        p.status === 'verified' ? 'badge-success' :
                        p.status === 'failed' ? 'badge-danger' : 'badge-warning'
                      }`}>
                        {p.status === 'verified' ? 'Lunas / Terverifikasi' : p.status === 'failed' ? 'Gagal' : 'Menunggu Verifikasi'}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem' }}>
                      {p.proof_url ? (
                        <button
                          onClick={() => setSelectedProof(p.proof_url!)}
                          className="btn btn-outline btn-sm"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                        >
                          <Eye size={12} />
                          <span>Lihat Bukti</span>
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Tanpa Foto</span>
                      )}
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem', textAlign: 'right' }}>
                      {p.status !== 'verified' ? (
                        <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                          <button
                            onClick={() => handleVerify(p)}
                            className="btn btn-teal btn-sm"
                            style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                          >
                            <CheckCircle2 size={12} />
                            <span>Verifikasi Lunas</span>
                          </button>
                          <button
                            onClick={() => handleReject(p)}
                            className="btn btn-outline btn-sm"
                            style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', color: '#EF4444' }}
                          >
                            <XCircle size={12} />
                            <span>Tolak</span>
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 600 }}>
                          ✓ Terverifikasi {p.verified_at ? formatDateTime(p.verified_at) : ''}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2.5rem', color: '#64748B' }}>
            Belum ada transaksi pembayaran.
          </div>
        )}
      </div>

      {/* Proof Preview Modal */}
      {selectedProof && (
        <div className="modal-overlay" onClick={() => setSelectedProof(null)}>
          <div className="modal-content" style={{ maxWidth: '520px', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h4 style={{ fontSize: '1.1rem', color: '#0F172A' }}>Bukti Pembayaran Pelanggan</h4>
              <button onClick={() => setSelectedProof(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>
            <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid #CBD5E1', maxHeight: '480px' }}>
              <img src={selectedProof} alt="Bukti Transfer" style={{ width: '100%', height: 'auto', display: 'block' }} />
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

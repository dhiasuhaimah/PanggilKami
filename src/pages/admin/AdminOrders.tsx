import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  PhoneCall, 
  MapPin, 
  Calendar,
  AlertCircle,
  X
} from 'lucide-react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { db } from '../../services/db';
import { useToast } from '../../contexts/ToastContext';
import { Booking, BookingStatus, PaymentStatus } from '../../types';
import { formatRupiah, formatDateTime, generateWhatsAppUrl } from '../../utils';

export const AdminOrders: React.FC = () => {
  const { showToast } = useToast();
  const [orders, setOrders] = useState<Booking[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Booking | null>(null);
  const [statusUpdateNote, setStatusUpdateNote] = useState('');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    setOrders(db.getBookings());
  };

  const handleUpdateStatus = (newStatus: BookingStatus) => {
    if (!selectedOrder) return;
    try {
      const updated = db.updateBookingStatus(
        selectedOrder.id,
        newStatus,
        statusUpdateNote || `Status diubah menjadi ${newStatus} oleh Admin`,
        'Admin'
      );
      setSelectedOrder(updated);
      loadOrders();
      setStatusUpdateNote('');
      showToast(`Status pesanan ${updated.order_code} diperbarui ke "${newStatus}".`, 'success');
    } catch (e: any) {
      showToast(e.message || 'Gagal memperbarui status', 'error');
    }
  };

  const handleUpdatePaymentStatus = (newPayStatus: PaymentStatus) => {
    if (!selectedOrder) return;
    try {
      const updated = db.updateBookingPaymentStatus(
        selectedOrder.id,
        newPayStatus,
        `Status pembayaran diubah ke ${newPayStatus} oleh Admin`
      );
      setSelectedOrder(updated);
      loadOrders();
      showToast(`Status pembayaran diubah ke "${newPayStatus}".`, 'success');
    } catch (e: any) {
      showToast(e.message || 'Gagal memperbarui pembayaran', 'error');
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.order_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer_phone.includes(searchQuery);

    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout 
      title="Manajemen Pesanan" 
      subtitle="Kelola pesanan masuk, pantau pemenuhan layanan, dan perbarui status operasional"
    >
      {/* Search and Filters Header */}
      <div className="card" style={{ backgroundColor: '#FFFFFF', marginBottom: '1.5rem', padding: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Cari kode pesanan, nama, atau no. telepon..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div style={{ minWidth: '180px' }}>
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Semua Status Pesanan</option>
              <option value="menunggu_pembayaran">Menunggu Pembayaran</option>
              <option value="menunggu_verifikasi_pembayaran">Verifikasi Pembayaran</option>
              <option value="menunggu_konfirmasi_layanan">Konfirmasi Layanan</option>
              <option value="menunggu_mitra">Menugaskan Mitra</option>
              <option value="sedang_diproses">Sedang Diproses</option>
              <option value="selesai">Selesai</option>
              <option value="dibatalkan">Dibatalkan</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', color: '#0F172A' }}>
            Daftar Pesanan ({filteredOrders.length})
          </h3>
        </div>

        {filteredOrders.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)', color: '#64748B' }}>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Kode & Waktu</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Pelanggan</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Layanan</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Jadwal</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Total Tagihan</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Status Pesanan</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Status Bayar</th>
                  <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(order => (
                  <tr key={order.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.85rem 0.5rem' }}>
                      <div style={{ fontWeight: 700, color: '#0F172A' }}>{order.order_code}</div>
                      <div style={{ fontSize: '0.725rem', color: '#94A3B8' }}>{formatDateTime(order.created_at)}</div>
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem' }}>
                      <div style={{ fontWeight: 600, color: '#1E293B' }}>{order.customer_name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{order.customer_phone}</div>
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem', color: '#334155' }}>
                      {order.service_name}
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem', fontSize: '0.8rem', color: '#475569' }}>
                      {order.scheduled_date} <br />
                      <span style={{ fontWeight: 600 }}>{order.scheduled_time} WIB</span>
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem', fontWeight: 700, color: '#1D4ED8' }}>
                      {formatRupiah(order.total_amount)}
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem' }}>
                      <span className={`badge ${
                        order.status === 'selesai' ? 'badge-success' :
                        order.status === 'dibatalkan' ? 'badge-danger' :
                        order.status === 'menunggu_pembayaran' ? 'badge-warning' : 'badge-primary'
                      }`}>
                        {order.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem' }}>
                      <span className={`badge ${order.payment_status === 'lunas' ? 'badge-success' : 'badge-warning'}`}>
                        {order.payment_status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem', textAlign: 'right' }}>
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="btn btn-outline btn-sm"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                      >
                        <Eye size={14} />
                        <span>Detail</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748B' }}>
            Tidak ada pesanan yang sesuai dengan filter pencarian.
          </div>
        )}
      </div>

      {/* Order Detail & Status Management Modal */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content" style={{ maxWidth: '720px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', color: '#0F172A', fontWeight: 800 }}>
                  Kelola Pesanan: {selectedOrder.order_code}
                </h3>
                <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
                  Dibuat pada {formatDateTime(selectedOrder.created_at)}
                </span>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Quick Contact & Info Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0F172A', marginBottom: '0.5rem' }}>
                  Pelanggan & Kontak:
                </div>
                <div style={{ fontSize: '0.85rem', color: '#334155' }}><strong>Nama:</strong> {selectedOrder.customer_name}</div>
                <div style={{ fontSize: '0.85rem', color: '#334155' }}><strong>WA:</strong> {selectedOrder.customer_phone}</div>
                {selectedOrder.customer_email && <div style={{ fontSize: '0.85rem', color: '#334155' }}><strong>Email:</strong> {selectedOrder.customer_email}</div>}
                <div style={{ marginTop: '0.5rem' }}>
                  <a
                    href={generateWhatsAppUrl(selectedOrder.customer_phone, `Halo Kak ${selectedOrder.customer_name}, kami dari Admin PanggilKami Solo Baru terkait pesanan ${selectedOrder.order_code}.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-whatsapp btn-sm"
                  >
                    <PhoneCall size={12} />
                    <span>Hubungi Pelanggan via WA</span>
                  </a>
                </div>
              </div>

              <div style={{ backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0F172A', marginBottom: '0.5rem' }}>
                  Lokasi & Jadwal:
                </div>
                <div style={{ fontSize: '0.85rem', color: '#334155' }}><strong>Area:</strong> {selectedOrder.area_name}</div>
                {selectedOrder.pickup_address && (
                  <div style={{ fontSize: '0.85rem', color: '#334155' }}><strong>Titik Jemput:</strong> {selectedOrder.pickup_address}</div>
                )}
                <div style={{ fontSize: '0.85rem', color: '#334155' }}><strong>Tujuan / Alamat:</strong> {selectedOrder.destination_address || '-'}</div>
                <div style={{ fontSize: '0.85rem', color: '#1D4ED8', fontWeight: 600, marginTop: '0.25rem' }}>
                  Jadwal: {selectedOrder.scheduled_date} pukul {selectedOrder.scheduled_time} WIB
                </div>
              </div>
            </div>

            {/* Financial Details */}
            <div style={{ backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0F172A', marginBottom: '0.5rem' }}>
                Rincian Biaya Transaksi:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', fontSize: '0.85rem' }}>
                <div>Jasa: <strong>{formatRupiah(selectedOrder.service_fee)}</strong></div>
                <div>Jarak: <strong>{formatRupiah(selectedOrder.travel_fee)}</strong></div>
                {selectedOrder.item_budget > 0 && <div>Uang Belanja Titipan: <strong>{formatRupiah(selectedOrder.item_budget)}</strong></div>}
                {selectedOrder.discount_amount > 0 && <div>Diskon: <strong>- {formatRupiah(selectedOrder.discount_amount)}</strong></div>}
                <div>Total Tagihan: <strong style={{ color: '#1D4ED8', fontSize: '1rem' }}>{formatRupiah(selectedOrder.total_amount)}</strong></div>
              </div>
            </div>

            {/* Change Status Controls */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem', marginBottom: '1.25rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0F172A', marginBottom: '0.75rem' }}>
                Perbarui Status Pesanan Operasional:
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                {(['menunggu_konfirmasi_layanan', 'menunggu_mitra', 'sedang_diproses', 'selesai', 'dibatalkan'] as BookingStatus[]).map(st => (
                  <button
                    key={st}
                    onClick={() => handleUpdateStatus(st)}
                    className={`btn btn-sm ${selectedOrder.status === st ? 'btn-primary' : 'btn-outline'}`}
                  >
                    {st.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>

              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0F172A', marginBottom: '0.5rem' }}>
                Perbarui Status Pembayaran:
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                {(['belum_bayar', 'menunggu_verifikasi', 'lunas', 'gagal', 'dikembalikan'] as PaymentStatus[]).map(ps => (
                  <button
                    key={ps}
                    onClick={() => handleUpdatePaymentStatus(ps)}
                    className={`btn btn-sm ${selectedOrder.payment_status === ps ? 'btn-teal' : 'btn-outline'}`}
                  >
                    {ps.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Catatan perubahan status (opsional)"
                  value={statusUpdateNote}
                  onChange={(e) => setStatusUpdateNote(e.target.value)}
                />
              </div>
            </div>

            {/* Status History Trail */}
            {selectedOrder.status_history && selectedOrder.status_history.length > 0 && (
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#64748B', marginBottom: '0.5rem' }}>
                  Riwayat Perubahan Status:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', maxHeight: '140px', overflowY: 'auto', fontSize: '0.8rem' }}>
                  {selectedOrder.status_history.map((h, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', color: '#475569', backgroundColor: '#F8FAFC', padding: '0.3rem 0.6rem', borderRadius: '4px' }}>
                      <span><strong>{h.status.replace(/_/g, ' ')}</strong>: {h.note || '-'}</span>
                      <span style={{ color: '#94A3B8' }}>{formatDateTime(h.timestamp)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

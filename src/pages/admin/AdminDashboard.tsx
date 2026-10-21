import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  TrendingUp, 
  Wallet,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  CreditCard
} from 'lucide-react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { db } from '../../services/db';
import { Booking, Payment, User } from '../../types';
import { formatRupiah, formatDateTime } from '../../utils';

export const AdminDashboard: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [customers, setCustomers] = useState<User[]>([]);

  useEffect(() => {
    setBookings(db.getBookings());
    setPayments(db.getPayments());
    setCustomers(db.getUsers().filter(u => u.role === 'customer'));
  }, []);

  // Metrics calculation
  const totalOrders = bookings.length;
  const newOrders = bookings.filter(b => b.status === 'menunggu_pembayaran' || b.status === 'menunggu_konfirmasi_layanan').length;
  const waitingPayment = bookings.filter(b => b.status === 'menunggu_pembayaran').length;
  const waitingVerification = bookings.filter(b => b.status === 'menunggu_verifikasi_pembayaran').length;
  const inProgressOrders = bookings.filter(b => b.status === 'sedang_diproses' || b.status === 'menunggu_mitra').length;
  const completedOrders = bookings.filter(b => b.status === 'selesai').length;
  const cancelledOrders = bookings.filter(b => b.status === 'dibatalkan').length;

  // Gross Transaction Value vs Net Service Revenue (Strictly separating jastip item budget from service fee)
  const totalGrossValue = bookings
    .filter(b => b.status !== 'dibatalkan')
    .reduce((acc, b) => acc + b.total_amount, 0);

  const netServiceRevenue = bookings
    .filter(b => b.status !== 'dibatalkan' && b.payment_status === 'lunas')
    .reduce((acc, b) => acc + (b.service_fee + b.travel_fee - b.discount_amount), 0);

  const totalItemBudgetManaged = bookings
    .filter(b => b.status !== 'dibatalkan')
    .reduce((acc, b) => acc + b.item_budget, 0);

  const recentOrders = bookings.slice(0, 6);

  return (
    <AdminLayout 
      title="Ringkasan Operasional" 
      subtitle="Pantau metriks pemesanan, verifikasi pembayaran GoPay/QRIS, dan armada layanan PanggilKami"
    >
      {/* Revenue & Gross Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '1.75rem' }}>
        <div className="card" style={{ backgroundColor: '#FFFFFF', borderLeft: '4px solid #1D4ED8' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>Pendapatan Bersih Jasa</span>
            <span style={{ backgroundColor: '#EFF6FF', color: '#1D4ED8', padding: '0.35rem', borderRadius: 'var(--radius-sm)' }}>
              <TrendingUp size={18} />
            </span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.25rem' }}>
            {formatRupiah(netServiceRevenue)}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 500 }}>
            Upah jasa & ongkos dari pesanan lunas
          </div>
        </div>

        <div className="card" style={{ backgroundColor: '#FFFFFF', borderLeft: '4px solid #0D9488' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>Total Nilai Transaksi</span>
            <span style={{ backgroundColor: '#F0FDFA', color: '#0D9488', padding: '0.35rem', borderRadius: 'var(--radius-sm)' }}>
              <Wallet size={18} />
            </span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.25rem' }}>
            {formatRupiah(totalGrossValue)}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
            Gross (Termasuk uang belanja titipan: {formatRupiah(totalItemBudgetManaged)})
          </div>
        </div>

        <div className="card" style={{ backgroundColor: '#FFFFFF', borderLeft: '4px solid #F59E0B' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>Perlu Verifikasi Bayar</span>
            <span style={{ backgroundColor: '#FFFBEB', color: '#F59E0B', padding: '0.35rem', borderRadius: 'var(--radius-sm)' }}>
              <CreditCard size={18} />
            </span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#D97706', marginBottom: '0.25rem' }}>
            {waitingVerification}
          </div>
          <Link to="/admin/pembayaran" style={{ fontSize: '0.75rem', color: '#1D4ED8', fontWeight: 600 }}>
            Verifikasi sekarang →
          </Link>
        </div>

        <div className="card" style={{ backgroundColor: '#FFFFFF', borderLeft: '4px solid #10B981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>Pelanggan Terdaftar</span>
            <span style={{ backgroundColor: '#ECFDF5', color: '#10B981', padding: '0.35rem', borderRadius: 'var(--radius-sm)' }}>
              <Users size={18} />
            </span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.25rem' }}>
            {customers.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
            Warga Solo Baru & sekitarnya
          </div>
        </div>
      </div>

      {/* Operational Order Status Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.85rem', marginBottom: '2rem' }}>
        <div className="card" style={{ padding: '1rem', textAlign: 'center', backgroundColor: '#FFFFFF' }}>
          <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Total Pesanan</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A' }}>{totalOrders}</div>
        </div>
        <div className="card" style={{ padding: '1rem', textAlign: 'center', backgroundColor: '#FFFFFF' }}>
          <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Menunggu Bayar</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F59E0B' }}>{waitingPayment}</div>
        </div>
        <div className="card" style={{ padding: '1rem', textAlign: 'center', backgroundColor: '#FFFFFF' }}>
          <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Sedang Diproses</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0D9488' }}>{inProgressOrders}</div>
        </div>
        <div className="card" style={{ padding: '1rem', textAlign: 'center', backgroundColor: '#FFFFFF' }}>
          <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Pesanan Selesai</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10B981' }}>{completedOrders}</div>
        </div>
        <div className="card" style={{ padding: '1rem', textAlign: 'center', backgroundColor: '#FFFFFF' }}>
          <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Dibatalkan</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#EF4444' }}>{cancelledOrders}</div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', color: '#0F172A' }}>Pesanan Masuk Terbaru</h3>
            <p style={{ fontSize: '0.85rem', color: '#64748B' }}>Daftar transaksi terkini dari pelanggan</p>
          </div>
          <Link to="/admin/pesanan" className="btn btn-outline btn-sm">
            <span>Buka Semua Pesanan</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {recentOrders.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)', color: '#64748B' }}>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Kode Pesanan</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Pelanggan</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Layanan</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Total</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Status Pesanan</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Pembayaran</th>
                  <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.85rem 0.5rem', fontWeight: 700, color: '#0F172A' }}>
                      {order.order_code}
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem' }}>
                      <div style={{ fontWeight: 600, color: '#1E293B' }}>{order.customer_name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{order.customer_phone}</div>
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem', color: '#475569' }}>
                      {order.service_name}
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
                      <Link to={`/admin/pesanan`} className="btn btn-outline btn-sm" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}>
                        Kelola
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2.5rem', color: '#64748B' }}>
            Belum ada data pesanan masuk.
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

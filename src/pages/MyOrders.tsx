import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Clock, CheckCircle2, AlertCircle, Search, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../services/db';
import { Booking } from '../types';
import { formatRupiah, formatDateTime } from '../utils';

export const MyOrders: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Booking[]>([]);
  const [searchCode, setSearchCode] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (user) {
      setOrders(db.getBookingsByCustomer(user.id));
    } else {
      // If guest, show recent bookings from DB or local
      setOrders(db.getBookings().slice(0, 5));
    }
  }, [user]);

  const handleSearchByCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchCode.trim()) return;
    const found = db.getBookingById(searchCode.trim().toUpperCase());
    if (found) {
      navigate(`/pesanan/${found.order_code}`);
    } else {
      alert(`Pesanan dengan kode "${searchCode}" tidak ditemukan.`);
    }
  };

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'menunggu_pembayaran':
        return <span className="badge badge-warning">Menunggu Pembayaran</span>;
      case 'menunggu_verifikasi_pembayaran':
        return <span className="badge badge-warning">Verifikasi Pembayaran</span>;
      case 'menunggu_konfirmasi_layanan':
        return <span className="badge badge-primary">Konfirmasi Layanan</span>;
      case 'menunggu_mitra':
        return <span className="badge badge-teal">Menunggu Mitra</span>;
      case 'sedang_diproses':
        return <span className="badge badge-teal">Sedang Diproses</span>;
      case 'selesai':
        return <span className="badge badge-success">Selesai</span>;
      case 'dibatalkan':
        return <span className="badge badge-danger">Dibatalkan</span>;
      default:
        return <span className="badge badge-neutral">{status}</span>;
    }
  };

  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(o => o.status === statusFilter);

  return (
    <div className="section section-subtle" style={{ minHeight: '85vh' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.85rem', color: '#0F172A', marginBottom: '0.25rem' }}>
              Pesanan Saya
            </h1>
            <p style={{ color: '#64748B', fontSize: '0.95rem' }}>
              {user ? `Kelola dan pantau seluruh transaksi Anda (${user.email})` : 'Daftar pesanan Anda di PanggilKami'}
            </p>
          </div>

          <Link to="/layanan" className="btn btn-teal">
            <ShoppingBag size={16} />
            <span>Pesan Jasa Baru</span>
          </Link>
        </div>

        {/* Quick Search By Code Bar */}
        <div className="card" style={{ marginBottom: '1.5rem', backgroundColor: '#FFFFFF', padding: '1rem 1.25rem' }}>
          <form onSubmit={handleSearchByCode} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Cari berdasarkan Kode Pesanan (Contoh: PK-20261018-XXXX)"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary btn-sm">
              <Search size={14} />
              <span>Cari Pesanan</span>
            </button>
          </form>
        </div>

        {/* Status Filter Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
          {[
            { id: 'all', label: 'Semua Status' },
            { id: 'menunggu_pembayaran', label: 'Menunggu Bayar' },
            { id: 'sedang_diproses', label: 'Dalam Proses' },
            { id: 'selesai', label: 'Selesai' },
            { id: 'dibatalkan', label: 'Dibatalkan' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`btn btn-sm ${statusFilter === tab.id ? 'btn-primary' : 'btn-outline'}`}
              style={{ borderRadius: 'var(--radius-full)' }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {filteredOrders.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredOrders.map(order => (
              <div key={order.id} className="card" style={{ backgroundColor: '#FFFFFF', padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>KODE:</span>
                      <strong style={{ fontSize: '1rem', color: '#0F172A' }}>{order.order_code}</strong>
                      {getStatusBadge(order.status)}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
                      Dibuat pada: {formatDateTime(order.created_at)}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Total Biaya:</div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1D4ED8' }}>
                      {formatRupiah(order.total_amount)}
                    </div>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: '#0F172A', fontSize: '0.925rem' }}>
                      {order.service_name}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
                      Jadwal: {order.scheduled_date} pukul {order.scheduled_time} WIB
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {order.payment_status !== 'lunas' && order.status !== 'dibatalkan' && (
                      <Link to={`/pembayaran/${order.order_code}`} className="btn btn-teal btn-sm">
                        Bayar Sekarang
                      </Link>
                    )}
                    <Link to={`/pesanan/${order.order_code}`} className="btn btn-outline btn-sm">
                      <span>Buka Detail</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem', backgroundColor: '#FFFFFF' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: '#F1F5F9',
              color: '#64748B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem auto'
            }}>
              <ShoppingBag size={28} />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#0F172A' }}>
              Belum Ada Pesanan Ditemukan
            </h3>
            <p style={{ color: '#64748B', fontSize: '0.925rem', marginBottom: '1.5rem' }}>
              Anda belum memiliki riwayat pesanan dengan kriteria ini. Mulai pesan jasa pertama Anda hari ini.
            </p>
            <Link to="/layanan" className="btn btn-primary">
              Lihat Katalog Layanan
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

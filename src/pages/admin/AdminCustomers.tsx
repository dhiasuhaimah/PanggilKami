import React, { useState, useEffect } from 'react';
import { Users, PhoneCall, Mail, Calendar, ShoppingBag, Search } from 'lucide-react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { db } from '../../services/db';
import { User, Booking } from '../../types';
import { formatDate, formatRupiah, generateWhatsAppUrl } from '../../utils';

export const AdminCustomers: React.FC = () => {
  const [customers, setCustomers] = useState<User[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setCustomers(db.getUsers().filter(u => u.role === 'customer'));
    setBookings(db.getBookings());
  }, []);

  const getCustomerOrders = (customerId: string) => {
    return bookings.filter(b => b.customer_id === customerId);
  };

  const filtered = customers.filter(c => 
    c.full_name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  return (
    <AdminLayout 
      title="Manajemen Pelanggan" 
      subtitle="Daftar akun pelanggan terdaftar dan histori aktivitas pemesanan"
    >
      {/* Search Header */}
      <div className="card" style={{ backgroundColor: '#FFFFFF', marginBottom: '1.5rem', padding: '1rem 1.25rem' }}>
        <input
          type="text"
          className="form-input"
          placeholder="Cari pelanggan berdasarkan nama, email, atau no. telepon..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Customer Table */}
      <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', color: '#0F172A', marginBottom: '1.25rem' }}>
          Data Pelanggan ({filtered.length})
        </h3>

        {filtered.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)', color: '#64748B' }}>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Nama Pelanggan</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Kontak WhatsApp</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Email</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Bergabung</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Total Pesanan</th>
                  <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => {
                  const orders = getCustomerOrders(c.id);
                  const totalSpent = orders
                    .filter(o => o.status !== 'dibatalkan')
                    .reduce((acc, o) => acc + o.total_amount, 0);

                  return (
                    <tr key={c.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.85rem 0.5rem', fontWeight: 700, color: '#0F172A' }}>
                        {c.full_name}
                      </td>
                      <td style={{ padding: '0.85rem 0.5rem', color: '#334155' }}>
                        {c.phone}
                      </td>
                      <td style={{ padding: '0.85rem 0.5rem', color: '#64748B' }}>
                        {c.email}
                      </td>
                      <td style={{ padding: '0.85rem 0.5rem', color: '#64748B', fontSize: '0.8rem' }}>
                        {formatDate(c.created_at)}
                      </td>
                      <td style={{ padding: '0.85rem 0.5rem' }}>
                        <span className="badge badge-primary">
                          {orders.length} Pesanan ({formatRupiah(totalSpent)})
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 0.5rem', textAlign: 'right' }}>
                        <a
                          href={generateWhatsAppUrl(c.phone, `Halo Kak ${c.full_name}, kami dari Customer Service PanggilKami.`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-whatsapp btn-sm"
                          style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                        >
                          <PhoneCall size={12} />
                          <span>Hubungi WA</span>
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2.5rem', color: '#64748B' }}>
            Belum ada pelanggan terdaftar.
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

import React, { useState, useEffect } from 'react';
import { Settings, Save, MapPin, Tag, Lock, PhoneCall, Mail, Clock, Plus, Trash2 } from 'lucide-react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { db } from '../../services/db';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { SiteSettings, ServiceArea, Voucher } from '../../types';
import { formatRupiah } from '../../utils';

export const AdminSettings: React.FC = () => {
  const { user, changePassword } = useAuth();
  const { showToast } = useToast();

  const [settings, setSettings] = useState<SiteSettings>(db.getSettings());
  const [areas, setAreas] = useState<ServiceArea[]>(db.getAreas());
  const [vouchers, setVouchers] = useState<Voucher[]>(db.getVouchers());

  // New Area form
  const [newAreaName, setNewAreaName] = useState('');
  const [newAreaCity, setNewAreaCity] = useState('Sukoharjo');
  const [newAreaFee, setNewAreaFee] = useState<number>(5000);

  // New Voucher form
  const [newVoucherCode, setNewVoucherCode] = useState('');
  const [newVoucherValue, setNewVoucherValue] = useState<number>(50);

  // Password change
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      db.updateSettings(settings);
      showToast('Pengaturan website berhasil disimpan!', 'success');
    } catch (e: any) {
      showToast('Gagal menyimpan pengaturan', 'error');
    }
  };

  const handleAddArea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAreaName.trim()) return;

    try {
      db.addArea({
        name: newAreaName.trim(),
        city: newAreaCity.trim(),
        base_fee: Number(newAreaFee),
        is_active: true
      });
      setAreas(db.getAreas());
      setNewAreaName('');
      showToast('Wilayah layanan berhasil ditambahkan!', 'success');
    } catch (e: any) {
      showToast('Gagal menambah wilayah', 'error');
    }
  };

  const handleToggleArea = (area: ServiceArea) => {
    try {
      db.updateArea(area.id, { is_active: !area.is_active });
      setAreas(db.getAreas());
      showToast(`Wilayah ${area.name} diubah.`, 'success');
    } catch (e: any) {
      showToast('Gagal memperbarui wilayah', 'error');
    }
  };

  const handleChangeAdminPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      showToast('Kata sandi baru minimal 6 karakter', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('Konfirmasi kata sandi tidak cocok', 'error');
      return;
    }

    try {
      await changePassword(oldPassword, newPassword);
      showToast('Kata sandi admin berhasil diperbarui!', 'success');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      showToast(err.message || 'Gagal mengganti kata sandi', 'error');
    }
  };

  return (
    <AdminLayout 
      title="Pengaturan Website & Operasional" 
      subtitle="Kelola kontak resmi, nomor WhatsApp, wilayah operasional, kupon promo, dan keamanan admin"
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
        
        {/* Contact & General Info */}
        <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.15rem', color: '#0F172A', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <PhoneCall size={18} style={{ color: '#1D4ED8' }} />
            <span>Informasi Kontak & Operasional</span>
          </h3>

          <form onSubmit={handleSaveSettings}>
            <div className="form-group">
              <label className="form-label">Nomor WhatsApp Customer Service</label>
              <input
                type="text"
                required
                className="form-input"
                value={settings.whatsapp_number}
                onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Dukungan Pelanggan</label>
              <input
                type="email"
                required
                className="form-input"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Alamat Pusat Operasional</label>
              <textarea
                required
                className="form-textarea"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Jam Operasional Harian</label>
              <input
                type="text"
                required
                className="form-input"
                value={settings.operating_hours}
                onChange={(e) => setSettings({ ...settings, operating_hours: e.target.value })}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              <Save size={16} />
              <span>Simpan Pengaturan Kontak</span>
            </button>
          </form>
        </div>

        {/* Change Admin Password */}
        <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.15rem', color: '#0F172A', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Lock size={18} style={{ color: '#EF4444' }} />
            <span>Keamanan Akun Administrator</span>
          </h3>

          <div style={{ backgroundColor: '#FEF2F2', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.8rem', color: '#991B1B' }}>
            Email Admin: <strong>{user?.email}</strong>. Ganti kata sandi bawaan (123456) untuk menjaga keamanan operasional.
          </div>

          <form onSubmit={handleChangeAdminPassword}>
            <div className="form-group">
              <label className="form-label">Kata Sandi Saat Ini</label>
              <input
                type="password"
                required
                className="form-input"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Masukkan kata sandi lama"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Kata Sandi Baru</label>
              <input
                type="password"
                required
                className="form-input"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min. 6 karakter"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Konfirmasi Kata Sandi Baru</label>
              <input
                type="password"
                required
                className="form-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi kata sandi baru"
              />
            </div>

            <button type="submit" className="btn btn-teal" style={{ width: '100%', justifyContent: 'center' }}>
              <Lock size={16} />
              <span>Perbarui Kata Sandi Admin</span>
            </button>
          </form>
        </div>

        {/* Manage Service Areas */}
        <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.15rem', color: '#0F172A', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={18} style={{ color: '#0D9488' }} />
            <span>Wilayah Jangkauan Solo Raya</span>
          </h3>

          <form onSubmit={handleAddArea} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <input
              type="text"
              required
              className="form-input"
              style={{ flex: 2, minWidth: '140px' }}
              placeholder="Nama area baru (contoh: Baki)"
              value={newAreaName}
              onChange={(e) => setNewAreaName(e.target.value)}
            />
            <input
              type="number"
              required
              className="form-input"
              style={{ flex: 1, minWidth: '90px' }}
              placeholder="Ongkos (Rp)"
              value={newAreaFee}
              onChange={(e) => setNewAreaFee(Number(e.target.value))}
            />
            <button type="submit" className="btn btn-teal btn-sm">
              <Plus size={14} />
              <span>Tambah</span>
            </button>
          </form>

          <div style={{ maxHeight: '240px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {areas.map(a => (
              <div key={a.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.5rem 0.75rem',
                backgroundColor: '#F8FAFC',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem'
              }}>
                <div>
                  <strong>{a.name}</strong> ({a.city})
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                    Ongkos: {a.base_fee ? formatRupiah(a.base_fee) : 'Gratis'}
                  </div>
                </div>
                <button
                  onClick={() => handleToggleArea(a)}
                  className={`btn btn-sm ${a.is_active ? 'btn-outline' : 'btn-teal'}`}
                  style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem' }}
                >
                  {a.is_active ? 'Aktif' : 'Nonaktif'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Voucher Management */}
        <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.15rem', color: '#0F172A', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Tag size={18} style={{ color: '#1D4ED8' }} />
            <span>Kupon Voucher Promosi</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {vouchers.map(v => (
              <div key={v.id} style={{
                backgroundColor: '#EFF6FF',
                border: '1px solid #BFDBFE',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontWeight: 800, color: '#1E3A8A', fontSize: '1rem' }}>
                    KODE: {v.code.toUpperCase()}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#2563EB' }}>
                    Diskon: {v.discount_value}% {v.discount_value === 100 ? '(Total Jadi Rp 0)' : ''} | Terpakai: {v.current_uses} / {v.max_uses}
                  </div>
                </div>
                <span className="badge badge-success">Aktif</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};

import React, { useState } from 'react';
import { User, Phone, Mail, Lock, ShieldCheck, Save, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

export const Profile: React.FC = () => {
  const { user, updateProfile, changePassword, logout } = useAuth();
  const { showToast } = useToast();

  // Profile fields
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [savingProfile, setSavingProfile] = useState(false);

  // Password fields
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  if (!user) {
    return <div className="container section">Silakan login terlebih dahulu.</div>;
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await updateProfile({
        full_name: fullName.trim(),
        phone: phone.trim()
      });
      showToast('Profil berhasil diperbarui!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Gagal memperbarui profil', 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      showToast('Kata sandi baru minimal 6 karakter', 'error');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      showToast('Konfirmasi kata sandi baru tidak cocok', 'error');
      return;
    }

    setSavingPassword(true);
    try {
      await changePassword(oldPassword, newPassword);
      showToast('Kata sandi berhasil diubah!', 'success');
      setOldPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err: any) {
      showToast(err.message || 'Gagal mengubah kata sandi', 'error');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="section section-subtle" style={{ minHeight: '85vh' }}>
      <div className="container" style={{ maxWidth: '780px' }}>
        <h1 style={{ fontSize: '1.85rem', color: '#0F172A', marginBottom: '0.35rem' }}>
          Profil Pengguna
        </h1>
        <p style={{ color: '#64748B', marginBottom: '2rem' }}>
          Kelola informasi akun dan pengaturan keamanan PanggilKami Anda.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {/* Profile Form */}
          <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.15rem', color: '#0F172A', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={18} style={{ color: '#1D4ED8' }} />
              <span>Data Pribadi</span>
            </h3>

            <form onSubmit={handleUpdateProfile}>
              <div className="form-group">
                <label className="form-label">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Alamat Email (Tidak dapat diubah)</label>
                <input
                  type="email"
                  disabled
                  className="form-input"
                  value={user.email}
                  style={{ backgroundColor: '#F8FAFC', color: '#64748B' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Nomor WhatsApp</label>
                <input
                  type="tel"
                  required
                  className="form-input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Peran Pengguna (Role)</label>
                <div>
                  <span className={`badge ${user.role === 'admin' ? 'badge-danger' : 'badge-primary'}`}>
                    {user.role === 'admin' ? 'Administrator Operasional' : 'Pelanggan Terverifikasi'}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={savingProfile}
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
              >
                <Save size={16} />
                <span>{savingProfile ? 'Menyimpan...' : 'Simpan Perubahan Profil'}</span>
              </button>
            </form>
          </div>

          {/* Change Password Form */}
          <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.15rem', color: '#0F172A', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Lock size={18} style={{ color: '#0D9488' }} />
              <span>Ganti Kata Sandi</span>
            </h3>

            <form onSubmit={handleChangePassword}>
              <div className="form-group">
                <label className="form-label">Kata Sandi Saat Ini</label>
                <input
                  type="password"
                  required
                  className="form-input"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Masukkan sandi saat ini"
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
                <label className="form-label">Ulangi Kata Sandi Baru</label>
                <input
                  type="password"
                  required
                  className="form-input"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Konfirmasi sandi baru"
                />
              </div>

              <button
                type="submit"
                disabled={savingPassword}
                className="btn btn-teal"
                style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
              >
                <Save size={16} />
                <span>{savingPassword ? 'Memperbarui...' : 'Perbarui Kata Sandi'}</span>
              </button>
            </form>

            <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '2rem', paddingTop: '1.25rem' }}>
              <button
                onClick={logout}
                className="btn btn-outline"
                style={{ width: '100%', justifyContent: 'center', color: '#EF4444', borderColor: '#FCA5A5' }}
              >
                <LogOut size={16} />
                <span>Keluar dari Akun (Logout)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, AlertCircle, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Logo } from '../components/Logo';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { showToast } = useToast();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (password.length < 6) {
      setErrorMsg('Kata sandi minimal 6 karakter.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    setIsLoading(true);

    try {
      const newUser = await register(fullName, email, phone, password);
      showToast(`Pendaftaran berhasil! Selamat datang, ${newUser.full_name}.`, 'success');
      navigate('/pesanan-saya');
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan saat pendaftaran.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="section section-subtle" style={{ minHeight: '85vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: '480px' }}>
        <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '2.5rem 2rem' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Logo variant="navbar" size="lg" />
            </div>
            <h1 style={{ fontSize: '1.5rem', color: '#0F172A', marginBottom: '0.35rem' }}>
              Daftar Akun Pelanggan
            </h1>
            <p style={{ color: '#64748B', fontSize: '0.875rem' }}>
              Buat akun untuk memantau pesanan dan mendapatkan promo menarik
            </p>
          </div>

          {errorMsg && (
            <div style={{
              backgroundColor: '#FEF2F2',
              border: '1px solid #FECACA',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              color: '#991B1B',
              fontSize: '0.875rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Nama Lengkap <span className="required">*</span></label>
              <input
                type="text"
                required
                className="form-input"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Contoh: Budi Santoso"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Alamat Email <span className="required">*</span></label>
              <input
                type="email"
                required
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Nomor WhatsApp <span className="required">*</span></label>
              <input
                type="tel"
                required
                className="form-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Contoh: 081234567890"
              />
              <span className="form-helper">Digunakan untuk konfirmasi pesanan & koordinasi mitra</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2">
              <div className="form-group">
                <label className="form-label">Kata Sandi <span className="required">*</span></label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="form-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 6 karakter"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Ulangi Kata Sandi <span className="required">*</span></label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="form-input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ketik ulang sandi"
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748B',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                <span>{showPassword ? 'Sembunyikan Kata Sandi' : 'Tampilkan Kata Sandi'}</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-teal"
              style={{ width: '100%', justifyContent: 'center', padding: '0.75rem' }}
            >
              <UserPlus size={16} />
              <span>{isLoading ? 'Mendaftarkan Akun...' : 'Daftar Sekarang'}</span>
            </button>
          </form>

          <div style={{
            marginTop: '1.75rem',
            textAlign: 'center',
            fontSize: '0.875rem',
            color: '#64748B',
            borderTop: '1px solid var(--border-color)',
            paddingTop: '1.25rem'
          }}>
            Sudah memiliki akun?{' '}
            <Link to="/login" style={{ fontWeight: 700, color: '#1D4ED8' }}>
              Masuk di Sini
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

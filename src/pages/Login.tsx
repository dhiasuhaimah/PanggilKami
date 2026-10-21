import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Mail, Lock, AlertCircle, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Logo } from '../components/Logo';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      const user = await login(email, password);
      showToast(`Selamat datang kembali, ${user.full_name}!`, 'success');
      
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(from === '/login' ? '/' : from);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan saat masuk');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="section section-subtle" style={{ minHeight: '85vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: '440px' }}>
        <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '2.5rem 2rem' }}>
          {/* Logo / Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Logo variant="navbar" size="lg" />
            </div>
            <h1 style={{ fontSize: '1.5rem', color: '#0F172A', marginBottom: '0.35rem' }}>
              Masuk ke PanggilKami
            </h1>
            <p style={{ color: '#64748B', fontSize: '0.875rem' }}>
              Gunakan email dan kata sandi Anda untuk melanjutkan
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
              <label className="form-label">Alamat Email</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  required
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                />
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label">Kata Sandi</label>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi"
                  style={{ paddingRight: '2.5rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#64748B',
                    cursor: 'pointer'
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem', padding: '0.75rem' }}
            >
              <LogIn size={16} />
              <span>{isLoading ? 'Memverifikasi...' : 'Masuk Sekarang'}</span>
            </button>
          </form>

          {/* Quick Credential Hint for Tester */}
          <div style={{
            marginTop: '1.5rem',
            padding: '0.75rem',
            backgroundColor: '#F8FAFC',
            borderRadius: 'var(--radius-md)',
            border: '1px solid #E2E8F0',
            fontSize: '0.75rem',
            color: '#64748B',
            lineHeight: '1.4'
          }}>
            <div style={{ fontWeight: 700, color: '#334155', marginBottom: '0.2rem' }}>
              🔑 Akun Bawaan Sistem:
            </div>
            <div>Admin: <code>admin@gmail.com</code> | Sandi: <code>123456</code></div>
            <div>Pelanggan: <code>budi@gmail.com</code> | Sandi: <code>123456</code></div>
          </div>

          <div style={{
            marginTop: '1.75rem',
            textAlign: 'center',
            fontSize: '0.875rem',
            color: '#64748B',
            borderTop: '1px solid var(--border-color)',
            paddingTop: '1.25rem'
          }}>
            Belum memiliki akun?{' '}
            <Link to="/register" style={{ fontWeight: 700, color: '#1D4ED8' }}>
              Daftar Pelanggan Baru
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

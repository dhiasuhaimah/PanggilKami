import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  User as UserIcon, 
  LogOut, 
  LayoutDashboard, 
  ShoppingBag, 
  PhoneCall, 
  ChevronDown,
  Sparkles,
  MapPin
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { generateWhatsAppUrl } from '../utils';

import { Logo } from './Logo';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const navLinks = [
    { name: 'Beranda', path: '/' },
    { name: 'Layanan', path: '/layanan' },
    { name: 'Cara Pemesanan', path: '/cara-pemesanan' },
    { name: 'Area Layanan', path: '/area-layanan' },
    { name: 'Tentang Kami', path: '/tentang-kami' },
    { name: 'Kontak', path: '/kontak' },
    { name: 'FAQ', path: '/faq' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 800,
      backgroundColor: 'rgba(255, 255, 255, 0.96)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(226, 232, 240, 0.9)',
      boxShadow: '0 2px 10px rgba(11, 27, 61, 0.04)',
      transition: 'all 200ms ease'
    }}>
      {/* Top Banner Bar for Location & CS */}
      <div style={{
        backgroundColor: '#07132B',
        color: '#E2E8F0',
        fontSize: '0.8rem',
        padding: '0.4rem 0',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={13} style={{ color: '#38BDF8' }} />
            <span>Pusat Layanan: <strong>Solo Baru HTC, Sukoharjo</strong> & Sekitarnya</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <a 
              href={generateWhatsAppUrl('082283883580', 'Halo CS PanggilKami, saya ingin bertanya tentang layanan jasa panggilan.')} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#E2E8F0', display: 'flex', alignItems: 'center', gap: '0.35rem', textDecoration: 'none' }}
            >
              <PhoneCall size={12} style={{ color: '#25D366' }} />
              <span>WhatsApp: 082283883580</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '74px' }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <Logo variant="navbar" size="md" />
        </Link>

        {/* Desktop Navigation */}
        <nav style={{ display: 'none' }} className="desktop-nav">
          <ul style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', listStyle: 'none' }}>
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link 
                  to={link.path}
                  style={{
                    color: isActive(link.path) ? '#1D4ED8' : '#334155',
                    fontWeight: isActive(link.path) ? 700 : 500,
                    fontSize: '0.925rem',
                    padding: '0.35rem 0',
                    borderBottom: isActive(link.path) ? '2px solid #1D4ED8' : '2px solid transparent',
                    transition: 'all 150ms ease'
                  }}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Action Buttons & Auth */}
        <div style={{ display: 'none', alignItems: 'center', gap: '0.85rem' }} className="desktop-actions">
          {isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="btn btn-outline"
                style={{ padding: '0.5rem 0.95rem', borderRadius: 'var(--radius-full)' }}
              >
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: isAdmin ? '#EF4444' : '#1D4ED8',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 700
                }}>
                  {user?.full_name ? user.full_name[0].toUpperCase() : 'U'}
                </div>
                <span style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.full_name?.split(' ')[0]}
                </span>
                <ChevronDown size={14} />
              </button>

              {userDropdownOpen && (
                <div 
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '110%',
                    width: '220px',
                    backgroundColor: 'white',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    boxShadow: 'var(--shadow-lg)',
                    padding: '0.5rem',
                    zIndex: 999
                  }}
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border-color)', marginBottom: '0.35rem' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0F172A' }}>{user?.full_name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{user?.email}</div>
                    <span className={`badge ${isAdmin ? 'badge-danger' : 'badge-primary'}`} style={{ marginTop: '0.25rem' }}>
                      {isAdmin ? 'Administrator' : 'Pelanggan'}
                    </span>
                  </div>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setUserDropdownOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 0.75rem',
                        color: '#1D4ED8',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        borderRadius: 'var(--radius-sm)'
                      }}
                    >
                      <LayoutDashboard size={16} />
                      Dashboard Admin
                    </Link>
                  )}

                  <Link
                    to="/pesanan-saya"
                    onClick={() => setUserDropdownOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 0.75rem',
                      color: '#334155',
                      fontSize: '0.875rem',
                      borderRadius: 'var(--radius-sm)'
                    }}
                  >
                    <ShoppingBag size={16} />
                    Pesanan Saya
                  </Link>

                  <Link
                    to="/profil"
                    onClick={() => setUserDropdownOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 0.75rem',
                      color: '#334155',
                      fontSize: '0.875rem',
                      borderRadius: 'var(--radius-sm)'
                    }}
                  >
                    <UserIcon size={16} />
                    Profil Pengguna
                  </Link>

                  <button
                    onClick={handleLogout}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 0.75rem',
                      color: '#EF4444',
                      fontSize: '0.875rem',
                      border: 'none',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      borderRadius: 'var(--radius-sm)',
                      textAlign: 'left'
                    }}
                  >
                    <LogOut size={16} />
                    Keluar (Logout)
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link to="/login" className="btn btn-outline btn-sm">
                Masuk
              </Link>
              <Link to="/register" className="btn btn-outline-primary btn-sm">
                Daftar
              </Link>
            </div>
          )}

          <Link to="/layanan" className="btn btn-teal btn-sm">
            <Sparkles size={14} />
            Pesan Sekarang
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0.5rem',
            background: 'none',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            color: '#0F172A',
            cursor: 'pointer'
          }}
          className="mobile-toggle"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div 
          style={{
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid var(--border-color)',
            padding: '1.25rem',
            boxShadow: 'var(--shadow-lg)'
          }}
          className="mobile-drawer"
        >
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: 'block',
                    padding: '0.5rem 0.75rem',
                    color: isActive(link.path) ? '#1D4ED8' : '#334155',
                    fontWeight: isActive(link.path) ? 700 : 500,
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: isActive(link.path) ? '#EFF6FF' : 'transparent'
                  }}
                >
                  {link.name}
                </Link>
              </li>
            ))}

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
              {isAuthenticated ? (
                <>
                  <div style={{ padding: '0.5rem 0.75rem', fontWeight: 600, color: '#0F172A' }}>
                    Halo, {user?.full_name} ({isAdmin ? 'Admin' : 'Pelanggan'})
                  </div>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      style={{ display: 'block', padding: '0.5rem 0.75rem', color: '#1D4ED8', fontWeight: 600 }}
                    >
                      Dashboard Admin
                    </Link>
                  )}
                  <Link
                    to="/pesanan-saya"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ display: 'block', padding: '0.5rem 0.75rem', color: '#334155' }}
                  >
                    Pesanan Saya
                  </Link>
                  <Link
                    to="/profil"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ display: 'block', padding: '0.5rem 0.75rem', color: '#334155' }}
                  >
                    Profil Akun
                  </Link>
                  <button
                    onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                    style={{ 
                      display: 'block', 
                      width: '100%', 
                      padding: '0.5rem 0.75rem', 
                      color: '#EF4444', 
                      textAlign: 'left', 
                      border: 'none', 
                      background: 'none',
                      fontWeight: 600
                    }}
                  >
                    Keluar (Logout)
                  </button>
                </>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn btn-outline"
                    style={{ textAlign: 'center' }}
                  >
                    Masuk
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn btn-outline-primary"
                    style={{ textAlign: 'center' }}
                  >
                    Daftar
                  </Link>
                </div>
              )}

              <Link
                to="/layanan"
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-teal"
                style={{ width: '100%', marginTop: '0.75rem', textAlign: 'center' }}
              >
                Pesan Jasa Sekarang
              </Link>
            </div>
          </ul>
        </div>
      )}

      {/* Media query styling for navbar */}
      <style>{`
        @media (min-width: 900px) {
          .desktop-nav { display: block !important; }
          .desktop-actions { display: flex !important; }
          .mobile-toggle { display: none !important; }
          .mobile-drawer { display: none !important; }
        }
      `}</style>
    </header>
  );
};

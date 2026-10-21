import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Layers, 
  Users, 
  CreditCard, 
  Star, 
  Settings, 
  LogOut, 
  ArrowLeft, 
  Menu, 
  X,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title, subtitle }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const menuItems = [
    { name: 'Ringkasan Operasional', path: '/admin', icon: LayoutDashboard },
    { name: 'Manajemen Pesanan', path: '/admin/pesanan', icon: ShoppingBag },
    { name: 'Manajemen Layanan', path: '/admin/layanan', icon: Layers },
    { name: 'Manajemen Pelanggan', path: '/admin/pelanggan', icon: Users },
    { name: 'Manajemen Pembayaran', path: '/admin/pembayaran', icon: CreditCard },
    { name: 'Manajemen Ulasan', path: '/admin/ulasan', icon: Star },
    { name: 'Pengaturan Website', path: '/admin/pengaturan', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      {/* Sidebar for Desktop */}
      <aside style={{
        width: '260px',
        backgroundColor: '#0F172A',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh',
        zIndex: 50
      }} className="admin-desktop-sidebar">
        {/* Brand Header */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #1E293B' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              backgroundColor: '#1D4ED8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1rem',
              color: 'white'
            }}>
              PK
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.02em' }}>
                Admin<span style={{ color: '#14B8A6' }}>PanggilKami</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                Solo Baru HTC Operational
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav style={{ padding: '1rem 0.75rem', flex: 1, overflowY: 'auto' }}>
          <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', padding: '0.5rem 0.75rem' }}>
            Menu Utama
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {menuItems.map(item => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.7rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      color: active ? '#FFFFFF' : '#94A3B8',
                      backgroundColor: active ? '#1D4ED8' : 'transparent',
                      fontWeight: active ? 600 : 500,
                      fontSize: '0.9rem',
                      transition: 'all 150ms ease'
                    }}
                  >
                    <Icon size={18} style={{ color: active ? '#FFFFFF' : '#64748B' }} />
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer / Account */}
        <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid #1E293B', backgroundColor: '#0B1120' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFFFFF' }}>{user?.full_name?.split(' ')[0]}</div>
              <div style={{ fontSize: '0.725rem', color: '#64748B' }}>{user?.email}</div>
            </div>
            <span className="badge badge-danger" style={{ fontSize: '0.65rem' }}>ADMIN</span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link to="/" className="btn btn-outline" style={{ flex: 1, padding: '0.4rem', fontSize: '0.75rem', color: '#E2E8F0', borderColor: '#334155' }}>
              <ArrowLeft size={12} />
              Website
            </Link>
            <button 
              onClick={handleLogout} 
              className="btn btn-outline" 
              style={{ padding: '0.4rem 0.6rem', fontSize: '0.75rem', color: '#EF4444', borderColor: '#334155' }}
              title="Logout Admin"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Admin Top Header */}
        <header style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid var(--border-color)',
          padding: '1rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="admin-mobile-toggle"
              style={{
                display: 'none',
                background: 'none',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.4rem',
                cursor: 'pointer'
              }}
            >
              <Menu size={20} />
            </button>
            <div>
              <h1 style={{ fontSize: '1.35rem', color: '#0F172A', fontWeight: 800 }}>{title}</h1>
              {subtitle && <p style={{ fontSize: '0.85rem', color: '#64748B' }}>{subtitle}</p>}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link to="/" className="btn btn-outline btn-sm">
              <ArrowLeft size={14} />
              <span>Lihat Toko Publik</span>
            </Link>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main style={{ padding: '1.5rem', flex: 1, maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
          {children}
        </main>
      </div>

      {/* Media Queries for Admin Responsive */}
      <style>{`
        @media (max-width: 899px) {
          .admin-desktop-sidebar {
            display: ${sidebarOpen ? 'flex' : 'none'} !important;
            position: fixed !important;
            left: 0;
            top: 0;
            bottom: 0;
            z-index: 999;
          }
          .admin-mobile-toggle {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
};

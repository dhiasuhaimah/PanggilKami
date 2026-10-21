import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
  const { user, isAuthenticated, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '3px solid #E2E8F0', 
            borderTopColor: '#1D4ED8', 
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem auto' 
          }} />
          <p style={{ color: '#64748B', fontWeight: 500 }}>Memuat data akun...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="container section" style={{ textAlign: 'center', maxWidth: '520px' }}>
        <div className="card" style={{ padding: '2.5rem' }}>
          <div style={{ 
            width: '64px', 
            height: '64px', 
            backgroundColor: '#FEF2F2', 
            color: '#EF4444', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontSize: '1.75rem',
            margin: '0 auto 1.25rem auto'
          }}>
            🚫
          </div>
          <h2 style={{ marginBottom: '0.75rem' }}>Akses Ditolak</h2>
          <p style={{ color: '#64748B', marginBottom: '1.5rem' }}>
            Halaman ini khusus untuk administrator PanggilKami. Akun Anda terdaftar sebagai pelanggan ({user?.email}).
          </p>
          <a href="/" className="btn btn-primary" style={{ display: 'inline-flex' }}>
            Kembali ke Beranda
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

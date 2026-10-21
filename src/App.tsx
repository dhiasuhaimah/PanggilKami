import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { ProtectedRoute } from './components/ProtectedRoute';

// Public & Customer Pages
import { Home } from './pages/Home';
import { Services } from './pages/Services';
import { ServiceDetail } from './pages/ServiceDetail';
import { Checkout } from './pages/Checkout';
import { Payment } from './pages/Payment';
import { MyOrders } from './pages/MyOrders';
import { OrderDetail } from './pages/OrderDetail';
import { About } from './pages/About';
import { HowToOrder } from './pages/HowToOrder';
import { ServiceAreas } from './pages/ServiceAreas';
import { Contact } from './pages/Contact';
import { FAQ } from './pages/FAQ';
import { ReviewsPage } from './pages/ReviewsPage';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Profile } from './pages/Profile';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminServices } from './pages/admin/AdminServices';
import { AdminPayments } from './pages/admin/AdminPayments';
import { AdminCustomers } from './pages/admin/AdminCustomers';
import { AdminReviews } from './pages/admin/AdminReviews';
import { AdminSettings } from './pages/admin/AdminSettings';

// Scroll to top helper
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Layout Wrapper
const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <div style={{ flex: 1 }}>{children}</div>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <HashRouter>
          <ScrollToTop />
          <MainLayout>
            <Routes>
              {/* Public Pages */}
              <Route path="/" element={<Home />} />
              <Route path="/layanan" element={<Services />} />
              <Route path="/layanan/:slug" element={<ServiceDetail />} />
              <Route path="/tentang-kami" element={<About />} />
              <Route path="/cara-pemesanan" element={<HowToOrder />} />
              <Route path="/area-layanan" element={<ServiceAreas />} />
              <Route path="/kontak" element={<Contact />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/ulasan" element={<ReviewsPage />} />

              {/* Auth Pages */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Order Flow */}
              <Route path="/pesan/:slug" element={<Checkout />} />
              <Route path="/pembayaran/:orderCode" element={<Payment />} />
              <Route path="/pesanan-saya" element={<MyOrders />} />
              <Route path="/pesanan/:orderCode" element={<OrderDetail />} />

              {/* Customer Protected Route */}
              <Route 
                path="/profil" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />

              {/* Admin Protected Routes */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/pesanan" 
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminOrders />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/layanan" 
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminServices />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/pembayaran" 
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminPayments />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/pelanggan" 
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminCustomers />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/ulasan" 
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminReviews />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/pengaturan" 
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminSettings />
                  </ProtectedRoute>
                } 
              />

              {/* Fallback 404 Route */}
              <Route 
                path="*" 
                element={
                  <div className="container section" style={{ textAlign: 'center', padding: '5rem 1rem' }}>
                    <div style={{ fontSize: '4rem', fontWeight: 800, color: '#1D4ED8', marginBottom: '1rem' }}>404</div>
                    <h2 style={{ marginBottom: '1rem' }}>Halaman Tidak Ditemukan</h2>
                    <p style={{ color: '#64748B', marginBottom: '2rem' }}>
                      Halaman yang Anda tuju mungkin telah dipindahkan atau tautan salah.
                    </p>
                    <a href="/" className="btn btn-primary">
                      Kembali ke Beranda PanggilKami
                    </a>
                  </div>
                } 
              />
            </Routes>
          </MainLayout>
        </HashRouter>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;

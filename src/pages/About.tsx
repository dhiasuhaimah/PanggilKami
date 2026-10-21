import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Target, Users, MapPin, CheckCircle2, Sparkles } from 'lucide-react';
import { Logo } from '../components/Logo';

export const About: React.FC = () => {
  return (
    <div className="section section-subtle" style={{ minHeight: '85vh' }}>
      <div className="container" style={{ maxWidth: '860px' }}>
        <div className="section-header">
          <div className="section-tag section-tag-teal">
            <Users size={14} />
            <span>Mengenal Lebih Dekat</span>
          </div>
          <h1 className="section-title">Tentang PanggilKami</h1>
          <p className="section-desc">
            Marketplace jasa panggilan lokal yang menghubungkan masyarakat Solo Baru dan sekitarnya dengan bantuan harian yang terpercaya.
          </p>
        </div>

        {/* Story Card with Official Brand Badge */}
        <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '2.5rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
            <Logo variant="badge" size="lg" />
          </div>
          <h2 style={{ fontSize: '1.4rem', color: '#0F172A', marginBottom: '1rem', textAlign: 'center' }}>
            Latar Belakang & Visi Kami
          </h2>
          <p style={{ color: '#475569', fontSize: '1rem', lineHeight: '1.8', marginBottom: '1.25rem' }}>
            Kehidupan mahasiswa, pekerja, dan keluarga di kawasan Solo Baru, Grogol, dan Sukoharjo sering kali dipenuhi kesibukan. Mencari bantuan praktis seperti menitip oleh-oleh khas Solo saat sibuk, mengirim dokumen mendesak ke kampus, transportasi lokal yang aman, atau membersihkan kamar kos yang kotor sering kali memakan waktu jika harus mencari kontak mitra satu per satu.
          </p>
          <p style={{ color: '#475569', fontSize: '1rem', lineHeight: '1.8', marginBottom: '1.75rem' }}>
            <strong>PanggilKami</strong> didirikan dengan satu tujuan sederhana: menjadi platform perantara yang mempertemukan pelanggan dengan penyedia jasa lokal terpercaya melalui sistem pemesanan online yang praktis, transparan, dan aman.
          </p>

          <div style={{
            backgroundColor: '#EFF6FF',
            borderLeft: '4px solid #1D4ED8',
            padding: '1.25rem',
            borderRadius: '0 var(--radius-md) var(--radius-md) 0'
          }}>
            <div style={{ fontWeight: 800, color: '#1E40AF', fontSize: '1.1rem', marginBottom: '0.25rem' }}>
              “Butuh Bantuan? PanggilKami.”
            </div>
            <p style={{ color: '#1E3A8A', fontSize: '0.9rem', margin: 0 }}>
              Tagline kami adalah komitmen untuk selalu siap memberikan kemudahan bagi setiap kebutuhan harian Anda.
            </p>
          </div>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3" style={{ marginBottom: '2.5rem' }}>
          <div className="card" style={{ backgroundColor: '#FFFFFF' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#EFF6FF',
              color: '#1D4ED8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <ShieldCheck size={22} />
            </div>
            <h3 style={{ fontSize: '1.1rem', color: '#0F172A', marginBottom: '0.5rem' }}>
              Transparansi Biaya
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#64748B', lineHeight: '1.6' }}>
              Tidak ada biaya tersembunyi. Biaya jasa titip belanja dipisahkan dari harga barang, dan tarif kebersihan dihitung jelas per jam pengerjaan.
            </p>
          </div>

          <div className="card" style={{ backgroundColor: '#FFFFFF' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#F0FDFA',
              color: '#0D9488',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <MapPin size={22} />
            </div>
            <h3 style={{ fontSize: '1.1rem', color: '#0F172A', marginBottom: '0.5rem' }}>
              Fokus Lokal Solo Baru
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#64748B', lineHeight: '1.6' }}>
              Berpusat di Hartono Trade Center (HTC) Sukoharjo, kami mengutamakan penugasan mitra lokal yang paham rute dan seluk-beluk Solo Raya.
            </p>
          </div>

          <div className="card" style={{ backgroundColor: '#FFFFFF' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#FEF2F2',
              color: '#EF4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <Target size={22} />
            </div>
            <h3 style={{ fontSize: '1.1rem', color: '#0F172A', marginBottom: '0.5rem' }}>
              Keamanan Transaksi
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#64748B', lineHeight: '1.6' }}>
              Integrasi pembayaran QR GoPay dan QRIS nasional resmi yang langsung mengunci nominal pesanan secara akurat dan terpantau admin.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center' }}>
          <Link to="/layanan" className="btn btn-primary btn-lg">
            <Sparkles size={18} />
            <span>Jelajahi 4 Kategori Layanan</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

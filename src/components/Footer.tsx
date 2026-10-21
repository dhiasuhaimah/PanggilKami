import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, ShieldCheck, Heart } from 'lucide-react';
import { generateWhatsAppUrl } from '../utils';
import { Logo } from './Logo';

export const Footer: React.FC = () => {
  return (
    <footer style={{
      backgroundColor: '#07132B',
      color: '#94A3B8',
      paddingTop: '4.5rem',
      paddingBottom: '2.5rem',
      marginTop: 'auto',
      borderTop: '1px solid rgba(226, 232, 240, 0.12)'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem'
        }}>
          {/* Brand Info */}
          <div>
            <div style={{ marginBottom: '1.25rem' }}>
              <Logo variant="footer" size="lg" />
            </div>
            
            <p style={{ color: '#CBD5E1', fontSize: '0.95rem', marginBottom: '1.25rem', lineHeight: '1.6' }}>
              Platform marketplace jasa panggilan lokal terpercaya untuk membantu kebutuhan harian Anda secara praktis, transparan, dan aman.
            </p>
            
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#1E293B',
              padding: '0.5rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid #334155'
            }}>
              <ShieldCheck size={16} style={{ color: '#10B981' }} />
              <span style={{ color: '#E2E8F0', fontSize: '0.85rem', fontWeight: 600 }}>
                Tagline: "Butuh Bantuan? PanggilKami."
              </span>
            </div>
          </div>

          {/* Core Services */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1.05rem', marginBottom: '1.25rem' }}>
              Kategori Layanan
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <li>
                <Link to="/layanan/jastip-barang" style={{ color: '#94A3B8' }}>
                  Jasa Titip Barang (Oleh-oleh & Kuliner)
                </Link>
              </li>
              <li>
                <Link to="/layanan/antar-barang" style={{ color: '#94A3B8' }}>
                  Antar Barang Apa Saja (Dokumen & Paket)
                </Link>
              </li>
              <li>
                <Link to="/layanan/antar-jemput" style={{ color: '#94A3B8' }}>
                  Antar Jemput Orang (Perjalanan Lokal)
                </Link>
              </li>
              <li>
                <Link to="/layanan/bersih-bersih" style={{ color: '#94A3B8' }}>
                  Bersih-bersih Kamar / WC / Kos
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links & Area */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1.05rem', marginBottom: '1.25rem' }}>
              Informasi & Bantuan
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <li>
                <Link to="/cara-pemesanan" style={{ color: '#94A3B8' }}>
                  Cara Pemesanan & Alur Layanan
                </Link>
              </li>
              <li>
                <Link to="/area-layanan" style={{ color: '#94A3B8' }}>
                  Wilayah Jangkauan Solo Raya
                </Link>
              </li>
              <li>
                <Link to="/tentang-kami" style={{ color: '#94A3B8' }}>
                  Tentang PanggilKami
                </Link>
              </li>
              <li>
                <Link to="/faq" style={{ color: '#94A3B8' }}>
                  Pertanyaan Sering Diajukan (FAQ)
                </Link>
              </li>
              <li>
                <Link to="/kontak" style={{ color: '#94A3B8' }}>
                  Hubungi Customer Service
                </Link>
              </li>
              <li>
                <Link to="/admin" style={{ color: '#64748B', fontSize: '0.85rem' }}>
                  Portal Pengelola (Admin)
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1.05rem', marginBottom: '1.25rem' }}>
              Hubungi Kami
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                <MapPin size={18} style={{ color: '#14B8A6', flexShrink: 0, marginTop: '0.15rem' }} />
                <span>
                  Solo Baru HTC (Hartono Trade Center), Jl. Ir. Soekarno No.A21, Madegondo, Grogol, Sukoharjo, Jawa Tengah
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Phone size={16} style={{ color: '#25D366', flexShrink: 0 }} />
                <a 
                  href={generateWhatsAppUrl('082283883580', 'Halo PanggilKami, saya ingin konsultasi layanan.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#CBD5E1' }}
                >
                  WhatsApp: 082283883580
                </a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Mail size={16} style={{ color: '#38BDF8', flexShrink: 0 }} />
                <a href="mailto:panggilkamisolo@gmail.com" style={{ color: '#CBD5E1' }}>
                  panggilkamisolo@gmail.com
                </a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Clock size={16} style={{ color: '#FBBF24', flexShrink: 0 }} />
                <span>Setiap Hari: 06.00 - 22.00 WIB</span>
              </div>
            </div>

            {/* GoPay & QRIS Badge */}
            <div style={{ marginTop: '1.25rem', padding: '0.75rem', backgroundColor: '#1E293B', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginBottom: '0.35rem' }}>
                Metode Pembayaran Resmi:
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span className="badge badge-teal" style={{ fontSize: '0.75rem' }}>GoPay</span>
                <span className="badge badge-primary" style={{ fontSize: '0.75rem' }}>QRIS Nasional</span>
                <span className="badge badge-neutral" style={{ fontSize: '0.75rem' }}>Bank Transfer</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid #1E293B',
          paddingTop: '1.5rem',
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          fontSize: '0.85rem',
          color: '#64748B'
        }}>
          <div>
            © {new Date().getFullYear()} PanggilKami. Hak cipta dilindungi undang-undang.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span>Melayani Solo Baru & Sukoharjo dengan</span>
            <Heart size={14} style={{ color: '#EF4444' }} />
          </div>
        </div>
      </div>
    </footer>
  );
};

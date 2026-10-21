import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  PhoneCall, 
  ShoppingBag, 
  Truck, 
  Navigation, 
  Sparkle,
  HelpCircle,
  MessageSquare
} from 'lucide-react';
import { ServiceCard } from '../components/ServiceCard';
import { ReviewCard } from '../components/ReviewCard';
import { db } from '../services/db';
import { Service, Review } from '../types';
import { generateWhatsAppUrl } from '../utils';

export const Home: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    setServices(db.getServices().filter(s => s.is_active));
    // Max 10 reviews on homepage from real DB
    setReviews(db.getPublicReviews().slice(0, 10));
  }, []);

  const steps = [
    {
      num: '01',
      title: 'Pilih Layanan',
      desc: 'Tentukan kebutuhan Anda: titip belanja, kirim barang, antar jemput, atau bersih-bersih kos.'
    },
    {
      num: '02',
      title: 'Isi Detail & Jadwal',
      desc: 'Lengkapi alamat, patokan, instruksi khusus, dan estimasi waktu pengerjaan yang diinginkan.'
    },
    {
      num: '03',
      title: 'Bayar via GoPay / QRIS',
      desc: 'Lakukan pembayaran secara realtime dengan QR GoPay / QRIS nasional yang akurat dan aman.'
    },
    {
      num: '04',
      title: 'Layanan Selesai & Review',
      desc: 'Mitra kami menjalankan tugas dengan sigap. Setelah tuntas, Anda dapat memberikan ulasan.'
    }
  ];

  const highlights = [
    {
      icon: Clock,
      title: 'Pemesanan Online Praktis',
      desc: 'Pesan kapan saja tanpa perlu mencari kontak mitra satu per satu secara manual.'
    },
    {
      icon: ShieldCheck,
      title: 'Tarif & Rincian Transparan',
      desc: 'Seluruh biaya dasar, ongkos perjalanan, dan uang belanja titipan dipisahkan secara jujur.'
    },
    {
      icon: PhoneCall,
      title: 'Bantuan CS Responsif',
      desc: 'Tim Customer Service di Solo Baru HTC siap mendampingi pesanan via WhatsApp setiap hari.'
    },
    {
      icon: ShoppingBag,
      title: 'Riwayat Pesanan Terpantau',
      desc: 'Pantau status pesanan mulai dari verifikasi pembayaran hingga layanan selesai secara realtime.'
    }
  ];

  return (
    <div>
      {/* HERO SECTION */}
      <section style={{
        position: 'relative',
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid var(--border-color)',
        paddingTop: '3.5rem',
        paddingBottom: '4rem',
        overflow: 'hidden'
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3rem',
            alignItems: 'center'
          }}>
            {/* Left Content */}
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.65rem',
                backgroundColor: 'rgba(11, 27, 61, 0.05)',
                border: '1px solid rgba(11, 27, 61, 0.12)',
                padding: '0.35rem 0.85rem',
                borderRadius: '9999px',
                marginBottom: '1.25rem',
                boxShadow: '0 2px 6px rgba(11, 27, 61, 0.04)'
              }}>
                <div style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  backgroundColor: '#0B1B3D',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #CBD5E1'
                }}>
                  <img src="/images/logo.jpg" alt="PK" style={{ width: '190%', height: '190%', objectFit: 'cover', objectPosition: 'center 38%' }} />
                </div>
                <span style={{ fontSize: '0.825rem', fontWeight: 700, color: '#07132B', letterSpacing: '0.02em' }}>
                  Marketplace Jasa Panggilan Resmi Solo Baru & Sekitarnya
                </span>
              </div>

              <h1 style={{ marginBottom: '1.25rem', color: '#07132B', fontWeight: 800, lineHeight: 1.15, fontSize: '2.75rem' }}>
                Butuh Bantuan? <br />
                <span style={{ color: '#0B1B3D' }}>PANGGIL</span>
                <span style={{ color: '#1D4ED8' }}>KAMI</span>.
              </h1>

              <p style={{
                fontSize: '1.15rem',
                color: '#475569',
                lineHeight: '1.6',
                marginBottom: '2rem',
                maxWidth: '540px'
              }}>
                Solusi on-demand terpercaya untuk kebutuhan harian Anda di Solo Baru & Solo Raya. Praktis, tarif transparan, pembayaran QR GoPay real-time, dan aman.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem', marginBottom: '2.5rem' }}>
                <Link to="/layanan" className="btn btn-primary btn-lg" style={{ boxShadow: '0 8px 20px -3px rgba(29, 78, 216, 0.4)' }}>
                  <Sparkles size={18} />
                  <span>Pesan Jasa Sekarang</span>
                </Link>
                <a 
                  href="#kategori-layanan" 
                  className="btn btn-outline btn-lg"
                  style={{ borderColor: '#CBD5E1', color: '#07132B' }}
                >
                  <span>Lihat 4 Layanan Utama</span>
                  <ArrowRight size={18} />
                </a>
              </div>

              {/* Trust Badges */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1.25rem',
                paddingTop: '1.25rem',
                borderTop: '1px solid var(--border-color)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem', color: '#334155', fontWeight: 500 }}>
                  <CheckCircle2 size={16} style={{ color: '#10B981' }} />
                  <span>Pusat Operasional Solo Baru HTC</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem', color: '#334155', fontWeight: 500 }}>
                  <CheckCircle2 size={16} style={{ color: '#10B981' }} />
                  <span>QRIS GoPay Otomatis</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem', color: '#334155', fontWeight: 500 }}>
                  <CheckCircle2 size={16} style={{ color: '#10B981' }} />
                  <span>Voucher Diskon "panggilkami"</span>
                </div>
              </div>
            </div>

            {/* Right Image with Official Brand Card */}
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'relative',
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-xl)',
                border: '1px solid var(--border-color)',
                backgroundColor: '#07132B'
              }}>
                <img 
                  src="/images/hero_banner.jpg" 
                  alt="Penyedia Layanan PanggilKami Solo Baru"
                  style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '420px', objectFit: 'cover' }}
                />

                {/* Floating Official Luxury Brand Badge on Top-Right */}
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  backgroundColor: 'rgba(7, 19, 43, 0.92)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: '12px',
                  padding: '0.5rem 0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  boxShadow: '0 8px 24px rgba(7, 19, 43, 0.4)',
                  border: '1px solid rgba(203, 213, 225, 0.3)'
                }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: '1px solid #CBD5E1',
                    backgroundColor: '#0B1B3D',
                    flexShrink: 0
                  }}>
                    <img 
                      src="/images/logo.jpg" 
                      alt="PanggilKami" 
                      style={{ width: '190%', height: '190%', objectFit: 'cover', objectPosition: 'center 38%' }} 
                    />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.65rem', color: '#94A3B8', fontWeight: 600, letterSpacing: '0.04em' }}>OFFICIAL PARTNER</div>
                    <div style={{ fontSize: '0.85rem', color: '#FFFFFF', fontWeight: 800, letterSpacing: '0.05em' }}>PANGGILKAMI</div>
                  </div>
                </div>
                
                {/* Floating Card On Hero Image Bottom */}
                <div style={{
                  position: 'absolute',
                  bottom: '1rem',
                  left: '1rem',
                  right: '1rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.96)',
                  backdropFilter: 'blur(10px)',
                  padding: '1rem 1.25rem',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: 'var(--shadow-md)'
                }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Mitra Terverifikasi Solo Raya</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#07132B' }}>Siap Membantu Setiap Hari</div>
                  </div>
                  <span className="badge badge-teal" style={{ fontWeight: 700 }}>06.00 - 22.00 WIB</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 CORE SERVICES SECTION */}
      <section id="kategori-layanan" className="section section-subtle">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">
              <ShoppingBag size={14} />
              <span>Layanan Unggulan</span>
            </div>
            <h2 className="section-title">Solusi Kebutuhan Harian Anda</h2>
            <p className="section-desc">
              Pilih dari empat kategori layanan kami dengan proses pemesanan transparan dan mudah diakses.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {services.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>

          {/* Prompt Voucher Callout */}
          <div style={{
            marginTop: '3rem',
            backgroundColor: '#EFF6FF',
            border: '1px solid #BFDBFE',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem 1.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                backgroundColor: '#1D4ED8',
                color: 'white',
                padding: '0.5rem',
                borderRadius: 'var(--radius-md)'
              }}>
                <Sparkles size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 700, color: '#1E3A8A', fontSize: '1rem' }}>
                  Voucher Spesial Pengguna Baru: Gunakan Kode <code style={{ backgroundColor: '#DBEAFE', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 800 }}>panggilkami</code>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#2563EB' }}>
                  Dapatkan potongan diskon 100% (Rp 0) untuk pesanan pertama Anda. Coba layanan kami sekarang!
                </div>
              </div>
            </div>
            <Link to="/layanan" className="btn btn-primary btn-sm">
              Coba Sekarang
            </Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-tag section-tag-teal">
              <span>Alur Pemesanan</span>
            </div>
            <h2 className="section-title">Cara Kerja PanggilKami</h2>
            <p className="section-desc">
              Hanya butuh 4 langkah ringkas untuk memesan bantuan yang Anda butuhkan hari ini.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map(step => (
              <div 
                key={step.num}
                className="card"
                style={{ position: 'relative', overflow: 'hidden' }}
              >
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: 800,
                  color: '#EFF6FF',
                  position: 'absolute',
                  top: '0.5rem',
                  right: '1rem',
                  lineHeight: 1
                }}>
                  {step.num}
                </div>
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '8px',
                    backgroundColor: '#1D4ED8',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    marginBottom: '1rem'
                  }}>
                    {step.num}
                  </div>
                  <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', color: '#0F172A' }}>
                    {step.title}
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: '#64748B', lineHeight: '1.5' }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KEY ADVANTAGES */}
      <section className="section section-subtle">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">
              <span>Kenapa Kami</span>
            </div>
            <h2 className="section-title">Keunggulan Layanan PanggilKami</h2>
            <p className="section-desc">
              Didesain khusus untuk memberikan kepastian, keamanan, dan kenyamanan bertransaksi bagi warga Solo Baru dan sekitarnya.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {highlights.map((h, i) => {
              const Icon = h.icon;
              return (
                <div key={i} className="card" style={{ padding: '1.75rem' }}>
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: '#EFF6FF',
                    color: '#1D4ED8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.25rem'
                  }}>
                    <Icon size={24} />
                  </div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#0F172A' }}>
                    {h.title}
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: '#64748B', lineHeight: '1.5' }}>
                    {h.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SERVICE COVERAGE AREA SECTION */}
      <section className="section">
        <div className="container">
          <div style={{
            backgroundColor: '#0F172A',
            borderRadius: 'var(--radius-xl)',
            padding: '3rem 2rem',
            color: '#FFFFFF'
          }}>
            <div style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                backgroundColor: 'rgba(20, 184, 166, 0.2)',
                color: '#2DD4BF',
                padding: '0.3rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8rem',
                fontWeight: 600,
                marginBottom: '1rem'
              }}>
                <MapPin size={14} />
                <span>Jangkauan Layanan Lokal</span>
              </div>
              <h2 style={{ color: '#FFFFFF', marginBottom: '1rem' }}>
                Area Jangkauan Layanan Solo Baru & Sekitarnya
              </h2>
              <p style={{ color: '#94A3B8', fontSize: '1rem', lineHeight: '1.6', marginBottom: '2rem' }}>
                Pusat operasional kami berada di <strong>Solo Baru HTC (Hartono Trade Center), Sukoharjo</strong>. Kami melayani area terdekat dengan prioritas mitra lokal.
              </p>

              {/* Area Badges Grid */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem', justifyContent: 'center', marginBottom: '2rem' }}>
                {[
                  'Solo Baru HTC',
                  'Sukoharjo Kota',
                  'Kartasura',
                  'Karanganyar',
                  'Sekitar Kampus UMS',
                  'Sekitar Kampus UNS',
                  'Solo Kota (Slamet Riyadi / Pasar Kliwon)',
                  'Nusukan',
                  'Mojolaban',
                  'Semanggi'
                ].map(area => (
                  <span 
                    key={area}
                    style={{
                      backgroundColor: '#1E293B',
                      border: '1px solid #334155',
                      color: '#E2E8F0',
                      padding: '0.45rem 0.95rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.875rem',
                      fontWeight: 500
                    }}
                  >
                    📍 {area}
                  </span>
                ))}
              </div>

              <div style={{ fontSize: '0.825rem', color: '#94A3B8', fontStyle: 'italic' }}>
                * Catatan: Ketersediaan layanan bergantung pada jarak tempuh alamat dan armada mitra aktif saat pemesanan.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS SECTION (MAX 10 OR AUTHENTIC EMPTY STATE) */}
      <section className="section section-subtle">
        <div className="container">
          <div className="section-header">
            <div className="section-tag section-tag-teal">
              <MessageSquare size={14} />
              <span>Ulasan Nyata Pelanggan</span>
            </div>
            <h2 className="section-title">Apa Kata Mereka Tentang PanggilKami?</h2>
            <p className="section-desc">
              Transparansi adalah komitmen kami. Ulasan di bawah murni berasal dari pelanggan yang telah menyelesaikan pesanan nyata.
            </p>
          </div>

          {reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3">
              {reviews.map(review => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          ) : (
            <div className="card" style={{
              textAlign: 'center',
              padding: '3rem 1.5rem',
              maxWidth: '580px',
              margin: '0 auto',
              backgroundColor: '#FFFFFF'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: '#EFF6FF',
                color: '#1D4ED8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem auto'
              }}>
                <MessageSquare size={28} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#0F172A' }}>
                Belum Ada Ulasan Publik
              </h3>
              <p style={{ color: '#64748B', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                Jadilah pelanggan pertama yang berbagi pengalaman! Pesan salah satu layanan kami dan berikan ulasan Anda setelah pesanan selesai.
              </p>
              <Link to="/layanan" className="btn btn-teal">
                <Sparkles size={16} />
                <span>Pesan Layanan Sekarang</span>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* FAQ HIGHLIGHT & CTA */}
      <section className="section">
        <div className="container" style={{ textAlign: 'center', maxWidth: '760px' }}>
          <div className="section-tag">
            <HelpCircle size={14} />
            <span>Punya Pertanyaan?</span>
          </div>
          <h2 style={{ marginBottom: '1rem', color: '#0F172A' }}>
            Siap Membantu Kebutuhan Harian Anda
          </h2>
          <p style={{ color: '#64748B', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '2rem' }}>
            Ada pertanyaan tentang penyesuaian biaya, wilayah jemput, atau kebutuhan khusus? Hubungi tim Customer Service kami via WhatsApp untuk respon cepat.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <a
              href={generateWhatsAppUrl('082283883580', 'Halo CS PanggilKami, saya ingin bertanya tentang cara pemesanan.')}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp btn-lg"
            >
              <PhoneCall size={18} />
              <span>Chat WhatsApp: 082283883580</span>
            </a>
            <Link to="/faq" className="btn btn-outline btn-lg">
              <span>Buka Halaman FAQ</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

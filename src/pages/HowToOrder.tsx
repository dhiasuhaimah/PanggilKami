import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, CheckCircle2, ShieldCheck, ArrowRight, Tag, PhoneCall } from 'lucide-react';
import { generateWhatsAppUrl } from '../utils';

export const HowToOrder: React.FC = () => {
  const steps = [
    {
      num: '1',
      title: 'Pilih Layanan Yang Anda Perlukan',
      desc: 'Buka halaman Layanan dan pilih dari 4 kategori: Jasa Titip Barang, Antar Barang Apa Saja, Antar Jemput Orang, atau Bersih-bersih Kamar Kos/WC.'
    },
    {
      num: '2',
      title: 'Lengkapi Formulir & Jadwal Pengerjaan',
      desc: 'Isi alamat penjemputan/tujuan, patokan lokasi, jadwal jam pengerjaan, dan catatan khusus. Pada layanan kebersihan, Anda dapat memilih luas dan tingkat kekotoran kamar kos.'
    },
    {
      num: '3',
      title: 'Periksa Rincian Biaya & Masukkan Voucher',
      desc: 'Sistem menampilkan rincian biaya transparan. Anda dapat memasukkan kode voucher "panggilkami" untuk mendapatkan promo potongan 100% (Rp 0).'
    },
    {
      num: '4',
      title: 'Lakukan Pembayaran Aman via GoPay / QRIS',
      desc: 'Pindai barcode QRIS resmi yang menampilkan nominal pesanan Anda secara realtime. Setelah membayar, klik tombol "Saya Sudah Membayar".'
    },
    {
      num: '5',
      title: 'Mitra Bertugas & Berikan Ulasan Anda',
      desc: 'Mitra kami akan menjalankan layanan sesuai pesanan. Setelah selesai, jangan lupa berikan rating bintang dan ulasan pengalaman Anda di PanggilKami.'
    }
  ];

  return (
    <div className="section section-subtle" style={{ minHeight: '85vh' }}>
      <div className="container" style={{ maxWidth: '840px' }}>
        <div className="section-header">
          <div className="section-tag section-tag-teal">
            <span>Panduan Pelanggan</span>
          </div>
          <h1 className="section-title">Cara Pemesanan Jasa di PanggilKami</h1>
          <p className="section-desc">
            Alur praktis dan transparan untuk memesan jasa bantuan harian di Solo Baru HTC & sekitarnya.
          </p>
        </div>

        {/* Steps Container */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '3rem' }}>
          {steps.map(s => (
            <div key={s.num} className="card" style={{ backgroundColor: '#FFFFFF', display: 'flex', gap: '1.5rem', alignItems: 'flex-start', padding: '1.75rem' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: '#1D4ED8',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.15rem',
                flexShrink: 0
              }}>
                {s.num}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.15rem', color: '#0F172A', marginBottom: '0.4rem' }}>
                  {s.title}
                </h3>
                <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Special Notes Card */}
        <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '2rem', marginBottom: '2.5rem' }}>
          <h3 style={{ fontSize: '1.15rem', color: '#0F172A', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Tag size={18} style={{ color: '#0D9488' }} />
            <span>Ketentuan Penting Tiap Layanan</span>
          </h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem', color: '#475569' }}>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
              <CheckCircle2 size={16} style={{ color: '#10B981', flexShrink: 0, marginTop: '0.15rem' }} />
              <span><strong>Jasa Titip Barang:</strong> Biaya jasa Rp 25.000 hanya mencakup upah jasa titip dan antre. Uang pembelian barang dihitung terpisah sesuai nota toko resmi.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
              <CheckCircle2 size={16} style={{ color: '#10B981', flexShrink: 0, marginTop: '0.15rem' }} />
              <span><strong>Antar Barang:</strong> Tarif mulai Rp 15.000. Dilarang keras mengirim barang ilegal, narkoba, miras, atau bahan berbahaya.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
              <CheckCircle2 size={16} style={{ color: '#10B981', flexShrink: 0, marginTop: '0.15rem' }} />
              <span><strong>Antar Jemput:</strong> Diproses sesuai ketersediaan mitra dan kendaraan aktif demi keamanan dan keselamatan perjalanan.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
              <CheckCircle2 size={16} style={{ color: '#10B981', flexShrink: 0, marginTop: '0.15rem' }} />
              <span><strong>Bersih-bersih:</strong> Tarif dasar Rp 100.000/jam. Total estimasi disesuaikan dengan luas $m^2$ dan tingkat kekotoran kamar kos/WC.</span>
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/layanan" className="btn btn-primary btn-lg">
            <Sparkles size={18} />
            <span>Mulai Pesan Layanan</span>
          </Link>
          <a
            href={generateWhatsAppUrl('082283883580', 'Halo CS PanggilKami, saya ingin bertanya tentang cara pemesanan.')}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp btn-lg"
          >
            <PhoneCall size={18} />
            <span>Konsultasi WhatsApp CS</span>
          </a>
        </div>
      </div>
    </div>
  );
};

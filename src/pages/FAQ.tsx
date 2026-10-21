import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ChevronDown, ChevronUp, PhoneCall, Sparkles } from 'lucide-react';
import { generateWhatsAppUrl } from '../utils';

export const FAQ: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Bagaimana cara memesan jasa di PanggilKami?',
      a: 'Sangat mudah: buka katalog Layanan, pilih salah satu dari 4 layanan kami, lengkapi alamat dan instruksi pengerjaan pada formulir pemesanan, lalu lakukan pembayaran via QR GoPay/QRIS resmi kami. Pesanan Anda akan langsung diproses oleh admin dan mitra.'
    },
    {
      q: 'Bagaimana sistem pembayaran di PanggilKami?',
      a: 'Kami menggunakan sistem QRIS Nasional resmi yang mendukung GoPay, BCA, Mandiri, BRI, BNI, Dana, OVO, ShopeePay, dan seluruh perbankan di Indonesia. Saat checkout, sistem membuat QRIS dinamis dengan nominal tagihan yang tepat sehingga Anda tidak perlu mengetik nominal secara manual.'
    },
    {
      q: 'Apakah biaya jasa titip (Jastip) Rp 25.000 sudah termasuk harga barang?',
      a: 'Tidak. Biaya Rp 25.000 adalah upah jasa bagi mitra untuk mengantre, membelikan, dan mengantarkan barang titipan Anda. Uang pembelian barang dihitung terpisah sesuai nota toko resmi.'
    },
    {
      q: 'Bagaimana perhitungan biaya layanan Bersih-bersih Kos/WC?',
      a: 'Layanan kebersihan memiliki tarif dasar Rp 100.000 per jam. Total estimasi biaya disesuaikan dengan luas ruangan (m²), tipe area (kamar saja, WC saja, atau kamar beserta WC), serta tingkat kekotoran ruangan (ringan, sedang, atau berat).'
    },
    {
      q: 'Apakah bisa memesan jika alamat saya di luar area Solo Baru?',
      a: 'Bisa. Kami melayani area Sukoharjo, Kartasura, Karanganyar, sekitar UMS, sekitar UNS, Solo Kota, Nusukan, Mojolaban, dan Semanggi. Jika alamat Anda di luar daftar, pilih opsi "Alamat Lain" dan admin akan mengonfirmasi ketersediaan mitra terdekat dengan penyesuaian ongkos jarak.'
    },
    {
      q: 'Bagaimana cara menggunakan voucher "panggilkami"?',
      a: 'Masukkan kode voucher "panggilkami" pada kolom voucher di halaman formulir pemesanan (checkout). Voucher memberikan diskon 100% (total pembayaran menjadi Rp 0) untuk promo pengguna baru, dan pesanan dapat langsung diselesaikan tanpa perlu transfer dana.'
    },
    {
      q: 'Bagaimana kebijakan pembatalan dan pengembalian dana?',
      a: 'Pesanan dapat dibatalkan selama mitra belum ditugaskan atau belum membeli barang titipan Anda. Jika terjadi pembatalan yang sah, dana akan dikembalikan melalui konfirmasi admin via WhatsApp dalam waktu 1x24 jam.'
    },
    {
      q: 'Bagaimana cara memberikan ulasan setelah layanan selesai?',
      a: 'Setelah status pesanan Anda diperbarui menjadi "Selesai" oleh admin, Anda dapat membuka halaman "Detail Pesanan" dari menu "Pesanan Saya". Di bagian bawah halaman tersebut, formulir ulasan resmi akan aktif untuk memberikan rating bintang 1-5 dan komentar pengalaman Anda.'
    },
    {
      q: 'Bagaimana jika saya memerlukan bantuan mendesak?',
      a: 'Tim Customer Service kami siaga setiap hari mulai pukul 06.00 hingga 22.00 WIB melalui WhatsApp di 082283883580 atau email panggilkamisolo@gmail.com.'
    }
  ];

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <div className="section section-subtle" style={{ minHeight: '85vh' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <div className="section-header">
          <div className="section-tag section-tag-teal">
            <HelpCircle size={14} />
            <span>Pusat Tanya Jawab</span>
          </div>
          <h1 className="section-title">Pertanyaan Sering Diajukan (FAQ)</h1>
          <p className="section-desc">
            Temukan jawaban lengkap seputar alur pemesanan, harga transparan, pembayaran, dan kebijakan PanggilKami.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '3rem' }}>
          {faqs.map((f, i) => (
            <div 
              key={i}
              className="card"
              style={{
                backgroundColor: '#FFFFFF',
                padding: '1.25rem 1.5rem',
                cursor: 'pointer',
                borderColor: openIdx === i ? '#93C5FD' : 'var(--border-color)'
              }}
              onClick={() => toggle(i)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                <h3 style={{ fontSize: '1.05rem', color: openIdx === i ? '#1D4ED8' : '#0F172A', fontWeight: 700 }}>
                  {f.q}
                </h3>
                <div style={{ color: openIdx === i ? '#1D4ED8' : '#64748B' }}>
                  {openIdx === i ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </div>

              {openIdx === i && (
                <div style={{ marginTop: '0.85rem', paddingTop: '0.85rem', borderTop: '1px solid var(--border-color)' }}>
                  <p style={{ color: '#475569', fontSize: '0.925rem', lineHeight: '1.7', margin: 0 }}>
                    {f.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Still Have Questions CTA */}
        <div className="card" style={{ backgroundColor: '#0F172A', color: '#FFFFFF', padding: '2rem', textAlign: 'center', borderRadius: 'var(--radius-xl)' }}>
          <h3 style={{ fontSize: '1.25rem', color: '#FFFFFF', marginBottom: '0.5rem' }}>
            Masih Ada Pertanyaan Lain?
          </h3>
          <p style={{ color: '#94A3B8', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
            Customer Service kami di Solo Baru HTC siap melayani dan menjelaskan setiap kebutuhan Anda.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <a
              href={generateWhatsAppUrl('082283883580', 'Halo CS PanggilKami, saya ingin bertanya lebih lanjut.')}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp"
            >
              <PhoneCall size={16} />
              <span>Chat WhatsApp: 082283883580</span>
            </a>
            <Link to="/layanan" className="btn btn-primary">
              <Sparkles size={16} />
              <span>Pesan Jasa Sekarang</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

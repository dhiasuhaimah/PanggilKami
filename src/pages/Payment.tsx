import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  Copy, 
  Download, 
  PhoneCall, 
  ShieldCheck, 
  AlertCircle, 
  Upload, 
  Sparkles,
  ShoppingBag,
  ExternalLink
} from 'lucide-react';
import { db } from '../services/db';
import { useToast } from '../contexts/ToastContext';
import { Booking, Payment as PaymentType } from '../types';
import { 
  formatRupiah, 
  formatDateTime, 
  generateDynamicQRIS, 
  generateWhatsAppUrl 
} from '../utils';

export const Payment: React.FC = () => {
  const { orderCode } = useParams<{ orderCode: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [payment, setPayment] = useState<PaymentType | null>(null);
  const [proofImage, setProofImage] = useState<string>('');
  const [submittingProof, setSubmittingProof] = useState<boolean>(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!orderCode) return;
    const found = db.getBookingById(orderCode);
    if (!found) {
      showToast('Pesanan tidak ditemukan', 'error');
      navigate('/pesanan-saya');
      return;
    }
    setBooking(found);

    const foundPayment = db.getPaymentByBookingId(found.id);
    if (foundPayment) {
      setPayment(foundPayment);
    }

    // If order is free (voucher 100%), trigger confetti
    if (found.total_amount === 0) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [orderCode, navigate, showToast]);

  // Generate dynamic QRIS with exact order nominal
  useEffect(() => {
    if (booking && booking.total_amount > 0) {
      const dynamicPayload = generateDynamicQRIS(booking.total_amount);
      
      QRCode.toDataURL(dynamicPayload, {
        width: 320,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'M'
      })
      .then(url => {
        setQrDataUrl(url);
      })
      .catch(err => {
        console.error('Failed to generate QR:', err);
      });
    }
  }, [booking]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`${label} berhasil disalin`, 'success');
  };

  const handleProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        showToast('Ukuran foto bukti maksimal 3MB', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofImage(reader.result as string);
        showToast('Foto bukti transfer berhasil dipilih', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirmPaid = () => {
    if (!booking) return;

    setSubmittingProof(true);
    try {
      // Update Payment Record
      if (payment) {
        db.updatePayment(payment.id, {
          status: 'pending',
          proof_url: proofImage || undefined,
          paid_at: new Date().toISOString(),
          notes: 'Pelanggan telah mengonfirmasi pembayaran. Menunggu verifikasi admin.'
        });
      }

      // Update Booking Status to 'menunggu_verifikasi_pembayaran'
      const updatedBooking = db.updateBookingStatus(
        booking.id,
        'menunggu_verifikasi_pembayaran',
        'Pelanggan telah klik Saya Sudah Membayar',
        'Pelanggan'
      );
      db.updateBookingPaymentStatus(booking.id, 'menunggu_verifikasi');

      setBooking({ ...updatedBooking });
      showToast('Konfirmasi pembayaran terkirim! Admin akan memverifikasi.', 'success');
    } catch (e: any) {
      showToast(e.message || 'Gagal memperbarui status pembayaran', 'error');
    } finally {
      setSubmittingProof(false);
    }
  };

  const handleDownloadQR = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `QRIS-PanggilKami-${booking?.order_code}.png`;
    link.click();
    showToast('QR Code pembayaran berhasil diunduh', 'success');
  };

  if (!booking) {
    return <div className="container section">Memuat data pembayaran...</div>;
  }

  // Pre-filled WhatsApp message
  const waMsg = `Halo Customer Service PanggilKami,
Saya ingin konfirmasi pembayaran untuk pesanan:
- Kode Pesanan: ${booking.order_code}
- Nama Pemesan: ${booking.customer_name}
- Layanan: ${booking.service_name}
- Total: ${formatRupiah(booking.total_amount)}
- Waktu: ${formatDateTime(booking.created_at)}
Mohon bantu verifikasi pesanan saya. Terima kasih.`;

  const isPaid = booking.payment_status === 'lunas';
  const isPendingVerification = booking.payment_status === 'menunggu_verifikasi';

  return (
    <div className="section section-subtle" style={{ minHeight: '85vh' }}>
      <div className="container" style={{ maxWidth: '820px' }}>
        {/* Breadcrumb / Back */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <Link 
            to="/pesanan-saya"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#475569', fontWeight: 600, fontSize: '0.9rem' }}
          >
            <ArrowLeft size={16} />
            <span>Ke Riwayat Pesanan Saya</span>
          </Link>

          <span className={`badge ${
            isPaid ? 'badge-success' : 
            isPendingVerification ? 'badge-warning' : 'badge-primary'
          }`}>
            {isPaid ? 'Pembayaran Lunas' : isPendingVerification ? 'Menunggu Verifikasi Admin' : 'Menunggu Pembayaran'}
          </span>
        </div>

        {/* ORDER COMPLETED / FREE BANNER */}
        {booking.total_amount === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem', backgroundColor: '#FFFFFF', marginBottom: '2rem' }}>
            <div style={{
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              backgroundColor: '#ECFDF5',
              color: '#10B981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem auto'
            }}>
              <CheckCircle2 size={36} />
            </div>

            <h2 style={{ fontSize: '1.75rem', color: '#065F46', marginBottom: '0.5rem' }}>
              Pemesanan Berhasil & Lunas!
            </h2>
            <p style={{ color: '#047857', fontSize: '1.05rem', marginBottom: '1.5rem' }}>
              Pesanan Anda memenuhi syarat voucher promo <strong>{booking.voucher_code}</strong> dengan diskon 100% (Rp 0). Anda tidak perlu mentransfer dana.
            </p>

            <div style={{
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              maxWidth: '480px',
              margin: '0 auto 2rem auto',
              textAlign: 'left'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                <span style={{ color: '#64748B' }}>Kode Pesanan:</span>
                <strong style={{ color: '#0F172A' }}>{booking.order_code}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                <span style={{ color: '#64748B' }}>Layanan:</span>
                <strong style={{ color: '#0F172A' }}>{booking.service_name}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: '#64748B' }}>Status Pesanan:</span>
                <span className="badge badge-primary">Menunggu Konfirmasi Layanan</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to={`/pesanan/${booking.order_code}`} className="btn btn-primary">
                <ShoppingBag size={16} />
                <span>Lihat Detail Pesanan</span>
              </Link>
              <a
                href={generateWhatsAppUrl('082283883580', waMsg)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp"
              >
                <PhoneCall size={16} />
                <span>Konfirmasi via WhatsApp CS</span>
              </a>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            {/* Left Card: QRIS GoPay Merchant Card */}
            <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '1.75rem', textAlign: 'center' }}>
              {/* Merchant Header styled like GoPay screenshot with Official Logo */}
              <div style={{
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: 'var(--radius-lg)',
                padding: '1rem',
                marginBottom: '1.5rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.65rem' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    border: '1.5px solid #CBD5E1',
                    backgroundColor: '#0B1B3D',
                    boxShadow: '0 2px 8px rgba(11, 27, 61, 0.2)'
                  }}>
                    <img src="/images/logo.jpg" alt="PanggilKami" style={{ width: '190%', height: '190%', objectFit: 'cover', objectPosition: 'center 38%' }} />
                  </div>
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#07132B', marginBottom: '0.2rem', letterSpacing: '-0.01em' }}>
                  panggilkami
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748B', lineHeight: '1.4', marginBottom: '0.5rem' }}>
                  Hartono Trade Center, Jl. Ir. Soekarno No.A21, Dusun I, Madegondo, Kec. Grogol, Kabupaten Sukoharjo, Jawa Tengah 57552
                </div>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  padding: '0.2rem 0.6rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#334155'
                }}>
                  NMID: ID1026484632207
                </div>
              </div>

              {/* QR Container with QRIS logo and red corner accents matching the image */}
              <div style={{
                position: 'relative',
                display: 'inline-block',
                padding: '1.25rem',
                backgroundColor: '#FFFFFF',
                borderRadius: '24px',
                border: '1px solid #E2E8F0',
                boxShadow: 'var(--shadow-md)',
                marginBottom: '1.25rem'
              }}>
                {/* QRIS Logo on Top */}
                <div style={{ marginBottom: '0.5rem', fontWeight: 900, letterSpacing: '0.05em', fontSize: '1.35rem', color: '#0F172A' }}>
                  QRIS <span style={{ fontSize: '0.65rem', fontWeight: 600, color: '#64748B', verticalAlign: 'super' }}>Nasional</span>
                </div>

                {/* QR Code Canvas / Image */}
                {qrDataUrl ? (
                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    <img 
                      src={qrDataUrl} 
                      alt="GoPay QRIS Dynamic Payment" 
                      style={{ width: '240px', height: '240px', display: 'block', margin: '0 auto' }}
                    />
                    {/* Realtime nominal stamp */}
                    <div style={{
                      position: 'absolute',
                      bottom: '-8px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: '#1D4ED8',
                      color: 'white',
                      padding: '0.25rem 0.75rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      whiteSpace: 'nowrap',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                    }}>
                      ⚡ Nominal Otomatis: {formatRupiah(booking.total_amount)}
                    </div>
                  </div>
                ) : (
                  <div style={{ width: '240px', height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    Membuat QRIS Dinamis...
                  </div>
                )}

                {/* Red corner accents like in user image */}
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  width: '16px',
                  height: '16px',
                  borderTop: '3px solid #EF4444',
                  borderLeft: '3px solid #EF4444'
                }} />
                <div style={{
                  position: 'absolute',
                  bottom: '12px',
                  right: '12px',
                  width: '16px',
                  height: '16px',
                  borderBottom: '3px solid #EF4444',
                  borderRight: '3px solid #EF4444'
                }} />
              </div>

              {/* Total Nominal to Pay */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>TOTAL TAGIHAN</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1D4ED8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <span>{formatRupiah(booking.total_amount)}</span>
                  <button 
                    onClick={() => handleCopy(booking.total_amount.toString(), 'Nominal pembayaran')}
                    title="Salin nominal"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>

              {/* QR Actions */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.65rem' }}>
                <button 
                  onClick={handleDownloadQR}
                  className="btn btn-outline btn-sm"
                  style={{ borderRadius: 'var(--radius-full)' }}
                >
                  <Download size={14} />
                  <span>Unduh QRIS</span>
                </button>
              </div>
            </div>

            {/* Right Card: Payment Steps & Confirmation Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Order Info Summary */}
              <div className="card" style={{ backgroundColor: '#FFFFFF' }}>
                <h4 style={{ fontSize: '1rem', marginBottom: '1rem', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ShoppingBag size={16} style={{ color: '#1D4ED8' }} />
                  <span>Ringkasan Transaksi</span>
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748B' }}>Kode Pesanan:</span>
                    <strong style={{ color: '#0F172A' }}>{booking.order_code}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748B' }}>Layanan:</span>
                    <strong style={{ color: '#0F172A' }}>{booking.service_name}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748B' }}>Biaya Jasa:</span>
                    <span>{formatRupiah(booking.service_fee)}</span>
                  </div>
                  {booking.travel_fee > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#64748B' }}>Penyesuaian Jarak:</span>
                      <span>{formatRupiah(booking.travel_fee)}</span>
                    </div>
                  )}
                  {booking.item_budget > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#0D9488' }}>
                      <span>Anggaran Belanja Titipan:</span>
                      <span>{formatRupiah(booking.item_budget)}</span>
                    </div>
                  )}
                  {booking.discount_amount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16A34A' }}>
                      <span>Diskon Voucher ({booking.voucher_code}):</span>
                      <span>- {formatRupiah(booking.discount_amount)}</span>
                    </div>
                  )}
                  <div style={{ borderTop: '1px solid var(--border-color)', margin: '0.35rem 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontWeight: 700, color: '#0F172A' }}>Total:</span>
                    <span style={{ fontWeight: 800, fontSize: '1.15rem', color: '#1D4ED8' }}>
                      {formatRupiah(booking.total_amount)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="card" style={{ backgroundColor: '#FFFFFF' }}>
                <h4 style={{ fontSize: '0.95rem', marginBottom: '0.75rem', color: '#0F172A' }}>
                  Panduan Pembayaran QRIS:
                </h4>
                <ol style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: '#475569', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <li>Buka aplikasi <strong>GoPay</strong>, BCA Mobile, Livin Mandiri, BRImo, Dana, OVO, atau e-wallet Anda.</li>
                  <li>Pilih menu <strong>Scan / Bayar QRIS</strong>.</li>
                  <li>Arahkan kamera ke QR di samping atau unggah gambar QR yang telah diunduh.</li>
                  <li>Periksa nama penerima: <strong>panggilkami (SUKOHARJO)</strong> dan pastikan nominal tepat sebesar <strong>{formatRupiah(booking.total_amount)}</strong>.</li>
                  <li>Konfirmasi dengan PIN e-wallet Anda.</li>
                </ol>
              </div>

              {/* Upload Proof & Confirm Button */}
              <div className="card" style={{ backgroundColor: '#FFFFFF' }}>
                <h4 style={{ fontSize: '0.95rem', marginBottom: '0.75rem', color: '#0F172A' }}>
                  Konfirmasi Pembayaran Anda
                </h4>

                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>
                    Unggah Bukti Transfer (Opsional):
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    className="form-input"
                    onChange={handleProofUpload}
                  />
                  {proofImage && (
                    <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#10B981', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <CheckCircle2 size={14} />
                      <span>Bukti transfer siap dilampirkan</span>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <button
                    onClick={handleConfirmPaid}
                    disabled={submittingProof || isPaid}
                    className="btn btn-primary btn-lg"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    <CheckCircle2 size={18} />
                    <span>
                      {isPaid 
                        ? 'Pembayaran Sudah Lunas' 
                        : isPendingVerification 
                        ? 'Menunggu Verifikasi Admin (Sudah Dikonfirmasi)' 
                        : 'Saya Sudah Membayar'}
                    </span>
                  </button>

                  <a
                    href={generateWhatsAppUrl('082283883580', waMsg)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-whatsapp"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    <PhoneCall size={16} />
                    <span>Kirim Bukti Pembayaran via WhatsApp</span>
                  </a>

                  <Link 
                    to={`/pesanan/${booking.order_code}`} 
                    className="btn btn-outline" 
                    style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem' }}
                  >
                    <span>Lihat Perkembangan Pesanan</span>
                  </Link>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Calendar, 
  User, 
  Phone, 
  ShoppingBag, 
  Star, 
  PhoneCall,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { db } from '../services/db';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Booking, Review } from '../types';
import { formatRupiah, formatDateTime, generateWhatsAppUrl } from '../utils';

export const OrderDetail: React.FC = () => {
  const { orderCode } = useParams<{ orderCode: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [existingReview, setExistingReview] = useState<Review | null>(null);

  // Review Form state
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>('');
  const [submittingReview, setSubmittingReview] = useState<boolean>(false);

  useEffect(() => {
    if (!orderCode) return;
    const found = db.getBookingById(orderCode);
    if (!found) {
      showToast('Pesanan tidak ditemukan', 'error');
      navigate('/pesanan-saya');
      return;
    }
    setBooking(found);

    // Check if review already exists
    const revs = db.getReviews();
    const rev = revs.find(r => r.booking_id === found.id);
    if (rev) {
      setExistingReview(rev);
    }
  }, [orderCode, navigate, showToast]);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking) return;

    if (!reviewComment.trim()) {
      showToast('Mohon tuliskan komentar ulasan Anda', 'error');
      return;
    }

    setSubmittingReview(true);
    try {
      const created = db.createReview({
        booking_id: booking.id,
        order_code: booking.order_code,
        customer_id: booking.customer_id,
        customer_name: booking.customer_name,
        service_name: booking.service_name,
        rating: reviewRating,
        comment: reviewComment.trim()
      });

      setExistingReview(created);
      showToast('Terima kasih! Ulasan Anda berhasil disimpan.', 'success');
    } catch (e: any) {
      showToast(e.message || 'Gagal mengirim ulasan', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (!booking) {
    return <div className="container section">Memuat detail pesanan...</div>;
  }

  const statusSteps = [
    { key: 'menunggu_pembayaran', label: 'Menunggu Pembayaran' },
    { key: 'menunggu_verifikasi_pembayaran', label: 'Verifikasi Pembayaran' },
    { key: 'menunggu_konfirmasi_layanan', label: 'Konfirmasi Layanan' },
    { key: 'menunggu_mitra', label: 'Menugaskan Mitra' },
    { key: 'sedang_diproses', label: 'Sedang Dikerjakan' },
    { key: 'selesai', label: 'Selesai' }
  ];

  const getStepStatus = (stepKey: string) => {
    if (booking.status === 'dibatalkan') return 'cancelled';
    const statusOrder = [
      'menunggu_pembayaran',
      'menunggu_verifikasi_pembayaran',
      'menunggu_konfirmasi_layanan',
      'menunggu_mitra',
      'sedang_diproses',
      'selesai'
    ];
    const currentIndex = statusOrder.indexOf(booking.status);
    const stepIndex = statusOrder.indexOf(stepKey);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="section section-subtle" style={{ minHeight: '85vh' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        {/* Back Link */}
        <Link
          to="/pesanan-saya"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#475569', marginBottom: '1.5rem', fontWeight: 600, fontSize: '0.9rem' }}
        >
          <ArrowLeft size={16} />
          <span>Kembali ke Riwayat Pesanan</span>
        </Link>

        {/* Order Header Card */}
        <div className="card" style={{ backgroundColor: '#FFFFFF', marginBottom: '1.5rem', padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
                <h1 style={{ fontSize: '1.5rem', color: '#0F172A', fontWeight: 800 }}>
                  {booking.order_code}
                </h1>
                <span className={`badge ${
                  booking.status === 'selesai' ? 'badge-success' :
                  booking.status === 'dibatalkan' ? 'badge-danger' :
                  booking.status === 'menunggu_pembayaran' ? 'badge-warning' : 'badge-primary'
                }`}>
                  {booking.status.replace(/_/g, ' ').toUpperCase()}
                </span>
              </div>
              <div style={{ fontSize: '0.85rem', color: '#64748B' }}>
                Dipesan pada {formatDateTime(booking.created_at)}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {booking.payment_status !== 'lunas' && booking.status !== 'dibatalkan' && (
                <Link to={`/pembayaran/${booking.order_code}`} className="btn btn-teal">
                  Buka Halaman Pembayaran
                </Link>
              )}
              <a
                href={generateWhatsAppUrl('082283883580', `Halo CS PanggilKami, saya ingin bertanya tentang perkembangan pesanan ${booking.order_code}.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp"
              >
                <PhoneCall size={16} />
                <span>Chat CS</span>
              </a>
            </div>
          </div>
        </div>

        {/* Progress Timeline */}
        <div className="card" style={{ backgroundColor: '#FFFFFF', marginBottom: '1.5rem', padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.05rem', marginBottom: '1.25rem', color: '#0F172A' }}>
            Status Perkembangan Pesanan
          </h3>

          {booking.status === 'dibatalkan' ? (
            <div style={{ backgroundColor: '#FEF2F2', padding: '1rem', borderRadius: 'var(--radius-md)', color: '#991B1B', fontSize: '0.9rem' }}>
              ⚠️ Pesanan ini telah dibatalkan. Jika ada pertanyaan, hubungi tim CS kami.
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', overflowX: 'auto', paddingBottom: '0.5rem' }}>
              {statusSteps.map((s, idx) => {
                const state = getStepStatus(s.key);
                return (
                  <div key={s.key} style={{ minWidth: '110px', textAlign: 'center', padding: '0 0.25rem' }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      margin: '0 auto 0.5rem auto',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      backgroundColor: state === 'completed' ? '#10B981' : state === 'current' ? '#1D4ED8' : '#E2E8F0',
                      color: state === 'upcoming' ? '#64748B' : '#FFFFFF'
                    }}>
                      {state === 'completed' ? '✓' : idx + 1}
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      fontWeight: state === 'current' ? 700 : 500,
                      color: state === 'current' ? '#1D4ED8' : state === 'completed' ? '#0F172A' : '#94A3B8'
                    }}>
                      {s.label}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Details Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
          {/* Customer & Location */}
          <div className="card" style={{ backgroundColor: '#FFFFFF' }}>
            <h4 style={{ fontSize: '1rem', marginBottom: '1rem', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <MapPin size={16} style={{ color: '#1D4ED8' }} />
              <span>Lokasi & Pemesan</span>
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.875rem' }}>
              <div>
                <span style={{ color: '#64748B' }}>Nama Pemesan:</span>
                <div style={{ fontWeight: 600, color: '#0F172A' }}>{booking.customer_name}</div>
              </div>
              <div>
                <span style={{ color: '#64748B' }}>WhatsApp:</span>
                <div style={{ fontWeight: 600, color: '#0F172A' }}>{booking.customer_phone}</div>
              </div>
              <div>
                <span style={{ color: '#64748B' }}>Wilayah Jangkauan:</span>
                <div style={{ fontWeight: 600, color: '#0F172A' }}>{booking.area_name || 'Solo Baru'}</div>
              </div>
              {booking.pickup_address && (
                <div>
                  <span style={{ color: '#64748B' }}>Titik Penjemputan:</span>
                  <div style={{ fontWeight: 500, color: '#0F172A' }}>{booking.pickup_address}</div>
                </div>
              )}
              {booking.destination_address && (
                <div>
                  <span style={{ color: '#64748B' }}>Alamat Tujuan / Pengerjaan:</span>
                  <div style={{ fontWeight: 500, color: '#0F172A' }}>{booking.destination_address}</div>
                </div>
              )}
              <div>
                <span style={{ color: '#64748B' }}>Jadwal Pelaksanaan:</span>
                <div style={{ fontWeight: 600, color: '#1D4ED8' }}>
                  {booking.scheduled_date} pukul {booking.scheduled_time} WIB
                </div>
              </div>
            </div>
          </div>

          {/* Service Details & Cost Breakdown */}
          <div className="card" style={{ backgroundColor: '#FFFFFF' }}>
            <h4 style={{ fontSize: '1rem', marginBottom: '1rem', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShoppingBag size={16} style={{ color: '#0D9488' }} />
              <span>Rincian Layanan & Biaya</span>
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>Layanan:</span>
                <strong style={{ color: '#0F172A' }}>{booking.service_name}</strong>
              </div>

              {/* Service specific details display */}
              {booking.details?.item_names && (
                <div style={{ backgroundColor: '#F8FAFC', padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Barang Titipan:</span>
                  <div style={{ fontWeight: 600, color: '#0F172A' }}>{booking.details.item_names}</div>
                  {booking.details.store_name && <div style={{ fontSize: '0.75rem', color: '#475569' }}>Toko: {booking.details.store_name}</div>}
                </div>
              )}

              {booking.details?.clean_area_type && (
                <div style={{ backgroundColor: '#F8FAFC', padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Detail Ruangan:</span>
                  <div style={{ fontWeight: 600, color: '#0F172A' }}>
                    Tipe: {booking.details.clean_area_type} | Luas: {booking.details.area_sqm} m² | Kondisi: {booking.details.dirtiness_level}
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
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
                <span style={{ fontWeight: 700, color: '#0F172A' }}>Total Akhir:</span>
                <span style={{ fontWeight: 800, fontSize: '1.25rem', color: '#1D4ED8' }}>
                  {formatRupiah(booking.total_amount)}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <span style={{ color: '#64748B' }}>Status Pembayaran:</span>
                <span className={`badge ${booking.payment_status === 'lunas' ? 'badge-success' : 'badge-warning'}`}>
                  {booking.payment_status.replace(/_/g, ' ').toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* REVIEWS SECTION - ONLY IF ORDER COMPLETED */}
        {booking.status === 'selesai' && (
          <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Star size={18} style={{ color: '#F59E0B' }} />
              <span>Ulasan Layanan Anda</span>
            </h3>

            {existingReview ? (
              <div style={{
                backgroundColor: '#FFFBEB',
                border: '1px solid #FDE68A',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                marginTop: '1rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.5rem' }}>
                  {[1, 2, 3, 4, 5].map(st => (
                    <Star
                      key={st}
                      size={18}
                      style={{
                        fill: st <= existingReview.rating ? '#F59E0B' : '#E2E8F0',
                        color: st <= existingReview.rating ? '#F59E0B' : '#CBD5E1'
                      }}
                    />
                  ))}
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#92400E', marginLeft: '0.5rem' }}>
                    {existingReview.rating} dari 5 Bintang
                  </span>
                </div>
                <p style={{ fontStyle: 'italic', color: '#78350F', fontSize: '0.95rem' }}>
                  "{existingReview.comment}"
                </p>
                <div style={{ fontSize: '0.75rem', color: '#B45309', marginTop: '0.5rem' }}>
                  Ulasan telah tersimpan di database dan tampil di halaman publik.
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} style={{ marginTop: '1rem' }}>
                <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '1rem' }}>
                  Pesanan Anda telah tuntas. Bagikan kepuasan Anda bersama mitra PanggilKami untuk membantu calon pelanggan lain.
                </p>

                <div className="form-group">
                  <label className="form-label">Beri Rating Bintang (1 - 5):</label>
                  <div style={{ display: 'flex', gap: '0.5rem', cursor: 'pointer' }}>
                    {[1, 2, 3, 4, 5].map(st => (
                      <button
                        type="button"
                        key={st}
                        onClick={() => setReviewRating(st)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.2rem' }}
                      >
                        <Star
                          size={28}
                          style={{
                            fill: st <= reviewRating ? '#F59E0B' : '#E2E8F0',
                            color: st <= reviewRating ? '#F59E0B' : '#CBD5E1'
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Komentar & Pengalaman Anda:</label>
                  <textarea
                    required
                    className="form-textarea"
                    placeholder="Ceritakan pengalaman Anda, kecepatan mitra, kebersihan, atau pelayanan kami..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="btn btn-teal"
                >
                  <Star size={16} />
                  <span>Kirim Ulasan Resmi</span>
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

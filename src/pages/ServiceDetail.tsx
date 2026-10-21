import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Clock, 
  Calendar, 
  Calculator, 
  Tag, 
  PhoneCall,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { db } from '../services/db';
import { Service, ServiceSlug } from '../types';
import { formatRupiah, calculateCleaningEstimate, generateWhatsAppUrl } from '../utils';

export const ServiceDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<Service | null>(null);

  // Dynamic Cleaning Calculator State
  const [cleanAreaType, setCleanAreaType] = useState<'kamar' | 'wc' | 'kamar_wc' | 'area_tambahan'>('kamar');
  const [cleanSqm, setCleanSqm] = useState<number>(15);
  const [dirtinessLevel, setDirtinessLevel] = useState<'ringan' | 'sedang' | 'berat'>('ringan');

  // Jastip Estimated Budget State
  const [jastipEstimatedBudget, setJastipEstimatedBudget] = useState<number>(50000);

  useEffect(() => {
    if (slug) {
      const found = db.getServiceBySlug(slug as ServiceSlug);
      if (found) {
        setService(found);
      } else {
        navigate('/layanan');
      }
    }
  }, [slug, navigate]);

  if (!service) {
    return <div className="container section" style={{ textAlign: 'center' }}>Memuat layanan...</div>;
  }

  // Calculate dynamic cleaning estimate
  const cleaningEstimate = calculateCleaningEstimate(
    cleanSqm,
    dirtinessLevel,
    cleanAreaType,
    service.pricing_rules?.hourly_rate || 100000
  );

  const handleProceedToBooking = () => {
    // Navigate to checkout with pre-filled state
    navigate(`/pesan/${service.slug}`, {
      state: {
        cleanAreaType,
        cleanSqm,
        dirtinessLevel,
        cleaningEstimate,
        jastipEstimatedBudget
      }
    });
  };

  return (
    <div className="section section-subtle" style={{ minHeight: '85vh' }}>
      <div className="container">
        {/* Back Link */}
        <Link 
          to="/layanan" 
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.4rem', 
            color: '#475569', 
            marginBottom: '1.5rem', 
            fontWeight: 600,
            fontSize: '0.9rem' 
          }}
        >
          <ArrowLeft size={16} />
          <span>Kembali ke Katalog Layanan</span>
        </Link>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem',
          alignItems: 'start'
        }}>
          {/* Left Column: Image & Highlights */}
          <div>
            <div style={{
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-md)',
              border: '1px solid var(--border-color)',
              marginBottom: '1.5rem',
              backgroundColor: '#FFFFFF'
            }}>
              <img 
                src={service.image_url} 
                alt={service.name} 
                style={{ width: '100%', height: '360px', objectFit: 'cover' }}
              />
            </div>

            {/* Service Guarantee Card */}
            <div className="card" style={{ backgroundColor: '#FFFFFF' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#1D4ED8' }}>
                <ShieldCheck size={20} />
                <h4 style={{ fontSize: '1rem', color: '#0F172A' }}>Jaminan Transaksi PanggilKami</h4>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.875rem', color: '#475569' }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
                  <CheckCircle2 size={16} style={{ color: '#10B981', flexShrink: 0, marginTop: '0.15rem' }} />
                  <span>Tarif transparan tanpa biaya tersembunyi.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
                  <CheckCircle2 size={16} style={{ color: '#10B981', flexShrink: 0, marginTop: '0.15rem' }} />
                  <span>Didukung tim Customer Service Solo Baru HTC setiap hari.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
                  <CheckCircle2 size={16} style={{ color: '#10B981', flexShrink: 0, marginTop: '0.15rem' }} />
                  <span>Dukungan pembayaran digital GoPay & QRIS resmi.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Pricing & Booking Trigger */}
          <div>
            <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '2rem' }}>
              <div className="section-tag section-tag-teal" style={{ marginBottom: '0.65rem' }}>
                {service.category}
              </div>

              <h1 style={{ fontSize: '1.85rem', color: '#0F172A', marginBottom: '0.75rem' }}>
                {service.name}
              </h1>

              <p style={{ color: '#475569', fontSize: '1.025rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                {service.description}
              </p>

              {/* Price Banner */}
              <div style={{
                backgroundColor: '#EFF6FF',
                border: '1px solid #BFDBFE',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                marginBottom: '1.75rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#1E40AF', fontWeight: 600, textTransform: 'uppercase' }}>
                    Tarif Dasar
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1D4ED8' }}>
                    {formatRupiah(service.base_price)}
                  </div>
                </div>
                <span className="badge badge-primary" style={{ fontSize: '0.85rem' }}>
                  {service.unit}
                </span>
              </div>

              {/* DYNAMIC ESTIMATOR FOR BERSIH-BERSIH (Rp 100.000 / jam) */}
              {service.slug === 'bersih-bersih' && (
                <div style={{
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.5rem',
                  marginBottom: '1.75rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '1rem', color: '#0D9488' }}>
                    <Calculator size={18} />
                    <h3 style={{ fontSize: '1.05rem', color: '#0F172A' }}>Kalkulator Estimasi Biaya Kebersihan</h3>
                  </div>

                  {/* Area Type */}
                  <div className="form-group">
                    <label className="form-label">Tipe Area Hunian:</label>
                    <select
                      className="form-select"
                      value={cleanAreaType}
                      onChange={(e) => setCleanAreaType(e.target.value as any)}
                    >
                      <option value="kamar">Kamar Kos Standar (Tanpa Kamar Mandi)</option>
                      <option value="wc">Kamar Mandi / WC Saja</option>
                      <option value="kamar_wc">Kamar Kos Beserta WC Dalam</option>
                      <option value="area_tambahan">Kamar Kos + Dapur / Area Tambahan</option>
                    </select>
                  </div>

                  {/* Area Sqm */}
                  <div className="form-group">
                    <label className="form-label">Perkiraan Luas Area ({cleanSqm} m²):</label>
                    <input
                      type="range"
                      min={6}
                      max={60}
                      step={3}
                      value={cleanSqm}
                      onChange={(e) => setCleanSqm(Number(e.target.value))}
                      style={{ width: '100%' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748B' }}>
                      <span>Kecil (6 m²)</span>
                      <span>Sedang (18 m²)</span>
                      <span>Luas (60 m²)</span>
                    </div>
                  </div>

                  {/* Dirtiness Level */}
                  <div className="form-group">
                    <label className="form-label">Tingkat Kekotoran Ruangan:</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                      {(['ringan', 'sedang', 'berat'] as const).map(lvl => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => setDirtinessLevel(lvl)}
                          className={`btn btn-sm ${dirtinessLevel === lvl ? 'btn-teal' : 'btn-outline'}`}
                          style={{ textTransform: 'capitalize' }}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Realtime Estimate Calculation Output */}
                  <div style={{
                    marginTop: '1.25rem',
                    padding: '1rem',
                    backgroundColor: '#FFFFFF',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid #CBD5E1'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#64748B', marginBottom: '0.35rem' }}>
                      <span>Tarif Dasar:</span>
                      <span>Rp 100.000 / jam</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#64748B', marginBottom: '0.35rem' }}>
                      <span>Estimasi Durasi Pengerjaan:</span>
                      <span style={{ fontWeight: 600, color: '#0F172A' }}>~{cleaningEstimate.estimatedHours} Jam</span>
                    </div>
                    {cleaningEstimate.areaAddon > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#64748B', marginBottom: '0.35rem' }}>
                        <span>Penyesuaian Tipe Area:</span>
                        <span>+{formatRupiah(cleaningEstimate.areaAddon)}</span>
                      </div>
                    )}
                    <div style={{ borderTop: '1px dashed #E2E8F0', margin: '0.5rem 0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.95rem' }}>Estimasi Biaya:</span>
                      <span style={{ fontWeight: 800, color: '#0D9488', fontSize: '1.25rem' }}>
                        {formatRupiah(cleaningEstimate.totalEstimated)}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '0.4rem', fontStyle: 'italic' }}>
                      * Estimasi dapat dikonfirmasi ulang oleh admin jika kondisi di lapangan membutuhkan penanganan mendalam.
                    </p>
                  </div>
                </div>
              )}

              {/* JASTIP EXPLANATION & BUDGET INPUT */}
              {service.slug === 'jastip-barang' && (
                <div style={{
                  backgroundColor: '#F0FDFA',
                  border: '1px solid #99F6E4',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem',
                  marginBottom: '1.75rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.5rem', color: '#0F766E' }}>
                    <Tag size={18} />
                    <h3 style={{ fontSize: '1rem', color: '#0F766E' }}>Ketentuan Pemisahan Biaya Jastip</h3>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: '#134E4A', lineHeight: '1.5', marginBottom: '0.85rem' }}>
                    Biaya jasa <strong>Rp 25.000</strong> adalah upah tenaga mitra untuk mengantre dan membeli barang titipan Anda. <strong>Uang pembelian barang dihitung terpisah</strong> dan disesuaikan dengan nota toko resmi.
                  </p>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ color: '#0F766E' }}>Perkiraan Anggaran Pembelian Barang (Opsional):</label>
                    <input
                      type="number"
                      className="form-input"
                      value={jastipEstimatedBudget}
                      onChange={(e) => setJastipEstimatedBudget(Math.max(0, Number(e.target.value)))}
                      placeholder="Contoh: 50000"
                    />
                    <span className="form-helper">Jika belum tahu harga pastinya, konfirmasi harga final akan dilakukan sebelum pesanan dieksekusi.</span>
                  </div>
                </div>
              )}

              {/* COURIER CAUTION */}
              {service.slug === 'antar-barang' && (
                <div style={{
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FECACA',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1rem 1.25rem',
                  marginBottom: '1.75rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.65rem'
                }}>
                  <AlertCircle size={20} style={{ color: '#EF4444', flexShrink: 0, marginTop: '0.15rem' }} />
                  <div style={{ fontSize: '0.875rem', color: '#991B1B', lineHeight: '1.5' }}>
                    <strong>Ketentuan Keamanan Pengiriman:</strong> Kami tidak melayani pengiriman barang terlarang, narkotika, bahan mudah meledak/berbahaya, atau benda yang melanggar hukum RI.
                  </div>
                </div>
              )}

              {/* RIDE CAUTION */}
              {service.slug === 'antar-jemput' && (
                <div style={{
                  backgroundColor: '#FFFBEB',
                  border: '1px solid #FDE68A',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1rem 1.25rem',
                  marginBottom: '1.75rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.65rem'
                }}>
                  <AlertCircle size={20} style={{ color: '#D97706', flexShrink: 0, marginTop: '0.15rem' }} />
                  <div style={{ fontSize: '0.875rem', color: '#92400E', lineHeight: '1.5' }}>
                    <strong>Ketersediaan Mitra:</strong> Layanan antar jemput diproses sesuai armada dan mitra yang siap di sekitar lokasi jemput Anda demi menjaga keselamatan dan kenyamanan.
                  </div>
                </div>
              )}

              {/* ACTION BUTTON */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button
                  onClick={handleProceedToBooking}
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <Sparkles size={18} />
                  <span>Lanjutkan Pemesanan Jasa</span>
                  <ArrowRight size={18} />
                </button>

                <a
                  href={generateWhatsAppUrl('082283883580', `Halo CS PanggilKami, saya ingin bertanya tentang layanan ${service.name}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <PhoneCall size={16} />
                  <span>Tanya CS via WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

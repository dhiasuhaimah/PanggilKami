import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, CheckCircle2, Clock, ShieldAlert, Sparkles, Navigation } from 'lucide-react';
import { db } from '../services/db';
import { ServiceArea } from '../types';
import { formatRupiah } from '../utils';

export const ServiceAreas: React.FC = () => {
  const [areas, setAreas] = useState<ServiceArea[]>([]);

  useEffect(() => {
    setAreas(db.getAreas());
  }, []);

  return (
    <div className="section section-subtle" style={{ minHeight: '85vh' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        <div className="section-header">
          <div className="section-tag section-tag-teal">
            <MapPin size={14} />
            <span>Cakupan Wilayah</span>
          </div>
          <h1 className="section-title">Area Layanan PanggilKami</h1>
          <p className="section-desc">
            Pusat operasional kami bertempat di <strong>Solo Baru HTC (Hartono Trade Center), Sukoharjo</strong>. Kami memprioritaskan wilayah terdekat dan koridor utama Solo Raya.
          </p>
        </div>

        {/* Central Hub Card */}
        <div className="card" style={{
          backgroundColor: '#0F172A',
          color: '#FFFFFF',
          padding: '2rem',
          marginBottom: '2.5rem',
          borderRadius: 'var(--radius-xl)'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: '#1D4ED8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Navigation size={28} />
            </div>
            <div style={{ flex: 1, minWidth: '260px' }}>
              <div style={{ fontSize: '0.8rem', color: '#14B8A6', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                Kantor Pusat Operasional
              </div>
              <h2 style={{ fontSize: '1.4rem', color: '#FFFFFF', marginBottom: '0.5rem' }}>
                Solo Baru HTC (Hartono Trade Center)
              </h2>
              <p style={{ color: '#94A3B8', fontSize: '0.925rem', lineHeight: '1.6', margin: 0 }}>
                Jl. Ir. Soekarno No.A21, Dusun I, Madegondo, Kec. Grogol, Kabupaten Sukoharjo, Jawa Tengah 57552.
              </p>
            </div>
            <span className="badge badge-teal">Titik Acuan Utama</span>
          </div>
        </div>

        {/* Areas Grid */}
        <h3 style={{ fontSize: '1.25rem', color: '#0F172A', marginBottom: '1.25rem' }}>
          Daftar Wilayah Jangkauan Aktif:
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ marginBottom: '2.5rem' }}>
          {areas.map(area => (
            <div key={area.id} className="card" style={{ backgroundColor: '#FFFFFF', padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <h4 style={{ fontSize: '1.05rem', color: '#0F172A' }}>
                  {area.name}
                </h4>
                <span className={`badge ${area.is_active ? 'badge-success' : 'badge-neutral'}`}>
                  {area.is_active ? 'Tersedia' : 'Nonaktif'}
                </span>
              </div>
              <div style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '0.75rem' }}>
                Wilayah: {area.city}
              </div>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <span style={{ color: '#64748B' }}>Ongkos Jarak Dasar:</span>
                <strong style={{ color: '#1D4ED8' }}>
                  {area.base_fee ? formatRupiah(area.base_fee) : 'Gratis'}
                </strong>
              </div>
              {area.estimated_eta_mins && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                  <span style={{ color: '#64748B' }}>Estimasi Sampai:</span>
                  <span style={{ color: '#0F172A', fontWeight: 600 }}>~{area.estimated_eta_mins} Menit</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Out of Area Note */}
        <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '1.5rem', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <ShieldAlert size={22} style={{ color: '#F59E0B', flexShrink: 0, marginTop: '0.1rem' }} />
            <div>
              <h4 style={{ fontSize: '1rem', color: '#0F172A', marginBottom: '0.35rem' }}>
                Bagaimana Jika Alamat Saya Tidak Ada di Daftar?
              </h4>
              <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>
                Jangan khawatir. Anda dapat memilih opsi <strong>"Alamat Lain / Di Luar Wilayah Reguler"</strong> pada halaman formulir pemesanan, atau langsung konsultasikan lokasi Anda dengan admin via WhatsApp. Kami akan memeriksa ketersediaan mitra terdekat untuk Anda.
              </p>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <Link to="/layanan" className="btn btn-primary btn-lg">
            <Sparkles size={18} />
            <span>Pesan Jasa Sekarang</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

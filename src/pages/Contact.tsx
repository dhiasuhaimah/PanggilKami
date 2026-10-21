import React, { useState } from 'react';
import { PhoneCall, Mail, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { generateWhatsAppUrl } from '../utils';

export const Contact: React.FC = () => {
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      showToast('Mohon lengkapi nama dan pesan Anda', 'error');
      return;
    }
    setSubmitted(true);
    showToast('Pesan berhasil terkirim. CS kami akan segera menghubungi Anda!', 'success');
  };

  return (
    <div className="section section-subtle" style={{ minHeight: '85vh' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        <div className="section-header">
          <div className="section-tag section-tag-teal">
            <PhoneCall size={14} />
            <span>Kontak Kami</span>
          </div>
          <h1 className="section-title">Hubungi Tim PanggilKami</h1>
          <p className="section-desc">
            Kami siap mendengar pertanyaan, kebutuhan khusus, maupun masukan Anda seputar layanan PanggilKami.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {/* Contact Details Card */}
          <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#0F172A', marginBottom: '1.5rem' }}>
              Informasi Operasional
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontSize: '0.925rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: '#EFF6FF',
                  color: '#1D4ED8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <MapPin size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: '#0F172A', marginBottom: '0.2rem' }}>
                    Alamat Pusat Operasional
                  </div>
                  <p style={{ color: '#64748B', lineHeight: '1.5', margin: 0 }}>
                    Solo Baru HTC (Hartono Trade Center), Jl. Ir. Soekarno No.A21, Dusun I, Madegondo, Kec. Grogol, Kabupaten Sukoharjo, Jawa Tengah 57552
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: '#ECFDF5',
                  color: '#10B981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <PhoneCall size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: '#0F172A', marginBottom: '0.2rem' }}>
                    Customer Service WhatsApp
                  </div>
                  <a 
                    href={generateWhatsAppUrl('082283883580', 'Halo CS PanggilKami, saya ingin bertanya.')}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#0D9488', fontWeight: 600 }}
                  >
                    082283883580 (Respon Cepat)
                  </a>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: '#F0F9FF',
                  color: '#0284C7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Mail size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: '#0F172A', marginBottom: '0.2rem' }}>
                    Email Resmi
                  </div>
                  <a href="mailto:panggilkamisolo@gmail.com" style={{ color: '#0284C7', fontWeight: 600 }}>
                    panggilkamisolo@gmail.com
                  </a>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: '#FFFBEB',
                  color: '#D97706',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Clock size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: '#0F172A', marginBottom: '0.2rem' }}>
                    Jam Pelayanan
                  </div>
                  <p style={{ color: '#64748B', lineHeight: '1.5', margin: 0 }}>
                    Setiap Hari: 06.00 - 22.00 WIB
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#0F172A', marginBottom: '1.5rem' }}>
              Kirimkan Pertanyaan Anda
            </h3>

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <CheckCircle2 size={48} style={{ color: '#10B981', margin: '0 auto 1rem auto' }} />
                <h4 style={{ fontSize: '1.2rem', color: '#0F172A', marginBottom: '0.5rem' }}>
                  Pesan Anda Telah Diterima!
                </h4>
                <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                  Tim kami akan menindaklanjuti pesan Anda melalui nomor WhatsApp atau email yang Anda sertakan.
                </p>
                <button onClick={() => setSubmitted(false)} className="btn btn-outline btn-sm">
                  Kirim Pesan Lain
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Nama Anda <span className="required">*</span></label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nama lengkap Anda"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2">
                  <div className="form-group">
                    <label className="form-label">No. WhatsApp <span className="required">*</span></label>
                    <input
                      type="tel"
                      required
                      className="form-input"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="08xxxxxxxxxx"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-input"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@anda.com"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Isi Pesan atau Pertanyaan <span className="required">*</span></label>
                  <textarea
                    required
                    className="form-textarea"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tuliskan pertanyaan, kebutuhan seputar penyesuaian tarif, atau permohonan kerjasama..."
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  <Send size={16} />
                  <span>Kirim Pesan</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

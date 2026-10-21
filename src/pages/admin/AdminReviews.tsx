import React, { useState, useEffect } from 'react';
import { Star, Eye, EyeOff, ShieldAlert, MessageSquare, X } from 'lucide-react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { db } from '../../services/db';
import { useToast } from '../../contexts/ToastContext';
import { Review } from '../../types';
import { formatDate } from '../../utils';

export const AdminReviews: React.FC = () => {
  const { showToast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all');
  const [modifyingReview, setModifyingReview] = useState<Review | null>(null);
  const [hideReason, setHideReason] = useState('');

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = () => {
    setReviews(db.getReviews());
  };

  const handleToggleVisibility = (review: Review) => {
    if (review.is_visible) {
      // Need a reason to hide
      setModifyingReview(review);
      setHideReason('');
    } else {
      // Unhide
      try {
        db.toggleReviewVisibility(review.id, true);
        loadReviews();
        showToast('Ulasan kini ditampilkan kembali di publik.', 'success');
      } catch (e: any) {
        showToast('Gagal mengubah visibilitas', 'error');
      }
    }
  };

  const confirmHideReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modifyingReview) return;
    if (!hideReason.trim()) {
      showToast('Wajib menyertakan alasan moderasi/penyembunyian', 'error');
      return;
    }

    try {
      db.toggleReviewVisibility(modifyingReview.id, false, hideReason.trim());
      loadReviews();
      setModifyingReview(null);
      showToast('Ulasan disembunyikan dari publik dengan alasan tercatat.', 'info');
    } catch (e: any) {
      showToast('Gagal memoderasi ulasan', 'error');
    }
  };

  const filtered = ratingFilter === 'all'
    ? reviews
    : reviews.filter(r => r.rating === ratingFilter);

  return (
    <AdminLayout 
      title="Manajemen Ulasan" 
      subtitle="Moderasi ulasan pelanggan asli dengan transparansi dan alasan tercatat"
    >
      {/* Notice Card */}
      <div className="card" style={{ backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1E40AF', fontSize: '0.85rem' }}>
          <ShieldAlert size={16} />
          <span>
            <strong>Kebijakan Transparansi:</strong> Admin tidak diizinkan mengubah isi komentar ulasan pelanggan secara diam-diam. Anda hanya dapat menyembunyikan ulasan yang melanggar aturan kesusilaan/SARA dengan alasan tertulis.
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600, marginRight: '0.5rem' }}>Filter Rating:</span>
          <button
            onClick={() => setRatingFilter('all')}
            className={`btn btn-sm ${ratingFilter === 'all' ? 'btn-primary' : 'btn-outline'}`}
          >
            Semua ({reviews.length})
          </button>
          {[5, 4, 3, 2, 1].map(st => (
            <button
              key={st}
              onClick={() => setRatingFilter(st)}
              className={`btn btn-sm ${ratingFilter === st ? 'btn-primary' : 'btn-outline'}`}
            >
              ⭐ {st} ({reviews.filter(r => r.rating === st).length})
            </button>
          ))}
        </div>
      </div>

      {/* Reviews Table */}
      <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', color: '#0F172A', marginBottom: '1.25rem' }}>
          Daftar Ulasan Masuk ({filtered.length})
        </h3>

        {filtered.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)', color: '#64748B' }}>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Rating</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Pelanggan</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Layanan & Pesanan</th>
                  <th style={{ padding: '0.75rem 0.5rem', width: '35%' }}>Komentar Pelanggan</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Status Tampil</th>
                  <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>Moderasi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.85rem 0.5rem', verticalAlign: 'top' }}>
                      <div style={{ display: 'flex', gap: '0.1rem' }}>
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star
                            key={s}
                            size={14}
                            style={{
                              fill: s <= r.rating ? '#F59E0B' : '#E2E8F0',
                              color: s <= r.rating ? '#F59E0B' : '#CBD5E1'
                            }}
                          />
                        ))}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: '0.2rem' }}>
                        {formatDate(r.created_at)}
                      </div>
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem', fontWeight: 600, color: '#0F172A', verticalAlign: 'top' }}>
                      {r.customer_name}
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem', verticalAlign: 'top' }}>
                      <div style={{ color: '#1E293B', fontWeight: 500 }}>{r.service_name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Kode: {r.order_code}</div>
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem', color: '#334155', fontStyle: 'italic', lineHeight: '1.5', verticalAlign: 'top' }}>
                      "{r.comment}"
                      {r.hidden_reason && (
                        <div style={{ marginTop: '0.35rem', fontSize: '0.75rem', color: '#EF4444', fontStyle: 'normal' }}>
                          Alasan disembunyikan: {r.hidden_reason}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem', verticalAlign: 'top' }}>
                      <span className={`badge ${r.is_visible ? 'badge-success' : 'badge-danger'}`}>
                        {r.is_visible ? 'Tampil Publik' : 'Disembunyikan'}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem', textAlign: 'right', verticalAlign: 'top' }}>
                      <button
                        onClick={() => handleToggleVisibility(r)}
                        className={`btn btn-sm ${r.is_visible ? 'btn-outline' : 'btn-teal'}`}
                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                      >
                        {r.is_visible ? <EyeOff size={12} /> : <Eye size={12} />}
                        <span>{r.is_visible ? 'Sembunyikan' : 'Tampilkan'}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2.5rem', color: '#64748B' }}>
            Belum ada ulasan pelanggan yang masuk.
          </div>
        )}
      </div>

      {/* Moderation Reason Modal */}
      {modifyingReview && (
        <div className="modal-overlay" onClick={() => setModifyingReview(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h4 style={{ fontSize: '1.1rem', color: '#0F172A' }}>
                Alasan Menyembunyikan Ulasan
              </h4>
              <button onClick={() => setModifyingReview(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={confirmHideReview}>
              <div style={{ backgroundColor: '#F8FAFC', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.85rem', color: '#475569', fontStyle: 'italic' }}>
                "{modifyingReview.comment}" — oleh {modifyingReview.customer_name}
              </div>

              <div className="form-group">
                <label className="form-label">Tuliskan Alasan Moderasi Resmi <span className="required">*</span></label>
                <textarea
                  required
                  className="form-textarea"
                  placeholder="Contoh: Mengandung kata-kata kasar / data pribadi pihak ketiga..."
                  value={hideReason}
                  onChange={(e) => setHideReason(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setModifyingReview(null)} className="btn btn-outline">
                  Batal
                </button>
                <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#EF4444' }}>
                  Konfirmasi Sembunyikan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

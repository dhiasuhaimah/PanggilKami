import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, MessageSquare, Sparkles, Filter } from 'lucide-react';
import { ReviewCard } from '../components/ReviewCard';
import { db } from '../services/db';
import { Review } from '../types';

export const ReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all');

  useEffect(() => {
    setReviews(db.getPublicReviews());
  }, []);

  const filteredReviews = ratingFilter === 'all'
    ? reviews
    : reviews.filter(r => r.rating === ratingFilter);

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : '5.0';

  return (
    <div className="section section-subtle" style={{ minHeight: '85vh' }}>
      <div className="container" style={{ maxWidth: '980px' }}>
        <div className="section-header">
          <div className="section-tag section-tag-teal">
            <MessageSquare size={14} />
            <span>Suara Pelanggan Nyata</span>
          </div>
          <h1 className="section-title">Ulasan Pelanggan PanggilKami</h1>
          <p className="section-desc">
            Seluruh ulasan di bawah ini berasal dari pelanggan yang telah memesan dan menyelesaikan transaksi layanan kami.
          </p>
        </div>

        {/* Rating Summary Bar */}
        {reviews.length > 0 && (
          <div className="card" style={{
            backgroundColor: '#FFFFFF',
            padding: '1.75rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{ fontSize: '3rem', fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>
                {avgRating}
              </div>
              <div>
                <div style={{ display: 'flex', gap: '0.2rem', marginBottom: '0.25rem' }}>
                  {[1, 2, 3, 4, 5].map(st => (
                    <Star
                      key={st}
                      size={18}
                      style={{
                        fill: st <= Math.round(Number(avgRating)) ? '#F59E0B' : '#E2E8F0',
                        color: st <= Math.round(Number(avgRating)) ? '#F59E0B' : '#CBD5E1'
                      }}
                    />
                  ))}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#64748B' }}>
                  Berdasarkan {reviews.length} ulasan pesanan yang telah selesai
                </div>
              </div>
            </div>

            {/* Filter buttons */}
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => setRatingFilter('all')}
                className={`btn btn-sm ${ratingFilter === 'all' ? 'btn-primary' : 'btn-outline'}`}
                style={{ borderRadius: 'var(--radius-full)' }}
              >
                Semua Bintang
              </button>
              {[5, 4, 3, 2, 1].map(stars => (
                <button
                  key={stars}
                  onClick={() => setRatingFilter(stars)}
                  className={`btn btn-sm ${ratingFilter === stars ? 'btn-primary' : 'btn-outline'}`}
                  style={{ borderRadius: 'var(--radius-full)' }}
                >
                  ⭐ {stars}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Reviews Grid */}
        {filteredReviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredReviews.map(r => (
              <ReviewCard key={r.id} review={r} />
            ))}
          </div>
        ) : (
          <div className="card" style={{
            textAlign: 'center',
            padding: '3.5rem 1.5rem',
            backgroundColor: '#FFFFFF',
            maxWidth: '560px',
            margin: '0 auto'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#EFF6FF',
              color: '#1D4ED8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem auto'
            }}>
              <MessageSquare size={32} />
            </div>
            <h3 style={{ fontSize: '1.25rem', color: '#0F172A', marginBottom: '0.5rem' }}>
              Belum Ada Ulasan
            </h3>
            <p style={{ color: '#64748B', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              Jadilah pelanggan pertama yang berbagi pengalaman! Pesan salah satu layanan kami dan bagikan ulasan Anda setelah pesanan selesai.
            </p>
            <Link to="/layanan" className="btn btn-teal">
              <Sparkles size={16} />
              <span>Pesan Jasa Sekarang</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

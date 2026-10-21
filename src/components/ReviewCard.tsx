import React from 'react';
import { Star, CheckCircle } from 'lucide-react';
import { Review } from '../types';
import { formatDate } from '../utils';

interface ReviewCardProps {
  review: Review;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header with Rating & Date */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={16}
              style={{
                fill: star <= review.rating ? '#F59E0B' : '#E2E8F0',
                color: star <= review.rating ? '#F59E0B' : '#CBD5E1'
              }}
            />
          ))}
        </div>
        <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
          {formatDate(review.created_at)}
        </span>
      </div>

      {/* Comment */}
      <p style={{
        fontSize: '0.925rem',
        color: '#334155',
        lineHeight: '1.5',
        fontStyle: 'italic',
        marginBottom: '1rem',
        flex: 1
      }}>
        "{review.comment}"
      </p>

      {/* Customer & Service Info */}
      <div style={{
        borderTop: '1px solid var(--border-color)',
        paddingTop: '0.75rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span>{review.customer_name}</span>
            <span title="Pelanggan Terverifikasi" style={{ display: 'inline-flex' }}>
              <CheckCircle size={14} style={{ color: '#10B981' }} />
            </span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
            Layanan: {review.service_name}
          </div>
        </div>
      </div>
    </div>
  );
};

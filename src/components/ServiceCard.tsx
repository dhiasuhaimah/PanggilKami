import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Tag, ShieldCheck } from 'lucide-react';
import { Service } from '../types';
import { formatRupiah } from '../utils';

interface ServiceCardProps {
  service: Service;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  return (
    <div className="card card-interactive" style={{
      display: 'flex',
      flexDirection: 'column',
      padding: '0',
      overflow: 'hidden',
      height: '100%'
    }}>
      {/* Service Image Container */}
      <div style={{ position: 'relative', height: '210px', overflow: 'hidden', backgroundColor: '#F1F5F9' }}>
        <img 
          src={service.image_url} 
          alt={service.name} 
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 300ms ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        />
        <div style={{
          position: 'absolute',
          top: '0.85rem',
          left: '0.85rem',
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(4px)',
          color: '#FFFFFF',
          padding: '0.3rem 0.65rem',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.75rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem'
        }}>
          <Tag size={12} style={{ color: '#14B8A6' }} />
          <span>{service.category}</span>
        </div>
      </div>

      {/* Card Content */}
      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ marginBottom: '0.75rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.4rem', color: '#0F172A' }}>
            {service.name}
          </h3>
          <p style={{ fontSize: '0.9rem', color: '#64748B', lineHeight: '1.5' }}>
            {service.short_desc}
          </p>
        </div>

        {/* Price Tag */}
        <div style={{
          marginTop: 'auto',
          paddingTop: '1rem',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          marginBottom: '1.25rem'
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase' }}>
              Tarif Mulai
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1D4ED8' }}>
              {formatRupiah(service.base_price)}
            </div>
          </div>
          <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 500 }}>
            {service.unit}
          </span>
        </div>

        {/* Action Button */}
        <Link 
          to={`/layanan/${service.slug}`} 
          className="btn btn-outline-primary"
          style={{ width: '100%', justifyContent: 'space-between' }}
        >
          <span>Pilih & Lihat Detail</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};

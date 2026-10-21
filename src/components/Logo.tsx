import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  variant?: 'navbar' | 'footer' | 'badge' | 'icon-only' | 'hero';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'navbar',
  size = 'md',
  showTagline = true,
  className = ''
}) => {
  // Determine pixel dimensions based on size
  const iconSizes = {
    sm: { width: 34, height: 34, fontSize: '1rem', subSize: '0.625rem' },
    md: { width: 44, height: 44, fontSize: '1.25rem', subSize: '0.7rem' },
    lg: { width: 56, height: 56, fontSize: '1.5rem', subSize: '0.8rem' },
    xl: { width: 72, height: 72, fontSize: '1.85rem', subSize: '0.9rem' }
  };

  const currentSize = iconSizes[size];

  // Official logo image path
  const logoImgSrc = '/images/logo.jpg';

  if (variant === 'badge' || variant === 'hero') {
    return (
      <div 
        className={`panggilkami-logo-badge ${className}`}
        style={{
          position: 'relative',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 12px 30px -5px rgba(11, 27, 61, 0.4), 0 4px 12px rgba(11, 27, 61, 0.25)',
          border: '1px solid rgba(226, 232, 240, 0.25)',
          backgroundColor: '#0B1B3D',
          display: 'inline-block'
        }}
      >
        <div style={{ position: 'relative' }}>
          <img 
            src={logoImgSrc} 
            alt="PanggilKami Official Emblem" 
            style={{
              width: '100%',
              maxWidth: size === 'xl' ? '360px' : size === 'lg' ? '280px' : '220px',
              height: 'auto',
              display: 'block',
              objectFit: 'cover'
            }}
          />
          {/* Subtle glossy overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 60%)',
            pointerEvents: 'none'
          }} />
        </div>
      </div>
    );
  }

  if (variant === 'icon-only') {
    return (
      <div 
        className={`panggilkami-logo-icon ${className}`}
        style={{
          width: `${currentSize.width}px`,
          height: `${currentSize.height}px`,
          borderRadius: '10px',
          overflow: 'hidden',
          backgroundColor: '#0B1B3D',
          border: '1.5px solid #CBD5E1',
          boxShadow: '0 2px 8px rgba(11, 27, 61, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}
      >
        <img 
          src={logoImgSrc} 
          alt="PK" 
          style={{
            width: '180%',
            height: '180%',
            objectFit: 'cover',
            objectPosition: 'center 38%',
            transform: 'scale(1.15)'
          }}
        />
      </div>
    );
  }

  // Navbar and Footer variants (Emblem + Typography)
  const isDark = variant === 'footer';

  return (
    <div 
      className={`panggilkami-brand-logo ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.75rem',
        textDecoration: 'none'
      }}
    >
      {/* Intricate PK Monogram Icon */}
      <div style={{
        width: `${currentSize.width}px`,
        height: `${currentSize.height}px`,
        borderRadius: '10px',
        overflow: 'hidden',
        backgroundColor: '#0B1B3D',
        border: '1.5px solid rgba(203, 213, 225, 0.6)',
        boxShadow: '0 3px 10px rgba(11, 27, 61, 0.35)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        flexShrink: 0
      }}>
        <img 
          src={logoImgSrc} 
          alt="PK" 
          style={{
            width: '190%',
            height: '190%',
            objectFit: 'cover',
            objectPosition: 'center 38%',
            display: 'block'
          }}
        />
      </div>

      {/* Typography */}
      <div>
        <div style={{
          fontSize: currentSize.fontSize,
          fontWeight: 800,
          color: isDark ? '#FFFFFF' : '#0B1B3D',
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
          display: 'flex',
          alignItems: 'center',
          gap: '2px'
        }}>
          <span>PANGGIL</span>
          <span style={{ color: '#1D4ED8' }}>KAMI</span>
        </div>
        {showTagline && (
          <div style={{
            fontSize: currentSize.subSize,
            fontWeight: 700,
            color: isDark ? '#94A3B8' : '#64748B',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            lineHeight: 1.2,
            marginTop: '1px'
          }}>
            SOLO BARU • JASA PANGGILAN
          </div>
        )}
      </div>
    </div>
  );
};

export default Logo;

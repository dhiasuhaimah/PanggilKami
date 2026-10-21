import React from 'react';
import { formatRupiah } from '../utils';
import { Tag, AlertCircle } from 'lucide-react';

interface PriceSummaryProps {
  serviceFee: number;
  travelFee?: number;
  itemBudget?: number;
  discountAmount?: number;
  voucherCode?: string;
  isEstimate?: boolean;
  isJastip?: boolean;
}

export const PriceSummary: React.FC<PriceSummaryProps> = ({
  serviceFee,
  travelFee = 0,
  itemBudget = 0,
  discountAmount = 0,
  voucherCode,
  isEstimate = false,
  isJastip = false
}) => {
  const subtotal = serviceFee + travelFee + itemBudget;
  const finalTotal = Math.max(0, subtotal - discountAmount);

  return (
    <div style={{
      backgroundColor: '#F8FAFC',
      border: '1px solid #E2E8F0',
      borderRadius: 'var(--radius-lg)',
      padding: '1.25rem'
    }}>
      <h4 style={{ fontSize: '1rem', marginBottom: '1rem', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <span>Rincian Biaya Transparan</span>
        {isEstimate && (
          <span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>
            Estimasi
          </span>
        )}
      </h4>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.9rem' }}>
        {/* Biaya Jasa */}
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
          <span>Biaya Jasa Layanan:</span>
          <span style={{ fontWeight: 600, color: '#0F172A' }}>{formatRupiah(serviceFee)}</span>
        </div>

        {/* Biaya Jarak / Operasional */}
        {travelFee > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
            <span>Penyesuaian Area / Jarak:</span>
            <span style={{ fontWeight: 600, color: '#0F172A' }}>{formatRupiah(travelFee)}</span>
          </div>
        )}

        {/* Anggaran Belanja Barang (Jastip) */}
        {isJastip && itemBudget > 0 && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            color: '#0F766E', 
            backgroundColor: '#F0FDFA', 
            padding: '0.35rem 0.6rem', 
            borderRadius: 'var(--radius-sm)' 
          }}>
            <span>Anggaran Beli Barang Titipan:</span>
            <span style={{ fontWeight: 700 }}>{formatRupiah(itemBudget)}</span>
          </div>
        )}

        {/* Diskon Voucher */}
        {discountAmount > 0 && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            color: '#15803D', 
            backgroundColor: '#ECFDF5', 
            padding: '0.35rem 0.6rem', 
            borderRadius: 'var(--radius-sm)' 
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Tag size={14} />
              Voucher Diskon ({voucherCode}):
            </span>
            <span style={{ fontWeight: 700 }}>- {formatRupiah(discountAmount)}</span>
          </div>
        )}

        {/* Separator */}
        <div style={{ borderTop: '1px dashed #CBD5E1', margin: '0.4rem 0' }} />

        {/* Total Akhir */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A' }}>
              Total Pembayaran:
            </div>
            {finalTotal === 0 && (
              <span style={{ fontSize: '0.75rem', color: '#16A34A', fontWeight: 600 }}>
                (Gratis dengan Voucher Promosi 100%)
              </span>
            )}
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: finalTotal === 0 ? '#16A34A' : '#1D4ED8' }}>
            {formatRupiah(finalTotal)}
          </div>
        </div>

        {/* Catatan Jastip / Estimasi */}
        {isJastip && (
          <div style={{
            fontSize: '0.775rem',
            color: '#64748B',
            marginTop: '0.5rem',
            lineHeight: '1.4',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.35rem'
          }}>
            <AlertCircle size={14} style={{ color: '#0D9488', flexShrink: 0, marginTop: '0.1rem' }} />
            <span>
              <strong>Penting:</strong> Biaya jasa titip Rp 25.000 terpisah dari uang pembelian barang. Uang belanja akan disesuaikan dengan nota asli pembelian di toko.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

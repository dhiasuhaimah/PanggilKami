// Utility functions for PanggilKami

export function formatRupiah(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return 'Rp 0';
  return 'Rp ' + Math.round(amount).toLocaleString('id-ID');
}

export function formatDate(dateString: string): string {
  if (!dateString) return '-';
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString: string): string {
  if (!dateString) return '-';
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateString;
  }
}

export function generateOrderCode(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `PK-${y}${m}${d}-${rand}`;
}

export function generateTransactionId(): string {
  const ts = Date.now().toString().slice(-6);
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `TRX-${ts}-${rand}`;
}

/**
 * Format Indonesian WhatsApp phone number & pre-filled text
 */
export function generateWhatsAppUrl(phone: string, message: string): string {
  let cleanPhone = phone.replace(/[^0-9]/g, '');
  if (cleanPhone.startsWith('0')) {
    cleanPhone = '62' + cleanPhone.slice(1);
  } else if (!cleanPhone.startsWith('62')) {
    cleanPhone = '62' + cleanPhone;
  }
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * CRC16-CCITT (0xFFFF initial, 0x1021 poly) for EMVCo / QRIS compliant checksum
 */
export function calculateQRISChecksum(str: string): string {
  let crc = 0xFFFF;
  for (let i = 0; i < str.length; i++) {
    crc ^= (str.charCodeAt(i) << 8);
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xFFFF;
      } else {
        crc = (crc << 1) & 0xFFFF;
      }
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

/**
 * Generate Realtime Dynamic QRIS from Merchant GoPay string with exact transaction amount
 * Merchant: panggilkami, Hartono Trade Center, Jl. Ir. Soekarno No.A21, Dusun I, Madegondo, Kec. Grogol, Kab. Sukoharjo
 * NMID: ID1026484632207
 */
export function generateDynamicQRIS(amount: number): string {
  // Base QRIS from Merchant GoPay, Tag 01 set to 12 (Dynamic Point-of-Sale)
  let qris = "00020101021226610014COM.GO-JEK.WWW01189360091432268065010210G2268065010303UMI51440014ID.CO.QRIS.WWW0215ID10264846322070303UMI520482115303360";
  
  if (amount && amount > 0) {
    const amtStr = Math.round(amount).toString();
    const len = amtStr.length.toString().padStart(2, '0');
    qris += "54" + len + amtStr;
  }
  
  qris += "5802ID5911panggilkami6009SUKOHARJO61055755262070703A016304";
  const checksum = calculateQRISChecksum(qris);
  return qris + checksum;
}

/**
 * Calculate Cleaning Price based on sqm, dirtiness, area type, and hourly rate
 * Rule: Base price Rp 100.000 / hour.
 * Duration estimated based on sqm: minimum 1 hour, +1 hour for each additional 15 m2.
 * Dirtiness multiplier:
 * - Ringan: 1.0x
 * - Sedang: 1.25x
 * - Berat: 1.5x
 * Area Type add-ons:
 * - Kamar kos: +0
 * - Kamar mandi/WC: +Rp 25.000
 * - Kamar beserta WC: +Rp 45.000
 * - Area tambahan: +Rp 60.000
 */
export function calculateCleaningEstimate(
  sqm: number = 15,
  dirtiness: 'ringan' | 'sedang' | 'berat' = 'ringan',
  areaType: 'kamar' | 'wc' | 'kamar_wc' | 'area_tambahan' = 'kamar',
  hourlyRate: number = 100000
) {
  // Estimasi durasi (jam)
  let baseHours = 1;
  if (sqm > 15) {
    baseHours = 1 + Math.ceil((sqm - 15) / 15);
  }
  
  let multiplier = 1.0;
  if (dirtiness === 'sedang') multiplier = 1.25;
  if (dirtiness === 'berat') multiplier = 1.5;

  let areaAddon = 0;
  if (areaType === 'wc') areaAddon = 25000;
  if (areaType === 'kamar_wc') areaAddon = 45000;
  if (areaType === 'area_tambahan') areaAddon = 60000;

  const estimatedHours = Math.round(baseHours * (dirtiness === 'berat' ? 1.5 : (dirtiness === 'sedang' ? 1.25 : 1)) * 10) / 10;
  const baseServiceFee = Math.round(baseHours * hourlyRate * multiplier);
  const totalEstimated = baseServiceFee + areaAddon;

  return {
    baseHours,
    estimatedHours,
    hourlyRate,
    multiplier,
    areaAddon,
    baseServiceFee,
    totalEstimated
  };
}

/**
 * Secure password hash using SHA-256 for local state & storage
 */
export async function hashPassword(password: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

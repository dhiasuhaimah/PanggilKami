export type UserRole = 'customer' | 'admin';

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  role: UserRole;
  created_at: string;
  avatar_url?: string;
}

export type ServiceSlug = 
  | 'jastip-barang'
  | 'antar-barang'
  | 'antar-jemput'
  | 'bersih-bersih';

export interface CleaningPricingRule {
  hourly_rate: number;          // Default 100000 (Rp 100.000 / jam)
  sqm_per_hour: number;          // approx 15 m2 per hour
  dirtiness_multipliers: {
    ringan: number;              // 1.0
    sedang: number;              // 1.25
    berat: number;               // 1.6
  };
  area_type_additions: {
    kamar: number;               // 0
    wc: number;                  // 25000
    kamar_wc: number;            // 45000
    area_tambahan: number;       // 60000
  };
}

export interface Service {
  id: string;
  name: string;
  slug: ServiceSlug;
  description: string;
  short_desc: string;
  base_price: number;
  unit: string;
  category: string;
  is_active: boolean;
  image_url: string;
  pricing_rules?: CleaningPricingRule | any;
}

export interface ServiceArea {
  id: string;
  name: string;
  city: string;
  is_active: boolean;
  base_fee?: number;
  estimated_eta_mins?: number;
}

export type BookingStatus = 
  | 'menunggu_pembayaran'
  | 'menunggu_verifikasi_pembayaran'
  | 'menunggu_konfirmasi_layanan'
  | 'menunggu_mitra'
  | 'sedang_diproses'
  | 'selesai'
  | 'dibatalkan';

export type PaymentStatus = 
  | 'belum_bayar'
  | 'menunggu_verifikasi'
  | 'lunas'
  | 'gagal'
  | 'dikembalikan';

export interface StatusHistoryItem {
  status: BookingStatus;
  timestamp: string;
  note?: string;
  updated_by?: string;
}

export interface Booking {
  id: string;
  order_code: string;
  customer_id: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  service_id: string;
  service_name: string;
  service_slug: ServiceSlug;
  status: BookingStatus;
  payment_status: PaymentStatus;
  
  // Cost breakdown
  service_fee: number;
  travel_fee: number;
  item_budget: number;         // For jastip
  discount_amount: number;
  total_amount: number;
  voucher_code?: string;
  
  // Location and Scheduling
  pickup_address?: string;
  destination_address?: string;
  area_id?: string;
  area_name?: string;
  scheduled_date: string;
  scheduled_time: string;
  notes?: string;

  // Service-specific inputs
  details: {
    // Jastip
    item_names?: string;
    store_name?: string;
    item_quantity?: string;
    item_reference_image?: string;
    is_budget_confirmed?: boolean;

    // Antar Barang
    item_type?: string;
    package_size_weight?: string;
    receiver_name?: string;
    receiver_phone?: string;

    // Antar Jemput Orang
    passenger_count?: number;
    trip_notes?: string;

    // Bersih-bersih
    clean_area_type?: 'kamar' | 'wc' | 'kamar_wc' | 'area_tambahan';
    area_sqm?: number;
    dirtiness_level?: 'ringan' | 'sedang' | 'berat';
    estimated_hours?: number;
    condition_photo?: string;
  };

  status_history: StatusHistoryItem[];
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  booking_id: string;
  order_code: string;
  transaction_id: string;
  method: 'qris_gopay' | 'voucher' | 'manual_transfer';
  amount: number;
  status: 'pending' | 'verified' | 'failed';
  proof_url?: string;
  qris_payload?: string;
  paid_at?: string;
  verified_at?: string;
  verified_by?: string;
  notes?: string;
}

export interface Review {
  id: string;
  booking_id: string;
  order_code: string;
  customer_id: string;
  customer_name: string;
  service_name: string;
  rating: number; // 1-5
  comment: string;
  is_visible: boolean;
  hidden_reason?: string;
  created_at: string;
}

export interface Voucher {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number; // 100 for percentage means 100% off
  min_order: number;
  max_uses: number;
  current_uses: number;
  is_active: boolean;
  expires_at?: string;
}

export interface SiteSettings {
  whatsapp_number: string;
  email: string;
  address: string;
  business_name: string;
  tagline: string;
  operating_hours: string;
  cleaning_hourly_rate: number;
  cleaning_sqm_multiplier: number;
  jastip_base_fee: number;
  courier_base_fee: number;
  ride_base_fee: number;
}

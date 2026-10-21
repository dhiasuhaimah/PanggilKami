-- ==============================================================================
-- PANGGILKAMI DATABASE SCHEMA & SECURITY POLICIES (POSTGRESQL / SUPABASE)
-- ==============================================================================

-- 1. Create Custom Enum Types
CREATE TYPE user_role AS ENUM ('customer', 'admin');
CREATE TYPE booking_status_type AS ENUM (
  'menunggu_pembayaran',
  'menunggu_verifikasi_pembayaran',
  'menunggu_konfirmasi_layanan',
  'menunggu_mitra',
  'sedang_diproses',
  'selesai',
  'dibatalkan'
);
CREATE TYPE payment_status_type AS ENUM (
  'belum_bayar',
  'menunggu_verifikasi',
  'lunas',
  'gagal',
  'dikembalikan'
);

-- 2. Profiles Table (Extends Supabase auth.users or standalone)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  role user_role DEFAULT 'customer',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Services Table
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  short_desc TEXT NOT NULL,
  base_price NUMERIC(12, 2) NOT NULL DEFAULT 0,
  unit TEXT NOT NULL,
  category TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  image_url TEXT NOT NULL,
  pricing_rules JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Service Areas Table
CREATE TABLE IF NOT EXISTS public.service_areas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  base_fee NUMERIC(12, 2) DEFAULT 0,
  estimated_eta_mins INT DEFAULT 20,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Vouchers Table
CREATE TABLE IF NOT EXISTS public.vouchers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL DEFAULT 'percentage',
  discount_value NUMERIC(12, 2) NOT NULL,
  min_order NUMERIC(12, 2) DEFAULT 0,
  max_uses INT DEFAULT 1000,
  current_uses INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Bookings Table
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_code TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  service_id UUID REFERENCES public.services(id),
  service_name TEXT NOT NULL,
  service_slug TEXT NOT NULL,
  status booking_status_type DEFAULT 'menunggu_pembayaran',
  payment_status payment_status_type DEFAULT 'belum_bayar',
  
  -- Financial Breakdown
  service_fee NUMERIC(12, 2) NOT NULL DEFAULT 0,
  travel_fee NUMERIC(12, 2) NOT NULL DEFAULT 0,
  item_budget NUMERIC(12, 2) NOT NULL DEFAULT 0,
  discount_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  voucher_code TEXT,
  
  -- Locations & Schedule
  area_id TEXT,
  area_name TEXT,
  pickup_address TEXT,
  destination_address TEXT,
  scheduled_date DATE NOT NULL,
  scheduled_time TIME NOT NULL,
  notes TEXT,
  
  status_history JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Booking Details Table (Detailed specifications)
CREATE TABLE IF NOT EXISTS public.booking_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. Payments Table
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  order_code TEXT NOT NULL,
  transaction_id TEXT UNIQUE NOT NULL,
  method TEXT NOT NULL DEFAULT 'qris_gopay',
  amount NUMERIC(12, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, verified, failed
  proof_url TEXT,
  qris_payload TEXT,
  paid_at TIMESTAMPTZ,
  verified_at TIMESTAMPTZ,
  verified_by TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 9. Reviews Table
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID UNIQUE NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  order_code TEXT NOT NULL,
  customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  service_name TEXT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  is_visible BOOLEAN DEFAULT true,
  hidden_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 10. Site Settings Table
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vouchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Public / Service Policies
CREATE POLICY "Public read active services" ON public.services FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "Admin manage services" ON public.services FOR ALL USING (public.is_admin());

CREATE POLICY "Public read active areas" ON public.service_areas FOR SELECT USING (true);
CREATE POLICY "Admin manage areas" ON public.service_areas FOR ALL USING (public.is_admin());

CREATE POLICY "Public read visible reviews" ON public.reviews FOR SELECT USING (is_visible = true OR public.is_admin());
CREATE POLICY "Customer create review on completed booking" ON public.reviews FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.bookings b
    WHERE b.id = booking_id AND b.status = 'selesai'
  )
);
CREATE POLICY "Admin moderate reviews" ON public.reviews FOR UPDATE USING (public.is_admin());

-- Bookings Policies: Customers read only their own bookings; Admins read all
CREATE POLICY "Customers view own bookings" ON public.bookings FOR SELECT USING (
  customer_id = auth.uid() OR public.is_admin()
);
CREATE POLICY "Customers insert bookings" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin update bookings" ON public.bookings FOR UPDATE USING (public.is_admin());

-- Payments Policies
CREATE POLICY "Customers view own payments" ON public.payments FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.bookings b WHERE b.id = booking_id AND (b.customer_id = auth.uid() OR public.is_admin()))
);
CREATE POLICY "Admin manage payments" ON public.payments FOR ALL USING (public.is_admin());

-- ==============================================================================
-- INITIAL SEED DATA
-- ==============================================================================

-- Seed Admin Profile (admin@gmail.com)
INSERT INTO public.profiles (email, full_name, phone, role)
VALUES ('admin@gmail.com', 'Admin Operasional PanggilKami', '082283883580', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Seed Default Services
INSERT INTO public.services (name, slug, description, short_desc, base_price, unit, category, image_url)
VALUES 
(
  'Jasa Titip Barang',
  'jastip-barang',
  'Titip beli oleh-oleh khas Solo, makanan, kebutuhan sehari-hari, perlengkapan, dan barang lain yang diperbolehkan tanpa perlu repot mengantre.',
  'Beli makanan, oleh-oleh Solo, atau belanja harian praktis tanpa antre.',
  25000,
  'per transaksi jasa titip',
  'Belanja & Titip',
  '/images/service_jastip.jpg'
),
(
  'Antar Barang Apa Saja',
  'antar-barang',
  'Layanan pengantaran barang, dokumen, makanan, kebutuhan kuliah, dan barang lain yang diperbolehkan dengan proses pemesanan yang praktis.',
  'Kirim dokumen, paket, atau perlengkapan cepat & aman di Solo Raya.',
  15000,
  'per perjalanan awal',
  'Kurir & Pengiriman',
  '/images/service_antar_barang.jpg'
),
(
  'Antar Jemput Orang',
  'antar-jemput',
  'Layanan antar jemput untuk perjalanan lokal dengan memperhatikan kenyamanan, keamanan, dan ketersediaan mitra.',
  'Perjalanan lokal aman dan nyaman dengan konfirmasi mitra terpercaya.',
  15000,
  'per perjalanan awal',
  'Transportasi Lokal',
  '/images/service_antar_jemput.jpg'
),
(
  'Bersih-bersih Kamar / WC / Kos',
  'bersih-bersih',
  'Layanan kebersihan untuk kamar kos, kamar mandi, WC, dan area hunian agar lebih bersih dan nyaman.',
  'Kamar kos & WC bersih berkilau mulai Rp 100.000/jam.',
  100000,
  'per jam pengerjaan',
  'Kebersihan Hunian',
  '/images/service_cleaning.jpg'
)
ON CONFLICT (slug) DO NOTHING;

-- Seed Default Voucher (100% discount promo)
INSERT INTO public.vouchers (code, discount_type, discount_value, min_order, max_uses, is_active)
VALUES ('panggilkami', 'percentage', 100, 0, 1000, true)
ON CONFLICT (code) DO NOTHING;

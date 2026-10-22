import { 
  User, 
  Service, 
  ServiceArea, 
  Booking, 
  Payment, 
  Review, 
  Voucher, 
  SiteSettings, 
  BookingStatus, 
  PaymentStatus 
} from '../types';
import { hashPassword, generateTransactionId } from '../utils';

// Local Storage Keys
const STORAGE_KEYS = {
  USERS: 'panggilkami_users',
  CURRENT_USER: 'panggilkami_session',
  SERVICES: 'panggilkami_services',
  AREAS: 'panggilkami_areas',
  BOOKINGS: 'panggilkami_bookings',
  PAYMENTS: 'panggilkami_payments',
  REVIEWS: 'panggilkami_reviews',
  VOUCHERS: 'panggilkami_vouchers',
  SETTINGS: 'panggilkami_settings',
  PASSWORD_HASHES: 'panggilkami_auth_pwd'
};

// Default Services Seed
const DEFAULT_SERVICES: Service[] = [
  {
    id: 'srv_1',
    name: 'Jasa Titip Barang',
    slug: 'jastip-barang',
    description: 'Titip beli oleh-oleh khas Solo, makanan, kebutuhan sehari-hari, perlengkapan, dan barang lain yang diperbolehkan tanpa perlu repot mengantre.',
    short_desc: 'Beli makanan khas, oleh-oleh Solo, atau belanja harian praktis tanpa perlu repot antre.',
    base_price: 15000,
    unit: 'per transaksi jasa titip',
    category: 'Belanja & Titip',
    is_active: true,
    image_url: '/images/service_jastip.jpg',
    pricing_rules: {
      note: 'Biaya jasa mulai Rp 15.000 terpisah dari uang belanja barang.'
    }
  },
  {
    id: 'srv_2',
    name: 'Antar Barang Apa Saja',
    slug: 'antar-barang',
    description: 'Layanan pengantaran barang, dokumen, makanan, kebutuhan kuliah, dan barang lain yang diperbolehkan dengan proses pemesanan yang praktis.',
    short_desc: 'Kirim dokumen, paket, atau perlengkapan cepat & aman di sekitar Solo Baru dan Solo Raya.',
    base_price: 15000,
    unit: 'per perjalanan awal',
    category: 'Kurir & Pengiriman',
    is_active: true,
    image_url: '/images/service_antar_barang.jpg',
    pricing_rules: {
      note: 'Tarif dasar mulai Rp 15.000, dapat disesuaikan dengan jarak dan ukuran barang.'
    }
  },
  {
    id: 'srv_3',
    name: 'Antar Jemput Orang',
    slug: 'antar-jemput',
    description: 'Layanan antar jemput untuk perjalanan lokal dengan memperhatikan kenyamanan, keamanan, dan ketersediaan mitra.',
    short_desc: 'Antar jemput perjalanan lokal nyaman dan aman sesuai ketersediaan mitra terpercaya.',
    base_price: 15000,
    unit: 'per perjalanan awal',
    category: 'Transportasi Lokal',
    is_active: true,
    image_url: '/images/service_antar_jemput.jpg',
    pricing_rules: {
      note: 'Tarif awal Rp 15.000, penyesuaian tarif transparan berdasarkan jarak dan waktu.'
    }
  },
  {
    id: 'srv_4',
    name: 'Bersih Kamar Kos',
    slug: 'bersih-kamar-kos',
    description: 'Layanan kebersihan khusus kamar kos: sapu, pel lantai, lap debu meja/lemari, ganti sprei, dan buang sampah.',
    short_desc: 'Bersih kamar kos rapi, higienis & wangi mulai Rp 50.000 / jam pengerjaan.',
    base_price: 50000,
    unit: 'per jam pengerjaan',
    category: 'Kebersihan Hunian',
    is_active: true,
    image_url: '/images/service_cleaning.jpg',
    pricing_rules: {
      hourly_rate: 50000,
      note: 'Tarif mulai Rp 50.000 per jam pengerjaan kamar kos di Solo.'
    }
  },
  {
    id: 'srv_5',
    name: 'Bersihin WC & Kamar Mandi',
    slug: 'cuci-wc-kamar-mandi',
    description: 'Pembersihan kerak membandel pada lantai kamar mandi, kloset duduk/jongkok, wastafel, dan dinding dengan pembersih profesional.',
    short_desc: 'Bersihin WC tuntas kerak & higienis mulai Rp 100.000 / jam pengerjaan.',
    base_price: 100000,
    unit: 'per jam pengerjaan',
    category: 'Kebersihan Hunian',
    is_active: true,
    image_url: '/images/cuci_wc.png',
    pricing_rules: {
      hourly_rate: 100000,
      note: 'Tarif dihitung Rp 100.000 per jam pengerjaan tuntas kerak.'
    }
  },
  {
    id: 'srv_6',
    name: 'Suruh Apa Saja (Fleksibel)',
    slug: 'suruh-apa-saja',
    description: 'Layanan serbabisa fleksibel untuk berbagai tugas mendadak: antre tiket, fotokopi tugas, angkat galon, atau urusan harian lainnya.',
    short_desc: 'Tugas serbabisa & mendesak dibantu mitra cekatan mulai Rp 15.000.',
    base_price: 15000,
    unit: 'per tugas awal',
    category: 'Bantuan Personal',
    is_active: true,
    image_url: '/images/service_suruh.jpg',
    pricing_rules: {
      note: 'Tarif transparan mulai Rp 15.000 disesuaikan dengan tingkat kesulitan tugas.'
    }
  }
];

// Default Service Areas Seed
const DEFAULT_AREAS: ServiceArea[] = [
  { id: 'area_1', name: 'Solo Baru (HTC & Sekitarnya)', city: 'Sukoharjo', is_active: true, base_fee: 0, estimated_eta_mins: 15 },
  { id: 'area_2', name: 'Sukoharjo Kota', city: 'Sukoharjo', is_active: true, base_fee: 5000, estimated_eta_mins: 30 },
  { id: 'area_3', name: 'Kartasura', city: 'Sukoharjo', is_active: true, base_fee: 5000, estimated_eta_mins: 25 },
  { id: 'area_4', name: 'Karanganyar', city: 'Karanganyar', is_active: true, base_fee: 8000, estimated_eta_mins: 35 },
  { id: 'area_5', name: 'Area Sekitar Kampus UMS', city: 'Sukoharjo', is_active: true, base_fee: 3000, estimated_eta_mins: 20 },
  { id: 'area_6', name: 'Area Sekitar Kampus UNS', city: 'Surakarta', is_active: true, base_fee: 4000, estimated_eta_mins: 25 },
  { id: 'area_7', name: 'Solo Kota (Slamet Riyadi / Pasar Kliwon)', city: 'Surakarta', is_active: true, base_fee: 3000, estimated_eta_mins: 20 },
  { id: 'area_8', name: 'Nusukan', city: 'Surakarta', is_active: true, base_fee: 6000, estimated_eta_mins: 30 },
  { id: 'area_9', name: 'Mojolaban', city: 'Sukoharjo', is_active: true, base_fee: 5000, estimated_eta_mins: 25 },
  { id: 'area_10', name: 'Semanggi', city: 'Surakarta', is_active: true, base_fee: 3000, estimated_eta_mins: 15 }
];

// Default Voucher Seed
const DEFAULT_VOUCHERS: Voucher[] = [
  {
    id: 'vch_1',
    code: 'panggilkami',
    discount_type: 'percentage',
    discount_value: 100, // 100% off -> Rp 0
    min_order: 0,
    max_uses: 1000,
    current_uses: 0,
    is_active: true,
    expires_at: '2030-12-31'
  }
];

// Default Settings Seed
const DEFAULT_SETTINGS: SiteSettings = {
  whatsapp_number: '082283883580',
  email: 'panggilkamisolo@gmail.com',
  address: 'Solo Baru HTC (Hartono Trade Center), Jl. Ir. Soekarno No.A21, Madegondo, Grogol, Sukoharjo',
  business_name: 'PanggilKami',
  tagline: 'Butuh Bantuan? PanggilKami.',
  operating_hours: 'Setiap Hari: 06.00 - 22.00 WIB',
  cleaning_hourly_rate: 100000,
  cleaning_sqm_multiplier: 15,
  jastip_base_fee: 15000,
  courier_base_fee: 15000,
  ride_base_fee: 15000
};

/**
 * Database & Repository Service
 */
class DatabaseService {
  private initialized = false;

  constructor() {
    this.initDatabase();
  }

  public async initDatabase() {
    if (typeof window === 'undefined') return;

    // Check services
    if (!localStorage.getItem(STORAGE_KEYS.SERVICES)) {
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(DEFAULT_SERVICES));
    }

    // Check areas
    if (!localStorage.getItem(STORAGE_KEYS.AREAS)) {
      localStorage.setItem(STORAGE_KEYS.AREAS, JSON.stringify(DEFAULT_AREAS));
    }

    // Check vouchers
    if (!localStorage.getItem(STORAGE_KEYS.VOUCHERS)) {
      localStorage.setItem(STORAGE_KEYS.VOUCHERS, JSON.stringify(DEFAULT_VOUCHERS));
    }

    // Check site settings
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    }

    // Check bookings
    if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify([]));
    }

    // Check payments
    if (!localStorage.getItem(STORAGE_KEYS.PAYMENTS)) {
      localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify([]));
    }

    // Check reviews (initially empty per requirement)
    if (!localStorage.getItem(STORAGE_KEYS.REVIEWS)) {
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify([]));
    }

    // Seed Admin Account: admin@gmail.com / 123456
    let users: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    let pwdMap: Record<string, string> = JSON.parse(localStorage.getItem(STORAGE_KEYS.PASSWORD_HASHES) || '{}');

    const adminExists = users.some(u => u.email.toLowerCase() === 'admin@gmail.com');
    if (!adminExists) {
      const adminId = 'usr_admin_default';
      const adminHash = await hashPassword('123456');
      
      const adminUser: User = {
        id: adminId,
        email: 'admin@gmail.com',
        full_name: 'Admin Operasional PanggilKami',
        phone: '082283883580',
        role: 'admin',
        created_at: new Date().toISOString()
      };
      
      users.push(adminUser);
      pwdMap[adminUser.email.toLowerCase()] = adminHash;

      // Seed a customer for convenience testing
      const customerHash = await hashPassword('123456');
      const testCustomer: User = {
        id: 'usr_cust_budi',
        email: 'budi@gmail.com',
        full_name: 'Budi Santoso (Solo Baru)',
        phone: '081234567890',
        role: 'customer',
        created_at: new Date().toISOString()
      };
      users.push(testCustomer);
      pwdMap[testCustomer.email.toLowerCase()] = customerHash;

      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      localStorage.setItem(STORAGE_KEYS.PASSWORD_HASHES, JSON.stringify(pwdMap));
    }

    this.initialized = true;
  }

  // --- Auth & Users ---
  public getUsers(): User[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  }

  public async register(fullName: string, email: string, phone: string, password: string): Promise<User> {
    const users = this.getUsers();
    const cleanEmail = email.trim().toLowerCase();
    
    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      throw new Error('Email sudah terdaftar. Silakan gunakan email lain atau login.');
    }

    const id = 'usr_' + Date.now();
    const newUser: User = {
      id,
      email: cleanEmail,
      full_name: fullName.trim(),
      phone: phone.trim(),
      role: 'customer', // strictly customer
      created_at: new Date().toISOString()
    };

    const pwdHash = await hashPassword(password);
    const pwdMap: Record<string, string> = JSON.parse(localStorage.getItem(STORAGE_KEYS.PASSWORD_HASHES) || '{}');
    pwdMap[cleanEmail] = pwdHash;

    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    localStorage.setItem(STORAGE_KEYS.PASSWORD_HASHES, JSON.stringify(pwdMap));
    this.setCurrentUser(newUser);

    return newUser;
  }

  public async login(email: string, password: string): Promise<User> {
    const users = this.getUsers();
    const cleanEmail = email.trim().toLowerCase();
    const user = users.find(u => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      throw new Error('Email atau kata sandi tidak sesuai.');
    }

    const pwdMap: Record<string, string> = JSON.parse(localStorage.getItem(STORAGE_KEYS.PASSWORD_HASHES) || '{}');
    const inputHash = await hashPassword(password);

    if (pwdMap[cleanEmail] !== inputHash) {
      throw new Error('Email atau kata sandi tidak sesuai.');
    }

    this.setCurrentUser(user);
    return user;
  }

  public getCurrentUser(): User | null {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return raw ? JSON.parse(raw) : null;
  }

  public setCurrentUser(user: User | null) {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }

  public logout() {
    this.setCurrentUser(null);
  }

  public async updateProfile(userId: string, updates: Partial<User>): Promise<User> {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === userId);
    if (idx === -1) throw new Error('Pengguna tidak ditemukan.');

    // Protect role escalation
    const allowedUpdates = { ...updates };
    delete allowedUpdates.role;
    delete allowedUpdates.id;

    users[idx] = { ...users[idx], ...allowedUpdates };
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    const current = this.getCurrentUser();
    if (current && current.id === userId) {
      this.setCurrentUser(users[idx]);
    }

    return users[idx];
  }

  public async changePassword(email: string, oldPassword: string, newPassword: string): Promise<boolean> {
    const cleanEmail = email.trim().toLowerCase();
    const pwdMap: Record<string, string> = JSON.parse(localStorage.getItem(STORAGE_KEYS.PASSWORD_HASHES) || '{}');
    const oldHash = await hashPassword(oldPassword);

    if (pwdMap[cleanEmail] !== oldHash) {
      throw new Error('Kata sandi lama tidak sesuai.');
    }

    pwdMap[cleanEmail] = await hashPassword(newPassword);
    localStorage.setItem(STORAGE_KEYS.PASSWORD_HASHES, JSON.stringify(pwdMap));
    return true;
  }

  // --- Services ---
  public getServices(): Service[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.SERVICES) || '[]');
  }

  public getServiceBySlug(slug: string): Service | undefined {
    return this.getServices().find(s => s.slug === slug);
  }

  public updateService(id: string, updates: Partial<Service>): Service {
    const services = this.getServices();
    const idx = services.findIndex(s => s.id === id);
    if (idx === -1) throw new Error('Layanan tidak ditemukan');
    services[idx] = { ...services[idx], ...updates };
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
    return services[idx];
  }

  public addService(service: Omit<Service, 'id'>): Service {
    const services = this.getServices();
    const newService: Service = {
      ...service,
      id: 'srv_' + Date.now()
    };
    services.push(newService);
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
    return newService;
  }

  // --- Areas ---
  public getAreas(): ServiceArea[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.AREAS) || '[]');
  }

  public updateArea(id: string, updates: Partial<ServiceArea>): ServiceArea {
    const areas = this.getAreas();
    const idx = areas.findIndex(a => a.id === id);
    if (idx === -1) throw new Error('Area tidak ditemukan');
    areas[idx] = { ...areas[idx], ...updates };
    localStorage.setItem(STORAGE_KEYS.AREAS, JSON.stringify(areas));
    return areas[idx];
  }

  public addArea(area: Omit<ServiceArea, 'id'>): ServiceArea {
    const areas = this.getAreas();
    const newArea: ServiceArea = {
      ...area,
      id: 'area_' + Date.now()
    };
    areas.push(newArea);
    localStorage.setItem(STORAGE_KEYS.AREAS, JSON.stringify(areas));
    return newArea;
  }

  // --- Bookings ---
  public getBookings(): Booking[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || '[]');
  }

  public getBookingById(id: string): Booking | undefined {
    return this.getBookings().find(b => b.id === id || b.order_code === id);
  }

  public getBookingsByCustomer(customerId: string): Booking[] {
    return this.getBookings().filter(b => b.customer_id === customerId);
  }

  public createBooking(bookingData: Omit<Booking, 'id' | 'created_at' | 'updated_at' | 'status_history'>): Booking {
    const bookings = this.getBookings();
    const now = new Date().toISOString();
    
    const newBooking: Booking = {
      ...bookingData,
      id: 'bk_' + Date.now(),
      created_at: now,
      updated_at: now,
      status_history: [
        {
          status: bookingData.status,
          timestamp: now,
          note: 'Pesanan berhasil dibuat oleh pelanggan'
        }
      ]
    };

    // If voucher used, increment usage
    if (newBooking.voucher_code) {
      this.useVoucher(newBooking.voucher_code);
    }

    bookings.unshift(newBooking);
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));

    // Create corresponding payment record
    const paymentRecord: Payment = {
      id: 'pay_' + Date.now(),
      booking_id: newBooking.id,
      order_code: newBooking.order_code,
      transaction_id: generateTransactionId(),
      method: newBooking.total_amount === 0 ? 'voucher' : 'qris_gopay',
      amount: newBooking.total_amount,
      status: newBooking.total_amount === 0 ? 'verified' : 'pending',
      paid_at: newBooking.total_amount === 0 ? now : undefined,
      notes: newBooking.total_amount === 0 ? 'Lunas otomatis menggunakan voucher diskon 100%' : 'Menunggu pembayaran QRIS GoPay'
    };
    this.createPayment(paymentRecord);

    return newBooking;
  }

  public updateBookingStatus(
    bookingId: string, 
    newStatus: BookingStatus, 
    note?: string,
    updatedBy?: string
  ): Booking {
    const bookings = this.getBookings();
    const idx = bookings.findIndex(b => b.id === bookingId || b.order_code === bookingId);
    if (idx === -1) throw new Error('Pesanan tidak ditemukan');

    const now = new Date().toISOString();
    bookings[idx].status = newStatus;
    bookings[idx].updated_at = now;

    if (!bookings[idx].status_history) {
      bookings[idx].status_history = [];
    }
    bookings[idx].status_history.push({
      status: newStatus,
      timestamp: now,
      note: note || `Status diperbarui menjadi ${newStatus}`,
      updated_by: updatedBy || 'Sistem'
    });

    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    return bookings[idx];
  }

  public updateBookingPaymentStatus(
    bookingId: string,
    paymentStatus: PaymentStatus,
    note?: string
  ): Booking {
    const bookings = this.getBookings();
    const idx = bookings.findIndex(b => b.id === bookingId || b.order_code === bookingId);
    if (idx === -1) throw new Error('Pesanan tidak ditemukan');

    bookings[idx].payment_status = paymentStatus;
    bookings[idx].updated_at = new Date().toISOString();

    // If payment is paid, advance booking status if still in awaiting payment
    if (paymentStatus === 'lunas' && (bookings[idx].status === 'menunggu_pembayaran' || bookings[idx].status === 'menunggu_verifikasi_pembayaran')) {
      bookings[idx].status = 'menunggu_konfirmasi_layanan';
    } else if (paymentStatus === 'menunggu_verifikasi' && bookings[idx].status === 'menunggu_pembayaran') {
      bookings[idx].status = 'menunggu_verifikasi_pembayaran';
    }

    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    return bookings[idx];
  }

  // --- Payments ---
  public getPayments(): Payment[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PAYMENTS) || '[]');
  }

  public getPaymentByBookingId(bookingId: string): Payment | undefined {
    return this.getPayments().find(p => p.booking_id === bookingId);
  }

  public createPayment(payment: Payment): Payment {
    const payments = this.getPayments();
    payments.unshift(payment);
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
    return payment;
  }

  public updatePayment(id: string, updates: Partial<Payment>): Payment {
    const payments = this.getPayments();
    const idx = payments.findIndex(p => p.id === id || p.booking_id === id);
    if (idx === -1) throw new Error('Transaksi pembayaran tidak ditemukan');
    
    payments[idx] = { ...payments[idx], ...updates };
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));

    // Sync with booking payment status
    if (updates.status === 'verified') {
      this.updateBookingPaymentStatus(payments[idx].booking_id, 'lunas', 'Pembayaran diverifikasi');
    } else if (updates.status === 'failed') {
      this.updateBookingPaymentStatus(payments[idx].booking_id, 'gagal', 'Pembayaran ditolak / gagal');
    }

    return payments[idx];
  }

  // --- Reviews ---
  public getReviews(): Review[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.REVIEWS) || '[]');
  }

  public getPublicReviews(): Review[] {
    return this.getReviews().filter(r => r.is_visible);
  }

  public createReview(reviewData: Omit<Review, 'id' | 'created_at' | 'is_visible'>): Review {
    const reviews = this.getReviews();
    
    // Check if review already exists for this booking
    if (reviews.some(r => r.booking_id === reviewData.booking_id)) {
      throw new Error('Ulasan untuk pesanan ini sudah pernah dikirimkan.');
    }

    // Verify booking is completed
    const booking = this.getBookingById(reviewData.booking_id);
    if (!booking) throw new Error('Data pesanan tidak ditemukan.');
    if (booking.status !== 'selesai') {
      throw new Error('Ulasan hanya dapat diberikan setelah pesanan berstatus Selesai.');
    }

    const newReview: Review = {
      ...reviewData,
      id: 'rev_' + Date.now(),
      is_visible: true,
      created_at: new Date().toISOString()
    };

    reviews.unshift(newReview);
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
    return newReview;
  }

  public toggleReviewVisibility(reviewId: string, isVisible: boolean, reason?: string): Review {
    const reviews = this.getReviews();
    const idx = reviews.findIndex(r => r.id === reviewId);
    if (idx === -1) throw new Error('Ulasan tidak ditemukan');

    reviews[idx].is_visible = isVisible;
    if (reason) reviews[idx].hidden_reason = reason;

    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
    return reviews[idx];
  }

  // --- Vouchers ---
  public getVouchers(): Voucher[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.VOUCHERS) || '[]');
  }

  public validateVoucher(code: string, orderAmount: number): { isValid: boolean; discountAmount: number; message: string; voucher?: Voucher } {
    const vouchers = this.getVouchers();
    const cleanCode = code.trim().toLowerCase();
    const vch = vouchers.find(v => v.code.toLowerCase() === cleanCode && v.is_active);

    if (!vch) {
      return { isValid: false, discountAmount: 0, message: 'Kode voucher tidak valid atau telah dinonaktifkan.' };
    }

    if (vch.expires_at && new Date(vch.expires_at) < new Date()) {
      return { isValid: false, discountAmount: 0, message: 'Voucher telah kedaluwarsa.' };
    }

    if (vch.current_uses >= vch.max_uses) {
      return { isValid: false, discountAmount: 0, message: 'Kuota penggunaan voucher telah habis.' };
    }

    let discount = 0;
    if (vch.discount_type === 'percentage') {
      discount = Math.round((orderAmount * vch.discount_value) / 100);
    } else {
      discount = Math.min(orderAmount, vch.discount_value);
    }

    return {
      isValid: true,
      discountAmount: discount,
      message: `Voucher "${vch.code}" berhasil diterapkan! Potongan ${vch.discount_value}%.`,
      voucher: vch
    };
  }

  public useVoucher(code: string) {
    const vouchers = this.getVouchers();
    const idx = vouchers.findIndex(v => v.code.toLowerCase() === code.trim().toLowerCase());
    if (idx !== -1) {
      vouchers[idx].current_uses += 1;
      localStorage.setItem(STORAGE_KEYS.VOUCHERS, JSON.stringify(vouchers));
    }
  }

  // --- Settings ---
  public getSettings(): SiteSettings {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return raw ? JSON.parse(raw) : DEFAULT_SETTINGS;
  }

  public updateSettings(settings: Partial<SiteSettings>): SiteSettings {
    const current = this.getSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    return updated;
  }
}

export const db = new DatabaseService();

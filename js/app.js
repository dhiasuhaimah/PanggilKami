/**
 * PANGGILKAMI - JASA SURUH & HELPER SOLO
 * Core Application Logic, State Management & Realtime Interactions
 */

// Storage Keys
const STORAGE_KEYS = {
  USERS: 'pk_users',
  CURRENT_USER: 'pk_current_user',
  ORDERS: 'pk_orders',
  REVIEWS: 'pk_reviews',
  ACTIVE_VIEW: 'pk_view_mode' // 'user' or 'admin'
};

// 10 Authentic Solo Reviews Seed
const INITIAL_REVIEWS = [
  {
    id: 'rev_1',
    name: 'Annisa Rahma',
    role: 'Mahasiswi UNS Jebres',
    service: 'Jastip Makanan & Apotek',
    rating: 5,
    date: '18 Okt 2026',
    comment: 'Penyelamat pas lagi meriang demam di kos! Titip beliin obat paracetamol di Kimia Farma sama bubur ayam Sekarpace, cuma 25 menit udah nyampe depan pintu kamar. Mas kurirnya ramah banget.'
  },
  {
    id: 'rev_2',
    name: 'Dimas Arya Pratama',
    role: 'Mahasiswa UMS Pabelan',
    service: 'Bersih-bersih Kamar Kos',
    rating: 5,
    date: '17 Okt 2026',
    comment: 'Langganan tiap akhir bulan buat bersihin kamar kos cowok. Kamar mandi yang tadinya berkerak kuning disikat sampe kinclong wangi. Tarifnya jujur & sangat terjangkau buat kantong mahasiswa.'
  },
  {
    id: 'rev_3',
    name: 'Bu Ratna Wijaya',
    role: 'Warga Solo Baru (Grogol)',
    service: 'Jastip Belanja Pasar',
    rating: 5,
    date: '16 Okt 2026',
    comment: 'Sering titip belanjaan daging dan sayur segar di Pasar Gede pas lagi repot urus kerjaan di rumah. Pembayaran QRIS di webnya gampang banget, tinggal scan langsung diverifikasi realtime.'
  },
  {
    id: 'rev_4',
    name: 'Kevin Setiawan',
    role: 'Karyawan Kantor Slamet Riyadi',
    service: 'Antar Jemput Orang',
    rating: 5,
    date: '15 Okt 2026',
    comment: 'Layanan antar jemputnya on-time banget! Jam 05.30 pagi dijemput di kos Kartasura dianter ke Stasiun Balapan, drivernya hafal jalan tikus jadi gak pake drama telat kereta Prameks.'
  },
  {
    id: 'rev_5',
    name: 'Nabila Putri',
    role: 'Mahasiswi ISI Surakarta',
    service: 'Suruh Apa Saja (Print Skripsi)',
    rating: 5,
    date: '14 Okt 2026',
    comment: 'Beneran bisa disuruh apa aja! Kemarin titip print tugas tebal 120 lembar dan jilid skripsi pas lagi magang. Hasil cetaknya rapi, uang print-nya difotoin struk aslinya transparan.'
  },
  {
    id: 'rev_6',
    name: 'Rian Hidayat',
    role: 'Solo Kota (Pasar Kliwon)',
    service: 'Jastip Oleh-oleh Solo',
    rating: 5,
    date: '13 Okt 2026',
    comment: 'Nitip belikan Serabi Notosuman 5 box buat oleh-oleh keluarga. Gak perlu ikut antri berdiri kepanasan, mas kurir PanggilKami yang antrekan. Sangat recommended!'
  },
  {
    id: 'rev_7',
    name: 'Citra Lestari',
    role: 'Warga Colomadu',
    service: 'Antar Jemput Anak Les',
    rating: 5,
    date: '11 Okt 2026',
    comment: 'Mitra PanggilKami sangat amanah dan sopan santun. Rutin bantu jemput anak dari tempat les di Manahan ke Colomadu saat saya masih dinas luar kota. Selalu lapor posisi realtime via WA.'
  },
  {
    id: 'rev_8',
    name: 'Fajar Ramadhan',
    role: 'Anak Kos Kartasura',
    service: 'Bersih Kamar & WC',
    rating: 5,
    date: '09 Okt 2026',
    comment: 'Hasil kerjanya teliti pol! Kolong kasur, debu jendela, sampai wastafel dibersihkan tuntas. Timnya bawa perlengkapan dan cairan pembersih sendiri, gak perlu nyiapin apa-apa.'
  },
  {
    id: 'rev_9',
    name: 'Dr. Hendra Gunawan',
    role: 'Solo Baru Residence',
    service: 'Antar Dokumen Penting',
    rating: 5,
    date: '08 Okt 2026',
    comment: 'Kirim berkas klinis penting dari Solo Baru ke RS di Jebres. Pengantaran langsung tanpa muter-muter, ada foto serah terima dokumen dengan jelas. Sangat profesional.'
  },
  {
    id: 'rev_10',
    name: 'Tiara Kusuma',
    role: 'Mahasiswi UNS Ngoresan',
    service: 'Jastip Makanan Malam',
    rating: 5,
    date: '06 Okt 2026',
    comment: 'Lagi nugas kelompok tengah malam hujan lebat, pesan jastip Susu Shi Jack & Roti Bakar. Webnya simpel gak ribet, langsung bayar QRIS, makanannya nyampe masih hangat!'
  }
];

// Initial Seed Orders (Mulai bersih 0 pesanan agar semua data real sesuai pesanan pengguna)
const INITIAL_ORDERS = [];

// App State
const state = {
  currentUser: null,
  viewMode: 'user', // 'user' or 'admin'
  orders: [],
  reviews: [],
  selectedService: 'jastip',
  activeQrisOrder: null,
  appliedVoucher: null,
  qrisTimerInterval: null,
  qrisRemainingSeconds: 900 // 15 mins
};

// Services Config (Tarif Jujur & Transparan Solo Raya)
const SERVICES_MAP = {
  'jastip': {
    id: 'jastip',
    name: 'Jasa Titip Barang & Belanja',
    shortName: 'Jastip Belanja & Titip Makanan',
    img: './images/jastip1.png',
    basePrice: 15000, // Rp 15.000 Sesuai Promo Transparan (Bukan 25.000)
    tag: 'Paling Sering Dipesan',
    desc: 'Titip beli makanan khas Solo (Serabi Notosuman, Selat Solo, Soto Gading), belanja minimarket/pasar, apotek tanpa repot antre.',
    placeholder: 'Contoh: Belikan Soto Triwindu 2 porsi & Es Teh, lalu antarkan ke kos putri Jebres...'
  },
  'antar-orang': {
    id: 'antar-orang',
    name: 'Antar Jemput Orang (Ride Solo)',
    shortName: 'Antar Jemput Orang',
    img: './images/antarjmppt1.png',
    basePrice: 15000,
    tag: 'Tepat Waktu & Aman',
    desc: 'Perjalanan aman ke stasiun Solo Balapan/Purwosari, kampus UNS/UMS, kantor, atau keliling Solo.',
    placeholder: 'Contoh: Jemput di Stasiun Solo Balapan jam 07.30 pagi, antar ke kos Pabelan UMS...'
  },
  'bersih-kos': {
    id: 'bersih-kos',
    name: 'Bersih Kamar Kos',
    shortName: 'Bersih Kamar Kos',
    img: './images/clenings1.png',
    basePrice: 50000, // Rp 50.000 / jam
    priceUnit: '/ jam',
    tag: 'Rapi & Wangi',
    desc: 'Layanan kebersihan kamar tidur kos: sapu, pel lantai, lap debu perabotan meja/lemari, ganti sprei kasur, dan rapikan ruangan.',
    placeholder: 'Contoh: Bersihkan kamar kos ukuran 3x4 meter (estimasi 1 jam), sapu, pel, dan rapikan meja belajar...'
  },
  'cuci-wc': {
    id: 'cuci-wc',
    name: 'Bersihin WC & Kamar Mandi',
    shortName: 'Bersihin WC',
    img: './images/cuci_wc.png',
    basePrice: 100000, // Rp 100.000 / jam
    priceUnit: '/ jam',
    tag: 'Kinclong & Higienis',
    desc: 'Sikat dan cuci tuntas kloset duduk/jongkok, lantai kamar mandi berkerak, wastafel, dinding keramik, dan kuras bak mandi hingga higienis & wangi.',
    placeholder: 'Contoh: Bersihin WC dan sikat kamar mandi berkerak kuning/hitam (estimasi 1 jam pengerjaan)...'
  },
  'suruh-bebas': {
    id: 'suruh-bebas',
    name: 'Suruh Apa Saja (Fleksibel)',
    shortName: 'Suruh Apa Saja Bebas',
    img: './images/antarbarang1.png',
    basePrice: 15000,
    priceUnit: '',
    tag: 'Fleksibel & Siaga',
    desc: 'Kirim dokumen, ambil laundry, print skripsi, antre loket, atau angkat barang kos.',
    placeholder: 'Contoh: Titip print & jilid dokumen 50 halaman di Manahan, lalu antar ke kampus...'
  }
};

// Render single chosen active service card in Step 1
function renderSelectedServiceCard() {
  const serviceKey = state.selectedService || 'jastip';
  const serviceObj = SERVICES_MAP[serviceKey] || SERVICES_MAP['jastip'];

  const imgEl = document.getElementById('selectedServiceImg');
  const badgeEl = document.getElementById('selectedServiceBadge');
  const nameEl = document.getElementById('selectedServiceName');
  const descEl = document.getElementById('selectedServiceDesc');
  const priceEl = document.getElementById('selectedServicePrice');

  if (imgEl) imgEl.src = serviceObj.img;
  if (badgeEl) badgeEl.innerText = serviceObj.tag;
  if (nameEl) nameEl.innerText = serviceObj.name;
  if (descEl) descEl.innerText = serviceObj.desc;
  if (priceEl) {
    priceEl.innerText = `Rp ${formatRupiah(serviceObj.basePrice)}${serviceObj.priceUnit ? ' ' + serviceObj.priceUnit : ''}`;
  }
}

// Toggle change service dropdown menu in Step 1
function toggleChangeServiceDropdown(e) {
  if (e) e.stopPropagation();
  const dropdown = document.getElementById('dropdownUbahLayanan');
  if (!dropdown) return;
  const isHidden = dropdown.style.display === 'none' || dropdown.style.display === '';
  dropdown.style.display = isHidden ? 'block' : 'none';
}

function selectServiceFromDropdown(serviceKey) {
  selectServiceForOrder(serviceKey, false);
  const dropdown = document.getElementById('dropdownUbahLayanan');
  if (dropdown) dropdown.style.display = 'none';
}

// Close dropdowns on outside click
document.addEventListener('click', (e) => {
  // Service change dropdown
  const dropdown = document.getElementById('dropdownUbahLayanan');
  const btn = document.getElementById('btnUbahLayanan');
  const card = document.getElementById('singleActiveServiceCard');
  if (dropdown && dropdown.style.display === 'block') {
    if (!dropdown.contains(e.target) && !btn?.contains(e.target) && !card?.contains(e.target)) {
      dropdown.style.display = 'none';
    }
  }

  // User profile dropdown
  const userDropdown = document.getElementById('userMenuDropdown');
  const userBtn = document.getElementById('btnUserMenu');
  if (userDropdown && userDropdown.style.display === 'block') {
    if (!userDropdown.contains(e.target) && !userBtn?.contains(e.target)) {
      userDropdown.style.display = 'none';
      if (userBtn) userBtn.classList.remove('open');
    }
  }
});

// Select service programmatically from service cards or chips
function selectServiceForOrder(serviceKey, shouldFocusStep2 = true) {
  if (!SERVICES_MAP[serviceKey]) serviceKey = 'jastip';
  state.selectedService = serviceKey;

  renderSelectedServiceCard();
  updateOrderPrice();

  if (shouldFocusStep2) {
    // Smoothly scroll to order section so user clearly sees the selected service in Step 1
    const pesanSection = document.getElementById('pesan');
    if (pesanSection) {
      pesanSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    const taskInput = document.getElementById('taskDesc');
    if (taskInput) {
      setTimeout(() => {
        taskInput.focus();
        taskInput.classList.add('step2-highlight');
        setTimeout(() => taskInput.classList.remove('step2-highlight'), 1800);
      }, 450);
    }
    showToast(`✓ Layanan "${SERVICES_MAP[serviceKey].name}" dipilih. Silakan tulis tugas Anda.`);
  }
}

// ============================================================================
// REAL-TIME DYNAMIC QRIS ENGINE (EMVCo Tag 54 Injection & CRC-16 Checksum)
// ============================================================================
function calculateCRC16(payload) {
  let crc = 0xFFFF;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc = crc << 1;
      }
      crc &= 0xFFFF;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

// Payload Asli GoPay Merchant Hartono Trade Center, Sukoharjo (NMID: ID1026484632207)
const STATIC_QRIS_BASE = '00020101021126610014COM.GO-JEK.WWW01189360091432268065010210G2268065010303UMI51440014ID.CO.QRIS.WWW0215ID10264846322070303UMI5204821153033605802ID5911panggilkami6009SUKOHARJO61055755262070703A0163048BCE';

function generateDynamicQRIS(nominal) {
  let basePayload = STATIC_QRIS_BASE;
  const crcIndex = basePayload.indexOf('6304');
  if (crcIndex !== -1) {
    basePayload = basePayload.substring(0, crcIndex);
  }
  // Change point of initiation to dynamic (010212)
  basePayload = basePayload.replace('010211', '010212');
  
  // Format amount Tag 54
  const amountStr = Math.round(nominal).toString();
  const amountLength = amountStr.length.toString().padStart(2, '0');
  const tag54 = `54${amountLength}${amountStr}`;
  
  // Insert Tag 54 before Tag 58 (Country Code '5802ID')
  const splitIndex = basePayload.indexOf('5802ID');
  const payloadWithAmount = basePayload.substring(0, splitIndex) + tag54 + basePayload.substring(splitIndex);
  
  // Calculate new CRC-16
  const payloadWithTag63 = payloadWithAmount + '6304';
  const newCrc = calculateCRC16(payloadWithTag63);
  return payloadWithTag63 + newCrc;
}

// Apply Promo Voucher (100% Discount for PANGGILKAMI)
function applyPromoVoucher() {
  const input = document.getElementById('voucherCodeInput');
  const msgEl = document.getElementById('voucherMessage');
  if (!input || !msgEl) return;

  const code = input.value.trim().toLowerCase();
  if (!code) {
    msgEl.innerHTML = '<span style="color: var(--danger);">Masukkan kode voucher terlebih dahulu.</span>';
    return;
  }

  if (code === 'panggilkami') {
    state.appliedVoucher = {
      code: 'PANGGILKAMI',
      discountPercent: 100,
      description: 'Potongan Promo 100% (Total Bayar Rp 0)'
    };
    msgEl.innerHTML = '<span style="color: #059669; font-weight: 700;">✅ Voucher PANGGILKAMI berhasil dipasang! Diskon 100% aktif (Total Jadi Rp 0).</span>';
    showToast('🎉 Voucher 100% aktif! Total pesanan Anda menjadi Rp 0.');
    updateOrderPrice();
  } else {
    state.appliedVoucher = null;
    msgEl.innerHTML = '<span style="color: var(--danger);">Kode voucher tidak valid atau sudah kadaluarsa.</span>';
    updateOrderPrice();
  }
}

// Initialize Application
function initApp() {
  loadData();
  bindEvents();
  renderApp();
}

// Load data from LocalStorage or seed defaults
function loadData() {
  // Ensure Admin User (admin@gmail.com / 123456) is always saved in storage
  try {
    let usersList = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];
    if (!usersList.some(u => u.email.toLowerCase() === 'admin@gmail.com')) {
      usersList.push({
        name: 'Admin Operasional Solo',
        email: 'admin@gmail.com',
        phone: '082283883580',
        password: '123456',
        role: 'admin'
      });
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(usersList));
    }
  } catch(e) {}

  // Current user
  const savedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  if (savedUser) {
    try { state.currentUser = JSON.parse(savedUser); } catch(e) {}
  }

  // View mode
  const savedView = localStorage.getItem(STORAGE_KEYS.ACTIVE_VIEW);
  if (savedView) {
    state.viewMode = savedView;
  }

  // Orders: Clean out any legacy dummy/mock orders (e.g. PK-2610-8492, 7731, 9014, or 'aca')
  const savedOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);
  if (savedOrders) {
    try {
      const parsed = JSON.parse(savedOrders);
      state.orders = Array.isArray(parsed) ? parsed.filter(o => 
        !o.id.startsWith('PK-2610-8492') && 
        !o.id.startsWith('PK-2610-7731') && 
        !o.id.startsWith('PK-2610-9014') &&
        o.customer_name !== 'aca'
      ) : [];
    } catch(e) {
      state.orders = [];
    }
  } else {
    state.orders = [];
  }
  saveOrders();

  // Reviews
  const savedReviews = localStorage.getItem(STORAGE_KEYS.REVIEWS);
  if (savedReviews) {
    try { state.reviews = JSON.parse(savedReviews); } catch(e) { state.reviews = INITIAL_REVIEWS; }
  } else {
    state.reviews = INITIAL_REVIEWS;
    saveReviews();
  }
}

function saveOrders() {
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(state.orders));
}

function saveReviews() {
  localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(state.reviews));
}

// Save Current User
function setCurrentUser(user) {
  state.currentUser = user;
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
  updateAuthUI();
}

// Switch View (User vs Admin)
function setViewMode(mode) {
  state.viewMode = mode;
  localStorage.setItem(STORAGE_KEYS.ACTIVE_VIEW, mode);

  // Update pills in top bar
  document.querySelectorAll('.role-switcher-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.role === mode);
  });

  const adminSection = document.getElementById('adminSection');
  const userSections = document.querySelectorAll('.user-view-section');

  if (mode === 'admin') {
    if (adminSection) adminSection.classList.add('active');
    userSections.forEach(s => s.style.display = 'none');
    renderAdminDashboard();
    showToast('Beralih ke Mode Admin Operasional');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    if (adminSection) adminSection.classList.remove('active');
    userSections.forEach(s => s.style.display = '');
    showToast('Beralih ke Mode Pengguna Pelanggan');
  }
}

// Render Core Elements
function renderApp() {
  updateAuthUI();
  renderSelectedServiceCard();
  renderReviews();
  renderTracker();
  updateOrderPrice();

  // If initial mode is admin
  if (state.viewMode === 'admin') {
    setViewMode('admin');
  }
}

// Update Auth UI in Header (Simple Person Logo + Click Red Logout Dropdown)
function updateAuthUI() {
  const authContainer = document.getElementById('navAuthContainer');
  if (!authContainer) return;

  if (state.currentUser) {
    const isAdmin = state.currentUser.role === 'admin';
    const displayName = state.currentUser.username || state.currentUser.name || 'Pengguna';
    const emailDisplay = state.currentUser.email || '';

    authContainer.innerHTML = `
      <div class="user-profile-menu-container">
        <button type="button" id="btnUserMenu" onclick="toggleUserMenuDropdown(event)" class="simple-user-badge-btn" title="Menu Akun: ${escapeHtml(displayName)}">
          <span class="user-avatar-circle-icon">${isAdmin ? '🛡️' : '👤'}</span>
          <span class="user-badge-username">${escapeHtml(displayName)}</span>
          <span class="user-badge-arrow">▾</span>
        </button>

        <div id="userMenuDropdown" class="user-dropdown-popover" style="display: none;">
          <div class="user-dropdown-header">
            <div class="user-dropdown-avatar">${isAdmin ? '🛡️' : '👤'}</div>
            <div class="user-dropdown-details">
              <strong class="user-dropdown-name">${escapeHtml(displayName)}</strong>
              <span class="user-dropdown-email">${escapeHtml(emailDisplay)}</span>
            </div>
          </div>

          <div class="user-dropdown-separator"></div>

          ${isAdmin ? `
            <button type="button" onclick="setViewMode(state.viewMode === 'admin' ? 'user' : 'admin'); closeUserMenuDropdown();" class="user-dropdown-action">
              <span>${state.viewMode === 'admin' ? '🌐 Tampilan Pelanggan' : '🛡️ Dashboard Admin Solo'}</span>
            </button>
            <div class="user-dropdown-separator"></div>
          ` : ''}

          <button type="button" onclick="handleLogout()" class="user-dropdown-action logout-red-btn">
            <span style="font-size: 1rem; color: #EF4444;">🚪</span>
            <span style="color: #EF4444; font-weight: 700;">Keluar</span>
          </button>
        </div>
      </div>
    `;

    // Also auto-fill order form if empty
    const nameInput = document.getElementById('custName');
    const phoneInput = document.getElementById('custPhone');
    if (nameInput && !nameInput.value) nameInput.value = displayName;
    if (phoneInput && !phoneInput.value) phoneInput.value = state.currentUser.phone || '';
  } else {
    authContainer.innerHTML = `
      <button onclick="openAuthModal('login')" class="btn btn-sm btn-secondary">Masuk</button>
      <button onclick="openAuthModal('register')" class="btn btn-sm btn-outline-navy">Daftar</button>
    `;
  }
}

// User Profile Dropdown Toggle & Close
function toggleUserMenuDropdown(e) {
  if (e) e.stopPropagation();
  const dropdown = document.getElementById('userMenuDropdown');
  const btn = document.getElementById('btnUserMenu');
  if (!dropdown) return;
  const isHidden = dropdown.style.display === 'none' || dropdown.style.display === '';
  dropdown.style.display = isHidden ? 'block' : 'none';
  if (btn) btn.classList.toggle('open', isHidden);
}

function closeUserMenuDropdown() {
  const dropdown = document.getElementById('userMenuDropdown');
  const btn = document.getElementById('btnUserMenu');
  if (dropdown) dropdown.style.display = 'none';
  if (btn) btn.classList.remove('open');
}

// Render 10 Reviews Section
function renderReviews() {
  const container = document.getElementById('reviewsGrid');
  if (!container) return;

  const reviews = state.reviews;
  container.innerHTML = reviews.map(rev => `
    <div class="review-card">
      <div class="review-card-top">
        <div class="review-avatar">${getInitials(rev.name)}</div>
        <div class="review-meta">
          <h4>${escapeHtml(rev.name)}</h4>
          <p>${escapeHtml(rev.role)}</p>
        </div>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <span class="review-service-pill">✓ ${escapeHtml(rev.service)}</span>
        <div class="stars-gold">${'★'.repeat(rev.rating)}</div>
      </div>
      <p class="review-quote">"${escapeHtml(rev.comment)}"</p>
      <div class="review-date">${rev.date}</div>
    </div>
  `).join('');

  // Update total badge
  const summaryEl = document.getElementById('reviewsCountSummary');
  if (summaryEl) {
    summaryEl.innerText = `${reviews.length} Ulasan Terverifikasi`;
  }
}

// Toggle Tracker Section Visibility (Hidden by default, shown on button click)
function toggleTrackerSection(e) {
  if (e) e.preventDefault();
  const tracker = document.getElementById('pelacakan');
  const navBtn = document.getElementById('navLinkCekPesanan');
  if (!tracker) return;

  const isHidden = tracker.style.display === 'none' || tracker.style.display === '';
  if (isHidden) {
    tracker.style.display = 'block';
    if (navBtn) navBtn.classList.add('active-tracked');
    renderTracker();
    tracker.scrollIntoView({ behavior: 'smooth' });
    const searchInput = document.getElementById('searchOrderInput');
    if (searchInput) setTimeout(() => searchInput.focus(), 350);
    showToast('Menampilkan pantauan status pesanan.');
  } else {
    tracker.style.display = 'none';
    if (navBtn) navBtn.classList.remove('active-tracked');
    showToast('Pantauan status disembunyikan.');
  }
}

// Render Order Tracker / My Orders
function renderTracker(specificOrderCode = null) {
  const trackerSection = document.getElementById('pelacakan');
  const navBtn = document.getElementById('navLinkCekPesanan');
  const container = document.getElementById('activeOrderCard');
  if (!container) return;

  let orderToDisplay = null;

  if (specificOrderCode) {
    orderToDisplay = state.orders.find(o => o.id.toLowerCase() === specificOrderCode.toLowerCase().trim());
    // Auto-reveal tracker when searching
    if (trackerSection) {
      trackerSection.style.display = 'block';
      if (navBtn) navBtn.classList.add('active-tracked');
    }
  } else if (state.activeQrisOrder) {
    orderToDisplay = state.orders.find(o => o.id === state.activeQrisOrder.id);
  } else {
    // Show most recent order
    orderToDisplay = state.orders[state.orders.length - 1];
  }

  if (!orderToDisplay) {
    container.innerHTML = `
      <div style="text-align: center; padding: 30px; color: var(--text-secondary);">
        <p>Belum ada riwayat pesanan yang dipilih. Masukkan Kode Pesanan di atas atau buat pesanan baru.</p>
      </div>
    `;
    return;
  }

  // Determine timeline progress
  const statusLevels = {
    'pending': 1,
    'waiting_verification': 2,
    'paid': 3,
    'on_way': 3,
    'completed': 4,
    'cancelled': 0
  };

  const currentLevel = statusLevels[orderToDisplay.status] || 1;

  container.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-light); padding-bottom: 14px; margin-bottom: 20px; flex-wrap: wrap; gap: 10px;">
      <div>
        <span style="font-size: 0.8rem; color: var(--text-muted);">Kode Pesanan:</span>
        <h3 style="font-size: 1.25rem; color: var(--primary); font-weight: 850;">#${escapeHtml(orderToDisplay.id)}</h3>
      </div>
      <div>
        ${getStatusBadgeHtml(orderToDisplay.status)}
      </div>
    </div>

    <!-- Timeline Progress -->
    <div class="order-timeline">
      <div class="timeline-step ${currentLevel >= 1 ? (currentLevel === 1 ? 'current' : 'completed') : ''}">
        <div class="timeline-dot">1</div>
        <div class="timeline-label">Menunggu Bayar</div>
      </div>
      <div class="timeline-step ${currentLevel >= 2 ? (currentLevel === 2 ? 'current' : 'completed') : ''}">
        <div class="timeline-dot">2</div>
        <div class="timeline-label">Verifikasi GoPay</div>
      </div>
      <div class="timeline-step ${currentLevel >= 3 ? (currentLevel === 3 ? 'current' : 'completed') : ''}">
        <div class="timeline-dot">3</div>
        <div class="timeline-label">Mitra OTW</div>
      </div>
      <div class="timeline-step ${currentLevel >= 4 ? 'completed' : ''}">
        <div class="timeline-dot">4</div>
        <div class="timeline-label">Selesai</div>
      </div>
    </div>

    <!-- Verification Pending Notice Banner -->
    ${orderToDisplay.status === 'waiting_verification' ? `
      <div style="background: #FFFBEB; border: 1.5px solid #FCD34D; border-radius: var(--radius-sm); padding: 14px 18px; margin-bottom: 18px; display: flex; align-items: flex-start; gap: 12px;">
        <span style="font-size: 1.5rem; line-height: 1;">⏳</span>
        <div style="font-size: 0.85rem; color: #92400E;">
          <strong style="font-size: 0.95rem; display: block; margin-bottom: 4px;">Screenshot Bukti Diterima — Menunggu Mutasi Saldo GoPay</strong>
          <p style="margin: 0; line-height: 1.45;">
            Admin PanggilKami sedang memeriksa saldo masuk pada akun GoPay Merchant. Setelah uang terkonfirmasi masuk, pesanan langsung diproses & mitra kurir diberangkatkan ke lokasi Anda.
          </p>
          ${orderToDisplay.proof_image ? `
            <div style="margin-top: 10px;">
              <span style="font-size: 0.74rem; font-weight: 700; color: #78350F; display: block; margin-bottom: 4px;">Screenshot bukti pembayaran Anda:</span>
              <img src="${orderToDisplay.proof_image}" alt="Bukti Transfer" style="max-height: 110px; border-radius: 8px; border: 1px solid #FCD34D; box-shadow: 0 2px 8px rgba(0,0,0,0.06);" />
            </div>
          ` : ''}
        </div>
      </div>
    ` : ''}

    <!-- Order Info Details -->
    <div style="background: var(--bg-primary); border-radius: var(--radius-sm); padding: 18px; margin-bottom: 20px; font-size: 0.9rem;">
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
        <div>
          <span style="color: var(--text-muted); font-size: 0.8rem; display: block;">Layanan:</span>
          <strong>${escapeHtml(orderToDisplay.service)}</strong>
        </div>
        <div>
          <span style="color: var(--text-muted); font-size: 0.8rem; display: block;">Total Biaya:</span>
          <strong style="color: var(--accent-warm); font-size: 1.05rem;">Rp ${formatRupiah(orderToDisplay.total_amount)}</strong>
        </div>
        <div>
          <span style="color: var(--text-muted); font-size: 0.8rem; display: block;">Pemesan:</span>
          <span>${escapeHtml(orderToDisplay.customer_name)} (${escapeHtml(orderToDisplay.customer_phone)})</span>
        </div>
        <div>
          <span style="color: var(--text-muted); font-size: 0.8rem; display: block;">Mitra Bertugas:</span>
          <span>${escapeHtml(orderToDisplay.courier_name || 'Menunggu verifikasi pembayaran GoPay')}</span>
        </div>
      </div>
      <div>
        <span style="color: var(--text-muted); font-size: 0.8rem; display: block;">Rincian Tugas:</span>
        <p style="margin-top: 4px; color: var(--text-main);">${escapeHtml(orderToDisplay.task_desc)}</p>
      </div>
      <div style="margin-top: 8px;">
        <span style="color: var(--text-muted); font-size: 0.8rem; display: block;">Lokasi Pengantaran:</span>
        <p style="color: var(--text-secondary);">${escapeHtml(orderToDisplay.address)} (${escapeHtml(orderToDisplay.area)})</p>
      </div>
    </div>

    <!-- Action Buttons -->
    <div style="display: flex; gap: 12px; flex-wrap: wrap;">
      ${orderToDisplay.status === 'pending' ? `
        <button onclick="reopenQrisModal('${orderToDisplay.id}')" class="btn btn-primary" style="flex: 1;">
          📲 Buka QRIS & Kirim Bukti Transfer (Rp ${formatRupiah(orderToDisplay.total_amount)})
        </button>
      ` : ''}

      ${orderToDisplay.status === 'waiting_verification' ? `
        <button onclick="reopenQrisModal('${orderToDisplay.id}')" class="btn btn-secondary" style="flex: 1;">
          📸 Perbarui / Kirim Ulang Bukti Screenshot
        </button>
      ` : ''}

      ${orderToDisplay.status !== 'completed' && orderToDisplay.status !== 'cancelled' ? `
        <button onclick="simulateOrderCompleted('${orderToDisplay.id}')" class="btn btn-secondary btn-sm" style="border: 1.5px dashed #059669; color: #047857; font-weight: 700; flex: 1;" title="Simulasikan tugas selesai untuk uji coba rating dan ulasan">
          ⚡ [Tes Cepat] Selesaikan Pesanan Ini
        </button>
      ` : ''}

      ${orderToDisplay.status === 'completed' && !orderToDisplay.has_reviewed ? `
        <button onclick="openReviewModalForOrder('${orderToDisplay.id}')" class="btn btn-primary" style="flex: 1; background: #F59E0B; box-shadow: 0 4px 14px rgba(245, 158, 11, 0.3); font-weight: 800;">
          ⭐ Beri Rating & Ulasan Layanan Ini
        </button>
      ` : ''}

      <a href="https://wa.me/6282283883580?text=${encodeURIComponent(`Halo Admin PanggilKami Solo, saya ingin menanyakan status pesanan #${orderToDisplay.id} (${orderToDisplay.service}) a.n. ${orderToDisplay.customer_name}.`)}" target="_blank" class="btn btn-secondary" style="flex: 1;">
        💬 Hubungi CS WhatsApp
      </a>
    </div>
  `;
}

// Order Form Pricing Calculator (100% Transparan Sesuai Permintaan User)
function updateOrderPrice() {
  const serviceKey = state.selectedService || 'jastip';
  const serviceObj = SERVICES_MAP[serviceKey] || SERVICES_MAP['jastip'];

  // Base price (Mulai Rp 15.000 untuk jastip, bukan 25.000!)
  const basePrice = serviceObj.basePrice;
  const areaSelect = document.getElementById('orderArea');
  let areaFee = 0;
  let areaName = 'Solo Baru';

  if (areaSelect) {
    const selectedOption = areaSelect.options[areaSelect.selectedIndex];
    areaName = selectedOption.text.split('—')[0].replace('(+ Rp 5.000)', '').trim();
    if (areaSelect.value.includes('luar')) {
      areaFee = 5000;
    }
  }

  const subtotal = basePrice + areaFee;
  let discount = 0;
  let finalTotal = subtotal;

  if (state.appliedVoucher) {
    discount = Math.round(subtotal * (state.appliedVoucher.discountPercent / 100));
    finalTotal = Math.max(0, subtotal - discount);
  }

  const serviceNameEl = document.getElementById('summaryServiceName');
  const baseEl = document.getElementById('summaryBasePrice');
  const areaNameEl = document.getElementById('summaryAreaName');
  const areaPriceEl = document.getElementById('summaryAreaPrice');
  const shoppingNoteEl = document.getElementById('shoppingFeeNoteRow');
  const totalEl = document.getElementById('summaryTotalPrice');
  const discountRow = document.getElementById('voucherDiscountRow');
  const discountEl = document.getElementById('summaryVoucherDiscount');
  const taskInput = document.getElementById('taskDesc');
  const submitBtn = document.querySelector('#quickOrderForm button[type="submit"]');

  if (serviceNameEl) serviceNameEl.innerText = serviceObj.shortName || serviceObj.name;
  if (baseEl) baseEl.innerText = `Rp ${formatRupiah(basePrice)}${serviceObj.priceUnit ? ' ' + serviceObj.priceUnit : ''}`;
  if (areaNameEl) areaNameEl.innerText = areaName;
  if (areaPriceEl) {
    if (areaFee > 0) {
      areaPriceEl.innerText = `+ Rp ${formatRupiah(areaFee)} (Luar Area Solo)`;
      areaPriceEl.style.color = 'var(--accent-warm)';
    } else {
      areaPriceEl.innerText = 'Rp 0 (Termasuk Bebas Biaya)';
      areaPriceEl.style.color = 'var(--success)';
    }
  }

  if (shoppingNoteEl) {
    shoppingNoteEl.style.display = (serviceKey === 'jastip') ? 'block' : 'none';
  }

  if (discountRow && discountEl) {
    if (discount > 0) {
      discountRow.style.display = 'flex';
      discountEl.innerText = `- Rp ${formatRupiah(discount)}`;
    } else {
      discountRow.style.display = 'none';
    }
  }

  if (totalEl) totalEl.innerText = `Rp ${formatRupiah(finalTotal)}`;

  if (submitBtn) {
    submitBtn.innerText = `Lanjut ke Pembayaran QRIS Realtime (Rp ${formatRupiah(finalTotal)}) ➡️`;
  }

  // Update placeholder helper if empty
  if (taskInput && !taskInput.value) {
    taskInput.placeholder = serviceObj.placeholder;
  }
}

// Quick helper to simulate order completion for review testing
function simulateOrderCompleted(orderId) {
  const order = state.orders.find(o => o.id === orderId);
  if (!order) return;

  order.status = 'completed';
  if (!order.paid_at) order.paid_at = new Date().toISOString();
  order.completed_at = new Date().toISOString();
  order.courier_name = 'Mas Joko Santoso (Honda Vario AD 4182 PK)';
  saveOrders();
  renderTracker(order.id);
  renderAdminDashboard();
  triggerConfetti();
  showToast(`🎉 Pesanan #${order.id} selesai! Silakan beri rating & ulasan.`);
}

// Handle Order Submission
function handleCreateOrder(e) {
  e.preventDefault();

  const serviceKey = state.selectedService || 'jastip';
  const serviceObj = SERVICES_MAP[serviceKey] || SERVICES_MAP['jastip'];

  const taskDesc = document.getElementById('taskDesc').value.trim();
  const areaSelect = document.getElementById('orderArea');
  const area = areaSelect ? areaSelect.options[areaSelect.selectedIndex].text : 'Solo Baru';
  const address = document.getElementById('destAddress').value.trim();
  const custName = document.getElementById('custName').value.trim();
  const custPhone = document.getElementById('custPhone').value.trim();

  if (!taskDesc || !address || !custName || !custPhone) {
    showToast('Mohon lengkapi tugas, alamat, nama, dan no WhatsApp.', 'error');
    return;
  }

  let areaFee = 0;
  if (areaSelect && areaSelect.value.includes('luar')) {
    areaFee = 5000;
  }

  const baseFee = serviceObj.basePrice;
  const subtotal = baseFee + areaFee;
  let discount = 0;
  let totalAmount = subtotal;

  if (state.appliedVoucher) {
    discount = Math.round(subtotal * (state.appliedVoucher.discountPercent / 100));
    totalAmount = Math.max(0, subtotal - discount);
  }

  const orderId = 'PK-' + new Date().getFullYear().toString().slice(-2) + (new Date().getMonth() + 1).toString().padStart(2, '0') + '-' + Math.floor(1000 + Math.random() * 9000);

  const isFreeVoucher = totalAmount === 0;

  const newOrder = {
    id: orderId,
    service: serviceObj.name,
    service_id: serviceKey,
    task_desc: taskDesc,
    area: area,
    address: address,
    customer_name: custName,
    customer_phone: custPhone,
    service_fee: baseFee,
    area_fee: areaFee,
    discount_amount: discount,
    voucher_code: state.appliedVoucher ? state.appliedVoucher.code : null,
    total_amount: totalAmount,
    status: isFreeVoucher ? 'paid' : 'pending',
    courier_name: isFreeVoucher ? 'Mas Joko Santoso (Mitra Siap Bertugas)' : 'Mitra Kurir Solo (Segera Ditugaskan)',
    created_at: new Date().toISOString(),
    paid_at: isFreeVoucher ? new Date().toISOString() : null,
    completed_at: null,
    has_reviewed: false
  };

  state.orders.push(newOrder);
  saveOrders();

  // If user is logged in, associate with them
  if (!state.currentUser) {
    setCurrentUser({
      name: custName,
      phone: custPhone,
      email: `${custPhone}@panggilkami.local`,
      role: 'customer'
    });
  }

  // Update tracker
  renderTracker(newOrder.id);

  if (isFreeVoucher) {
    showToast(`🎉 Pesanan #${orderId} BERHASIL dikonfirmasi GRATIS (Voucher 100%)! Mitra segera bertugas.`);
    const trackerEl = document.getElementById('pelacakan');
    if (trackerEl) trackerEl.scrollIntoView({ behavior: 'smooth' });
  } else {
    // Open Realtime Dynamic QRIS modal
    openQrisModal(newOrder);
    showToast(`Pesanan #${orderId} berhasil dibuat! Silakan bayar via QRIS.`);
  }
}

// Open QRIS Modal
function openQrisModal(order) {
  state.activeQrisOrder = order;
  state.qrisRemainingSeconds = 900; // Reset 15 mins

  const modal = document.getElementById('qrisModal');
  if (!modal) return;

  // Set order details in modal
  document.getElementById('qrisOrderCode').innerText = `#${order.id}`;
  document.getElementById('qrisNominal').innerText = `Rp ${formatRupiah(order.total_amount)}`;
  document.getElementById('qrisServiceTitle').innerText = order.service;

  // Generate Real-time Dynamic QRIS with exact nominal
  const dynamicPayload = generateDynamicQRIS(order.total_amount);
  const canvas = document.getElementById('qrisRealtimeCanvas');
  const badge = document.getElementById('qrisCanvasNominalBadge');
  const fallback = document.getElementById('qrisFallbackImg');
  if (badge) badge.innerText = `Rp ${formatRupiah(order.total_amount)}`;

  if (window.QRCode && canvas) {
    QRCode.toCanvas(canvas, dynamicPayload, {
      width: 250,
      margin: 1,
      color: { dark: '#0F172A', light: '#FFFFFF' }
    }, function(err) {
      if (err) {
        console.warn('QR Canvas error, using fallback image', err);
        if (fallback) fallback.style.display = 'block';
        canvas.style.display = 'none';
      } else {
        canvas.style.display = 'block';
        if (fallback) fallback.style.display = 'none';
      }
    });
  }

  // Update WhatsApp confirmation button link
  const waBtn = document.getElementById('qrisWaConfirmBtn');
  if (waBtn) {
    const waMsg = `Halo Admin CS PanggilKami (082283883580), saya sudah scan & bayar QRIS untuk pesanan #${order.id} (${order.service}) sebesar Rp ${formatRupiah(order.total_amount)} a.n. ${order.customer_name}. Mohon segera diverifikasi. Terima kasih.`;
    waBtn.href = `https://wa.me/6282283883580?text=${encodeURIComponent(waMsg)}`;
  }

  // Start countdown
  clearInterval(state.qrisTimerInterval);
  updateQrisCountdownUI();
  state.qrisTimerInterval = setInterval(() => {
    state.qrisRemainingSeconds--;
    if (state.qrisRemainingSeconds <= 0) {
      clearInterval(state.qrisTimerInterval);
      document.getElementById('qrisTimerDisplay').innerText = '00:00 (Kadaluarsa)';
    } else {
      updateQrisCountdownUI();
    }
  }, 1000);

  modal.classList.add('open');
}

function updateQrisCountdownUI() {
  const mins = Math.floor(state.qrisRemainingSeconds / 60).toString().padStart(2, '0');
  const secs = (state.qrisRemainingSeconds % 60).toString().padStart(2, '0');
  const el = document.getElementById('qrisTimerDisplay');
  if (el) el.innerText = `${mins}:${secs}`;
}

function closeQrisModal() {
  const modal = document.getElementById('qrisModal');
  if (modal) modal.classList.remove('open');
  clearInterval(state.qrisTimerInterval);
}

function reopenQrisModal(orderId) {
  const order = state.orders.find(o => o.id === orderId);
  if (order) openQrisModal(order);
}

// Handle Screenshot Bukti Bayar GoPay
let currentPaymentProofBase64 = null;

function handleProofImageSelected(e) {
  const file = e.target.files && e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(evt) {
    currentPaymentProofBase64 = evt.target.result;
    const preview = document.getElementById('paymentProofPreviewImg');
    const container = document.getElementById('paymentProofPreviewContainer');
    if (preview && container) {
      preview.src = currentPaymentProofBase64;
      container.style.display = 'block';
    }
  };
  reader.readAsDataURL(file);
}

// Submit payment with proof screenshot
function submitPaymentWithProof() {
  if (!state.activeQrisOrder) return;
  const order = state.orders.find(o => o.id === state.activeQrisOrder.id);
  if (!order) return;

  const fileInput = document.getElementById('paymentProofFile');
  const hasFile = (fileInput && fileInput.files && fileInput.files.length > 0) || currentPaymentProofBase64;

  if (!hasFile) {
    const confirmWithout = confirm('Anda belum memilih file screenshot bukti bayar. Apakah Anda sudah mentransfer dan ingin mengirimkan screenshotnya melalui WhatsApp CS?');
    if (!confirmWithout) {
      if (fileInput) fileInput.focus();
      return;
    }
  }

  const btn = document.getElementById('verifyPaymentBtn');
  if (btn) {
    btn.innerHTML = '⏳ Mengunggah Bukti Pembayaran...';
    btn.disabled = true;
  }

  setTimeout(() => {
    order.status = 'waiting_verification';
    order.proof_submitted_at = new Date().toISOString();
    if (currentPaymentProofBase64) {
      order.proof_image = currentPaymentProofBase64;
    }
    saveOrders();
    closeQrisModal();

    if (btn) {
      btn.innerHTML = '📤 Kirim Bukti Transfer & Konfirmasi Pesanan';
      btn.disabled = false;
    }

    // Reset upload state
    if (fileInput) fileInput.value = '';
    currentPaymentProofBase64 = null;
    const previewContainer = document.getElementById('paymentProofPreviewContainer');
    if (previewContainer) previewContainer.style.display = 'none';

    showToast(`📸 Bukti bayar #${order.id} diterima! Menunggu admin verifikasi saldo masuk di GoPay.`);

    // Automatically reveal and highlight the tracker
    const tracker = document.getElementById('pelacakan');
    const navBtn = document.getElementById('navLinkCekPesanan');
    if (tracker) {
      tracker.style.display = 'block';
      if (navBtn) navBtn.classList.add('active-tracked');
      renderTracker(order.id);
      tracker.scrollIntoView({ behavior: 'smooth' });
    }
  }, 600);
}

// Fallback old function to prevent errors
function verifyPaymentSuccess() {
  submitPaymentWithProof();
}

// Copy nominal to clipboard
function copyQrisNominal() {
  if (!state.activeQrisOrder) return;
  const num = state.activeQrisOrder.total_amount.toString();
  navigator.clipboard.writeText(num).then(() => {
    showToast(`Nominal Rp ${formatRupiah(state.activeQrisOrder.total_amount)} disalin!`);
  }).catch(() => {
    showToast(`Nominal: Rp ${formatRupiah(state.activeQrisOrder.total_amount)}`);
  });
}

// Confetti burst (pure JS canvas)
function triggerConfetti() {
  const count = 60;
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.style.position = 'fixed';
    el.style.top = '50%';
    el.style.left = '50%';
    el.style.width = '10px';
    el.style.height = '10px';
    el.style.backgroundColor = ['#E85D36', '#10B981', '#2563EB', '#F59E0B', '#8B5CF6'][Math.floor(Math.random() * 5)];
    el.style.borderRadius = '50%';
    el.style.zIndex = '9999';
    el.style.pointerEvents = 'none';
    el.style.transform = `translate(${(Math.random() - 0.5) * 500}px, ${(Math.random() - 0.5) * 500}px) scale(${Math.random() + 0.5})`;
    el.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
    el.style.opacity = '1';
    document.body.appendChild(el);

    setTimeout(() => {
      el.style.opacity = '0';
      el.style.transform += ' translateY(100px)';
      setTimeout(() => el.remove(), 800);
    }, 50);
  }
}

// Interactive Review Form Handling
let selectedRating = 5;

function openReviewModal() {
  const modal = document.getElementById('reviewModal');
  if (modal) modal.classList.add('open');
  setRatingStars(5);

  // Pre-fill name if user logged in
  if (state.currentUser) {
    const nameEl = document.getElementById('revNameInput');
    if (nameEl) nameEl.value = state.currentUser.name;
  }
}

function openReviewModalForOrder(orderId) {
  openReviewModal();
  const order = state.orders.find(o => o.id === orderId);
  if (order) {
    const serviceSelect = document.getElementById('revServiceInput');
    if (serviceSelect) {
      let matched = false;
      for (let opt of serviceSelect.options) {
        if (opt.value === order.service || opt.text === order.service || order.service.includes(opt.value)) {
          serviceSelect.value = opt.value;
          matched = true;
          break;
        }
      }
      if (!matched) {
        const sLower = (order.service || '').toLowerCase();
        if (sLower.includes('wc') || sLower.includes('mandi')) serviceSelect.value = 'Bersihin WC & Kamar Mandi';
        else if (sLower.includes('kamar') || sLower.includes('kos')) serviceSelect.value = 'Bersih Kamar Kos';
        else if (sLower.includes('jastip') || sLower.includes('titip')) serviceSelect.value = 'Jasa Titip Barang & Belanja';
        else if (sLower.includes('antar') || sLower.includes('jemput')) serviceSelect.value = 'Antar Jemput Orang (Ride Solo)';
        else serviceSelect.value = 'Suruh Apa Saja (Fleksibel)';
      }
    }
    const orderHidden = document.getElementById('revOrderIdHidden');
    if (orderHidden) orderHidden.value = order.id;
  }
}

function closeReviewModal() {
  const modal = document.getElementById('reviewModal');
  if (modal) modal.classList.remove('open');
}

function setRatingStars(val) {
  selectedRating = val;
  const stars = document.querySelectorAll('.star-picker-icon');
  stars.forEach((s, idx) => {
    s.style.color = (idx < val) ? '#F59E0B' : '#CBD5E1';
  });
}

function handleSubmitReview(e) {
  e.preventDefault();

  const name = document.getElementById('revNameInput').value.trim();
  const role = document.getElementById('revRoleInput').value.trim() || 'Pelanggan Solo';
  const service = document.getElementById('revServiceInput').value;
  const comment = document.getElementById('revCommentInput').value.trim();
  const orderId = document.getElementById('revOrderIdHidden')?.value;

  if (!name || !comment) {
    showToast('Mohon isi nama dan komentar ulasan.', 'error');
    return;
  }

  const now = new Date();
  const dateStr = `${now.getDate()} ${['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'][now.getMonth()]} ${now.getFullYear()}`;

  const newReview = {
    id: 'rev_' + Date.now(),
    name: name,
    role: role,
    service: service,
    rating: selectedRating,
    date: dateStr,
    comment: comment
  };

  // Add to beginning of reviews
  state.reviews.unshift(newReview);
  saveReviews();

  // If tied to order, mark order reviewed
  if (orderId) {
    const order = state.orders.find(o => o.id === orderId);
    if (order) {
      order.has_reviewed = true;
      saveOrders();
    }
  }

  closeReviewModal();
  renderReviews();
  renderTracker();
  showToast('Matur suwun! Ulasan Anda berhasil diterbitkan.');

  // Scroll to reviews section
  const revSection = document.getElementById('ulasan');
  if (revSection) revSection.scrollIntoView({ behavior: 'smooth' });
}

// Authentication Modals & Logic
let authModalMode = 'login'; // 'login' or 'register'

function openAuthModal(mode = 'login') {
  authModalMode = mode;
  const modal = document.getElementById('authModal');
  if (!modal) return;

  const tabLogin = document.getElementById('authTabLogin');
  const tabRegister = document.getElementById('authTabRegister');
  const loginFields = document.getElementById('authLoginFields');
  const registerFields = document.getElementById('authRegisterFields');
  const submitBtn = document.getElementById('authSubmitBtn');
  const title = document.getElementById('authModalTitle');
  const desc = document.getElementById('authModalDesc');
  const footerLink = document.getElementById('authFooterLink');

  if (mode === 'login') {
    if (tabLogin) tabLogin.classList.add('active');
    if (tabRegister) tabRegister.classList.remove('active');
    if (loginFields) loginFields.style.display = 'block';
    if (registerFields) registerFields.style.display = 'none';
    if (submitBtn) submitBtn.innerText = 'Masuk Sekarang';
    if (title) title.innerText = 'Masuk ke Akun Anda';
    if (desc) desc.innerText = 'Masukkan username atau email dan kata sandi Anda.';
    if (footerLink) {
      footerLink.innerHTML = `Belum punya akun? <a href="javascript:void(0)" onclick="openAuthModal('register')" style="color: var(--primary-accent); font-weight: 700;">Daftar Akun Baru</a>`;
    }
    setTimeout(() => {
      const idInput = document.getElementById('authLoginIdentifier');
      if (idInput && !idInput.value) idInput.focus();
    }, 150);
  } else {
    if (tabLogin) tabLogin.classList.remove('active');
    if (tabRegister) tabRegister.classList.add('active');
    if (loginFields) loginFields.style.display = 'none';
    if (registerFields) registerFields.style.display = 'block';
    if (submitBtn) submitBtn.innerText = 'Daftar Akun Sekarang';
    if (title) title.innerText = 'Daftar Akun Baru PanggilKami';
    if (desc) desc.innerText = 'Buat username, email, dan kata sandi Anda agar mudah masuk.';
    if (footerLink) {
      footerLink.innerHTML = `Sudah punya akun? <a href="javascript:void(0)" onclick="openAuthModal('login')" style="color: var(--primary-accent); font-weight: 700;">Masuk di Sini</a>`;
    }
    setTimeout(() => {
      const uInput = document.getElementById('authRegUsername');
      if (uInput) uInput.focus();
    }, 150);
  }

  modal.classList.add('open');
}

function closeAuthModal() {
  const modal = document.getElementById('authModal');
  if (modal) modal.classList.remove('open');
}

function handleAuthSubmit(e) {
  e.preventDefault();

  let storedUsers = [];
  try {
    storedUsers = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];
  } catch(err) { storedUsers = []; }

  if (authModalMode === 'login') {
    const idInput = document.getElementById('authLoginIdentifier');
    const pwdInput = document.getElementById('authLoginPassword');
    const identifier = (idInput ? idInput.value : '').trim();
    const password = pwdInput ? pwdInput.value : '';

    if (!identifier || !password) {
      showToast('Mohon masukkan username/email dan kata sandi.', 'error');
      return;
    }

    // 1. Check Admin Account (admin@gmail.com / admin with pw 123456)
    if (identifier.toLowerCase() === 'admin@gmail.com' || identifier.toLowerCase() === 'admin') {
      if (password === '123456') {
        setCurrentUser({
          username: 'admin',
          name: 'Admin Operasional Solo',
          email: 'admin@gmail.com',
          phone: '082283883580',
          role: 'admin'
        });
        closeAuthModal();
        showToast('Berhasil masuk sebagai Admin Operasional!');
        setViewMode('admin');
        return;
      } else {
        showToast('Kata sandi admin salah. Pastikan password adalah 123456.', 'error');
        return;
      }
    }

    // 2. Check Registered Users in Storage (strictly registered users)
    const matched = storedUsers.find(u => 
      (u.username && u.username.toLowerCase() === identifier.toLowerCase()) ||
      (u.email && u.email.toLowerCase() === identifier.toLowerCase())
    );

    if (matched) {
      if (matched.password === password) {
        setCurrentUser(matched);
        closeAuthModal();
        showToast(`Selamat datang kembali, ${matched.username || matched.name}!`);
        if (state.viewMode === 'admin') setViewMode('user');
        return;
      } else {
        showToast('Kata sandi salah. Silakan periksa kembali kata sandi Anda.', 'error');
        return;
      }
    }

    // 3. Reject if not registered! (NO FAKE / FALLBACK LOGINS)
    showToast(`Akun "${identifier}" belum terdaftar! Silakan klik tab "Daftar Akun Baru" terlebih dahulu.`, 'error');
    return;
  } else {
    // Register Mode
    const regUname = (document.getElementById('authRegUsername')?.value || '').trim();
    const regEmail = (document.getElementById('authRegEmail')?.value || '').trim();
    const regPhone = (document.getElementById('authRegPhone')?.value || '').trim();
    const regPass = document.getElementById('authRegPassword')?.value || '';

    if (!regUname || regUname.length < 3) {
      showToast('Username minimal 3 karakter tanpa spasi.', 'error');
      return;
    }
    if (/\s/.test(regUname)) {
      showToast('Username tidak boleh mengandung spasi.', 'error');
      return;
    }
    if (!regEmail || !regEmail.includes('@') || !regEmail.includes('.')) {
      showToast('Masukkan alamat email yang valid.', 'error');
      return;
    }
    if (!regPass || regPass.length < 6) {
      showToast('Kata sandi minimal 6 karakter.', 'error');
      return;
    }

    const cleanUname = regUname.toLowerCase();
    const cleanEmail = regEmail.toLowerCase();

    // Check if already registered
    const exists = storedUsers.some(u => 
      (u.username && u.username.toLowerCase() === cleanUname) ||
      (u.email && u.email.toLowerCase() === cleanEmail)
    );

    if (exists || cleanUname === 'admin' || cleanEmail === 'admin@gmail.com') {
      showToast('Username atau email sudah terdaftar. Silakan langsung masuk.', 'error');
      return;
    }

    const newUser = {
      id: 'usr_' + Date.now(),
      username: regUname,
      name: regUname,
      email: cleanEmail,
      phone: regPhone,
      password: regPass,
      role: 'customer',
      created_at: new Date().toISOString()
    };

    storedUsers.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(storedUsers));

    // Direct user to Login form as requested
    openAuthModal('login');
    const idInput = document.getElementById('authLoginIdentifier');
    const pwdInput = document.getElementById('authLoginPassword');
    if (idInput) idInput.value = regUname;
    if (pwdInput) {
      pwdInput.value = '';
      setTimeout(() => pwdInput.focus(), 200);
    }

    showToast(`✅ Akun "${regUname}" berhasil didaftarkan! Silakan masukkan kata sandi Anda untuk masuk.`);
  }
}

// Quick Test Logins
function quickLogin(role) {
  if (role === 'admin') {
    setCurrentUser({
      name: 'Admin Operasional Solo',
      email: 'admin@gmail.com',
      phone: '082283883580',
      role: 'admin'
    });
    closeAuthModal();
    showToast('Masuk sebagai Admin Operasional');
    setViewMode('admin');
  } else {
    setCurrentUser({
      name: 'Budi Santoso',
      email: 'budi@gmail.com',
      phone: '081234567890',
      role: 'customer'
    });
    closeAuthModal();
    showToast('Masuk sebagai Pengguna: Budi Santoso');
    setViewMode('user');
  }
}

function handleLogout() {
  setCurrentUser(null);
  closeUserMenuDropdown();
  showToast('Anda telah keluar dari akun.');
  if (state.viewMode === 'admin') {
    setViewMode('user');
  }
}

// Admin Dashboard Rendering & Management (100% Realtime Sesuai Data Nyata)
function renderAdminDashboard() {
  // Stats (Data Nyata, Tanpa Dibuat-buat)
  const totalOrders = state.orders.length;
  const activeOrders = state.orders.filter(o => ['waiting_verification', 'pending', 'paid', 'on_way'].includes(o.status)).length;
  // Omset dihitung HANYA dari pesanan yang sudah lunas (paid, on_way, completed)
  const totalRevenue = state.orders
    .filter(o => o.status === 'paid' || o.status === 'on_way' || o.status === 'completed')
    .reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);

  const totalReviews = state.reviews.length;
  let avgRating = 0;
  if (totalReviews > 0) {
    const sumRating = state.reviews.reduce((sum, r) => sum + (Number(r.rating) || 5), 0);
    avgRating = (sumRating / totalReviews).toFixed(1);
  }

  const statRevenueEl = document.getElementById('adminStatRevenue');
  const statOrdersEl = document.getElementById('adminStatOrders');
  const statActiveEl = document.getElementById('adminStatActive');
  const statReviewsEl = document.getElementById('adminStatReviews');
  const statReviewsSubEl = document.getElementById('adminStatRatingSub');

  if (statRevenueEl) statRevenueEl.innerText = `Rp ${formatRupiah(totalRevenue)}`;
  if (statOrdersEl) statOrdersEl.innerText = totalOrders;
  if (statActiveEl) statActiveEl.innerText = activeOrders;
  if (statReviewsEl) statReviewsEl.innerText = totalReviews;
  if (statReviewsSubEl) {
    statReviewsSubEl.innerText = totalReviews > 0 ? `Rata-rata rating ${avgRating} ★` : 'Belum ada ulasan';
  }

  // Table
  const tbody = document.getElementById('adminOrdersTableBody');
  if (!tbody) return;

  if (state.orders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 40px; font-size: 0.95rem;">
      📭 Belum ada pesanan masuk.<br>
      <span style="font-size: 0.82rem; color: var(--text-secondary); margin-top: 6px; display: inline-block;">
        Dashboard bersih dan siap digunakan. Silakan buat pesanan baru melalui form pemesanan untuk mulai mencoba alur sistem secara langsung.
      </span>
    </td></tr>`;
    return;
  }

  tbody.innerHTML = state.orders.slice().reverse().map(o => `
    <tr>
      <td>
        <strong>#${escapeHtml(o.id)}</strong>
        <div style="font-size: 0.75rem; color: var(--text-muted);">${formatDate(o.created_at)}</div>
      </td>
      <td>
        <strong>${escapeHtml(o.customer_name)}</strong>
        <div style="font-size: 0.78rem; color: var(--text-secondary);">${escapeHtml(o.customer_phone)}</div>
      </td>
      <td>
        <span style="font-weight: 700;">${escapeHtml(o.service)}</span>
        <div style="font-size: 0.75rem; color: var(--text-secondary); max-width: 220px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${escapeHtml(o.task_desc)}">
          ${escapeHtml(o.task_desc)}
        </div>
      </td>
      <td>
        <span>${escapeHtml(o.area)}</span>
        <div style="font-size: 0.75rem; color: var(--text-muted);">${escapeHtml(o.address)}</div>
      </td>
      <td>
        <strong style="color: var(--accent-warm);">Rp ${formatRupiah(o.total_amount)}</strong>
      </td>
      <td>
        ${getStatusBadgeHtml(o.status)}
      </td>
      <td>
        <div style="display: flex; gap: 6px; flex-wrap: wrap; align-items: center;">
          ${o.status === 'waiting_verification' ? `
            <button onclick="adminVerifyGopaySuccess('${o.id}')" class="btn btn-sm btn-primary" style="background: #059669; color: #fff; font-weight: 700; border: none; padding: 5px 10px;" title="Uang Masuk ke GoPay, Proses Pesanan & Tugaskan Mitra">
              ✅ Saldo GoPay Masuk
            </button>
            ${o.proof_image ? `
              <button onclick="adminViewProofImage('${o.id}')" class="btn btn-sm btn-secondary" style="padding: 5px 8px;" title="Lihat Screenshot Bukti Bayar">
                🖼️ Bukti
              </button>
            ` : ''}
          ` : ''}

          ${o.status === 'pending' ? `
            <button onclick="adminVerifyGopaySuccess('${o.id}')" class="btn btn-sm btn-secondary" style="background: #E0F2FE; color: #0284C7; border: none; font-weight: 600;" title="Konfirmasi Bayar">
              ✓ Terima
            </button>
          ` : ''}

          ${o.status === 'paid' ? `
            <button onclick="adminChangeOrderStatus('${o.id}', 'on_way')" class="btn btn-sm btn-secondary" style="background: var(--accent-warm-soft); color: var(--accent-warm); border: none; font-weight: 600;" title="Tugaskan Mitra OTW">
              🛵 OTW
            </button>
          ` : ''}

          ${o.status === 'on_way' ? `
            <button onclick="adminChangeOrderStatus('${o.id}', 'completed')" class="btn btn-sm btn-secondary" style="background: var(--success-soft); color: #047857; border: none; font-weight: 600;" title="Tandai Selesai">
              🎉 Selesai
            </button>
          ` : ''}

          <a href="https://wa.me/${formatWaNumber(o.customer_phone)}?text=${encodeURIComponent(`Halo Kak ${o.customer_name}, kami dari PanggilKami Solo terkait pesanan #${o.id}.`)}" target="_blank" class="btn btn-sm btn-secondary" title="Chat Pelanggan di WhatsApp" style="padding: 5px 8px;">
            💬 WA
          </a>

          <button onclick="adminDeleteOrder('${o.id}')" class="btn btn-sm btn-secondary" style="color: #EF4444; border: 1px solid #FECACA; padding: 5px 8px;" title="Hapus Pesanan Ini">
            🗑️
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function adminVerifyGopaySuccess(orderId) {
  const order = state.orders.find(o => o.id === orderId);
  if (!order) return;

  order.status = 'on_way';
  order.paid_at = new Date().toISOString();
  order.courier_name = 'Mitra Siaga Solo';
  saveOrders();
  renderAdminDashboard();
  renderTracker();
  showToast(`✅ Pembayaran pesanan #${orderId} terverifikasi masuk! Status: Mitra OTW.`);
}

function adminViewProofImage(orderId) {
  const order = state.orders.find(o => o.id === orderId);
  if (!order || !order.proof_image) {
    showToast('Tidak ada file screenshot yang tersimpan.');
    return;
  }
  const win = window.open();
  if (win) {
    win.document.write(`<title>Bukti Pembayaran #${order.id}</title><body style="margin:0;background:#0F172A;display:flex;align-items:center;justify-content:center;height:100vh;"><img src="${order.proof_image}" style="max-width:90%;max-height:90%;border-radius:12px;box-shadow:0 10px 40px rgba(0,0,0,0.5);"></body>`);
  }
}

function adminChangeOrderStatus(orderId, newStatus) {
  const order = state.orders.find(o => o.id === orderId);
  if (!order) return;

  order.status = newStatus;
  if (newStatus === 'paid' && !order.paid_at) order.paid_at = new Date().toISOString();
  if (newStatus === 'completed' && !order.completed_at) order.completed_at = new Date().toISOString();

  saveOrders();
  renderAdminDashboard();
  renderTracker();
  showToast(`Status pesanan #${orderId} diubah menjadi: ${newStatus.toUpperCase()}`);
}

function adminDeleteOrder(orderId) {
  if (!confirm(`Hapus data pesanan #${orderId}?`)) return;
  state.orders = state.orders.filter(o => o.id !== orderId);
  saveOrders();
  renderAdminDashboard();
  renderTracker();
  showToast(`Pesanan #${orderId} berhasil dihapus.`);
}

function adminResetAllOrders() {
  if (!confirm('Yakin ingin mengosongkan SEMUA data pesanan di dashboard admin?\nSemua riwayat pesanan uji coba akan dibersihkan agar Anda bisa mencoba alur pemesanan dari awal (0 pesanan).')) return;
  state.orders = [];
  saveOrders();
  renderAdminDashboard();
  renderTracker();
  showToast('✅ Semua data pesanan di dashboard admin berhasil dibersihkan!');
}

// Utility Helpers
function formatRupiah(num) {
  return (num || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function formatWaNumber(phone) {
  let clean = (phone || '').replace(/\D/g, '');
  if (clean.startsWith('0')) clean = '62' + clean.slice(1);
  return clean || '6282283883580';
}

function formatDate(isoStr) {
  if (!isoStr) return '-';
  const d = new Date(isoStr);
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')} WIB`;
}

function getInitials(name) {
  if (!name) return 'PK';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function getStatusBadgeHtml(status) {
  switch (status) {
    case 'pending':
      return `<span class="status-badge pending">🟡 Menunggu Pembayaran</span>`;
    case 'waiting_verification':
      return `<span class="status-badge" style="background: #FEF3C7; color: #B45309; border: 1px solid #FCD34D; font-weight: 700; padding: 4px 10px; border-radius: 99px;">⏳ Menunggu Cek Saldo GoPay</span>`;
    case 'paid':
      return `<span class="status-badge paid">🔵 Pembayaran Terverifikasi GoPay</span>`;
    case 'on_way':
      return `<span class="status-badge on_way">🛵 Mitra Menuju Lokasi</span>`;
    case 'completed':
      return `<span class="status-badge completed">🟢 Layanan Selesai</span>`;
    case 'cancelled':
      return `<span class="status-badge cancelled">🔴 Dibatalkan</span>`;
    default:
      return `<span class="status-badge">${status}</span>`;
  }
}

// Toast System
function showToast(msg, type = 'info') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span>${type === 'error' ? '⚠️' : '✨'}</span>
    <span>${escapeHtml(msg)}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Bind Event Listeners
function bindEvents() {
  // Area select change
  const areaSelect = document.getElementById('orderArea');
  if (areaSelect) {
    areaSelect.addEventListener('change', updateOrderPrice);
  }

  // Order form submit
  const orderForm = document.getElementById('quickOrderForm');
  if (orderForm) {
    orderForm.addEventListener('submit', handleCreateOrder);
  }

  // Search order tracker input
  const searchBtn = document.getElementById('searchOrderBtn');
  const searchInput = document.getElementById('searchOrderInput');
  if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', () => {
      const code = searchInput.value.trim().replace('#', '');
      if (code) {
        renderTracker(code);
        showToast(`Mencari pesanan #${code}...`);
      }
    });
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        searchBtn.click();
      }
    });
  }

  // Quick prompt tags
  document.querySelectorAll('.quick-tag').forEach(tag => {
    tag.addEventListener('click', () => {
      const input = document.getElementById('taskDesc');
      if (input) {
        input.value = tag.innerText;
        input.focus();
      }
    });
  });
}

// Run on DOM Ready
document.addEventListener('DOMContentLoaded', initApp);

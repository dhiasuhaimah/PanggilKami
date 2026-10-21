import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Clock, 
  Sparkles, 
  Tag, 
  AlertCircle, 
  CheckCircle2, 
  Upload,
  Phone,
  User as UserIcon,
  ShoppingBag
} from 'lucide-react';
import { db } from '../services/db';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { PriceSummary } from '../components/PriceSummary';
import { Service, ServiceArea, ServiceSlug } from '../types';
import { generateOrderCode, calculateCleaningEstimate } from '../utils';

export const Checkout: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [service, setService] = useState<Service | null>(null);
  const [areas, setAreas] = useState<ServiceArea[]>([]);

  // Customer Contact Fields
  const [customerName, setCustomerName] = useState(user?.full_name || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');

  // Common Booking Fields
  const [selectedAreaId, setSelectedAreaId] = useState<string>('area_1');
  const [isOutOfArea, setIsOutOfArea] = useState<boolean>(false);
  const [pickupAddress, setPickupAddress] = useState<string>('');
  const [destinationAddress, setDestinationAddress] = useState<string>('');
  const [scheduledDate, setScheduledDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [scheduledTime, setScheduledTime] = useState<string>('09:00');
  const [notes, setNotes] = useState<string>('');
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(false);

  // Voucher
  const [voucherCodeInput, setVoucherCodeInput] = useState<string>('');
  const [appliedVoucher, setAppliedVoucher] = useState<{ code: string; discountAmount: number } | null>(null);

  // Service-specific states
  // Jastip
  const [itemNames, setItemNames] = useState<string>('');
  const [storeName, setStoreName] = useState<string>('');
  const [itemQuantity, setItemQuantity] = useState<string>('1 paket');
  const [itemBudget, setItemBudget] = useState<number>(location.state?.jastipEstimatedBudget || 0);
  const [referencePhoto, setReferencePhoto] = useState<string>('');

  // Antar Barang
  const [itemType, setItemType] = useState<string>('Dokumen / Paket');
  const [packageSizeWeight, setPackageSizeWeight] = useState<string>('Ringan (< 3 kg)');
  const [receiverName, setReceiverName] = useState<string>('');
  const [receiverPhone, setReceiverPhone] = useState<string>('');

  // Antar Jemput
  const [passengerCount, setPassengerCount] = useState<number>(1);
  const [tripNotes, setTripNotes] = useState<string>('');

  // Bersih-bersih
  const [cleanAreaType, setCleanAreaType] = useState<'kamar' | 'wc' | 'kamar_wc' | 'area_tambahan'>(
    location.state?.cleanAreaType || 'kamar'
  );
  const [cleanSqm, setCleanSqm] = useState<number>(location.state?.cleanSqm || 15);
  const [dirtinessLevel, setDirtinessLevel] = useState<'ringan' | 'sedang' | 'berat'>(
    location.state?.dirtinessLevel || 'ringan'
  );

  useEffect(() => {
    if (!slug) {
      navigate('/layanan');
      return;
    }
    const foundService = db.getServiceBySlug(slug as ServiceSlug);
    if (!foundService) {
      navigate('/layanan');
      return;
    }
    setService(foundService);
    setAreas(db.getAreas().filter(a => a.is_active));

    // If user is logged in, sync info
    if (user) {
      setCustomerName(user.full_name);
      setCustomerPhone(user.phone);
      setCustomerEmail(user.email);
    }
  }, [slug, user, navigate]);

  // Calculate fees
  const selectedArea = areas.find(a => a.id === selectedAreaId);
  const travelFee = isOutOfArea ? 15000 : (selectedArea?.base_fee || 0);

  let serviceFee = service?.base_price || 0;

  if (service?.slug === 'bersih-bersih') {
    const calc = calculateCleaningEstimate(
      cleanSqm,
      dirtinessLevel,
      cleanAreaType,
      service.pricing_rules?.hourly_rate || 100000
    );
    serviceFee = calc.totalEstimated;
  }

  const isJastip = service?.slug === 'jastip-barang';
  const subtotal = serviceFee + travelFee + (isJastip ? itemBudget : 0);
  const discountAmount = appliedVoucher ? appliedVoucher.discountAmount : 0;
  const finalTotal = Math.max(0, subtotal - discountAmount);

  // Voucher validation handler
  const handleApplyVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!voucherCodeInput.trim()) return;

    const res = db.validateVoucher(voucherCodeInput, subtotal);
    if (res.isValid) {
      setAppliedVoucher({
        code: res.voucher!.code,
        discountAmount: res.discountAmount
      });
      showToast(res.message, 'success');
    } else {
      showToast(res.message, 'error');
    }
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setVoucherCodeInput('');
    showToast('Voucher dihapus', 'info');
  };

  // Image Upload handler (base64)
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast('Ukuran foto maksimal 2MB', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setReferencePhoto(reader.result as string);
        showToast('Foto referensi berhasil diunggah', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim() || !customerPhone.trim()) {
      showToast('Mohon lengkapi nama dan nomor WhatsApp Anda.', 'error');
      return;
    }

    if (!agreedToTerms) {
      showToast('Silakan centang persetujuan syarat & ketentuan.', 'error');
      return;
    }

    // Specific validations
    if (service?.slug === 'antar-barang' && (!pickupAddress.trim() || !destinationAddress.trim())) {
      showToast('Mohon isi alamat penjemputan dan alamat tujuan pengiriman.', 'error');
      return;
    }

    if (service?.slug === 'antar-jemput' && (!pickupAddress.trim() || !destinationAddress.trim())) {
      showToast('Mohon isi titik jemput dan titik tujuan perjalanan Anda.', 'error');
      return;
    }

    if (service?.slug === 'jastip-barang' && !itemNames.trim()) {
      showToast('Mohon tuliskan nama barang yang ingin dititip.', 'error');
      return;
    }

    if (service?.slug === 'bersih-bersih' && !destinationAddress.trim()) {
      showToast('Mohon isi alamat lengkap kamar kos / area yang ingin dibersihkan.', 'error');
      return;
    }

    const orderCode = generateOrderCode();
    const customerId = user ? user.id : 'guest_' + Date.now();

    const isFree = finalTotal === 0;

    const newBooking = db.createBooking({
      order_code: orderCode,
      customer_id: customerId,
      customer_name: customerName.trim(),
      customer_phone: customerPhone.trim(),
      customer_email: customerEmail.trim() || undefined,
      service_id: service!.id,
      service_name: service!.name,
      service_slug: service!.slug,
      status: isFree ? 'menunggu_konfirmasi_layanan' : 'menunggu_pembayaran',
      payment_status: isFree ? 'lunas' : 'belum_bayar',
      service_fee: serviceFee,
      travel_fee: travelFee,
      item_budget: isJastip ? itemBudget : 0,
      discount_amount: discountAmount,
      total_amount: finalTotal,
      voucher_code: appliedVoucher?.code,
      area_id: isOutOfArea ? 'out_of_area' : selectedAreaId,
      area_name: isOutOfArea ? 'Area Khusus / Luar Jangkauan' : selectedArea?.name,
      pickup_address: pickupAddress.trim() || undefined,
      destination_address: destinationAddress.trim() || undefined,
      scheduled_date: scheduledDate,
      scheduled_time: scheduledTime,
      notes: notes.trim() || undefined,
      details: {
        item_names: itemNames,
        store_name: storeName,
        item_quantity: itemQuantity,
        item_reference_image: referencePhoto,
        item_type: itemType,
        package_size_weight: packageSizeWeight,
        receiver_name: receiverName,
        receiver_phone: receiverPhone,
        passenger_count: passengerCount,
        trip_notes: tripNotes,
        clean_area_type: cleanAreaType,
        area_sqm: cleanSqm,
        dirtiness_level: dirtinessLevel
      }
    });

    showToast(`Pesanan ${newBooking.order_code} berhasil dibuat!`, 'success');

    // Navigate to payment page
    navigate(`/pembayaran/${newBooking.order_code}`);
  };

  if (!service) {
    return <div className="container section">Memuat data pesanan...</div>;
  }

  return (
    <div className="section section-subtle" style={{ minHeight: '85vh' }}>
      <div className="container">
        {/* Navigation Breadcrumb */}
        <Link 
          to={`/layanan/${service.slug}`}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#475569', marginBottom: '1.5rem', fontWeight: 600, fontSize: '0.9rem' }}
        >
          <ArrowLeft size={16} />
          <span>Kembali ke Detail Layanan</span>
        </Link>

        <h1 style={{ fontSize: '1.85rem', marginBottom: '0.5rem', color: '#0F172A' }}>
          Formulir Pemesanan Layanan
        </h1>
        <p style={{ color: '#64748B', marginBottom: '2rem' }}>
          Lengkapi data pesanan untuk <strong>{service.name}</strong> dengan informasi yang jelas dan akurat.
        </p>

        <form onSubmit={handleSubmitOrder}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
            alignItems: 'start'
          }}>
            {/* Left Column: Form Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Customer Contact Card */}
              <div className="card" style={{ backgroundColor: '#FFFFFF' }}>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <UserIcon size={18} style={{ color: '#1D4ED8' }} />
                  <span>Informasi Pemesan</span>
                </h3>

                {!isAuthenticated && (
                  <div style={{
                    backgroundColor: '#EFF6FF',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.85rem',
                    color: '#1E40AF',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <span>Sudah punya akun PanggilKami?</span>
                    <Link to="/login" style={{ fontWeight: 700, textDecoration: 'underline' }}>
                      Login Sekarang
                    </Link>
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">
                    Nama Lengkap Pemesan <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Contoh: Budi Santoso"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2">
                  <div className="form-group">
                    <label className="form-label">
                      Nomor WhatsApp Aktif <span className="required">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      className="form-input"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="Contoh: 081234567890"
                    />
                    <span className="form-helper">Untuk koordinasi mitra & konfirmasi bukti transaksi</span>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email (Opsional)</label>
                    <input
                      type="email"
                      className="form-input"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="email@anda.com"
                    />
                  </div>
                </div>
              </div>

              {/* Service-Specific Form Card */}
              <div className="card" style={{ backgroundColor: '#FFFFFF' }}>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Sparkles size={18} style={{ color: '#0D9488' }} />
                  <span>Detail Kebutuhan {service.name}</span>
                </h3>

                {/* 1. JASA TITIP FORM */}
                {service.slug === 'jastip-barang' && (
                  <>
                    <div className="form-group">
                      <label className="form-label">
                        Nama Barang / Makanan yang Ingin Dibeli <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        className="form-input"
                        value={itemNames}
                        onChange={(e) => setItemNames(e.target.value)}
                        placeholder="Contoh: Serabi Notosuman 2 kotak, Roti Mandarin Orion 1 dus"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2">
                      <div className="form-group">
                        <label className="form-label">Nama Toko / Lokasi Pembelian (Jika Tahu)</label>
                        <input
                          type="text"
                          className="form-input"
                          value={storeName}
                          onChange={(e) => setStoreName(e.target.value)}
                          placeholder="Contoh: Toko Orion Jl. Urip Sumoharjo"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Jumlah / Porsi</label>
                        <input
                          type="text"
                          className="form-input"
                          value={itemQuantity}
                          onChange={(e) => setItemQuantity(e.target.value)}
                          placeholder="Contoh: 2 kotak / 5 bungkus"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Perkiraan Anggaran Pembelian Barang (Rp)</label>
                      <input
                        type="number"
                        className="form-input"
                        value={itemBudget}
                        onChange={(e) => setItemBudget(Math.max(0, Number(e.target.value)))}
                        placeholder="Contoh: 100000"
                      />
                      <span className="form-helper">
                        Uang barang dipisahkan dari biaya jasa Rp 25.000. Nota toko asli akan dilampirkan mitra.
                      </span>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Unggah Foto Referensi Barang (Opsional)</label>
                      <input
                        type="file"
                        accept="image/*"
                        className="form-input"
                        onChange={handlePhotoUpload}
                      />
                      {referencePhoto && (
                        <div style={{ marginTop: '0.5rem', width: '80px', height: '80px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid #CBD5E1' }}>
                          <img src={referencePhoto} alt="Ref" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* 2. ANTAR BARANG FORM */}
                {service.slug === 'antar-barang' && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2">
                      <div className="form-group">
                        <label className="form-label">Jenis Barang yang Dikirim <span className="required">*</span></label>
                        <input
                          type="text"
                          required
                          className="form-input"
                          value={itemType}
                          onChange={(e) => setItemType(e.target.value)}
                          placeholder="Contoh: Dokumen skripsi, pakaian, makanan kering"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Perkiraan Ukuran / Berat</label>
                        <input
                          type="text"
                          className="form-input"
                          value={packageSizeWeight}
                          onChange={(e) => setPackageSizeWeight(e.target.value)}
                          placeholder="Contoh: 1 tas ransel / 2 kg"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2">
                      <div className="form-group">
                        <label className="form-label">Nama Penerima Paket</label>
                        <input
                          type="text"
                          className="form-input"
                          value={receiverName}
                          onChange={(e) => setReceiverName(e.target.value)}
                          placeholder="Nama orang yang menerima"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Nomor HP / WA Penerima</label>
                        <input
                          type="tel"
                          className="form-input"
                          value={receiverPhone}
                          onChange={(e) => setReceiverPhone(e.target.value)}
                          placeholder="08xxxxxxxxxx"
                        />
                      </div>
                    </div>

                    <div style={{
                      backgroundColor: '#FEF2F2',
                      border: '1px solid #FECACA',
                      padding: '0.75rem',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.8rem',
                      color: '#991B1B'
                    }}>
                      ⚠️ Tidak melayani barang berbahaya, cairan mudah meledak, atau barang terlarang.
                    </div>
                  </>
                )}

                {/* 3. ANTAR JEMPUT ORANG */}
                {service.slug === 'antar-jemput' && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2">
                      <div className="form-group">
                        <label className="form-label">Jumlah Penumpang</label>
                        <select
                          className="form-select"
                          value={passengerCount}
                          onChange={(e) => setPassengerCount(Number(e.target.value))}
                        >
                          <option value={1}>1 Orang (Motor / Mobil)</option>
                          <option value={2}>2 Orang (Mobil / Motor 2 Unit)</option>
                          <option value={3}>3 - 4 Orang (Mobil Armada)</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Catatan Perjalanan</label>
                        <input
                          type="text"
                          className="form-input"
                          value={tripNotes}
                          onChange={(e) => setTripNotes(e.target.value)}
                          placeholder="Contoh: Bawa 1 koper kecil"
                        />
                      </div>
                    </div>

                    <div style={{
                      backgroundColor: '#FFFBEB',
                      border: '1px solid #FDE68A',
                      padding: '0.75rem',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.8rem',
                      color: '#92400E'
                    }}>
                      ℹ️ Penjemputan dijalankan jika mitra tersedia di lokasi dan kondisi memungkinkan.
                    </div>
                  </>
                )}

                {/* 4. BERSIH-BERSIH KOS / WC */}
                {service.slug === 'bersih-bersih' && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2">
                      <div className="form-group">
                        <label className="form-label">Tipe Area Hunian</label>
                        <select
                          className="form-select"
                          value={cleanAreaType}
                          onChange={(e) => setCleanAreaType(e.target.value as any)}
                        >
                          <option value="kamar">Kamar Kos Standar (Tanpa WC)</option>
                          <option value="wc">Kamar Mandi / WC Saja</option>
                          <option value="kamar_wc">Kamar Kos Beserta WC Dalam</option>
                          <option value="area_tambahan">Kamar Kos + Dapur / Area Tambahan</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Tingkat Kekotoran</label>
                        <select
                          className="form-select"
                          value={dirtinessLevel}
                          onChange={(e) => setDirtinessLevel(e.target.value as any)}
                        >
                          <option value="ringan">Ringan (Debu rutin, sapu pel)</option>
                          <option value="sedang">Sedang (Lantai kusam / kerak wajar)</option>
                          <option value="berat">Berat (Kerak tebal / lama tak dihuni)</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Perkiraan Luas Area ({cleanSqm} m²):</label>
                      <input
                        type="range"
                        min={6}
                        max={60}
                        step={3}
                        value={cleanSqm}
                        onChange={(e) => setCleanSqm(Number(e.target.value))}
                        style={{ width: '100%' }}
                      />
                      <span className="form-helper">
                        Dihitung dengan tarif dasar Rp 100.000/jam berdasarkan luas dan tingkat kekotoran.
                      </span>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Unggah Foto Kondisi Kamar/WC (Opsional)</label>
                      <input
                        type="file"
                        accept="image/*"
                        className="form-input"
                        onChange={handlePhotoUpload}
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Area & Address Card */}
              <div className="card" style={{ backgroundColor: '#FFFFFF' }}>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={18} style={{ color: '#1D4ED8' }} />
                  <span>Alamat & Wilayah Layanan</span>
                </h3>

                {/* Service Area Selection */}
                <div className="form-group">
                  <label className="form-label">Pilih Wilayah Jangkauan:</label>
                  <select
                    className="form-select"
                    value={isOutOfArea ? 'custom' : selectedAreaId}
                    onChange={(e) => {
                      if (e.target.value === 'custom') {
                        setIsOutOfArea(true);
                      } else {
                        setIsOutOfArea(false);
                        setSelectedAreaId(e.target.value);
                      }
                    }}
                  >
                    {areas.map(area => (
                      <option key={area.id} value={area.id}>
                        {area.name} ({area.city}) {area.base_fee ? `+Rp ${area.base_fee.toLocaleString()}` : '(Bebas Ongkos Jarak)'}
                      </option>
                    ))}
                    <option value="custom">📍 Alamat Lain (Luar Wilayah Reguler Solo Baru)</option>
                  </select>
                </div>

                {isOutOfArea && (
                  <div style={{
                    backgroundColor: '#FFFBEB',
                    border: '1px solid #FDE68A',
                    padding: '0.85rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.85rem',
                    color: '#92400E',
                    marginBottom: '1rem',
                    lineHeight: '1.5'
                  }}>
                    Mohon maaf, lokasi saat ini di luar jangkauan reguler PanggilKami. Anda tetap dapat melanjutkan pemesanan dan admin akan memeriksa ketersediaan mitra khusus untuk Anda dengan biaya penyesuaian jarak.
                  </div>
                )}

                {/* Pickup Address for Courier / Transport */}
                {(service.slug === 'antar-barang' || service.slug === 'antar-jemput') && (
                  <div className="form-group">
                    <label className="form-label">
                      Alamat / Titik Penjemputan <span className="required">*</span>
                    </label>
                    <textarea
                      required
                      className="form-textarea"
                      value={pickupAddress}
                      onChange={(e) => setPickupAddress(e.target.value)}
                      placeholder="Contoh: Jl. Ir. Soekarno No. 20, Kos Melati Kamar 3B, Dekat Mall The Park Solo Baru"
                    />
                  </div>
                )}

                {/* Destination / Service Address */}
                <div className="form-group">
                  <label className="form-label">
                    {service.slug === 'antar-barang' || service.slug === 'antar-jemput'
                      ? 'Alamat Tujuan Pengantaran' 
                      : service.slug === 'jastip-barang' 
                      ? 'Alamat Pengantaran Belanjaan Anda' 
                      : 'Alamat Lengkap Kamar Kos / Hunian yang Dibersihkan'} <span className="required">*</span>
                  </label>
                  <textarea
                    required
                    className="form-textarea"
                    value={destinationAddress}
                    onChange={(e) => setDestinationAddress(e.target.value)}
                    placeholder="Nama jalan, nomor rumah/kos, patokan khusus untuk memudahkan mitra kami sampai ke lokasi..."
                  />
                </div>

                {/* Schedule Date & Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2">
                  <div className="form-group">
                    <label className="form-label">Tanggal Pelaksanaan <span className="required">*</span></label>
                    <input
                      type="date"
                      required
                      className="form-input"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Waktu / Jam Pelaksanaan <span className="required">*</span></label>
                    <input
                      type="time"
                      required
                      className="form-input"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                    />
                  </div>
                </div>

                {/* Additional Notes */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Catatan Tambahan untuk Mitra</label>
                  <input
                    type="text"
                    className="form-input"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Contoh: Tolong titipkan di pos satpam jika tidak ada orang"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Price Breakdown, Voucher & Checkout */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'sticky', top: '90px' }}>
              
              {/* Voucher Card */}
              <div className="card" style={{ backgroundColor: '#FFFFFF' }}>
                <h4 style={{ fontSize: '1rem', marginBottom: '0.75rem', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Tag size={16} style={{ color: '#1D4ED8' }} />
                  <span>Kupon & Voucher Diskon</span>
                </h4>

                {appliedVoucher ? (
                  <div style={{
                    backgroundColor: '#ECFDF5',
                    border: '1px solid #A7F3D0',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.75rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <div style={{ fontWeight: 700, color: '#065F46', fontSize: '0.9rem' }}>
                        Voucher "{appliedVoucher.code}" Aktif!
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#047857' }}>
                        Potongan 100% (Hemat Rp {discountAmount.toLocaleString()})
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveVoucher}
                      className="btn btn-outline btn-sm"
                      style={{ color: '#EF4444', borderColor: '#FCA5A5' }}
                    >
                      Hapus
                    </button>
                  </div>
                ) : (
                  <div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Masukkan kode voucher"
                        value={voucherCodeInput}
                        onChange={(e) => setVoucherCodeInput(e.target.value)}
                        style={{ textTransform: 'uppercase' }}
                      />
                      <button
                        type="button"
                        onClick={handleApplyVoucher}
                        className="btn btn-primary btn-sm"
                      >
                        Gunakan
                      </button>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                      Gunakan kode voucher <strong>panggilkami</strong> untuk diskon 100% (Rp 0).
                    </div>
                  </div>
                )}
              </div>

              {/* Price Summary Breakdown */}
              <PriceSummary
                serviceFee={serviceFee}
                travelFee={travelFee}
                itemBudget={isJastip ? itemBudget : 0}
                discountAmount={discountAmount}
                voucherCode={appliedVoucher?.code}
                isJastip={isJastip}
                isEstimate={service.slug === 'bersih-bersih'}
              />

              {/* Terms Agreement & Submit */}
              <div className="card" style={{ backgroundColor: '#FFFFFF' }}>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', cursor: 'pointer', marginBottom: '1.25rem' }}>
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    style={{ marginTop: '0.25rem' }}
                  />
                  <span style={{ fontSize: '0.85rem', color: '#475569', lineHeight: '1.5' }}>
                    Saya telah membaca dan menyetujui ketentuan pemesanan jasa PanggilKami serta kebenaran alamat yang diberikan.
                  </span>
                </label>

                <button
                  type="submit"
                  className="btn btn-teal btn-lg"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <Sparkles size={18} />
                  <span>
                    {finalTotal === 0 ? 'Selesaikan Pemesanan (Gratis Rp 0)' : 'Lanjut ke Pembayaran GoPay / QRIS'}
                  </span>
                </button>
              </div>

            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

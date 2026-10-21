import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShoppingBag, Truck, Navigation, Sparkle, Tag, ShieldCheck } from 'lucide-react';
import { ServiceCard } from '../components/ServiceCard';
import { db } from '../services/db';
import { Service } from '../types';

export const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    setServices(db.getServices().filter(s => s.is_active));
  }, []);

  const categories = [
    { id: 'all', name: 'Semua Layanan' },
    { id: 'Belanja & Titip', name: 'Jasa Titip' },
    { id: 'Kurir & Pengiriman', name: 'Antar Barang' },
    { id: 'Transportasi Lokal', name: 'Antar Jemput' },
    { id: 'Kebersihan Hunian', name: 'Bersih-bersih' }
  ];

  const filteredServices = selectedCategory === 'all'
    ? services
    : services.filter(s => s.category === selectedCategory);

  return (
    <div className="section section-subtle" style={{ minHeight: '80vh' }}>
      <div className="container">
        {/* Header */}
        <div className="section-header">
          <div className="section-tag section-tag-teal">
            <Sparkles size={14} />
            <span>Katalog Jasa Panggilan</span>
          </div>
          <h1 className="section-title">Pilih Layanan Yang Anda Butuhkan</h1>
          <p className="section-desc">
            PanggilKami hadir dengan empat kategori spesialis untuk mendampingi aktivitas harian Anda di Solo Baru & sekitarnya.
          </p>

          {/* Filter Pills */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            justifyContent: 'center',
            marginTop: '1.75rem'
          }}>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`btn btn-sm ${selectedCategory === cat.id ? 'btn-primary' : 'btn-outline'}`}
                style={{ borderRadius: 'var(--radius-full)' }}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {filteredServices.map(service => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        {/* Service Policy Notice */}
        <div className="card" style={{ marginTop: '3.5rem', backgroundColor: '#FFFFFF', padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
            <ShieldCheck size={20} style={{ color: '#1D4ED8' }} />
            <h3 style={{ fontSize: '1.1rem', color: '#0F172A' }}>Komitmen Kualitas & Transparansi Layanan</h3>
          </div>
          <p style={{ color: '#475569', fontSize: '0.925rem', lineHeight: '1.6' }}>
            Seluruh tarif di PanggilKami dihitung secara jujur dan transparan. Pada layanan titip belanja, biaya jasa dipisahkan secara tegas dari harga barang belanjaan. Pada layanan kebersihan, estimasi dihitung per jam (dasar Rp 100.000/jam) sesuai luas dan kondisi kamar kos Anda.
          </p>
        </div>
      </div>
    </div>
  );
};

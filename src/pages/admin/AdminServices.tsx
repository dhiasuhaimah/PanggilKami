import React, { useState, useEffect } from 'react';
import { Layers, Edit, Save, Plus, Check, X, Tag } from 'lucide-react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { db } from '../../services/db';
import { useToast } from '../../contexts/ToastContext';
import { Service } from '../../types';
import { formatRupiah } from '../../utils';

export const AdminServices: React.FC = () => {
  const { showToast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [editingService, setEditingService] = useState<Service | null>(null);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = () => {
    setServices(db.getServices());
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    try {
      db.updateService(editingService.id, {
        name: editingService.name,
        description: editingService.description,
        short_desc: editingService.short_desc,
        base_price: Number(editingService.base_price),
        unit: editingService.unit,
        is_active: editingService.is_active
      });

      showToast(`Layanan "${editingService.name}" berhasil diperbarui!`, 'success');
      setEditingService(null);
      loadServices();
    } catch (e: any) {
      showToast(e.message || 'Gagal menyimpan perubahan layanan', 'error');
    }
  };

  const handleToggleActive = (service: Service) => {
    try {
      db.updateService(service.id, { is_active: !service.is_active });
      loadServices();
      showToast(`Status layanan "${service.name}" berhasil diubah.`, 'success');
    } catch (e: any) {
      showToast('Gagal mengubah status', 'error');
    }
  };

  return (
    <AdminLayout 
      title="Manajemen Layanan" 
      subtitle="Atur tarif dasar, deskripsi, foto layanan, dan aturan estimasi harga kebersihan"
    >
      <div className="grid grid-cols-1 md:grid-cols-2">
        {services.map(service => (
          <div key={service.id} className="card" style={{ backgroundColor: '#FFFFFF', padding: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-md)', overflow: 'hidden', backgroundColor: '#F1F5F9', flexShrink: 0 }}>
                <img src={service.image_url} alt={service.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3 style={{ fontSize: '1.15rem', color: '#0F172A', marginBottom: '0.25rem' }}>
                    {service.name}
                  </h3>
                  <span className={`badge ${service.is_active ? 'badge-success' : 'badge-neutral'}`}>
                    {service.is_active ? 'Aktif' : 'Nonaktif'}
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '0.35rem' }}>
                  Kategori: {service.category}
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1D4ED8' }}>
                  {formatRupiah(service.base_price)} <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#64748B' }}>{service.unit}</span>
                </div>
              </div>
            </div>

            <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: '1.5', marginBottom: '1.25rem' }}>
              {service.description}
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              <button
                onClick={() => handleToggleActive(service)}
                className={`btn btn-sm ${service.is_active ? 'btn-outline' : 'btn-teal'}`}
              >
                {service.is_active ? 'Nonaktifkan' : 'Aktifkan'}
              </button>

              <button
                onClick={() => setEditingService({ ...service })}
                className="btn btn-outline-primary btn-sm"
              >
                <Edit size={14} />
                <span>Edit Tarif & Deskripsi</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Service Modal */}
      {editingService && (
        <div className="modal-overlay" onClick={() => setEditingService(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#0F172A' }}>
                Edit Layanan: {editingService.name}
              </h3>
              <button onClick={() => setEditingService(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit}>
              <div className="form-group">
                <label className="form-label">Nama Layanan</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={editingService.name}
                  onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2">
                <div className="form-group">
                  <label className="form-label">Tarif Dasar (Rp)</label>
                  <input
                    type="number"
                    required
                    className="form-input"
                    value={editingService.base_price}
                    onChange={(e) => setEditingService({ ...editingService, base_price: Number(e.target.value) })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Satuan Tarif</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={editingService.unit}
                    onChange={(e) => setEditingService({ ...editingService, unit: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Deskripsi Singkat (Ringkasan)</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={editingService.short_desc}
                  onChange={(e) => setEditingService({ ...editingService, short_desc: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Deskripsi Lengkap & Ketentuan</label>
                <textarea
                  required
                  className="form-textarea"
                  value={editingService.description}
                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setEditingService(null)} className="btn btn-outline">
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  <Save size={16} />
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

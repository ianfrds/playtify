'use client';

import { useState, useEffect } from 'react';
import { useAudio } from '@/context/AudioContext';

export function BrandModal() {
  const { brandName, setBrandName, isBrandModalOpen, setIsBrandModalOpen } = useAudio();
  const [val, setVal] = useState(brandName);

  useEffect(() => {
    if (isBrandModalOpen) setVal(brandName);
  }, [isBrandModalOpen, brandName]);

  if (!isBrandModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (val.trim()) {
      setBrandName(val.trim());
    }
    setIsBrandModalOpen(false);
  };

  return (
    <div className="modal" style={{ display: 'flex' }}>
      <div className="modal-overlay" onClick={() => setIsBrandModalOpen(false)} />
      <div className="modal-content">
        <h2>Ubah Nama Website</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="input-brand-name">Nama brand / logo</label>
          <input
            type="text"
            id="input-brand-name"
            maxLength={32}
            value={val}
            onChange={(e) => setVal(e.target.value)}
            placeholder="Contoh: MyMusic, VibeStream..."
            autoFocus
          />
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={() => setIsBrandModalOpen(false)}>
              Batal
            </button>
            <button type="submit" className="btn-primary">
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BrandModal;

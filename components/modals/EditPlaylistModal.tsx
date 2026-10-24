'use client';

import React, { useState, useEffect } from 'react';
import { useAudio } from '@/context/AudioContext';

const PRESET_COVERS = [
  'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&auto=format&fit=crop&q=80',
];

export function EditPlaylistModal() {
  const {
    isEditPlaylistModalOpen,
    closeEditPlaylistModal,
    editingPlaylist,
    updatePlaylist,
  } = useAudio();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [coverUrl, setCoverUrl] = useState('');

  useEffect(() => {
    if (editingPlaylist) {
      setName(editingPlaylist.name || '');
      setDescription(editingPlaylist.description || editingPlaylist.desc || '');
      setCoverUrl(editingPlaylist.cover || '');
    }
  }, [editingPlaylist]);

  if (!isEditPlaylistModalOpen || !editingPlaylist) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    updatePlaylist(editingPlaylist.id, {
      name: name.trim(),
      description: description.trim(),
      cover: coverUrl.trim(),
    });
  };

  const previewCover =
    coverUrl ||
    editingPlaylist.cover ||
    editingPlaylist.tracks[0]?.thumbnail ||
    editingPlaylist.tracks[0]?.thumb ||
    PRESET_COVERS[0];

  return (
    <div className="modal" style={{ display: 'flex' }}>
      <div className="modal-overlay" onClick={closeEditPlaylistModal} />
      <div
        className="modal-content edit-playlist-modal-content"
        style={{ maxWidth: 540, width: '92%', padding: '24px' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 700 }}>Edit rincian</h2>
          <button
            type="button"
            className="icon-btn"
            onClick={closeEditPlaylistModal}
            aria-label="Tutup"
            style={{ color: '#aaa', padding: 4 }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="edit-playlist-grid" style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {/* Left Column: Artwork preview & presets */}
            <div style={{ flex: '0 0 160px', width: 160 }}>
              <div
                style={{
                  width: 160,
                  height: 160,
                  borderRadius: 8,
                  overflow: 'hidden',
                  background: '#282828',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                  position: 'relative',
                }}
              >
                <img
                  src={previewCover}
                  alt={name || 'Cover playlist'}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              {/* Preset cover quick picker */}
              <div style={{ marginTop: 10 }}>
                <span style={{ fontSize: '0.72rem', color: '#888', display: 'block', marginBottom: 6 }}>
                  Pilih dari preset:
                </span>
                <div style={{ display: 'flex', gap: 6 }}>
                  {PRESET_COVERS.slice(0, 4).map((preset, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setCoverUrl(preset)}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 4,
                        overflow: 'hidden',
                        padding: 0,
                        border: coverUrl === preset ? '2px solid #1ed760' : '1px solid rgba(255,255,255,0.2)',
                        cursor: 'pointer',
                        background: 'transparent',
                      }}
                    >
                      <img src={preset} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Name, Description, Image URL */}
            <div style={{ flex: '1 1 240px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label htmlFor="edit-playlist-name" style={{ fontSize: '0.82rem', fontWeight: 600, color: '#bbb' }}>
                  Nama
                </label>
                <input
                  type="text"
                  id="edit-playlist-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama playlist"
                  maxLength={64}
                  required
                  style={{ marginTop: 4 }}
                />
              </div>

              <div>
                <label htmlFor="edit-playlist-desc" style={{ fontSize: '0.82rem', fontWeight: 600, color: '#bbb' }}>
                  Deskripsi
                </label>
                <textarea
                  id="edit-playlist-desc"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tambahkan deskripsi opsional..."
                  maxLength={200}
                  style={{
                    width: '100%',
                    background: 'var(--bg-card, #1e1e1e)',
                    border: '1px solid var(--border, rgba(255,255,255,0.15))',
                    borderRadius: 6,
                    padding: '8px 12px',
                    fontSize: '0.88rem',
                    color: '#fff',
                    outline: 'none',
                    resize: 'none',
                    marginTop: 4,
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              <div>
                <label htmlFor="edit-playlist-cover" style={{ fontSize: '0.78rem', color: '#888' }}>
                  URL Gambar Sampul (Opsional)
                </label>
                <input
                  type="text"
                  id="edit-playlist-cover"
                  value={coverUrl}
                  onChange={(e) => setCoverUrl(e.target.value)}
                  placeholder="https://..."
                  style={{ marginTop: 4, fontSize: '0.82rem' }}
                />
              </div>
            </div>
          </div>

          <p style={{ fontSize: '0.75rem', color: '#777', marginTop: 16 }}>
            Dengan melanjutkan, kamu menyetujui untuk memberikan akses gambar yang kamu miliki ke Haytify.
          </p>

          <div className="modal-actions" style={{ marginTop: 20 }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={closeEditPlaylistModal}
              style={{
                background: 'transparent',
                color: '#fff',
                border: 'none',
                fontWeight: 700,
                cursor: 'pointer',
                padding: '10px 20px',
              }}
            >
              Batal
            </button>
            <button
              type="submit"
              className="btn-primary"
              style={{
                background: '#fff',
                color: '#000',
                borderRadius: 24,
                fontWeight: 700,
                padding: '10px 28px',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditPlaylistModal;

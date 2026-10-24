'use client';

import { useState } from 'react';
import { useAudio } from '@/context/AudioContext';

export function NewPlaylistModal() {
  const { isNewPlaylistModalOpen, setIsNewPlaylistModalOpen, createPlaylist } = useAudio();
  const [name, setName] = useState('');

  if (!isNewPlaylistModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      createPlaylist(name.trim());
      setName('');
    }
  };

  return (
    <div className="modal" style={{ display: 'flex' }}>
      <div className="modal-overlay" onClick={() => setIsNewPlaylistModalOpen(false)} />
      <div className="modal-content">
        <h2>Playlist Baru</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="input-playlist-name">Nama playlist</label>
          <input
            type="text"
            id="input-playlist-name"
            maxLength={48}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Playlist saya..."
            autoFocus
          />
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={() => setIsNewPlaylistModalOpen(false)}>
              Batal
            </button>
            <button type="submit" className="btn-primary">
              Buat
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewPlaylistModal;

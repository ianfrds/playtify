'use client';

import React from 'react';
import { useAudio } from '@/context/AudioContext';
import { useRouter, usePathname } from 'next/navigation';

export function DeletePlaylistModal() {
  const {
    isDeletePlaylistModalOpen,
    closeDeletePlaylistModal,
    deletingPlaylist,
    deletePlaylist,
  } = useAudio();

  const router = useRouter();
  const pathname = usePathname();

  if (!isDeletePlaylistModalOpen || !deletingPlaylist) return null;

  const handleDelete = () => {
    const targetId = deletingPlaylist.id;
    deletePlaylist(targetId);

    // If currently viewing this playlist page, redirect to home
    if (pathname === `/playlist/${targetId}`) {
      router.push('/');
    }
  };

  return (
    <div className="modal" style={{ display: 'flex' }}>
      <div className="modal-overlay" onClick={closeDeletePlaylistModal} />
      <div
        className="modal-content"
        style={{
          maxWidth: 400,
          width: '90%',
          padding: '28px',
          textAlign: 'center',
          background: '#282828',
          borderRadius: 12,
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            background: 'rgba(233, 20, 41, 0.15)',
            color: '#e91429',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" />
          </svg>
        </div>

        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 10px 0' }}>
          Hapus dari Koleksi Kamu?
        </h2>

        <p style={{ fontSize: '0.88rem', color: '#b3b3b3', margin: '0 0 24px 0', lineHeight: 1.5 }}>
          Tindakan ini akan menghapus playlist <strong style={{ color: '#fff' }}>"{deletingPlaylist.name}"</strong> secara permanen.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
          <button
            type="button"
            onClick={closeDeletePlaylistModal}
            style={{
              padding: '10px 22px',
              borderRadius: 24,
              border: 'none',
              background: 'transparent',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              transition: 'transform 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleDelete}
            style={{
              padding: '10px 24px',
              borderRadius: 24,
              border: 'none',
              background: '#e91429',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              transition: 'transform 0.15s, background-color 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.04)';
              e.currentTarget.style.backgroundColor = '#f15e6c';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.backgroundColor = '#e91429';
            }}
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeletePlaylistModal;

'use client';

import React from 'react';
import { useAudio } from '@/context/AudioContext';
import { useRouter } from 'next/navigation';

export function MobileHeader() {
  const { user, openAuthModal, toggleRecDrawer } = useAudio();
  const router = useRouter();

  const userAvatar = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
  const initial = (user?.user_metadata?.full_name || user?.email || 'U').charAt(0).toUpperCase();

  const handleAvatarClick = () => {
    if (user) {
      router.push('/login');
    } else {
      openAuthModal('Masuk ke Haytify', 'Nikmati fitur lengkap dan sinkronkan lagu favoritmu.');
    }
  };

  return (
    <div className="mobile-top-header">
      <button
        className="mobile-avatar-wrap"
        onClick={handleAvatarClick}
        title={user ? 'Lihat Akun' : 'Masuk / Daftar'}
        aria-label={user ? 'Lihat Akun' : 'Masuk / Daftar'}
      >
        <div className="mobile-avatar" style={{ overflow: 'hidden' }}>
          {user ? (
            userAvatar ? (
              <img src={userAvatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ color: '#000', fontWeight: 800, fontSize: '0.9rem' }}>{initial}</span>
            )
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="10" />
              <path d="M8 11.5c3.5-1 7-0.5 9.5 1" stroke="#0a0a0a" strokeWidth="2" strokeLinecap="round" fill="none" />
              <path d="M7.5 14.5c4-1 8-0.5 10.5 1" stroke="#0a0a0a" strokeWidth="1.8" strokeLinecap="round" fill="none" />
              <path d="M9 8.5c3-0.8 6-0.3 8.5 1" stroke="#0a0a0a" strokeWidth="2.2" strokeLinecap="round" fill="none" />
            </svg>
          )}
        </div>
      </button>

      <div className="mobile-top-actions">
        <button
          className="mobile-notification-pill"
          onClick={() => toggleRecDrawer()}
          title="Rekomendasi Cepat"
        >
          <span className="mobile-pill-badge">12</span>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </button>

        <button
          className="mobile-icon-circle"
          onClick={() => router.push('/liked')}
          title="Lagu Disukai"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        <button
          className="mobile-icon-circle"
          onClick={() => router.push('/settings')}
          title="Pengaturan & Unduh APK"
          aria-label="Pengaturan"
        >
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default MobileHeader;

'use client';

import React from 'react';
import { useAudio } from '@/context/AudioContext';
import { useRouter } from 'next/navigation';

export function MobileHeader() {
  const { setIsBrandModalOpen, toggleRecDrawer } = useAudio();
  const router = useRouter();

  return (
    <div className="mobile-top-header">
      <button
        className="mobile-avatar-wrap"
        onClick={() => setIsBrandModalOpen(true)}
        title="Ubah Nama Brand"
        aria-label="Ubah Nama Brand"
      >
        <div className="mobile-avatar">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="10" />
            <path d="M8 11.5c3.5-1 7-0.5 9.5 1" stroke="#0a0a0a" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M7.5 14.5c4-1 8-0.5 10.5 1" stroke="#0a0a0a" strokeWidth="1.8" strokeLinecap="round" fill="none" />
            <path d="M9 8.5c3-0.8 6-0.3 8.5 1" stroke="#0a0a0a" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          </svg>
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
      </div>
    </div>
  );
}

export default MobileHeader;

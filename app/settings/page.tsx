'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAudio } from '@/context/AudioContext';

export default function SettingsPage() {
  const router = useRouter();
  const {
    showToast,
    user,
    deferredInstallPrompt,
    isPwaInstalled,
    triggerPwaInstall,
  } = useAudio();

  const [audioQuality, setAudioQuality] = useState<'auto' | 'high' | 'saver'>('auto');
  const [autoplayNext, setAutoplayNext] = useState<boolean>(true);
  const [syncLyrics, setSyncLyrics] = useState<boolean>(true);
  const [volumeNormalization, setVolumeNormalization] = useState<boolean>(true);
  const [showApkGuide, setShowApkGuide] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const q = localStorage.getItem('haytify_audio_quality') as any;
    if (q) setAudioQuality(q);
    const ap = localStorage.getItem('haytify_autoplay');
    if (ap !== null) setAutoplayNext(ap === 'true');
    const sl = localStorage.getItem('haytify_sync_lyrics');
    if (sl !== null) setSyncLyrics(sl === 'true');
  }, []);

  const handleQualityChange = (q: 'auto' | 'high' | 'saver') => {
    setAudioQuality(q);
    if (typeof window !== 'undefined') {
      localStorage.setItem('haytify_audio_quality', q);
      const labels = {
        auto: 'Kualitas Otomatis (Rekomendasi)',
        high: 'Kualitas Tinggi (320 kbps)',
        saver: 'Hemat Kuota (128 kbps)',
      };
      showToast(labels[q]);
    }
  };

  const handleClearCache = () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('haytify_lyrics_cache');
        sessionStorage.clear();
        showToast('Cache aplikasi berhasil dibersihkan!');
      } catch {
        showToast('Gagal membersihkan cache');
      }
    }
  };

  const handleDownloadApk = () => {
    setIsDownloading(true);
    showToast('Memulai pengunduhan APK Android...');
    setShowApkGuide(true);

    setTimeout(() => {
      window.location.href = '/api/download-apk';
      setIsDownloading(false);
    }, 400);
  };

  const handleInstallPwa = async () => {
    if (deferredInstallPrompt) {
      const ok = await triggerPwaInstall();
      if (ok) {
        showToast('Haytify berhasil dipasang di layar utama!');
      }
    } else {
      setShowApkGuide(true);
      showToast('Buka menu browser Anda (⋮) lalu pilih "Tambahkan ke Layar Utama"');
    }
  };

  return (
    <section id="view-settings" className="view active settings-page-view" style={{ display: 'block' }}>
      {/* ─── Top Header Bar ─── */}
      <div className="settings-page-topbar">
        <div className="settings-topbar-left">
          <button
            className="settings-topbar-back-btn"
            onClick={() => router.back()}
            aria-label="Kembali"
            title="Kembali"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            <span className="settings-back-label">Kembali</span>
          </button>
        </div>

        <div className="settings-topbar-center">
          <h1 className="settings-page-title">Pengaturan</h1>
        </div>

        <div className="settings-topbar-right" />
      </div>

      {/* ─── Page Content (Spacious & Clean Layout) ─── */}
      <div className="settings-page-container">
        {/* ─── SECTION 1: ANDROID APK & PWA (Featured Highlight Card) ─── */}
        <section className="settings-clean-card settings-apk-feature-card">
          <div className="settings-apk-header-row">
            <div className="settings-apk-badge-pill">
              <span className="settings-live-dot" />
              <span>Background Audio Penuh</span>
            </div>
            <span className="settings-apk-platform-tag">Android APK</span>
          </div>

          <h2 className="settings-apk-main-title">Aplikasi Android Haytify</h2>
          <p className="settings-apk-main-desc">
            Putar lagu terus-menerus tanpa jeda saat layar HP dimatikan atau saat Anda membuka aplikasi lain (WhatsApp, Instagram, games) tanpa hambatan browser.
          </p>

          <div className="settings-apk-button-grid">
            <button
              className="settings-btn-download-apk"
              onClick={handleDownloadApk}
              disabled={isDownloading}
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>{isDownloading ? 'Mengunduh...' : 'Download APK (.apk)'}</span>
            </button>

            <button
              className="settings-btn-install-pwa"
              onClick={handleInstallPwa}
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                <line x1="12" y1="18" x2="12.01" y2="18" />
              </svg>
              <span>{isPwaInstalled ? 'PWA Terpasang' : 'Pasang di Layar Utama'}</span>
            </button>
          </div>

          {/* Collapsible installation guide */}
          <button
            className="settings-guide-toggle-btn"
            onClick={() => setShowApkGuide(!showApkGuide)}
            type="button"
          >
            <span>{showApkGuide ? 'Sembunyikan Petunjuk Pemasangan ▲' : 'Petunjuk Pemasangan di HP Android ▼'}</span>
          </button>

          {showApkGuide && (
            <div className="settings-apk-instructions-box">
              <ol className="settings-instructions-list">
                <li>
                  Ketuk tombol <strong>Download APK (.apk)</strong> di atas.
                </li>
                <li>
                  Buka file <code>haytify.apk</code> dari notifikasi unduhan atau folder <strong>Download</strong> di HP Anda.
                </li>
                <li>
                  Jika muncul pesan <em>"Demi keamanan, ponsel Anda tidak diizinkan memasang aplikasi dari sumber ini"</em>:
                  <div className="settings-note-highlight">
                    👉 Ketuk <strong>Setelan</strong> lalu aktifkan <strong>Izinkan dari sumber ini</strong>.
                  </div>
                </li>
                <li>
                  Pilih <strong>Install</strong> dan buka aplikasinya. Lagu kini bisa berputar bebas di latar belakang!
                </li>
              </ol>
            </div>
          )}
        </section>

        {/* ─── SECTION 2: AUDIO STREAMING QUALITY ─── */}
        <section className="settings-clean-card">
          <div className="settings-section-header">
            <h3 className="settings-group-title">Kualitas Audio & Streaming</h3>
            <p className="settings-group-subtitle">Sesuaikan kualitas suara streaming musik sesuai kebutuhan kuota Anda.</p>
          </div>

          <div className="settings-quality-selector">
            <button
              className={`settings-quality-btn ${audioQuality === 'auto' ? 'active' : ''}`}
              onClick={() => handleQualityChange('auto')}
            >
              <span className="quality-btn-title">Otomatis</span>
              <span className="quality-btn-sub">Menyesuaikan sinyal</span>
            </button>

            <button
              className={`settings-quality-btn ${audioQuality === 'high' ? 'active' : ''}`}
              onClick={() => handleQualityChange('high')}
            >
              <span className="quality-btn-title">Tinggi HQ</span>
              <span className="quality-btn-sub">320 kbps jernih</span>
            </button>

            <button
              className={`settings-quality-btn ${audioQuality === 'saver' ? 'active' : ''}`}
              onClick={() => handleQualityChange('saver')}
            >
              <span className="quality-btn-title">Hemat Kuota</span>
              <span className="quality-btn-sub">128 kbps hemat</span>
            </button>
          </div>
        </section>

        {/* ─── SECTION 3: PLAYBACK PREFERENCES ─── */}
        <section className="settings-clean-card">
          <div className="settings-section-header">
            <h3 className="settings-group-title">Preferensi Pemutaran</h3>
            <p className="settings-group-subtitle">Atur kenyamanan pemutaran musik dan sinkronisasi lirik.</p>
          </div>

          <div className="settings-preference-list">
            <div className="settings-preference-item">
              <div className="settings-item-labels">
                <span className="settings-item-title">Putar Otomatis Lagu Berikutnya</span>
                <span className="settings-item-desc">Lanjutkan memutar rekomendasi lagu setelah antrean habis</span>
              </div>
              <label className="settings-switch">
                <input
                  type="checkbox"
                  checked={autoplayNext}
                  onChange={(e) => {
                    setAutoplayNext(e.target.checked);
                    localStorage.setItem('haytify_autoplay', e.target.checked ? 'true' : 'false');
                  }}
                />
                <span className="settings-switch-slider" />
              </label>
            </div>

            <div className="settings-preference-item">
              <div className="settings-item-labels">
                <span className="settings-item-title">Lirik Karaoke Real-time</span>
                <span className="settings-item-desc">Otomatis sinkronkan lirik lagu secara langsung per baris</span>
              </div>
              <label className="settings-switch">
                <input
                  type="checkbox"
                  checked={syncLyrics}
                  onChange={(e) => {
                    setSyncLyrics(e.target.checked);
                    localStorage.setItem('haytify_sync_lyrics', e.target.checked ? 'true' : 'false');
                  }}
                />
                <span className="settings-switch-slider" />
              </label>
            </div>

            <div className="settings-preference-item">
              <div className="settings-item-labels">
                <span className="settings-item-title">Normalisasi Volume Audio</span>
                <span className="settings-item-desc">Seimbangkan tingkat suara antar lagu yang berbeda</span>
              </div>
              <label className="settings-switch">
                <input
                  type="checkbox"
                  checked={volumeNormalization}
                  onChange={(e) => setVolumeNormalization(e.target.checked)}
                />
                <span className="settings-switch-slider" />
              </label>
            </div>
          </div>
        </section>

        {/* ─── SECTION 4: STORAGE & CACHE ─── */}
        <section className="settings-clean-card">
          <div className="settings-section-header">
            <h3 className="settings-group-title">Penyimpanan & Cache</h3>
            <p className="settings-group-subtitle">Kelola data sementara yang tersimpan di perangkat Anda.</p>
          </div>

          <div className="settings-storage-row">
            <div className="settings-item-labels">
              <span className="settings-item-title">Bersihkan Cache Aplikasi</span>
              <span className="settings-item-desc">Hapus data lirik, riwayat pencarian, dan cache lagu sementara</span>
            </div>
            <button className="settings-btn-clear-cache" onClick={handleClearCache}>
              Hapus Cache
            </button>
          </div>
        </section>

        {/* ─── SECTION 5: APP & ACCOUNT INFO ─── */}
        <section className="settings-clean-card settings-info-section">
          <div className="settings-section-header">
            <h3 className="settings-group-title">Informasi Aplikasi</h3>
          </div>

          <div className="settings-info-grid">
            <div className="settings-info-row">
              <span className="info-row-key">Versi Aplikasi</span>
              <span className="info-row-value">Haytify v2.5.0 (Latest Release)</span>
            </div>
            <div className="settings-info-row">
              <span className="info-row-key">Status Akun</span>
              <span className="info-row-value">{user ? (user.email || 'Pengguna Terdaftar') : 'Mode Tamu (Guest)'}</span>
            </div>
            <div className="settings-info-row">
              <span className="info-row-key">Mesin Audio</span>
              <span className="info-row-value">HTML5 Native Audio + YouTube Stream</span>
            </div>
          </div>

          <div className="settings-footer-note">
            <p>© 2026 Haytify • Musik bebas hambatan dengan antarmuka modern</p>
          </div>
        </section>
      </div>
    </section>
  );
}

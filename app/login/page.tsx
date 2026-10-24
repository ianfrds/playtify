'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAudio } from '@/context/AudioContext';
import { signInWithEmail, signUpWithEmail } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, signOut, enterGuestMode, showToast } = useAudio();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.get('mode') === 'register') {
      setMode('register');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email || !password) {
      setErrorMsg('Harap isi semua kolom email dan kata sandi.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Kata sandi minimal 6 karakter.');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'login') {
        const { data, error } = await signInWithEmail(email, password);
        if (error) {
          setErrorMsg(error.message || 'Email atau kata sandi salah.');
        } else if (data?.user) {
          showToast(`Selamat datang kembali, ${data.user.user_metadata?.full_name || data.user.email}!`);
          router.push('/');
        }
      } else {
        const { data, error } = await signUpWithEmail(email, password, fullName);
        if (error) {
          setErrorMsg(error.message || 'Gagal mendaftar. Silakan coba lagi.');
        } else {
          setSuccessMsg(
            data?.session
              ? 'Akun berhasil dibuat! Mengalihkan ke beranda...'
              : 'Pendaftaran berhasil! Silakan periksa email kamu untuk konfirmasi, atau langsung masuk.'
          );
          if (data?.session) {
            showToast('Akun berhasil dibuat!');
            setTimeout(() => router.push('/'), 1200);
          }
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  // If already logged in, show account status card
  if (user) {
    const displayName =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email?.split('@')[0] ||
      'Pengguna Playtify';

    const avatarUrl =
      user.user_metadata?.avatar_url ||
      user.user_metadata?.picture ||
      null;

    return (
      <div className="auth-page-container">
        <div className="auth-card" style={{ textAlign: 'center' }}>
          <div className="auth-brand-logo">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="#1ed760">
              <circle cx="12" cy="12" r="10" />
              <path d="M8 11.5c3.5-1 7-0.5 9.5 1" stroke="#121212" strokeWidth="2" strokeLinecap="round" fill="none" />
              <path d="M7.5 14.5c4-1 8-0.5 10.5 1" stroke="#121212" strokeWidth="1.8" strokeLinecap="round" fill="none" />
              <path d="M9 8.5c3-0.8 6-0.3 8.5 1" stroke="#121212" strokeWidth="2.2" strokeLinecap="round" fill="none" />
            </svg>
            <h2>Playtify</h2>
          </div>

          <div style={{ margin: '24px 0' }}>
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                style={{ width: 80, height: 80, borderRadius: '50%', margin: '0 auto', border: '2px solid #1ed760' }}
              />
            ) : (
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: '#1ed760',
                  color: '#000',
                  fontWeight: 800,
                  fontSize: '2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                }}
              >
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}

            <h3 style={{ margin: '16px 0 4px 0', fontSize: '1.25rem', color: '#fff' }}>
              {displayName}
            </h3>
            <p style={{ margin: 0, fontSize: '0.88rem', color: '#888' }}>
              {user.email}
            </p>
            <div style={{ marginTop: 8 }}>
              <span style={{ fontSize: '0.75rem', background: 'rgba(30,215,96,0.15)', color: '#1ed760', padding: '3px 10px', borderRadius: 12, fontWeight: 700 }}>
                AKUN TERVERIFIKASI
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button
              onClick={() => router.push('/')}
              className="btn-auth-primary"
              style={{ width: '100%' }}
            >
              Mulai Mendengarkan Musik
            </button>
            <button
              onClick={() => signOut()}
              className="btn-auth-secondary"
              style={{ width: '100%', color: '#ff4d4d', borderColor: 'rgba(255, 77, 77, 0.3)' }}
            >
              Keluar dari Akun
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page-container">
      {/* Background ambient decorative glow */}
      <div className="auth-glow" />

      <div className="auth-card">
        {/* Brand Header */}
        <div className="auth-brand-header">
          <div className="auth-brand-logo" onClick={() => router.push('/')} style={{ cursor: 'pointer' }}>
            <svg width="34" height="34" viewBox="0 0 24 24" fill="#1ed760">
              <circle cx="12" cy="12" r="10" />
              <path d="M8 11.5c3.5-1 7-0.5 9.5 1" stroke="#121212" strokeWidth="2" strokeLinecap="round" fill="none" />
              <path d="M7.5 14.5c4-1 8-0.5 10.5 1" stroke="#121212" strokeWidth="1.8" strokeLinecap="round" fill="none" />
              <path d="M9 8.5c3-0.8 6-0.3 8.5 1" stroke="#121212" strokeWidth="2.2" strokeLinecap="round" fill="none" />
            </svg>
            <span className="auth-brand-name">Playtify</span>
          </div>

          <h1 className="auth-title">
            {mode === 'login' ? 'Masuk ke Playtify' : 'Daftar Akun Baru'}
          </h1>
          <p className="auth-subtitle">
            {mode === 'login'
              ? 'Dengarkan jutaan lagu dan simpan playlist favoritmu di cloud.'
              : 'Nikmati musik tanpa batas dan sinkronkan playlist di semua perangkat.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="auth-tab-wrap">
          <button
            type="button"
            className={`auth-tab-btn ${mode === 'login' ? 'active' : ''}`}
            onClick={() => {
              setMode('login');
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
          >
            Masuk
          </button>
          <button
            type="button"
            className={`auth-tab-btn ${mode === 'register' ? 'active' : ''}`}
            onClick={() => {
              setMode('register');
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
          >
            Daftar
          </button>
        </div>

        {/* Error / Success Feedback */}
        {errorMsg && (
          <div className="auth-alert error">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="auth-alert success">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>{successMsg}</span>
          </div>
        )}

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'register' && (
            <div className="auth-field">
              <label htmlFor="auth-name">Nama Lengkap</label>
              <input
                id="auth-name"
                type="text"
                placeholder="cth. Budi Santoso"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoComplete="name"
                required
              />
            </div>
          )}

          <div className="auth-field">
            <label htmlFor="auth-email">Alamat Email</label>
            <input
              id="auth-email"
              type="email"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="auth-password">Kata Sandi</label>
            <div className="auth-password-wrap">
              <input
                id="auth-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Minimal 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                required
              />
              <button
                type="button"
                className="auth-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn-auth-primary"
            disabled={loading}
            style={{ marginTop: 8 }}
          >
            {loading ? (
              <span className="auth-spinner" />
            ) : mode === 'login' ? (
              'Masuk ke Playtify'
            ) : (
              'Daftar Sekarang'
            )}
          </button>
        </form>

        {/* Footer Switcher */}
        <div className="auth-footer">
          {mode === 'login' ? (
            <p>
              Belum punya akun?{' '}
              <button
                type="button"
                className="auth-link"
                onClick={() => {
                  setMode('register');
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
              >
                Daftar ke Playtify
              </button>
            </p>
          ) : (
            <p>
              Sudah punya akun?{' '}
              <button
                type="button"
                className="auth-link"
                onClick={() => {
                  setMode('login');
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
              >
                Masuk di sini
              </button>
            </p>
          )}

          <div className="auth-divider" style={{ margin: '16px 0 14px 0' }}>
            <span>ATAU</span>
          </div>

          <button
            type="button"
            className="btn-guest-mode"
            onClick={() => {
              enterGuestMode();
              router.push('/');
            }}
            title="Dengarkan musik tanpa perlu login"
            style={{ marginBottom: 14 }}
          >
            <div className="btn-guest-icon-wrap">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1ed760" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
              </svg>
            </div>
            <div className="btn-guest-content">
              <span className="btn-guest-title">Lanjutkan sebagai Tamu</span>
              <span className="btn-guest-sub">Dengarkan musik langsung tanpa login</span>
            </div>
            <svg className="btn-guest-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          <button
            type="button"
            className="auth-link-back"
            onClick={() => router.push('/')}
          >
            ← Kembali ke Beranda Playtify
          </button>
        </div>
      </div>
    </div>
  );
}

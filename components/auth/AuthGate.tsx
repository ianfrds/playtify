'use client';

import React, { useState } from 'react';
import { useAudio } from '@/context/AudioContext';
import { signInWithEmail, signUpWithEmail } from '@/lib/supabase';

export function AuthGate() {
  const { enterGuestMode, showToast } = useAudio();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

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
          setErrorMsg(error.message || 'Email atau kata sandi tidak valid.');
        } else if (data?.user) {
          showToast(`Selamat datang kembali, ${data.user.user_metadata?.full_name || data.user.email}!`);
        }
      } else {
        const { data, error } = await signUpWithEmail(email, password, fullName);
        if (error) {
          setErrorMsg(error.message || 'Gagal mendaftar. Silakan coba kembali.');
        } else {
          setSuccessMsg(
            data?.session
              ? 'Akun berhasil dibuat! Selamat datang di Haytify.'
              : 'Pendaftaran berhasil! Silakan periksa email kamu untuk konfirmasi akun atau langsung masuk.'
          );
          if (data?.session) {
            showToast('Akun berhasil dibuat!');
          }
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-gate-wrapper">
      <div className="auth-glow" />

      <div className="auth-card auth-gate-card">
        {/* Brand Header */}
        <div className="auth-brand-header">
          <div className="auth-brand-logo">
            <img
              src="/logo.png"
              alt="Haytify"
              style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'contain' }}
            />
            <span className="auth-brand-name">Haytify</span>
          </div>

          <h1 className="auth-title">
            {mode === 'login' ? 'Masuk ke Haytify' : 'Daftar Akun Baru'}
          </h1>
          <p className="auth-subtitle">
            {mode === 'login'
              ? 'Dengarkan jutaan lagu, buat playlist, dan nikmati audio berkualitas.'
              : 'Buat akun gratis untuk menyimpan playlist dan lagu favoritmu di cloud.'}
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

        {/* Alerts */}
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'register' && (
            <div className="auth-field">
              <label htmlFor="gate-name">Nama Lengkap</label>
              <input
                id="gate-name"
                type="text"
                placeholder="cth. Budi Santoso"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoComplete="name"
              />
            </div>
          )}

          <div className="auth-field">
            <label htmlFor="gate-email">Email</label>
            <input
              id="gate-email"
              type="email"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="auth-field">
            <label htmlFor="gate-password">Kata Sandi</label>
            <div className="auth-password-wrapper">
              <input
                id="gate-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Minimal 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              />
              <button
                type="button"
                className="auth-eye-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-label={showPassword ? 'Sembunyikan sandi' : 'Lihat sandi'}
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
              'Masuk ke Haytify'
            ) : (
              'Daftar Sekarang'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="auth-divider">
          <span>ATAU</span>
        </div>

        {/* Guest Mode Option */}
        <button
          type="button"
          className="btn-guest-mode"
          onClick={enterGuestMode}
          title="Dengarkan musik tanpa perlu login"
        >
          <div className="btn-guest-icon-wrap">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1ed760" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

        {/* Small Notice */}
        <p className="auth-gate-notice">
          Mode tamu memungkinkan Anda memutar jutaan musik bebas hambatan. Fitur simpan lagu favorit & buat playlist memerlukan login.
        </p>
      </div>
    </div>
  );
}

export default AuthGate;

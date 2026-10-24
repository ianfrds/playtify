'use client';

import React, { useState } from 'react';
import { useAudio } from '@/context/AudioContext';
import { signInWithEmail, signUpWithEmail } from '@/lib/supabase';

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, authModalTitle, authModalSubtitle, showToast } = useAudio();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

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
          closeAuthModal();
        }
      } else {
        const { data, error } = await signUpWithEmail(email, password, fullName);
        if (error) {
          setErrorMsg(error.message || 'Gagal mendaftar. Silakan coba kembali.');
        } else {
          setSuccessMsg(
            data?.session
              ? 'Akun berhasil dibuat! Mengalihkan...'
              : 'Pendaftaran berhasil! Silakan periksa email kamu untuk verifikasi.'
          );
          if (data?.session) {
            showToast('Akun berhasil dibuat!');
            setTimeout(() => {
              closeAuthModal();
            }, 800);
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
    <div className="modal" style={{ display: 'flex', zIndex: 10000 }}>
      <div className="modal-overlay" onClick={closeAuthModal} />
      <div
        className="auth-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          type="button"
          className="auth-modal-close"
          onClick={closeAuthModal}
          title="Tutup"
          aria-label="Tutup jendela login"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Modal Header */}
        <div className="auth-brand-header" style={{ marginBottom: 20 }}>
          <div className="auth-brand-logo">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="#1ed760">
              <circle cx="12" cy="12" r="10" />
              <path d="M8 11.5c3.5-1 7-0.5 9.5 1" stroke="#121212" strokeWidth="2" strokeLinecap="round" fill="none" />
              <path d="M7.5 14.5c4-1 8-0.5 10.5 1" stroke="#121212" strokeWidth="1.8" strokeLinecap="round" fill="none" />
              <path d="M9 8.5c3-0.8 6-0.3 8.5 1" stroke="#121212" strokeWidth="2.2" strokeLinecap="round" fill="none" />
            </svg>
            <span className="auth-brand-name">Playtify</span>
          </div>

          <h2 className="auth-title" style={{ fontSize: '1.35rem', marginTop: 12 }}>
            {authModalTitle}
          </h2>
          <p className="auth-subtitle" style={{ fontSize: '0.85rem' }}>
            {authModalSubtitle}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="auth-tab-wrap" style={{ marginBottom: 18 }}>
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
          <div className="auth-alert error" style={{ marginBottom: 14 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="auth-alert success" style={{ marginBottom: 14 }}>
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
              <label htmlFor="modal-name">Nama Lengkap</label>
              <input
                id="modal-name"
                type="text"
                placeholder="cth. Budi Santoso"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoComplete="name"
              />
            </div>
          )}

          <div className="auth-field">
            <label htmlFor="modal-email">Email</label>
            <input
              id="modal-email"
              type="email"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="auth-field">
            <label htmlFor="modal-password">Kata Sandi</label>
            <div className="auth-password-wrapper">
              <input
                id="modal-password"
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
              'Masuk'
            ) : (
              'Daftar Sekarang'
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <button
            type="button"
            className="auth-link-back"
            onClick={closeAuthModal}
            style={{ fontSize: '0.82rem' }}
          >
            Tetap Mendengarkan sebagai Tamu
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthModal;

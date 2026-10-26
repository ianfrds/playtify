'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAudio } from '@/context/AudioContext';
import AuthGate from '@/components/auth/AuthGate';
import AuthModal from '@/components/auth/AuthModal';
import GlobalAudioPlayer from '@/components/player/GlobalAudioPlayer';
import Sidebar from '@/components/layout/Sidebar';
import PlayerBar from '@/components/player/PlayerBar';
import MobileMiniPlayer from '@/components/player/MobileMiniPlayer';
import BottomDock from '@/components/layout/BottomDock';
import NowPlayingSidebar from '@/components/drawers/NowPlayingSidebar';
import QueueSidebar from '@/components/drawers/QueueSidebar';
import LyricsSidebar from '@/components/drawers/LyricsSidebar';
import RecDrawer from '@/components/drawers/RecDrawer';
import NewPlaylistModal from '@/components/modals/NewPlaylistModal';
import EditPlaylistModal from '@/components/modals/EditPlaylistModal';
import DeletePlaylistModal from '@/components/modals/DeletePlaylistModal';
import FullscreenLyricsModal from '@/components/modals/FullscreenLyricsModal';
import Toast from '@/components/common/Toast';

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const audio = useAudio();

  const {
    user,
    isGuest,
    isAuthLoading,
    currentTrack,
    isPlaying,
    isQueueSidebarOpen,
    isLyricsSidebarOpen,
    isNowPlayingSidebarOpen,
    isLyricsFullscreen,
    closeFullscreenLyrics,
    isNowPlayingModalOpen,
    setNowPlayingModalOpen,
    toggleQueueSidebar,
    toggleLyricsSidebar,
    toggleNowPlayingSidebar,
    isRecDrawerOpen,
    toggleRecDrawer,
    editingPlaylist,
    closeEditPlaylistModal,
    deletingPlaylist,
    closeDeletePlaylistModal,
    isNewPlaylistModalOpen,
    setIsNewPlaylistModalOpen,
    isBrandModalOpen,
    setIsBrandModalOpen,
    showToast,
  } = audio;

  const navigationStackRef = React.useRef<string[]>(['/']);
  const lastBackPressRef = React.useRef<number>(0);

  // Track page navigation layers in an explicit history stack
  useEffect(() => {
    if (!pathname) return;
    const stack = navigationStackRef.current;
    const currentTop = stack[stack.length - 1];
    if (currentTop !== pathname) {
      const existingIdx = stack.lastIndexOf(pathname);
      if (existingIdx !== -1 && existingIdx < stack.length - 1) {
        // User navigated back: prune stack down to this level
        navigationStackRef.current = stack.slice(0, existingIdx + 1);
      } else {
        // User pushed a new page: append layer
        navigationStackRef.current.push(pathname);
      }
    }
  }, [pathname]);

  // 1. Sync current song metadata, cover art, and playback state to Android Native Media Notification & PiP auto-enter
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const bridge = (window as any).AndroidAudioBridge;
      if (bridge) {
        if (currentTrack && typeof bridge.updateTrack === 'function') {
          const cover = currentTrack.thumbnail || currentTrack.thumb || '';
          bridge.updateTrack(currentTrack.title, currentTrack.artist, isPlaying, cover);
        }
        if (typeof bridge.setAudioPlaying === 'function') {
          bridge.setAudioPlaying(isPlaying);
        }
      }
    }
  }, [currentTrack, isPlaying]);

  // 2. Handle Android Notification Media Controller Actions (Previous, Play/Pause, Next)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    (window as any).handleNotificationMediaAction = (action: string) => {
      if (action === 'prev') {
        audio.playPrev();
      } else if (action === 'toggle') {
        audio.togglePlay();
      } else if (action === 'next') {
        audio.playNext();
      }
    };

    return () => {
      delete (window as any).handleNotificationMediaAction;
    };
  }, [audio.playPrev, audio.togglePlay, audio.playNext]);

  // 2. Layer-by-Layer Android Hardware Back Button Navigation
  useEffect(() => {
    if (typeof window === 'undefined') return;

    (window as any).handleAndroidBack = () => {
      // Layer 1: Close full screen lyrics if open
      if (isLyricsFullscreen) {
        closeFullscreenLyrics();
        return 'handled';
      }

      // Layer 2: Close Now Playing modal if open
      if (isNowPlayingModalOpen) {
        setNowPlayingModalOpen(false);
        return 'handled';
      }

      // Layer 3: Close flyout drawers if open
      if (isQueueSidebarOpen) {
        toggleQueueSidebar(false);
        return 'handled';
      }
      if (isLyricsSidebarOpen) {
        toggleLyricsSidebar(false);
        return 'handled';
      }
      if (isNowPlayingSidebarOpen) {
        toggleNowPlayingSidebar(false);
        return 'handled';
      }
      if (isRecDrawerOpen) {
        toggleRecDrawer(false);
        return 'handled';
      }

      // Layer 4: Close popup modals if open
      if (editingPlaylist) {
        closeEditPlaylistModal();
        return 'handled';
      }
      if (deletingPlaylist) {
        closeDeletePlaylistModal();
        return 'handled';
      }
      if (isNewPlaylistModalOpen) {
        setIsNewPlaylistModalOpen(false);
        return 'handled';
      }
      if (isBrandModalOpen) {
        setIsBrandModalOpen(false);
        return 'handled';
      }

      // Layer 5: Pop page navigation stack layer by layer
      if (navigationStackRef.current.length > 1) {
        navigationStackRef.current.pop(); // Pop current page
        const prevPage = navigationStackRef.current[navigationStackRef.current.length - 1] || '/';
        router.push(prevPage);
        return 'handled';
      }

      // If on non-root page but stack is 1, return to home
      if (pathname && pathname !== '/') {
        navigationStackRef.current = ['/'];
        router.push('/');
        return 'handled';
      }

      // Layer 6: At Root ('/') -> Double back press within 2s to exit smoothly
      const now = Date.now();
      if (now - lastBackPressRef.current < 2000) {
        const bridge = (window as any).AndroidAudioBridge;
        if (bridge && typeof bridge.moveToBack === 'function') {
          bridge.moveToBack();
        }
        return 'handled';
      }

      lastBackPressRef.current = now;
      showToast('Tekan sekali lagi untuk keluar');
      return 'handled';
    };

    return () => {
      delete (window as any).handleAndroidBack;
    };
  }, [
    pathname,
    router,
    isLyricsFullscreen,
    closeFullscreenLyrics,
    isNowPlayingModalOpen,
    setNowPlayingModalOpen,
    isQueueSidebarOpen,
    toggleQueueSidebar,
    isLyricsSidebarOpen,
    toggleLyricsSidebar,
    isNowPlayingSidebarOpen,
    toggleNowPlayingSidebar,
    isRecDrawerOpen,
    toggleRecDrawer,
    editingPlaylist,
    closeEditPlaylistModal,
    deletingPlaylist,
    closeDeletePlaylistModal,
    isNewPlaylistModalOpen,
    setIsNewPlaylistModalOpen,
    isBrandModalOpen,
    setIsBrandModalOpen,
    showToast,
  ]);

  // 1. Loading splash screen while checking session & guest state
  if (isAuthLoading) {
    return (
      <div className="auth-splash-loader">
        <div className="auth-splash-content">
          <img
            src="/logo.png"
            alt="Haytify"
            className="auth-splash-icon"
            style={{
              width: 96,
              height: 96,
              borderRadius: '50%',
              objectFit: 'contain',
              boxShadow: '0 12px 36px rgba(0, 0, 0, 0.6), 0 0 40px rgba(30, 215, 96, 0.35)',
            }}
          />
          <span className="auth-splash-brand" style={{ letterSpacing: '0.04em', marginTop: 4 }}>
            Haytify
          </span>
          <div className="auth-splash-spinner" />
        </div>
      </div>
    );
  }

  // 2. Pure Auth Gate when user is not logged in and not in guest mode
  if (!user && !isGuest) {
    return (
      <>
        <AuthGate />
        <Toast />
      </>
    );
  }

  const hasRightSidebar = isQueueSidebarOpen || isLyricsSidebarOpen || isNowPlayingSidebarOpen;

  // 3. Complete Haytify App Shell (Logged-in user or Guest)
  return (
    <>
      {/* Persistent Audio Engine */}
      <GlobalAudioPlayer />

      <div
        id="app"
        className={`${isNowPlayingSidebarOpen ? 'has-now-playing-sidebar' : ''} ${isQueueSidebarOpen ? 'has-queue-sidebar' : ''} ${isLyricsSidebarOpen ? 'has-lyrics-sidebar' : ''} ${hasRightSidebar ? 'has-right-sidebar' : ''}`.trim()}
      >
        {/* Desktop Left Sidebar */}
        <Sidebar />

        {/* Main Scrollable Stage */}
        <main id="main-content" className="main-content">
          {children}
        </main>

        {/* Desktop Player Bar */}
        <PlayerBar />

        {/* Mobile Mini Player Pill (Floating 16px above dock) */}
        <MobileMiniPlayer />

        {/* Mobile Bottom Dock */}
        <BottomDock />

        {/* Flyout Drawers & Modals */}
        <NowPlayingSidebar />
        <QueueSidebar />
        <LyricsSidebar />
        <RecDrawer />
        <NewPlaylistModal />
        <EditPlaylistModal />
        <DeletePlaylistModal />
        <FullscreenLyricsModal />
        <AuthModal />
        <Toast />
      </div>
    </>
  );
}

export default AppShell;

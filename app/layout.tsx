import type { Metadata, Viewport } from 'next';
import React from 'react';
import './globals.css';
import { AudioProvider } from '@/context/AudioContext';
import AppShell from '@/components/layout/AppShell';

export const metadata: Metadata = {
  metadataBase: new URL('https://playtifyy.vercel.app'),
  title: 'Playtify - Pemutar Musik Online Modern',
  description: 'Streaming musik bebas hambatan dengan rekomendasi YouTube terupdate, profil artis lengkap, dan audio stabil.',
  manifest: '/manifest.json',
  icons: {
    icon: '/icon-192.png',
    apple: '/icon-192.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AudioProvider>
          <AppShell>{children}</AppShell>
        </AudioProvider>
      </body>
    </html>
  );
}

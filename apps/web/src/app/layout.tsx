import type React from 'react';
import '@repo/ui/globals.css';
import '@/globals.css';
import { cn } from '@ui/lib/utils';
import type { Metadata, Viewport } from 'next';
import { Inter as FontSans } from 'next/font/google';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: 'Easy Workout Tracker',
  description:
    'Track your workouts and stay fit with our easy-to-use workout tracker.',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={cn(
        'min-h-screen bg-background font-sans antialiased',
        fontSans.variable,
      )}
      suppressHydrationWarning
    >
      <body>{children}</body>
    </html>
  );
}

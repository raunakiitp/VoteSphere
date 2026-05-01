import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import AppProviders from '@/components/AppProviders';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: 'VoteSphere – Intelligent Election Companion',
  description:
    'AI-powered civic-tech platform guiding citizens through every step of the electoral process. Powered by Google Gemini, Firebase, and Google Maps.',
  keywords: 'elections, voter registration, polling stations, civic education, AI assistant, India elections, ECI, EPIC card',
  authors: [{ name: 'VoteSphere Team' }],
  robots: 'index, follow',
  openGraph: {
    title: 'VoteSphere – Intelligent Election Companion',
    description: 'Your AI-powered guide to democratic participation in India.',
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VoteSphere – Intelligent Election Companion',
    description: 'Your AI-powered guide to democratic participation in India.',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#050b1a',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://generativelanguage.googleapis.com" />
      </head>
      <body className={inter.className}>
        {/* Accessibility: Skip to main content */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:bg-blue-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:font-semibold focus:outline-none focus:ring-2 focus:ring-white"
        >
          Skip to main content
        </a>

        <AppProviders>
          {/* Main landmark for screen readers */}
          <div id="main-content" role="main">
            {children}
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: 'rgba(10, 22, 40, 0.95)',
                color: '#f1f5f9',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                backdropFilter: 'blur(20px)',
                borderRadius: '0.75rem',
              },
              duration: 4000,
              // Accessible: announce toasts to screen readers
              ariaProps: {
                role: 'status',
                'aria-live': 'polite',
              },
            }}
          />
        </AppProviders>
      </body>
    </html>
  );
}

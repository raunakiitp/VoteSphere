import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import AppProviders from '@/components/AppProviders';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'VoteSphere – Intelligent Election Companion',
  description:
    'AI-powered civic-tech platform guiding citizens through every step of the electoral process. Powered by Google Gemini, Firebase, and Google Maps.',
  keywords: 'elections, voter registration, polling stations, civic education, AI assistant, India elections',
  openGraph: {
    title: 'VoteSphere – Intelligent Election Companion',
    description: 'Your AI-powered guide to democratic participation.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#050b1a" />
      </head>
      <body className={inter.className}>
        <AppProviders>
          {children}
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
            }}
          />
        </AppProviders>
      </body>
    </html>
  );
}

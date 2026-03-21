import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://quiz.theautomateddoctor.com'),
  title: 'Dark Triad Profiler — Discover Your Dark Side',
  description:
    'Take the validated Dark Triad personality assessment. Based on NPI, Levenson SRPS, and MACH-IV scales used by researchers worldwide. Takes 3 minutes.',
  openGraph: {
    title: 'Dark Triad Profiler',
    description: 'How much of the Dark Triad do you carry? Take the test.',
    type: 'website',
    siteName: 'The Automated Doctor',
    images: [
      {
        url: '/api/og?page=dark-triad',
        width: 1200,
        height: 630,
        alt: 'Dark Triad Profiler — Discover Your Dark Side',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dark Triad Profiler',
    description: 'How much of the Dark Triad do you carry? Take the test.',
    images: ['/api/og?page=dark-triad'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}

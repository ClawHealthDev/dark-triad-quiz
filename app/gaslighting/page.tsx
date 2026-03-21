import type { Metadata } from 'next';
import { Suspense } from 'react';
import GasQuizClient from '@/components/gaslighting/GasQuizClient';

export const metadata: Metadata = {
  title: "Gaslighting Test — Am I Being Gaslit? | The Automated Doctor",
  description:
    "Gaslighting erodes your trust in your own perception. Take this 14-question awareness quiz to identify common indicators and get your free Reality Grounding Guide.",
  keywords: [
    'gaslighting test',
    'am I being gaslit quiz',
    'gaslighting questionnaire',
    'gaslighting awareness quiz',
    'psychological manipulation quiz',
    'emotional abuse assessment',
    'dopamine trap',
    'the automated doctor',
  ],
  alternates: {
    canonical: 'https://quiz.theautomateddoctor.com/gaslighting',
  },
  openGraph: {
    title: "You're Not Crazy — You Might Be Getting Gaslit",
    description:
      "14 questions. Immediate results. Free Reality Grounding Guide sent to your inbox.",
    url: "https://quiz.theautomateddoctor.com/gaslighting",
    siteName: "The Automated Doctor",
    type: "website",
    images: [
      {
        url: '/api/og?page=gaslighting',
        width: 1200,
        height: 630,
        alt: 'Gaslighting Test — The Automated Doctor',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Gaslighting Test — Am I Being Gaslit?",
    description:
      "14 questions to identify gaslighting patterns. Get your free Reality Grounding Guide. By The Automated Doctor.",
    images: ['/api/og?page=gaslighting'],
  },
};

export default function GaslightingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border-2 border-teal-400 border-t-transparent animate-spin" />
        </div>
      }
    >
      <GasQuizClient />
    </Suspense>
  );
}

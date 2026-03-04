'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

type Status = 'loading' | 'ready' | 'error';

export default function SuccessClient() {
  const searchParams = useSearchParams();
  const stripeSessionId = searchParams.get('session_id');
  const quizSessionId = searchParams.get('quiz_session_id');

  const [status, setStatus] = useState<Status>('loading');
  const [downloadReady, setDownloadReady] = useState(false);

  useEffect(() => {
    if (!quizSessionId) {
      setStatus('error');
      return;
    }

    // Poll for payment confirmation (webhook may take a moment)
    let attempts = 0;
    const maxAttempts = 12; // 12 × 2.5s = 30s
    const interval = setInterval(async () => {
      attempts++;
      try {
        const res = await fetch(`/api/quiz/session/${quizSessionId}`);
        if (!res.ok) {
          if (attempts >= maxAttempts) {
            clearInterval(interval);
            setStatus('error');
          }
          return;
        }
        const data = await res.json();
        if (data.paid_report_unlocked) {
          clearInterval(interval);
          setDownloadReady(true);
          setStatus('ready');
        } else if (attempts >= maxAttempts) {
          clearInterval(interval);
          // Show ready anyway — webhook might just be slow
          setDownloadReady(true);
          setStatus('ready');
        }
      } catch {
        if (attempts >= maxAttempts) {
          clearInterval(interval);
          setStatus('error');
        }
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [quizSessionId]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-12 h-12 border-2 border-[#c0392b] border-t-transparent rounded-full animate-spin mx-auto mb-6" />
          <h1 className="text-xl font-bold text-white mb-2">Confirming your payment…</h1>
          <p className="text-gray-500 text-sm">This takes a few seconds. Please wait.</p>
        </div>
      </div>
    );
  }

  if (status === 'error' && !downloadReady) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-4xl mb-6">⚠️</div>
          <h1 className="text-2xl font-bold text-white mb-3">Something went wrong</h1>
          <p className="text-gray-400 text-sm mb-6">
            We couldn&apos;t verify your payment automatically. Don&apos;t worry — if your payment went through,
            your report will be available shortly. Check your email, or contact us at{' '}
            <a href="mailto:support@theautomateddoctor.com" className="text-[#c0392b]">
              support@theautomateddoctor.com
            </a>
          </p>
          <Link href="/" className="text-gray-500 hover:text-gray-300 text-sm">← Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] px-4 py-12">
      <div className="max-w-lg mx-auto">
        {/* Success header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-5">
            <span className="text-2xl">✓</span>
          </div>
          <h1 className="text-3xl font-black text-white mb-3">
            Your report is ready
          </h1>
          <p className="text-gray-400 text-sm">
            Thank you for your purchase. Your personalised Dark Triad Action Plan is waiting below.
          </p>
        </div>

        {/* Download card */}
        {quizSessionId && downloadReady && (
          <div className="rounded-xl border border-[#c0392b]/30 bg-[#c0392b]/8 p-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="text-3xl">📄</div>
              <div className="flex-1">
                <h2 className="font-bold text-white mb-1">Dark Triad Action Plan</h2>
                <p className="text-sm text-gray-400 mb-4">
                  Your personalised 6-page PDF report with per-trait analysis, management strategies, and recommended reading.
                </p>
                <a
                  href={`/api/report/${quizSessionId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#c0392b] hover:bg-[#a93226] text-white font-semibold text-sm rounded-lg transition-colors"
                >
                  ↓ Download PDF Report
                </a>
              </div>
            </div>
          </div>
        )}

        {/* What&apos;s in the report */}
        <div className="rounded-xl border border-white/10 bg-white/3 p-5 mb-6">
          <h3 className="font-semibold text-sm text-white mb-3">What&apos;s in your report</h3>
          <ul className="space-y-2">
            {[
              'Score summary with percentile rankings',
              'Deep-dive on each of your 3 traits',
              'Personalised management or protection strategies',
              'Recommended reading based on your profile',
              'Shareable insights and next steps',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-gray-400">
                <span className="text-[#c0392b] mt-0.5">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="flex-1 py-3 border border-white/10 hover:border-white/20 text-gray-400 hover:text-white text-center text-sm font-medium rounded-lg transition-all"
          >
            ← Home
          </Link>
          <Link
            href="/quiz"
            className="flex-1 py-3 border border-white/10 hover:border-white/20 text-gray-400 hover:text-white text-center text-sm font-medium rounded-lg transition-all"
          >
            Take Again
          </Link>
        </div>

        {stripeSessionId && (
          <p className="text-center text-xs text-gray-700 mt-4">
            Order ref: {stripeSessionId.slice(-12)}
          </p>
        )}
      </div>
    </div>
  );
}

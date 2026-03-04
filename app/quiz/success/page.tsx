import { Suspense } from 'react';
import SuccessClient from './SuccessClient';

export const metadata = {
  title: 'Payment Successful — Dark Triad Profiler',
};

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-gray-500">Loading…</div>
      </div>
    }>
      <SuccessClient />
    </Suspense>
  );
}

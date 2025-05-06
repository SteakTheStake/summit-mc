
'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      toast.success('Payment successful! Your download will be available soon.');
      setTimeout(() => {
        router.push('/vault');
      }, 3000);
    }
  }, [sessionId, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Thank You!</h1>
        <p className="text-xl">Your purchase was successful.</p>
        <p className="text-gray-400 mt-2">Redirecting to your vault...</p>
      </div>
    </div>
  );
}

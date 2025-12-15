'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dataParam = searchParams.get('data');

  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [paymentData, setPaymentData] = useState<any>(null);

  // Decode payment data OR restore from localStorage
  useEffect(() => {
    if (paymentData) return;

    if (dataParam) {
      try {
        const decoded = atob(dataParam);
        const parsed = JSON.parse(decoded);

        setPaymentData(parsed);
        localStorage.setItem('paymentData', JSON.stringify(parsed));
        setStatus('success');
        return;
      } catch (err) {
        console.error('Decode error', err);
      }
    }

    // Fallback on reload
    const stored = localStorage.getItem('paymentData');
    if (stored) {
      setPaymentData(JSON.parse(stored));
      setStatus('success');
    } else {
      setStatus('failed');
    }
  }, [dataParam, paymentData]);

  if (status === 'loading') {
    return <p className="text-center mt-10">Verifying payment...</p>;
  }

  if (status === 'failed') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-red-500 text-xl">Payment failed</p>
        <button
          onClick={() => router.push('/')}
          className="px-6 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
        >
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <main className="bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold text-green-400">Payment Successful ✅</h1>

      {paymentData && (
        <div className="text-gray-300 text-center space-y-1">
          <p><b>Transaction:</b> {paymentData.transaction_uuid}</p>
          <p><b>Amount:</b> {paymentData.total_amount}</p>
          <p><b>Status:</b> {paymentData.status}</p>
        </div>
      )}

      <button
        onClick={() => {
          localStorage.removeItem('paymentData');
          router.push('/')}}
        className="mt-6 px-8 py-3 bg-green-500 text-black font-semibold rounded hover:bg-green-400 transition"
      >
        Go to Home
      </button>
    </main>
  );
}

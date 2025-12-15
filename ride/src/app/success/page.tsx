// app/success/page.tsx
'use client';

import { useSearchParams, useRouter } from 'next/navigation'; // Use both hooks from next/navigation
import { useEffect } from 'react';

export default function SuccessPage() {
  const searchParams = useSearchParams();  // Use to get query parameters
  const router = useRouter();  // Use to redirect
  const transactionUuid = searchParams.get('transaction_uuid');  // Get the transaction_uuid from the URL

  useEffect(() => {
    if (!transactionUuid) {
      // If no transaction_uuid, redirect to the homepage immediately
      router.push('/ghar');
      return;
    }

    // Simulate fetching payment verification from your backend
    fetch('/api/verify-esewa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transaction_uuid: transactionUuid }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // If payment is successful, optionally display success message
          console.log('Payment verified!', data);
        } else {
          // If verification fails, you can show an error or do other actions
          console.log('Payment failed!', data);
        }

        // Redirect to the homepage after 2 seconds (or immediately if you prefer)
        setTimeout(() => {
          router.push('/');  // Redirect to the homepage
        }, 2000);  // You can adjust the delay time
      })
      .catch((error) => {
        console.error('Error verifying payment:', error);
        router.push('/');  // If there's an error, redirect to the homepage
      });
  }, [transactionUuid, router]);

  return (
    <main>
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center h-screen gap-6">
        <h1 className="text-4xl font-bold text-green-400">Success!</h1>
        <p className="text-gray-400 text-lg">
          Your payment was completed successfully. You will be redirected shortly...
        </p>
      </div>
    </main>
  );
}

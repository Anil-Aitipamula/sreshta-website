'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CheckoutPay() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/cart');
  }, [router]);

  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      <div className="w-10 h-10 border-4 border-navy/20 border-t-navy rounded-full animate-spin mx-auto mb-4" />
      <p className="text-sm text-gray-500">Redirecting to cart…</p>
    </div>
  );
}

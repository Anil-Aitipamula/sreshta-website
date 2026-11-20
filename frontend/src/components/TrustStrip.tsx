'use client';

import React from 'react';

const TRUST_POINTS = [
  {
    icon: (
      <svg className="w-5 h-5 text-[#bb984d]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
      </svg>
    ),
    title: '100% Certified Purity',
    desc: 'BIS 916 Hallmarked Gold & 925 Silver',
  },
  {
    icon: (
      <svg className="w-5 h-5 text-[#bb984d]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Direct Craftsman Value',
    desc: 'Factory-Direct Pricing • No Middlemen',
  },
  {
    icon: (
      <svg className="w-5 h-5 text-[#bb984d]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.25V3.75a1.125 1.125 0 00-1.125-1.125h-6.75a1.125 1.125 0 00-1.125 1.125v15" />
      </svg>
    ),
    title: 'Insured Pan-India Delivery',
    desc: '100% Safe & Tamper-Proof Transit',
  },
  {
    icon: (
      <svg className="w-5 h-5 text-[#bb984d]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
    title: 'Live WhatsApp Video Shopping',
    desc: 'Inspect Real Pieces in HD (+91 99896 08595)',
  },
];

export default function TrustStrip() {
  return (
    <section className="w-full bg-[#fcfaf7] border-y border-[#bb984d]/20 py-4 sm:py-5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-gray-200/80">
          {TRUST_POINTS.map((point, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-3 pt-3 sm:pt-0 ${
                idx > 0 ? 'sm:pl-6' : ''
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-white shadow-sm border border-[#bb984d]/30 flex items-center justify-center shrink-0">
                {point.icon}
              </div>
              <div className="min-w-0">
                <h4 className="text-[12px] sm:text-[13px] font-semibold text-[#102353] leading-snug truncate">
                  {point.title}
                </h4>
                <p className="text-[10px] sm:text-[11.5px] text-gray-500 leading-tight truncate">
                  {point.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


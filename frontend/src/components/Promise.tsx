'use client';

import { motion } from 'framer-motion';

const ITEMS = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 15l-3-3m0 0l3-3m-3 3h8M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z"/>
      </svg>
    ),
    label: '100% Certified Hallmark',
    desc: 'BIS 916 Gold & 925 Pure Silver',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="11" cy="11" r="6"/>
        <path d="M20 20l-4-4"/>
      </svg>
    ),
    label: 'Complete Transparency',
    desc: 'Exact Net Weight & Stone Breakdown',
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 10v6h3m3 0h6m3 0h3v-4l-3-3h-4v7m-8 0a2 2 0 104 0m4 0a2 2 0 104 0M3 10V6h11v10"/>
      </svg>
    ),
    label: 'Insured Express Shipping',
    desc: 'Tamper-Proof Pan-India Delivery',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"/>
      </svg>
    ),
    label: 'Ethical Master Karigars',
    desc: 'Generations of Handcrafted Excellence',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="14" r="5" />
        <path d="M10 9l2-4 2 4M6 14h1m10 0h1" />
      </svg>
    ),
    label: 'Bespoke Customisation',
    desc: 'Your Dream Design Crafted to Life',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
      </svg>
    ),
    label: 'Personalised Video Calls',
    desc: 'View Real Pieces Live on WhatsApp',
  }
];

export default function PromiseSection({ labels }: { labels?: string[] }) {
  const finalLabels = labels && labels.length === 6 ? labels : ITEMS.map(item => item.label);

  return (
    <section className="bg-white py-12 md:py-16 overflow-hidden border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-14">
          {/* Left Titling */}
          <div className="w-full lg:w-5/12 text-center lg:text-left">
            <span className="text-[#bb984d] text-xs font-semibold tracking-widest uppercase block mb-2">
              ✦ Trust & Assurance ✦
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#102353] leading-tight mb-4">
              The Sreshta <br className="hidden sm:inline" />
              <span className="text-[#bb984d] italic font-semibold">Royal Promise</span>
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed max-w-md mx-auto lg:mx-0 font-normal">
              For generations, Sreshta Jewellers has stood for uncompromising purity, heritage craftsmanship, and royal transparency. Every jewel is a promise kept.
            </p>
          </div>

          {/* Right Info Box */}
          <div className="w-full lg:w-7/12">
            <div className="border border-[#102353]/15 rounded-2xl bg-gradient-to-br from-[#fcfbf9] to-[#f6f8fc] p-6 sm:p-8 shadow-sm">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8">
                {ITEMS.map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#102353] text-[#bb984d] flex items-center justify-center mb-3 shadow-sm border border-[#bb984d]/30">
                      {item.icon}
                    </div>
                    <h4 className="text-[#102353] font-semibold text-xs sm:text-sm leading-snug mb-1">
                      {finalLabels[idx]}
                    </h4>
                    <p className="text-[11px] text-gray-500 font-normal leading-tight">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

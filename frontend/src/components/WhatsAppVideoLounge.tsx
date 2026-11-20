'use client';

import React from 'react';
import { cmsSrc } from '@/lib/cmsAsset';

export default function WhatsAppVideoLounge({ liveImage }: { liveImage?: string | null }) {
  const waNumber = '919989608595';
  const videoCallUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent('Hi Sreshta Jewellers, I would like to book a 1-on-1 Live WhatsApp Video Shopping Consultation.')}`;
  const chatUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent('Hi Sreshta Jewellers, I would like to enquire about your jewellery collections.')}`;
  const visualSrc = liveImage ? cmsSrc(liveImage) : '/images/hero_arch_necklace.webp';

  return (
    <section className="w-full py-10 sm:py-14 bg-gradient-to-br from-[#102353] via-[#0d1d45] to-[#08132e] text-white relative overflow-hidden my-4 sm:my-8">
      {/* Decorative luxury gold ambient accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#bb984d]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#25D366]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-[#bb984d]/40 text-[#bb984d] text-xs font-semibold tracking-wider uppercase mb-4">
              <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
              <span>Live Video Shopping Lounge</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal leading-tight tracking-tight mb-4 text-white">
              Experience Royal Jewellery{' '}
              <span className="text-[#bb984d] italic font-semibold">Live From Home</span>
            </h2>

            <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6 max-w-xl mx-auto lg:mx-0 font-normal">
              Can't visit our boutique in person? Connect directly with our master jewellery consultants over a private 1-on-1 WhatsApp video call. View actual pieces in crystal-clear HD, check hallmarking, and explore customized bridal designs before you buy.
            </p>

            {/* Feature badges */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-8 text-left max-w-lg mx-auto lg:mx-0">
              <div className="flex items-start gap-2.5">
                <span className="text-[#bb984d] text-base leading-none">✦</span>
                <span className="text-xs sm:text-sm text-gray-200">Real-Time HD Close-Ups & Weight Check</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-[#bb984d] text-base leading-none">✦</span>
                <span className="text-xs sm:text-sm text-gray-200">Live BIS Hallmark & Purity Verification</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-[#bb984d] text-base leading-none">✦</span>
                <span className="text-xs sm:text-sm text-gray-200">Direct Karigar Consultation & Sizing</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-[#bb984d] text-base leading-none">✦</span>
                <span className="text-xs sm:text-sm text-gray-200">100% Free & No Obligation to Purchase</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5">
              <a
                href={videoCallUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold text-xs sm:text-sm tracking-wide uppercase transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                </svg>
                <span>Book Live Video Call</span>
              </a>

              <a
                href={chatUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium text-xs sm:text-sm transition-all duration-200"
              >
                <span>Chat on WhatsApp: +91 99896 08595</span>
              </a>
            </div>
          </div>

          {/* Right Visual Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm rounded-2xl overflow-hidden border-2 border-[#bb984d]/40 shadow-2xl bg-[#091533] p-4 text-center">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-black/40 mb-4 border border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={visualSrc}
                  alt="Live Jewellery Inspection"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[10px] text-white flex items-center gap-1 font-mono">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  <span>LIVE DEMO</span>
                </div>
                <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-[#25D366] text-[10px] text-white font-bold flex items-center gap-1">
                  <span>WhatsApp HD</span>
                </div>
              </div>

              <div className="text-left px-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-semibold text-white">Master Karigar Assistance</h4>
                  <span className="text-[11px] text-[#bb984d] font-medium">Available Mon - Sat</span>
                </div>
                <p className="text-xs text-gray-400">
                  Instant scheduling • Over 800+ live video consultations completed across India & worldwide.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


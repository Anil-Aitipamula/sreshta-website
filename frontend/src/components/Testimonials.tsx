'use client';

import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TESTIMONIAL_REVIEWS } from '@/lib/data';
import { cmsSrc } from '@/lib/cmsAsset';

interface Props {
  live?: {
    images: (string | null)[];
    names: (string | null)[];
    texts: (string | null)[];
  };
}

export default function Testimonials({ live }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const liveImages = live?.images || [];
  const liveNames = live?.names || [];
  const liveTexts = live?.texts || [];

  const count = Math.max(liveNames.length, TESTIMONIAL_REVIEWS.length);
  const items = Array.from({ length: count })
    .map((_, i) => {
      const d = TESTIMONIAL_REVIEWS[i];
      return {
        name: liveNames[i] || d?.name || 'Sreshta Customer',
        text: liveTexts[i] || d?.text || 'Exquisite craftsmanship and pure authentic quality. Loved the personal video consultation on WhatsApp!',
        img: liveImages[i] ? cmsSrc(liveImages[i]) : d?.img || '/images/category/silver_image.png',
      };
    })
    .filter((it) => it.name || it.text);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const progress = (scrollLeft / (scrollWidth - clientWidth)) * 100;
    setScrollProgress(progress);
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener('resize', handleScroll);
    return () => window.removeEventListener('resize', handleScroll);
  }, []);

  return (
    <section className="bg-[#fcfbf9] py-12 sm:py-16 overflow-hidden border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#bb984d]/10 border border-[#bb984d]/30 text-[#bb984d] text-xs font-semibold uppercase tracking-wider mb-2">
            <span>★★★★★</span>
            <span>4.9 / 5 Rating</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-[#102353] tracking-tight mb-3">
            Voices of Royal Trust
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm font-normal">
            Real stories from over 1,200+ patrons and brides across India who celebrate their moments with Sreshta.
          </p>
        </div>

        {/* Reviews Carousel */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-6 overflow-x-auto pb-6 pt-2 px-2 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map((item, idx) => (
            <div
              key={idx}
              className="min-w-[280px] sm:min-w-[320px] max-w-[340px] shrink-0 snap-center bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* 5 Stars */}
                <div className="flex items-center gap-1 text-[#bb984d] text-sm mb-3">
                  {'★★★★★'}
                </div>

                {/* Review Text */}
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed italic mb-6">
                  &ldquo;{item.text}&rdquo;
                </p>
              </div>

              {/* Author & Photo */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 border border-[#bb984d]/30 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-xs sm:text-sm text-[#102353] leading-snug">
                    {item.name}
                  </h4>
                  <span className="text-[10px] text-[#25D366] font-medium flex items-center gap-1">
                    <span>✓</span> Verified Customer
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

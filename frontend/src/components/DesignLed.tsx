'use client';

import { useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import Link from 'next/link';
import { DESIGN_LED_ITEMS } from '@/lib/data';
import { cmsSrc } from '@/lib/cmsAsset';

interface Props {
  liveImages?: (string | null)[];
  liveLabels?: (string | null)[];
}

export default function DesignLed({ liveImages, liveLabels }: Props) {
  const [overrides, setOverrides] = useState<(string | null)[]>(
    liveImages ? liveImages.map((f) => (f ? cmsSrc(f) : null)) : new Array(6).fill(null)
  );
  const [labelOverrides, setLabelOverrides] = useState<(string | null)[]>(liveLabels || new Array(3).fill(null));

  useEffect(() => {
    if (!liveImages && !liveLabels) {
      fetch('/api/upload/design-led')
        .then((r) => r.json())
        .then((d) => {
          if (d.images) setOverrides(d.images.map((file: string | null) => (file ? cmsSrc(file) : null)));
          if (d.labels) setLabelOverrides(d.labels);
        })
        .catch(() => {});
    }
  }, [liveImages, liveLabels]);

  const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.2 } },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.23, 1, 0.32, 1] },
    },
  };

  const popVariants: Variants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: 'spring', stiffness: 150, damping: 12, delay: 0.2 },
    },
  };

  return (
    <section className="bg-white py-12 sm:py-16 border-b border-gray-100">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 px-4">
        <span className="text-[#bb984d] text-xs font-semibold tracking-widest uppercase block mb-2">
          ✦ Couture Excellence ✦
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-[#102353] tracking-tight mb-3">
          Design-Led Fine Jewellery
        </h2>
        <p className="text-gray-500 text-xs sm:text-sm font-normal">
          Masterpieces conceptualized with artistic vision and brought to life with precision casting.
        </p>
      </div>

      {/* Grid container */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {DESIGN_LED_ITEMS.map((item, idx) => {
          const largeIndex = idx * 2;
          const smallIndex = idx * 2 + 1;
          const displayLarge = overrides[largeIndex] || item.largeImg;
          const displaySmall = overrides[smallIndex] || item.smallImg;
          const displayLabel = labelOverrides[idx] || item.label;

          return (
            <motion.div variants={cardVariants} key={idx} className="flex flex-col items-center">
              <Link href={`/jewellery/${item.slug}`} className="flex flex-col items-center w-full group">
                {/* Image Box */}
                <div className="relative w-full max-w-[360px] mx-auto mb-16 sm:mb-20 border-2 border-[#bb984d]/50 rounded-2xl shadow-sm bg-[#fafafa] group-hover:border-[#bb984d] group-hover:shadow-lg transition-all duration-300">
                  <img
                    src={displayLarge}
                    alt={`${displayLabel} worn`}
                    className="w-full object-cover rounded-2xl"
                    draggable={false}
                  />

                  {/* Overlapping small container */}
                  <div className="absolute z-10 left-1/2 bottom-0 translate-y-[65%] -translate-x-1/2">
                    <motion.div
                      variants={popVariants}
                      className="w-[140px] h-[85px] sm:w-[160px] sm:h-[95px] xl:w-[180px] xl:h-[110px] bg-white rounded-xl shadow-xl border-2 border-gray-100 flex items-center justify-center p-1.5 overflow-hidden group-hover:scale-105 transition-transform duration-300"
                    >
                      <img
                        src={displaySmall}
                        alt={displayLabel}
                        className="w-full h-full object-cover rounded-lg"
                        draggable={false}
                      />
                    </motion.div>
                  </div>
                </div>

                {/* Label below */}
                <p className="text-sm sm:text-base text-gray-700 font-serif font-semibold tracking-wide mt-2 group-hover:text-[#bb984d] transition-colors">
                  {displayLabel}
                </p>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}

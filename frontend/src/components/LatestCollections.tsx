'use client';

import { motion, Variants } from 'framer-motion';
import Link from 'next/link';
import { cmsSrc } from '@/lib/cmsAsset';

const DEFAULTS = [
  '/images/collections/resized_image.png',
  '/images/collections/resized_image_2.png',
  '/images/collections/resized_image_3.png',
];

const COLLECTION_TITLES = [
  {
    title: 'Bridal Heritage & Haram',
    tag: 'Royal Wedding Collection',
    desc: 'Timeless temple craftsmanship and grand bridal necklaces',
    link: '/jewellery/haram',
  },
  {
    title: 'Solitaires & Fine Diamonds',
    tag: 'Signature Allure',
    desc: 'Brilliant cut solitaires and sparkling certified stones',
    link: '/jewellery/solitaires',
  },
  {
    title: 'Everyday Luxury & Silver',
    tag: 'Modern Everyday',
    desc: 'Lightweight elegance sculpted for daily celebrations',
    link: '/jewellery/necklace',
  },
];

interface Props {
  live: (string | null)[];
  btnLink?: string;
}

export default function LatestCollections({ live, btnLink = '/jewellery' }: Props) {
  const imgs = DEFAULTS.map((def, i) => (live[i] ? cmsSrc(live[i]) : def));

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
  };

  return (
    <section className="bg-[#fcfbf9] py-12 sm:py-16 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <span className="text-[#bb984d] text-xs font-semibold tracking-widest uppercase block mb-2">
            ✦ Signature Edits ✦
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-[#102353] tracking-tight mb-3">
            Curated Jewellery Collections
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm font-normal">
            Impeccable artistry meets royal heritage. Explore our bespoke seasonal themes.
          </p>
        </div>

        {/* Collections Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8"
        >
          {COLLECTION_TITLES.map((col, idx) => (
            <motion.div
              variants={itemVariants}
              key={idx}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              {/* Image Frame */}
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imgs[idx]}
                  alt={col.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  draggable={false}
                />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-semibold text-[#102353] uppercase tracking-wider shadow-sm">
                  {col.tag}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-normal text-[#102353] mb-2 group-hover:text-[#bb984d] transition-colors">
                    {col.title}
                  </h3>
                  <p className="text-gray-500 text-xs sm:text-sm leading-relaxed mb-5 font-normal">
                    {col.desc}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <Link
                    href={col.link}
                    className="text-xs sm:text-[13px] font-semibold text-[#102353] group-hover:text-[#bb984d] transition-colors flex items-center gap-1 uppercase tracking-wider"
                  >
                    <span>View Collection</span>
                    <span>→</span>
                  </Link>

                  <a
                    href={`https://wa.me/919989608595?text=${encodeURIComponent(`Hi, I would like to enquire about the ${col.title} collection.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-[#25D366] hover:underline flex items-center gap-1"
                  >
                    <span>Enquire</span>
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Global CTA Button */}
        <div className="text-center mt-10 sm:mt-12">
          <Link
            href={btnLink}
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-lg bg-[#102353] hover:bg-[#0c1a3d] text-white text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Browse All Collections
          </Link>
        </div>
      </div>
    </section>
  );
}

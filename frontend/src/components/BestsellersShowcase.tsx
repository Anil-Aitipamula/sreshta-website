'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchGroupImages, groupImageForSlug } from '@/lib/erpCatalog';
import { cmsSrc } from '@/lib/cmsAsset';

interface Product {
  id: string;
  name: string;
  category: string;
  slug: string;
  price: string;
  purity: string;
  weight: string;
  image: string;
  badge: string;
}

const BESTSELLERS: Product[] = [
  {
    id: 'sreshta-01',
    name: 'Royal Sapphire Diamond Teardrop Pendant',
    category: 'Pendants',
    slug: 'pendants',
    price: '₹48,500',
    purity: '22KT • BIS 916 Gold',
    weight: '8.4 grams',
    image: '/images/hero_arch_necklace.webp',
    badge: 'Signature Design',
  },
  {
    id: 'sreshta-02',
    name: 'Heritage Guttapusala Temple Haram',
    category: 'Haram & Necklaces',
    slug: 'haram',
    price: '₹1,45,000',
    purity: '22KT • BIS 916 Gold',
    weight: '34.2 grams',
    image: '/images/category/guttapusala_haram1.png',
    badge: 'Bridal Bestseller',
  },
  {
    id: 'sreshta-03',
    name: 'Artisanal Diamond Floral Jhumkis',
    category: 'Earrings',
    slug: 'earrings',
    price: '₹62,000',
    purity: '18KT • Certified Diamonds',
    weight: '11.8 grams',
    image: '/images/category/gold_earrings.png',
    badge: 'Most Loved',
  },
  {
    id: 'sreshta-04',
    name: 'Princess Cut Solitaire Engagement Ring',
    category: 'Rings',
    slug: 'rings',
    price: '₹38,900',
    purity: '18KT Gold • VVS/EF',
    weight: '4.6 grams',
    image: '/images/category/gold_rings.png',
    badge: 'Trending',
  },
  {
    id: 'sreshta-05',
    name: 'Royal Heritage Kasulaperu Coin Necklace',
    category: 'Haram & Necklaces',
    slug: 'haram',
    price: '₹1,85,000',
    purity: '22KT • BIS 916 Gold',
    weight: '42.5 grams',
    image: '/images/category/kasulaperu_1.webp',
    badge: 'Royal Heritage',
  },
  {
    id: 'sreshta-06',
    name: 'Handcrafted Nakshi Kada Bangles (Pair)',
    category: 'Bangles',
    slug: 'bangles',
    price: '₹95,000',
    purity: '22KT • BIS 916 Gold',
    weight: '26.8 grams',
    image: '/images/category/gold_bangles.png',
    badge: 'Craftsman Exclusive',
  },
];

export default function BestsellersShowcase() {
  const waNumber = '919989608595';
  const [imageOverrides, setImageOverrides] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;
    fetchGroupImages()
      .then((overrides) => {
        if (!cancelled && overrides) setImageOverrides(overrides);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="bg-[#fcfbf9] py-12 sm:py-16 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#bb984d]/10 border border-[#bb984d]/30 text-[#bb984d] text-xs font-semibold uppercase tracking-wider mb-2">
              <span>✦</span>
              <span>SIGNATURE MASTERPIECES</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#102353] tracking-tight">
              Most Coveted Bestsellers
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm font-normal mt-1">
              Our most cherished handcrafted creations, verified with 100% BIS hallmark certifications.
            </p>
          </div>

          <Link
            href="/jewellery"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#102353] hover:text-[#bb984d] transition-colors uppercase tracking-wider self-start md:self-end"
          >
            <span>View Complete Catalogue</span>
            <span>→</span>
          </Link>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {BESTSELLERS.map((product) => {
            const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(
              `Hi Sreshta Jewellers, I would like to buy/enquire about "${product.name}" (${product.price}, ${product.purity}).`
            )}`;
            const customOverride = imageOverrides[product.slug.toLowerCase()]?.trim();
            const displayImg = customOverride ? cmsSrc(customOverride) : product.image;

            return (
              <div
                key={product.id}
                className="group bg-white rounded-2xl overflow-hidden border border-gray-200/80 shadow-sm hover:shadow-xl hover:border-[#bb984d] transition-all duration-300 flex flex-col justify-between"
              >
                {/* Product Image Frame */}
                <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-[#fcfaf7] via-white to-[#f4f7fb] p-6 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={displayImg}
                    alt={product.name}
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Badge */}
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#102353] text-[#bb984d] border border-[#bb984d]/40 text-[10px] font-bold uppercase tracking-wider shadow-sm">
                    {product.badge}
                  </div>

                  {/* Weight tag */}
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md border border-gray-100 text-[10px] font-medium text-gray-500">
                    {product.weight}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                      {product.category}
                    </span>
                    <h3 className="font-serif text-base sm:text-lg font-medium text-[#102353] group-hover:text-[#bb984d] transition-colors leading-snug mb-2">
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-500 font-normal mb-4">
                      {product.purity}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] text-gray-400 block leading-tight">Price</span>
                      <span className="text-base sm:text-lg font-bold text-[#102353]">
                        {product.price}
                      </span>
                    </div>

                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-semibold tracking-wide transition-all duration-200 shadow-sm hover:shadow active:scale-95 shrink-0"
                    >
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      <span>Buy on WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

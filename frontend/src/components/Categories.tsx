'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import {
  fetchCatalogFilters,
  fetchGroupImages,
  groupImageForSlug,
  slugifyName,
  type CatalogFilterOption,
} from '@/lib/erpCatalog';
import { cmsSrc } from '@/lib/cmsAsset';

// Premium default categories to ensure the page ALWAYS looks stunning
const DEFAULT_CATEGORIES: Array<{ name: string; slug: string; img: string; count?: number }> = [
  { name: 'Rings', slug: 'rings', img: '/images/category/gold_rings.png', count: 48 },
  { name: 'Earrings', slug: 'earrings', img: '/images/category/gold_earrings.png', count: 62 },
  { name: 'Pendants', slug: 'pendants', img: '/images/category/gold_pendant.png', count: 35 },
  { name: 'Haram & Necklaces', slug: 'haram', img: '/images/category/gold_neckalce.png', count: 54 },
  { name: 'Bangles & Kadas', slug: 'bangles', img: '/images/category/gold_bangles.png', count: 41 },
  { name: 'Vaddanam', slug: 'vaddanam', img: '/images/header/silver-vaddanam.png', count: 18 },
  { name: 'Solitaires', slug: 'solitaires', img: '/images/category/solitaire_gold.png', count: 26 },
  { name: 'Mangalsutra', slug: 'nallapusalu', img: '/images/category/mangalsutra_gold.png', count: 22 },
  { name: 'Gold Chains', slug: 'chains', img: '/images/category/gold_chain.png', count: 39 },
  { name: 'Bracelets', slug: 'bracelet', img: '/images/category/gold_bracelet.png', count: 28 },
  { name: 'Anklets', slug: 'anklets', img: '/images/category/silver_anklet.png', count: 19 },
  { name: 'Bridal Sets', slug: 'choker', img: '/images/category/guttapusala_haram1.png', count: 15 },
];

const FILTER_TABS = [
  { label: 'All Jewellery', value: 'ALL' },
  { label: 'Rings', value: 'rings' },
  { label: 'Earrings', value: 'earrings' },
  { label: 'Pendants', value: 'pendants' },
  { label: 'Haram & Necklaces', value: 'haram' },
  { label: 'Bangles', value: 'bangles' },
  { label: 'Vaddanam', value: 'vaddanam' },
  { label: 'Solitaires', value: 'solitaires' },
  { label: 'Mangalsutra', value: 'nallapusalu' },
];

interface Props {
  goldLive?: Array<{ name?: string; filename?: string | null; url?: string | null } | null>;
  silverLive?: Array<{ name?: string; filename?: string | null; url?: string | null } | null>;
}

export default function Categories({ goldLive = [], silverLive = [] }: Props) {
  const [apiGroups, setApiGroups] = useState<CatalogFilterOption[]>([]);
  const [imageOverrides, setImageOverrides] = useState<Record<string, string>>({});
  const [selectedFilter, setSelectedFilter] = useState('ALL');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [payload, images] = await Promise.all([
          fetchCatalogFilters(),
          fetchGroupImages().catch(() => ({})),
        ]);
        if (!cancelled) {
          setImageOverrides(images);
          const grps = payload.filters?.group || [];
          if (grps.length > 0) setApiGroups(grps);
        }
      } catch {
        /* fallback to defaults */
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // Merge CMS live categories, API groups, and high-res defaults
  const displayCategories = useMemo(() => {
    // 1. If admin uploaded custom categories via CMS /upload/landing
    const cmsLive = [...goldLive, ...silverLive].filter(
      (item): item is { name?: string; filename?: string | null; url?: string | null } =>
        Boolean(item && item.name && (item.filename || item.url))
    );
    if (cmsLive.length > 0) {
      return cmsLive.map((item, idx) => {
        const name = item?.name || `Category ${idx + 1}`;
        const slug = slugifyName(name);
        const uploadedImg = item?.url || item?.filename ? cmsSrc(item?.url || item?.filename) : null;
        const customOverride = imageOverrides[slug.toLowerCase()]?.trim();
        const img = uploadedImg || customOverride || groupImageForSlug(slug, imageOverrides);
        return {
          name,
          slug,
          img,
          count: 24,
        };
      });
    }

    // 2. If ERP groups available from backend
    if (apiGroups.length > 0) {
      return apiGroups.map((g) => {
        const slug = g.slug || slugifyName(g.name);
        const customOverride = imageOverrides[slug.toLowerCase()]?.trim();
        const img = customOverride || groupImageForSlug(slug, imageOverrides);
        return {
          name: g.name,
          slug,
          img,
          count: g.count,
        };
      });
    }

    // 3. Fallback defaults with admin overrides applied
    return DEFAULT_CATEGORIES.map((cat) => {
      const customOverride = imageOverrides[cat.slug.toLowerCase()]?.trim();
      return {
        ...cat,
        img: customOverride || cat.img,
      };
    });
  }, [apiGroups, imageOverrides, goldLive, silverLive]);

  // Filter items based on active tab
  const filteredCategories = useMemo(() => {
    if (selectedFilter === 'ALL') return displayCategories;
    return displayCategories.filter(
      (c) =>
        c.slug.toLowerCase().includes(selectedFilter.toLowerCase()) ||
        c.name.toLowerCase().includes(selectedFilter.toLowerCase())
    );
  }, [displayCategories, selectedFilter]);

  return (
    <section className="bg-white py-10 sm:py-14 overflow-hidden border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <span className="text-[#bb984d] text-xs font-semibold tracking-widest uppercase block mb-2">
            ✦ PURE CRAFTSMANSHIP ✦
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#102353] tracking-tight mb-3">
            Shop By Category
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm font-normal">
            Explore unique handcrafted designs across BIS 916 Hallmarked Gold & 925 Sterling Silver.
          </p>
        </div>

        {/* Filter Pills Navigation */}
        <div className="flex items-center justify-center gap-2 sm:gap-2.5 flex-wrap mb-10 sm:mb-12">
          {FILTER_TABS.map((tab) => {
            const isActive = selectedFilter === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => setSelectedFilter(tab.value)}
                className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium tracking-wide transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#102353] text-white shadow-md -translate-y-0.5'
                    : 'bg-white border border-gray-200 text-gray-700 hover:border-[#102353] hover:text-[#102353] hover:shadow-sm'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Categories Showcase Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5 md:gap-6">
          {filteredCategories.map((cat) => (
            <div key={cat.slug} className="group">
              <Link
                href={`/jewellery/${cat.slug}`}
                className="flex flex-col items-center gap-2.5 cursor-pointer"
              >
                {/* Luxury Image Card */}
                <div className="w-full aspect-square rounded-2xl overflow-hidden flex items-center justify-center transition-all duration-300 bg-gradient-to-br from-[#fcfaf7] via-white to-[#f4f7fb] border border-gray-200/80 group-hover:border-[#bb984d] group-hover:shadow-[0_10px_25px_rgba(16,35,83,0.1)] group-hover:-translate-y-1.5 p-4 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cat.img}
                    alt={cat.name}
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                  />

                  {/* Subtle corner gold accent */}
                  <span className="absolute top-2 right-2 text-[#bb984d] opacity-0 group-hover:opacity-100 transition-opacity text-xs">
                    ✦
                  </span>
                </div>

                {/* Category Label */}
                <div className="text-center">
                  <p className="text-xs sm:text-sm font-semibold text-[#102353] group-hover:text-[#bb984d] transition-colors leading-tight uppercase tracking-wider">
                    {cat.name}
                  </p>
                  {cat.count ? (
                    <span className="text-[11px] text-gray-400 font-normal block mt-0.5">
                      {cat.count}+ designs
                    </span>
                  ) : null}
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

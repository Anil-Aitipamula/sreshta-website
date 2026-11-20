'use client';

import Link from 'next/link';
import { cmsSrc } from '@/lib/cmsAsset';

export interface HeroMeta {
  filename?: string | null;
  url?: string | null;
  type?: 'image' | 'video' | 'gif' | null;
  originalName?: string | null;
  uploadedAt?: string | null;
  tagline?: string | null;
  titleLine1?: string | null;
  titleLine2?: string | null;
  subtitle?: string | null;
  primaryBtnText?: string | null;
  primaryBtnLink?: string | null;
  secondaryBtnText?: string | null;
  secondaryBtnLink?: string | null;
  sealText?: string | null;
}

export default function Hero({ meta }: { meta?: HeroMeta | null }) {
  const customSrc = meta?.url || meta?.filename ? cmsSrc(meta.url || meta.filename) : null;
  const isVideo = meta?.type === 'video';
  const showcaseImage = customSrc || '/images/lumiere_emerald_suite.webp';

  const tagline = meta?.tagline || 'TIMELESS ELEGANCE. MODERN YOU.';
  const rawTitle1 = meta?.titleLine1 || 'Jewellery That';
  const titleLine1 = rawTitle1 === 'Jewelry That' ? 'Jewellery That' : rawTitle1;
  const titleLine2 = meta?.titleLine2 || 'Tells Your Story';
  const subtitle =
    meta?.subtitle ||
    'Exquisite designs, ethically crafted to celebrate every moment that matters.';
  const primaryBtnText = meta?.primaryBtnText || 'SHOP THE COLLECTION';
  const primaryBtnLink = meta?.primaryBtnLink || '/jewellery';
  const secondaryBtnText = meta?.secondaryBtnText || 'ORDER ON WHATSAPP';
  const secondaryBtnLink =
    meta?.secondaryBtnLink ||
    'https://wa.me/919989608595?text=Hi%20Sreshta%20Jewellers%2C%20I%20would%20like%20to%20enquire%20about%20your%20jewellery%20collections.';

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-r from-[#fcfaf7] via-[#f8f5ee] to-[#f2ecdc] border-b border-[#e8e2d8]/60 pt-10 sm:pt-14 lg:pt-16 pb-12 sm:pb-16 lg:pb-20">
      {/* Decorative ambient background curves */}
      <div className="absolute top-1/4 left-0 w-80 h-80 rounded-full border border-[#bb984d]/15 pointer-events-none -translate-x-1/2" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full border border-[#bb984d]/10 pointer-events-none translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Typography & Action Buttons */}
          <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left">
            {/* Tagline */}
            <span className="text-[#bb984d] text-xs sm:text-[13px] font-semibold tracking-[0.25em] uppercase mb-4 block">
              {tagline}
            </span>

            {/* Editorial Serif Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-normal text-[#102353] leading-[1.12] tracking-tight mb-5">
              {titleLine1} <br />
              <span>{titleLine2}</span>
            </h1>

            {/* Subtitle */}
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-8 max-w-md font-normal">
              {subtitle}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-8 w-full sm:w-auto">
              <Link
                href={primaryBtnLink}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-lg bg-[#102353] hover:bg-[#0b183a] text-white text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 group"
              >
                <span>{primaryBtnText}</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>

              <a
                href={secondaryBtnLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
              >
                <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <span>{secondaryBtnText}</span>
              </a>
            </div>

            {/* Sparkle emblem */}
            <div className="text-[#bb984d] text-base opacity-75 hidden lg:block">✦</div>
          </div>

          {/* Right Column: The Arched Fine Jewellery Window & Royal Seal (Matching Lumière Reference) */}
          <div className="lg:col-span-6 relative flex items-center justify-center lg:justify-end">
            <div className="relative flex items-stretch">
              {/* Main Arched Window - Image with crisp, prominent gold border overlay (Zero extra lines) */}
              <div className="relative w-full max-w-[320px] sm:max-w-[400px] lg:max-w-[440px] aspect-[4/5] rounded-t-[180px] sm:rounded-t-[220px] rounded-bl-xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(16,35,83,0.22)] bg-[#f3ecdc] group z-10">
                {isVideo && customSrc ? (
                  <video
                    className="w-full h-full object-cover block"
                    autoPlay
                    muted
                    loop
                    playsInline
                    key={customSrc}
                  >
                    <source src={customSrc} />
                  </video>
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={showcaseImage}
                    alt="Sreshta Fine Jewellery Suite"
                    className="w-full h-full object-cover object-center block transition-transform duration-700 group-hover:scale-105"
                    loading="eager"
                  />
                )}
                {/* Crisp 2.5px Gold Arch Border Overlay (Directly framing the image with zero clipping) */}
                <div className="absolute inset-0 rounded-t-[180px] sm:rounded-t-[220px] rounded-bl-xl border-2 sm:border-[2.5px] border-[#bb984d] pointer-events-none z-20" />
              </div>

              {/* Royal Navy Vertical Right Accent Panel (Seamlessly flush with arch right edge) */}
              <div className="hidden sm:flex w-14 sm:w-16 lg:w-20 bg-[#102353] rounded-r-2xl border-y-2 border-r-2 sm:border-y-[2.5px] sm:border-r-[2.5px] border-[#bb984d] relative items-center justify-center shadow-lg z-10 -ml-px">
                {/* Decorative gold vertical hairline */}
                <div className="absolute inset-y-8 left-2 w-px bg-[#bb984d]/30" />
              </div>

              {/* Circular Hallmark Medallion Seal (Centered on the seam between Arch & Navy Panel) */}
              <div className="absolute top-1/2 -translate-y-1/2 right-14 sm:right-16 lg:right-20 translate-x-1/2 w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full bg-[#102353] border-2 border-[#bb984d] shadow-2xl flex flex-col items-center justify-center text-center p-2 z-20 group-hover:rotate-12 transition-transform duration-500">
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#bb984d]/20 flex items-center justify-center text-[#bb984d] text-xs font-bold mb-0.5">
                  ✦
                </div>
                <span className="text-[7.5px] sm:text-[8.5px] font-bold text-[#bb984d] uppercase tracking-widest leading-tight px-1">
                  FINE CRAFTSMANSHIP
                </span>
                <span className="text-[6.5px] sm:text-[7px] text-gray-300 uppercase tracking-wider mt-0.5">
                  TIMELESS BEAUTY
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

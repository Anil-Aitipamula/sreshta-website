import Header from '@/components/Header';
import Hero from '@/components/Hero';
import TrustStrip from '@/components/TrustStrip';
import Categories from '@/components/Categories';
import BestsellersShowcase from '@/components/BestsellersShowcase';
import WhatsAppVideoLounge from '@/components/WhatsAppVideoLounge';
import LatestCollections from '@/components/LatestCollections';
import CuratedStyles from '@/components/CuratedStyles';
import Testimonials from '@/components/Testimonials';
import PromiseSection from '@/components/Promise';
import Footer from '@/components/Footer';

const EMPTY_LANDING = {
  goldCategories: [],
  silverCategories: [],
  collections: [],
  curatedSlots: [],
  curatedTitles: [],
  testimonialsImages: [],
  testimonialsNames: [],
  testimonialsTexts: [],
  promise: [],
  landing_visibility: {},
};

async function getMeta() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL || 'http://localhost:4001';
  try {
    const res = await fetch(`${API_URL}/api/site/landing/content`, {
      cache: 'no-store',
    });
    if (!res.ok) return EMPTY_LANDING;
    return await res.json();
  } catch {
    return EMPTY_LANDING;
  }
}

import { Suspense } from 'react';

async function LandingContent() {
  const meta = await getMeta();

  return (
    <>
      {/* 1. Lumière-Style Fine Jewellery Hero (Integrated Trust Pillars) */}
      <Hero meta={meta?.hero} />

      {/* 2. Categories Showcase with Filter Pills Below */}
      <Categories goldLive={meta?.goldCategories} silverLive={meta?.silverCategories} />

      {/* 4. Signature Bestsellers Grid with Direct WhatsApp Order */}
      <BestsellersShowcase />

      {/* 5. Live WhatsApp Video Call Shopping VIP Lounge */}
      <WhatsAppVideoLounge
        liveImage={
          meta?.standaloneBanner?.banner ||
          meta?.standaloneBanner?.url ||
          meta?.standaloneBanner?.filename
        }
      />

      {/* 6. Curated Occasion Collections (Bridal, Solitaires, Everyday) */}
      <LatestCollections live={meta.collections || []} />

      {/* 7. Shop By Budget & Curated Gifting Styles */}
      <CuratedStyles liveSlots={meta.curatedSlots} liveTitles={meta.curatedTitles} />

      {/* 8. Voices of Royal Trust & Verified Customer Reviews */}
      <Testimonials
        live={{
          images: meta.testimonialsImages || [],
          names: meta.testimonialsNames || [],
          texts: meta.testimonialsTexts || [],
        }}
      />

      {/* 9. The Sreshta Royal Promise (6 Trust Pillars) */}
      <PromiseSection labels={meta.promise} />
    </>
  );
}

function LandingSkeleton() {
  return (
    <div className="w-full h-[60vh] bg-gray-50 flex items-center justify-center animate-pulse">
      <div className="w-16 h-16 border-4 border-[#102353] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex flex-col gap-y-0 overflow-x-clip w-full max-w-[100vw]">
        <Suspense fallback={<LandingSkeleton />}>
          <LandingContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

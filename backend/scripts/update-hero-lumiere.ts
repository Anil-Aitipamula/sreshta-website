import 'dotenv/config';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(process.cwd(), 'backend/.env') });

import { setContent } from '../src/lib/content.js';

async function main() {
  const hero = {
    filename: 'lumiere_emerald_suite.webp',
    url: '/images/lumiere_emerald_suite.webp',
    type: 'image',
    originalName: 'lumiere_emerald_suite.webp',
    uploadedAt: new Date().toISOString(),
    tagline: 'TIMELESS ELEGANCE. MODERN YOU.',
    titleLine1: 'Jewellery That',
    titleLine2: 'Tells Your Story',
    subtitle: 'Exquisite designs, ethically crafted to celebrate every moment that matters.',
    primaryBtnText: 'SHOP THE COLLECTION',
    primaryBtnLink: '/jewellery',
    secondaryBtnText: 'ORDER ON WHATSAPP',
    secondaryBtnLink: 'https://wa.me/919989608595?text=Hi%20Sreshta%20Jewellers%2C%20I%20would%20like%20to%20enquire%20about%20your%20jewellery%20collections.',
    sealText: 'FINE CRAFTSMANSHIP • TIMELESS BEAUTY',
    trust1Title: 'Certified Diamonds',
    trust1Desc: 'Authentic & ethically sourced',
    trust2Title: 'Lifetime Warranty',
    trust2Desc: 'Quality you can trust, for a lifetime',
    trust3Title: 'Free Shipping',
    trust3Desc: 'Complimentary insured delivery worldwide',
  };

  await setContent('hero', hero);
  console.log('Hero updated to Lumière arched emerald suite style successfully!');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

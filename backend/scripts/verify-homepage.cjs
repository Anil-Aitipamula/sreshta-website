fetch('http://127.0.0.1:3001')
  .then(r => r.text())
  .then(t => {
    console.log('--- Checking localhost:3001 ---');
    console.log('1. Duplicate header category bar removed:', !t.includes('class="sticky top-0 z-50 bg-navy h-[46px]'));
    console.log('2. Monthly plan banner removed:', !t.includes('Monthly Plan'));
    console.log('3. Lumiere fine jewellery hero present & dynamic:', t.includes('Jewellery That') && t.includes('Tells Your Story') && (t.includes('lumiere_emerald_suite') || t.includes('lumiere_hero_ring')));
    console.log('4. Logo visible & prominent:', (t.includes('sreshta_official_logo.png') || t.includes('brand_logo.png')) && t.includes('Sreshta Jewellers'));
    console.log('5. Categories and Filter present:', t.includes('Shop By Category') && t.includes('All Jewellery') && t.includes('Rings'));
    console.log('6. Bestsellers showcase present:', t.includes('Most Coveted Bestsellers') && t.includes('Royal Sapphire Diamond Teardrop Pendant'));
    console.log('7. WhatsApp Video Lounge present:', t.includes('Live Video Shopping Lounge') && t.includes('Experience Royal Jewellery'));
    console.log('8. Curated Occasion Collections present:', t.includes('Curated Jewellery Collections'));
    console.log('9. Gifting By Budget present:', t.includes('giftcard-under10k.webp'));
    console.log('10. Voices of Royal Trust present:', t.includes('Voices of Royal Trust'));
    console.log('11. Sreshta Royal Promise present:', t.includes('The Sreshta') && t.includes('Royal Promise'));
    console.log('12. Direct WhatsApp links intact:', t.includes('9989608595'));
    console.log('13. Scroll to top hidden at top of landing page:', !t.includes('Scroll to top'));
    console.log('14. WhatsApp floating chat present:', t.includes('Chat on WhatsApp'));
    console.log('15. Enquire spelling present in collections:', t.includes('Enquire'));
  });

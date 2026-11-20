const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function processLogos() {
  const brandSrc = 'C:/Users/aitip/.gemini/antigravity/brain/4dd92e5f-2370-42ef-b315-1bfaf1d1d427/current_brand_logo.png';
  
  console.log('Processing brand logo from:', brandSrc);

  // Trim outer white padding
  const trimmedBrandBuffer = await sharp(brandSrc)
    .trim({ background: { r: 255, g: 255, b: 255 }, threshold: 10 })
    .toBuffer();

  const brandMeta = await sharp(trimmedBrandBuffer).metadata();
  console.log(`Trimmed brand logo to: ${brandMeta.width}x${brandMeta.height}`);

  // Add generous bottom padding (35px) so JEWELLERS never hits the bottom border
  // Add gentle top padding (10px) so the letters don't appear oversized
  const brandPadded = await sharp(trimmedBrandBuffer)
    .extend({
      top: 10,
      bottom: 35,
      left: 16,
      right: 16,
      background: { r: 255, g: 255, b: 255, alpha: 0 }
    })
    .png()
    .toBuffer();

  const brandOutPath = path.resolve('..', 'frontend', 'public', 'images', 'brand_logo.png');
  fs.writeFileSync(brandOutPath, brandPadded);
  console.log('Saved processed brand logo to:', brandOutPath);
}

processLogos().catch(console.error);

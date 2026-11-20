const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function run() {
  const src = 'C:/Users/aitip/.gemini/antigravity/brain/4dd92e5f-2370-42ef-b315-1bfaf1d1d427/.user_uploaded/media_1795169617663_11e10a9e.jpg';
  
  // 1. Trim outer white background
  const trimmed = await sharp(src)
    .trim({ background: { r: 255, g: 255, b: 255 }, threshold: 10 })
    .toBuffer();
    
  const meta = await sharp(trimmed).metadata();
  console.log('Trimmed size:', meta.width, meta.height);
  
  // Resize to a clean 512x512
  const resized = await sharp(trimmed)
    .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();
    
  // Apply circular mask so corners outside the navy circle are transparent
  const svgMask = `<svg width="512" height="512"><circle cx="256" cy="256" r="255" fill="#ffffff"/></svg>`;
  const circleMask = Buffer.from(svgMask);
  
  const circularIcon = await sharp(resized)
    .composite([{ input: circleMask, blend: 'dest-in' }])
    .png()
    .toBuffer();
    
  const frontendDir = path.resolve(__dirname, '..', '..', 'frontend');
  
  // Write to frontend/src/app/icon.png (Next.js App router icon convention)
  fs.writeFileSync(path.join(frontendDir, 'src', 'app', 'icon.png'), circularIcon);
  fs.writeFileSync(path.join(frontendDir, 'src', 'app', 'apple-icon.png'), await sharp(circularIcon).resize(180, 180).png().toBuffer());
  fs.writeFileSync(path.join(frontendDir, 'public', 'icon.png'), circularIcon);
  fs.writeFileSync(path.join(frontendDir, 'public', 'favicon.ico'), await sharp(circularIcon).resize(48, 48).png().toBuffer());
  
  console.log('Generated all favicon files successfully!');
}

run().catch(console.error);

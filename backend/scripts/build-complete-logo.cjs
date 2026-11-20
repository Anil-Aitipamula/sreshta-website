const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function buildCompleteLogo() {
  // 1. Load trimmed lotus icon
  const lotusBuffer = await sharp('frontend/public/images/trimmed_lotus.png')
    .resize({ height: 580, fit: 'contain' })
    .toBuffer();
  
  const lotusMeta = await sharp(lotusBuffer).metadata();
  console.log('Scaled lotus dimensions:', lotusMeta.width, 'x', lotusMeta.height);

  // 2. Load text logo
  const textBuffer = await sharp('frontend/public/images/sreshta_official_logo.png')
    .toBuffer();
  const textMeta = await sharp(textBuffer).metadata();
  console.log('Text logo dimensions:', textMeta.width, 'x', textMeta.height);

  // 3. Composite side by side with an elegant 100px gap
  const gap = 120;
  const totalWidth = lotusMeta.width + gap + textMeta.width;
  const totalHeight = Math.max(lotusMeta.height, textMeta.height);

  const lotusTop = Math.round((totalHeight - lotusMeta.height) / 2);
  const textTop = Math.round((totalHeight - textMeta.height) / 2);

  const compositeImage = await sharp({
    create: {
      width: totalWidth,
      height: totalHeight,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 0 }
    }
  })
    .composite([
      { input: lotusBuffer, left: 0, top: lotusTop },
      { input: textBuffer, left: lotusMeta.width + gap, top: textTop }
    ])
    .png()
    .toBuffer();

  const outPath1 = path.resolve('frontend/public/images/sreshta_official_logo.png');
  const outPath2 = path.resolve('frontend/public/images/brand_logo.png');
  fs.writeFileSync(outPath1, compositeImage);
  fs.writeFileSync(outPath2, compositeImage);
  console.log('Successfully saved complete brand logo (Lotus + Sreshta Jewellers) to:');
  console.log(' -', outPath1);
  console.log(' -', outPath2);
}

buildCompleteLogo().catch(console.error);


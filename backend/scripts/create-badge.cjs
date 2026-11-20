const sharp = require('../node_modules/sharp');

async function createBadge() {
  const size = 300;
  const svgBadge = Buffer.from(`
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#102353" flood-opacity="0.15" />
        </filter>
      </defs>
      <circle cx="150" cy="150" r="144" fill="#ffffff" stroke="#bb984d" stroke-width="5" />
      <circle cx="150" cy="150" r="134" fill="none" stroke="#bb984d" stroke-width="1.5" stroke-dasharray="4,4" opacity="0.6" />
    </svg>
  `);

  const resizedLotus = await sharp('frontend/public/images/logo_icon.png')
    .resize(180, 180, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  await sharp(svgBadge)
    .composite([
      {
        input: resizedLotus,
        top: 60,
        left: 60,
      }
    ])
    .png()
    .toFile('frontend/public/images/sreshta_circular_badge.png');

  console.log('Successfully created frontend/public/images/sreshta_circular_badge.png');
}

createBadge().catch(console.error);

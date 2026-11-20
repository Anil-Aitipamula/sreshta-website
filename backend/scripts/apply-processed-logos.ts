import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { putPublicObject } from '../src/lib/objectStorage.js';
import { getContent, setContent } from '../src/lib/content.js';

async function main() {
  console.log('Uploading processed logos to Supabase Storage...');

  const brandPath = path.resolve('../frontend/public/images/brand_logo.png');
  const iconPath = path.resolve('../frontend/public/images/logo_icon.png');

  const brandBuf = fs.readFileSync(brandPath);
  const iconBuf = fs.readFileSync(iconPath);

  const brandFilename = `brand_logo_sreshta_${Date.now()}.png`;
  const iconFilename = `logo_icon_sreshta_${Date.now()}.png`;

  const brandUrl = await putPublicObject(brandFilename, brandBuf, 'image/png');
  console.log('Uploaded brand logo to:', brandUrl);

  const iconUrl = await putPublicObject(iconFilename, iconBuf, 'image/png');
  console.log('Uploaded logo icon to:', iconUrl);

  console.log('Updating site_content header record...');
  const current = await getContent<any>('header', { selectedGroups: [] });
  current.logoUrl = brandUrl;
  current.logoIconUrl = iconUrl;
  await setContent('header', current);

  console.log('Successfully updated header in Supabase database!');
}

main().catch((err) => {
  console.error('Failed to upload/update logos:', err);
  process.exit(1);
});


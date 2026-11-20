import { Router } from 'express';
import path from 'node:path';
import { getContent, setContent } from '../lib/content.js';
import { upload, safeUnlink } from '../lib/upload.js';
import { storeCmsUpload } from '../lib/objectStorage.js';

const router = Router();

export type HeroMeta = {
  filename: string | null;
  url?: string | null;
  type: 'image' | 'video' | 'gif' | null;
  originalName: string | null;
  uploadedAt: string | null;
  tagline?: string | null;
  titleLine1?: string | null;
  titleLine2?: string | null;
  subtitle?: string | null;
  primaryBtnText?: string | null;
  primaryBtnLink?: string | null;
  secondaryBtnText?: string | null;
  secondaryBtnLink?: string | null;
  trust1Title?: string | null;
  trust1Desc?: string | null;
  trust2Title?: string | null;
  trust2Desc?: string | null;
  trust3Title?: string | null;
  trust3Desc?: string | null;
};

const emptyHero: HeroMeta = {
  filename: null,
  url: null,
  type: null,
  originalName: null,
  uploadedAt: null,
  tagline: 'TIMELESS ELEGANCE',
  titleLine1: 'Crafted to',
  titleLine2: 'Shine Forever',
  subtitle: 'Discover exquisite handcrafted jewellery pieces designed to celebrate life’s most precious moments.',
  primaryBtnText: 'SHOP COLLECTION',
  primaryBtnLink: '/jewellery',
  secondaryBtnText: 'ORDER ON WHATSAPP',
  secondaryBtnLink: 'https://wa.me/919989608595?text=Hi%20Sreshta%20Jewellers%2C%20I%20would%20like%20to%20enquire%20about%20your%20jewellery%20collections.',
  trust1Title: 'Certified Diamonds',
  trust1Desc: 'Authentic & ethically sourced',
  trust2Title: 'Lifetime Warranty',
  trust2Desc: 'Quality you can trust, for a lifetime',
  trust3Title: 'Free Shipping',
  trust3Desc: 'Complimentary insured delivery worldwide',
};

function mediaType(mime: string): HeroMeta['type'] {
  if (mime === 'image/gif') return 'gif';
  if (mime.startsWith('video/')) return 'video';
  return 'image';
}

router.get('/', async (_req, res) => {
  const hero = await getContent<HeroMeta>('hero', emptyHero);
  res.json({ ...emptyHero, ...hero });
});

router.post('/', upload.single('file'), async (req, res) => {
  try {
    const prev = await getContent<HeroMeta>('hero', emptyHero);
    const updated: HeroMeta = { ...prev };

    if (req.file) {
      const allowed = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/avif',
        'video/mp4',
        'video/webm',
        'video/ogg',
      ];
      if (!allowed.includes(req.file.mimetype)) {
        return res.status(415).json({ error: 'Unsupported file type' });
      }

      if (prev.url) safeUnlink(prev.url);
      else if (prev.filename) safeUnlink(prev.filename);

      const ext = path.extname(req.file.originalname) || '.bin';
      const stored = await storeCmsUpload(req.file, `hero${ext}`);

      updated.filename = stored.filename;
      updated.url = stored.url;
      updated.type = mediaType(req.file.mimetype);
      updated.originalName = req.file.originalname;
      updated.uploadedAt = new Date().toISOString();
    }

    if (req.body) {
      const fields = [
        'tagline',
        'titleLine1',
        'titleLine2',
        'subtitle',
        'primaryBtnText',
        'primaryBtnLink',
        'secondaryBtnText',
        'secondaryBtnLink',
        'trust1Title',
        'trust1Desc',
        'trust2Title',
        'trust2Desc',
        'trust3Title',
        'trust3Desc',
      ] as const;
      fields.forEach((f) => {
        if (req.body[f] !== undefined) {
          updated[f] = String(req.body[f] || '').trim();
        }
      });
    }

    await setContent('hero', updated);
    res.json({ success: true, ...updated });
  } catch (err) {
    console.error('[hero] POST', err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

router.put('/', async (req, res) => {
  try {
    const prev = await getContent<HeroMeta>('hero', emptyHero);
    const updated: HeroMeta = {
      ...prev,
      ...req.body,
    };
    await setContent('hero', updated);
    res.json({ success: true, ...updated });
  } catch (err) {
    console.error('[hero] PUT', err);
    res.status(500).json({ error: 'Failed to update hero content' });
  }
});

router.delete('/', async (_req, res) => {
  const prev = await getContent<HeroMeta>('hero', emptyHero);
  if (prev.url) safeUnlink(prev.url);
  else if (prev.filename) safeUnlink(prev.filename);
  await setContent('hero', emptyHero);
  res.json({ success: true });
});

export default router;

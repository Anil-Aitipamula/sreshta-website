import fs from 'node:fs';
import path from 'node:path';
import { Storage } from '@google-cloud/storage';
import { publicUploadPath, UPLOADS_DIR } from './upload.js';

function trimSlash(url: string) {
  return url.replace(/\/+$/, '');
}

export function supabaseBucketName() {
  return String(process.env.SUPABASE_STORAGE_BUCKET || 'sreshta-assets').trim();
}

export function supabaseStorageConfigured() {
  return Boolean(
    process.env.SUPABASE_URL &&
      (process.env.SUPABASE_SERVICE_ROLE_KEY ||
        process.env.SUPABASE_ANON_KEY ||
        process.env.SUPABASE_KEY)
  );
}

export function gcsBucketName() {
  return String(process.env.GCS_BUCKET || '').trim();
}

export function gcsConfigured() {
  return Boolean(gcsBucketName());
}

export function publicAssetBase() {
  if (supabaseStorageConfigured()) {
    const sbUrl = trimSlash(process.env.SUPABASE_URL!);
    return `${sbUrl}/storage/v1/object/public/${supabaseBucketName()}`;
  }
  const explicit = String(process.env.GCS_PUBLIC_BASE_URL || '').trim();
  if (explicit) return trimSlash(explicit);
  const bucket = gcsBucketName();
  if (bucket) return `https://storage.googleapis.com/${bucket}`;
  return '';
}

export function isManagedAssetUrl(url: string) {
  const value = String(url || '').trim();
  if (!value) return false;
  if (value.startsWith('/uploads/') || value.startsWith('/images/')) return true;
  if (value.startsWith('data:') || value.startsWith('blob:')) return true;
  if (value.includes('/storage/v1/object/public/')) return true;
  const gcsBase = publicAssetBase();
  if (gcsBase && value.startsWith(gcsBase)) return true;
  const bucket = gcsBucketName();
  if (bucket && value.includes(`storage.googleapis.com/${bucket}/`)) return true;
  const api = trimSlash(String(process.env.PUBLIC_API_BASE_URL || process.env.PUBLIC_BASE_URL || ''));
  if (api && (value.startsWith(`${api}/uploads/`) || value.startsWith(`${api}/images/`))) return true;
  try {
    const parsed = new URL(value);
    if (parsed.pathname.startsWith('/uploads/') || parsed.pathname.startsWith('/images/')) {
      return true;
    }
  } catch {
    /* not an absolute URL */
  }
  return false;
}

export function isForeignAssetUrl(url: string) {
  const value = String(url || '').trim();
  if (!value) return false;
  if (isManagedAssetUrl(value)) return false;
  return /^https?:\/\//i.test(value) || value.startsWith('//');
}

export function isForeignImageUrl(url: string) {
  if (!isForeignAssetUrl(url)) return false;
  const value = url.toLowerCase();
  return (
    value.includes('inventory-images') ||
    value.includes('gold-develop') ||
    value.includes('run.app') ||
    /\.(avif|gif|jpe?g|png|webp)(\?|$)/i.test(value)
  );
}

function gcsClient() {
  const json = String(process.env.GCS_SERVICE_ACCOUNT_JSON || '').trim();
  if (json) {
    const credentials = JSON.parse(json) as { project_id?: string };
    return new Storage({
      credentials,
      projectId: String(process.env.GCS_PROJECT_ID || credentials.project_id || '').trim() || undefined,
    });
  }
  const email = String(process.env.GCS_CLIENT_EMAIL || '').trim();
  const key = String(process.env.GCS_PRIVATE_KEY || '').replace(/\\n/g, '\n').trim();
  if (email && key) {
    return new Storage({
      projectId: String(process.env.GCS_PROJECT_ID || '').trim() || undefined,
      credentials: { client_email: email, private_key: key },
    });
  }
  return new Storage({
    projectId: String(process.env.GCS_PROJECT_ID || '').trim() || undefined,
  });
}

/** Store a public catalog/CMS file. Production uses GCS; local/dev can use /uploads. */
export async function putPublicObject(relPath: string, buffer: Buffer, contentType = 'image/jpeg') {
  const rel = relPath.replace(/^\/+/, '').replace(/\\/g, '/');

  if (supabaseStorageConfigured()) {
    try {
      const supabaseUrl = trimSlash(process.env.SUPABASE_URL!);
      const bucket = supabaseBucketName();
      const apiKey = (process.env.SUPABASE_SERVICE_ROLE_KEY ||
        process.env.SUPABASE_ANON_KEY ||
        process.env.SUPABASE_KEY)!;
      const uploadUrl = `${supabaseUrl}/storage/v1/object/${encodeURIComponent(bucket)}/${rel}`;
      const uploadRes = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          apikey: apiKey,
          'Content-Type': contentType,
          'x-upsert': 'true',
        },
        body: new Uint8Array(buffer),
      });
      if (uploadRes.ok) {
        return `${supabaseUrl}/storage/v1/object/public/${encodeURIComponent(bucket)}/${rel}`;
      }
      const errText = await uploadRes.text().catch(() => '');
      console.warn(`[storage] Supabase upload failed (${uploadRes.status}): ${errText}. Falling back to local.`);
    } catch (err) {
      console.warn('[storage] Supabase upload exception:', err);
    }
  }

  if (gcsConfigured()) {
    const bucketName = gcsBucketName();
    const file = gcsClient().bucket(bucketName).file(rel);
    await file.save(buffer, {
      resumable: false,
      contentType,
      metadata: { cacheControl: 'public, max-age=31536000, immutable' },
    });
    if (process.env.GCS_MAKE_PUBLIC === 'true') {
      await file.makePublic().catch(() => undefined);
    }
    return `${publicAssetBase()}/${rel}`;
  }

  const full = path.join(UPLOADS_DIR, ...rel.split('/'));
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, buffer);
  return publicUploadPath(rel);
}

export async function storeCmsUpload(file: Express.Multer.File, objectName: string) {
  const origExt = path.extname(file.originalname || '') || path.extname(objectName) || '.bin';
  const ext = origExt.startsWith('.') ? origExt : `.${origExt}`;
  const filename = `${objectName.replace(/\.[^/.]+$/, '')}${ext}`.replace(/^\/+/, '');
  const buffer = file.buffer;
  if (!buffer?.length) {
    throw new Error('Empty upload');
  }
  const url = await putPublicObject(filename, buffer, file.mimetype || 'application/octet-stream');
  return { filename, url };
}

'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import {
  fetchCatalog,
  fetchCatalogFilters,
  fetchGroupImages,
  uploadGroupImage,
  resetGroupImage,
  groupImageForSlug,
  slugifyName,
  type CatalogFilterOption,
} from '@/lib/erpCatalog';

type Props = {
  title: string;
  description?: string;
};

export default function ErpGroupsPanel({ title, description }: Props) {
  const [groups, setGroups] = useState<CatalogFilterOption[]>([]);
  const [imageOverrides, setImageOverrides] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadingSlug, setUploadingSlug] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingSlugRef = useRef<string>('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const slug = pendingSlugRef.current;
    if (!file || !slug) return;
    setUploadingSlug(slug);
    try {
      const res = await uploadGroupImage(slug, file);
      setImageOverrides((prev) => ({ ...prev, [slug]: res.image }));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Image upload failed');
    } finally {
      setUploadingSlug(null);
      pendingSlugRef.current = '';
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handlePickImage = (slug: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    pendingSlugRef.current = slug;
    fileInputRef.current?.click();
  };

  const handleResetImage = async (slug: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm(`Reset image for "${slug}" to default?`)) return;
    setUploadingSlug(slug);
    try {
      await resetGroupImage(slug);
      setImageOverrides((prev) => {
        const next = { ...prev };
        delete next[slug];
        return next;
      });
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Reset failed');
    } finally {
      setUploadingSlug(null);
    }
  };

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [payload, images] = await Promise.all([
          fetchCatalogFilters(),
          fetchGroupImages().catch(() => ({})),
        ]);
        if (cancelled) return;
        setImageOverrides(images);
        const base = [...(payload.filters?.group || [])];
        const withExactCounts = await Promise.all(
          base.map(async (g) => {
            const slug = g.slug || slugifyName(g.name);
            try {
              const catalog = await fetchCatalog({ group: slug, limit: 1, offset: 0 });
              return { ...g, slug, count: catalog.total ?? g.count ?? 0 };
            } catch {
              return { ...g, slug, count: g.count ?? 0 };
            }
          }),
        );
        if (cancelled) return;
        withExactCounts.sort(
          (a, b) => (b.count || 0) - (a.count || 0) || a.name.localeCompare(b.name),
        );
        setGroups(withExactCounts);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load ERP groups');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-6 border-t border-gray-100 pt-16">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-gradient-to-r from-slate-400 to-gray-500" />
          <h2 className="text-xl font-display font-bold text-navy uppercase tracking-widest">{title}</h2>
          <span className="text-xs text-emerald-600 font-bold uppercase tracking-wider">Live ERP</span>
        </div>
        <Link
          href="/upload/jewellery"
          className="px-4 py-1.5 rounded-full border border-navy/20 text-[10px] font-black text-navy uppercase hover:bg-navy/5"
        >
          Open jewellery admin
        </Link>
      </div>

      <p className="text-sm text-gray-500">
        {description ||
          'Driven by ERP inventory groups with available stock. Edit taxonomy in Octis ERP — not in this CMS.'}
      </p>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-2xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <p className="text-sm text-rose-500">{error}</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-x-5 gap-y-8">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          {groups.map((g) => {
            const slug = g.slug || slugifyName(g.name);
            const isCustom = Boolean(imageOverrides[slug]?.trim());
            const isUploading = uploadingSlug === slug;

            return (
              <div key={g.id || slug} className="flex flex-col items-center gap-2 group">
                <div className="relative w-full aspect-square rounded-[18px] bg-[#f4f6f9] flex items-center justify-center group-hover:shadow-md transition-shadow overflow-hidden border border-gray-100">
                  <img
                    src={groupImageForSlug(slug, imageOverrides)}
                    alt={g.name}
                    className="w-[75%] h-[75%] object-contain"
                  />

                  {/* Hover upload overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-2">
                    <button
                      onClick={(e) => handlePickImage(slug, e)}
                      disabled={isUploading}
                      className="px-2.5 py-1 rounded-full bg-white text-navy text-[10px] font-bold shadow hover:bg-gold hover:text-white transition-all uppercase tracking-wider"
                    >
                      {isUploading ? '…' : 'Upload'}
                    </button>
                    {isCustom && (
                      <button
                        onClick={(e) => handleResetImage(slug, e)}
                        disabled={isUploading}
                        className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[9px] font-bold shadow hover:bg-rose-600 transition-all uppercase tracking-wider"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>

                <Link
                  href={`/upload/jewellery/${slug}`}
                  className="text-[11px] font-semibold text-center text-navy uppercase leading-tight hover:text-gold transition-colors"
                >
                  {g.name}
                </Link>

                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-gray-400">
                    {typeof g.count === 'number' ? `${g.count} items` : '—'}
                  </span>
                  <button
                    onClick={(e) => handlePickImage(slug, e)}
                    className="text-[9px] text-gold font-bold underline hover:text-navy"
                  >
                    Edit
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  CART_CHANGED_EVENT,
  loadCart,
  removeFromCart,
  type CheckoutCartItem,
} from '@/lib/checkout';
import { addToWishlist } from '@/lib/wishlist';
import { formatDisplayPrice } from '@/lib/erpCatalog';
import { quoteCartOffer, type OfferQuote } from '@/lib/cartOffers';
import { useContactInfo } from '@/lib/contact';

export default function CartPage() {
  const router = useRouter();
  const [items, setItems] = useState<CheckoutCartItem[]>([]);
  const [ready, setReady] = useState(false);
  const [quote, setQuote] = useState<OfferQuote | null>(null);

  useEffect(() => {
    function sync() {
      setItems(loadCart());
      setReady(true);
    }
    sync();
    window.addEventListener(CART_CHANGED_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(CART_CHANGED_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (!items.length) {
      setQuote(null);
      return;
    }
    quoteCartOffer(items.map((item) => item.tag_number)).then((next) => {
      if (!cancelled) setQuote(next);
    });
    return () => {
      cancelled = true;
    };
  }, [items]);

  const subtotal = useMemo(
    () =>
      items.reduce((sum, item) => {
        const price = Number(item.display_price);
        return sum + (Number.isFinite(price) ? price : 0);
      }, 0),
    [items],
  );
  const discount = quote?.discount || 0;
  const total = quote ? quote.items_amount : subtotal;
  const freeTags = new Set(quote?.applied?.free_tags || []);

  const { whatsapp } = useContactInfo();

  function orderViaWhatsApp() {
    if (!items.length) return;
    const cleanNumber = (whatsapp || '+919989608595').replace(/[^0-9]/g, '');
    const itemsList = items
      .map(
        (it, idx) =>
          `${idx + 1}. *${it.name}* (Tag: ${it.tag_number}) - ${formatDisplayPrice(it.display_price)}`,
      )
      .join('\n');

    const msg = `Hello Sreshta Jewellers, I would like to purchase these items from my cart:\n\n${itemsList}\n\n*Total Amount:* ${formatDisplayPrice(total)}\n\nPlease share availability, payment and delivery confirmation.`;

    const waUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  }

  if (!ready) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-sm text-gray-500">
        Loading cart…
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="font-domine text-3xl text-[#032C5E] font-bold mb-3">Your cart is empty</h1>
        <p className="text-sm text-gray-500 mb-8">
          Add jewellery from live inventory, then checkout when you are ready.
        </p>
        <Link
          href="/jewellery"
          className="inline-flex bg-[#032C5E] text-white text-xs font-bold uppercase tracking-widest px-8 py-3 rounded-full"
        >
          Browse jewellery
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-8">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-[#bb984d] font-bold mb-1">Cart</p>
          <h1 className="font-domine text-[24px] sm:text-[28px] text-[#032C5E] font-bold">
            {items.length} item{items.length === 1 ? '' : 's'}
          </h1>
        </div>
        <Link href="/jewellery" className="text-sm text-[#032C5E] hover:underline">
          Continue shopping
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-3 space-y-4">
          {items.map((item) => (
            <div
              key={item.tag_number}
              className="flex flex-col xs:flex-row gap-4 border border-gray-100 rounded-xl bg-white p-4"
            >
              <Link
                href={
                  item.type_slug
                    ? `/jewellery/${encodeURIComponent(item.type_slug)}/${encodeURIComponent(item.tag_number)}`
                    : '/jewellery'
                }
                className="w-24 h-24 bg-[#fafafa] rounded overflow-hidden flex items-center justify-center shrink-0"
              >
                {item.image_url ? (
                  <img src={item.image_url} alt="" className="w-full h-full object-contain" />
                ) : (
                  <span className="text-[10px] text-gray-300">No image</span>
                )}
              </Link>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] text-gray-400 uppercase">Tag {item.tag_number}</p>
                <p className="text-sm font-medium text-[#222] leading-snug mt-1">{item.name}</p>
                <p className="text-base font-bold text-[#222] mt-2">
                  {freeTags.has(item.tag_number) ? (
                    <span>
                      <span className="line-through text-gray-400 font-medium mr-2">
                        {formatDisplayPrice(item.display_price)}
                      </span>
                      Free
                    </span>
                  ) : (
                    formatDisplayPrice(item.display_price)
                  )}
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <button
                    type="button"
                    onClick={() => {
                      addToWishlist({
                        tag_number: item.tag_number,
                        name: item.name,
                        display_price: item.display_price,
                        image_url: item.image_url,
                        type_slug: item.type_slug,
                      });
                      setItems(removeFromCart(item.tag_number));
                    }}
                    className="text-[12px] text-[#032C5E] hover:underline font-semibold"
                  >
                    Move to Wishlist
                  </button>
                  <button
                    type="button"
                    onClick={() => setItems(removeFromCart(item.tag_number))}
                    className="text-[12px] text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="lg:col-span-2">
          <div className="border border-gray-100 rounded-xl p-5 bg-[#fafafa] sticky top-24">
            <p className="text-[11px] uppercase tracking-widest text-gray-400 mb-4">Summary</p>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">Items</span>
              <span className="font-medium">{items.length}</span>
            </div>
            {discount > 0 ? (
              <>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium">{formatDisplayPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm mb-2 text-[#00a699]">
                  <span>{quote?.applied?.name || 'Offer'}</span>
                  <span className="font-medium">-{formatDisplayPrice(discount)}</span>
                </div>
              </>
            ) : null}
            <div className="flex justify-between text-base font-bold text-[#222] border-t border-gray-200 pt-3 mt-3 mb-6">
              <span>Total</span>
              <span>{formatDisplayPrice(total)}</span>
            </div>
            <button
              type="button"
              onClick={orderViaWhatsApp}
              className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-[12px] uppercase tracking-widest py-3.5 rounded-full transition-all flex items-center justify-center gap-2.5 shadow-sm hover:shadow active:scale-95"
            >
              <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Order on WhatsApp
            </button>
            <p className="text-[11px] text-gray-400 mt-3 text-center">
              Connects directly with our jewellery consultants on WhatsApp to confirm delivery and details.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

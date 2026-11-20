'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { formatDisplayPrice, type CatalogItem } from '@/lib/erpCatalog';
import {
  addToCart,
  createCheckoutSession,
  loadCart,
  type CheckoutCartItem,
} from '@/lib/checkout';
import { fetchMe, type WebsiteCustomer, type ShippingAddress } from '@/lib/auth';
import { fetchShippingMethods, type ShippingMethod } from '@/lib/shipping';
import { quoteCartOffer, type OfferQuote } from '@/lib/cartOffers';
import { useContactInfo } from '@/lib/contact';

async function loadItem(tag: string): Promise<CatalogItem | null> {
  try {
    const res = await fetch(`/api/catalog/items/${encodeURIComponent(tag)}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const body = await res.json();
    return body.data || null;
  } catch {
    return null;
  }
}

function toCartItem(loaded: CatalogItem): CheckoutCartItem {
  return {
    tag_number: loaded.tag_number,
    name: loaded.name,
    display_price: loaded.display_price,
    image_url: loaded.image_url,
    type_slug: loaded.group_slug || loaded.type_slug,
  };
}

export default function CheckoutForm() {
  const router = useRouter();
  const { whatsapp } = useContactInfo();
  const searchParams = useSearchParams();
  const tagFromQuery = (searchParams.get('tag') || '').trim().toUpperCase();

  const [items, setItems] = useState<CatalogItem[]>([]);
  const [customer, setCustomer] = useState<WebsiteCustomer | null>(null);
  const [addresses, setAddresses] = useState<ShippingAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [shippingMethodId, setShippingMethodId] = useState<string>('');
  const [quote, setQuote] = useState<OfferQuote | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      setLoading(true);
      setError(null);

      const me = await fetchMe().catch(() => null);
      if (cancelled) return;
      if (!me) {
        const cart = loadCart();
        const tag = tagFromQuery || cart[0]?.tag_number || '';
        const next = tag
          ? `/checkout?tag=${encodeURIComponent(tag)}`
          : cart.length
            ? '/checkout'
            : '/cart';
        router.replace(`/account/login?next=${encodeURIComponent(next)}`);
        return;
      }
      setCustomer(me);

      const methods = await fetchShippingMethods().catch(() => []);
      if (cancelled) return;
      setShippingMethods(methods);
      if (methods.length) setShippingMethodId(methods[0].id);
      
      let existing: ShippingAddress[] = [];
      if (Array.isArray(me.shippingAddress)) {
        existing = me.shippingAddress;
      } else if (me.shippingAddress && (me.shippingAddress as ShippingAddress).pincode) {
        existing = [me.shippingAddress as ShippingAddress];
      }
      setAddresses(existing);
      
      if (existing.length > 0) {
        const defaultAddr = existing.find((a: ShippingAddress) => a.isDefault) || existing[0];
        setSelectedAddressId(defaultAddr.id || JSON.stringify(defaultAddr));
      }

      const tags = tagFromQuery
        ? [tagFromQuery]
        : loadCart().map((row) => row.tag_number);

      if (!tags.length) {
        setItems([]);
        setLoading(false);
        return;
      }

      const loadedRows = await Promise.all(tags.map((tag) => loadItem(tag)));
      if (cancelled) return;

      const available = loadedRows.filter((row): row is CatalogItem => Boolean(row));
      if (!available.length) {
        setItems([]);
        setError('These items are no longer available.');
        setLoading(false);
        return;
      }

      available.forEach((row) => addToCart(toCartItem(row)));
      setItems(available);
      if (available.length < tags.length) {
        setError('Some items were unavailable and were removed from this checkout.');
      }
      setLoading(false);
    }

    init();
    return () => {
      cancelled = true;
    };
  }, [tagFromQuery, router]);

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
  const itemsAmount = quote ? quote.items_amount : subtotal;
  const freeTags = new Set(quote?.applied?.free_tags || []);

  const shippingCharge = useMemo(() => {
    const method = shippingMethods.find((m) => m.id === shippingMethodId);
    return method ? Number(method.charge) || 0 : 0;
  }, [shippingMethods, shippingMethodId]);

  const payable = itemsAmount + shippingCharge;

  async function onPay() {
    if (!items.length || submitting) return;
    setSubmitting(true);
    setError(null);

    const cleanNumber = (whatsapp || '+919989608595').replace(/[^0-9]/g, '');
    const selectedAddr = addresses.find(a => (a.id || JSON.stringify(a)) === selectedAddressId);
    const addrText = selectedAddr
      ? `${selectedAddr.addressLine || ''}, ${selectedAddr.city || ''} - ${selectedAddr.pincode || ''}`
      : '';

    const itemsText = items
      .map((it, idx) => `${idx + 1}. *${it.name}* (Tag: ${it.tag_number}) - ${formatDisplayPrice(it.display_price)}`)
      .join('\n');

    const customerText = customer ? `*Customer:* ${customer.name || ''} (${customer.mobile || customer.email || ''})\n` : '';
    const shippingText = addrText ? `*Shipping Address:* ${addrText}\n` : '';

    const msg = `Hello Sreshta Jewellers, I would like to place an order:\n\n${customerText}${shippingText}*Items:*\n${itemsText}\n\n*Total Payable:* ${formatDisplayPrice(payable)}\n\nPlease share delivery and order confirmation.`;

    const waUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    setSubmitting(false);
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center text-gray-500 text-sm">
        Loading checkout…
      </div>
    );
  }

  if (!customer) {
    return null;
  }

  if (!items.length) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="font-domine text-2xl text-[#032C5E] mb-3">Your cart is empty</h1>
        <p className="text-sm text-gray-500 mb-8">
          Choose a piece from live inventory to continue.
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
      <h1 className="font-domine text-[24px] sm:text-[28px] text-[#032C5E] font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-3 space-y-5">
          <div className="rounded-xl border border-gray-100 bg-[#fafafa] p-5 space-y-3">
            <div className="flex justify-between items-center border-b border-gray-200 pb-2 mb-3">
              <h2 className="text-sm font-bold text-[#032C5E] uppercase tracking-wide">
                Shipping Address
              </h2>
              <Link
                href={`/account/address?next=${encodeURIComponent('/checkout')}`}
                className="text-[11px] font-bold text-teal-600 hover:text-teal-700 uppercase tracking-widest border border-teal-200 hover:border-teal-300 rounded px-2 py-1 transition-colors"
              >
                + Add New
              </Link>
            </div>
            
            {addresses.length === 0 ? (
              <div className="text-sm text-gray-500 py-2">
                You do not have any saved addresses. <br/>
                <Link href={`/account/address?next=${encodeURIComponent('/checkout')}`} className="text-teal-600 underline font-medium mt-1 inline-block">Add an address now</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {addresses.map((addr) => {
                  const addrId = addr.id || JSON.stringify(addr);
                  return (
                    <label key={addrId} className={`flex gap-3 p-3 rounded-lg border cursor-pointer transition-all ${selectedAddressId === addrId ? 'border-teal-500 bg-teal-50/30 ring-1 ring-teal-500' : 'border-gray-200 hover:border-teal-200 bg-white'}`}>
                      <input 
                        type="radio" 
                        name="shippingAddress" 
                        className="mt-1 w-4 h-4 text-teal-600 border-gray-300 focus:ring-teal-500" 
                        checked={selectedAddressId === addrId}
                        onChange={() => setSelectedAddressId(addrId)}
                      />
                      <div className="text-sm text-gray-600 flex-1">
                        <p className="font-bold text-gray-900">{addr.recipientName || customer.name}</p>
                        <p>{addr.addressLine || addr.street}</p>
                        <p>{[addr.locality, addr.city, addr.state, addr.pincode].filter(Boolean).join(', ')}</p>
                        <p className="mt-1 text-gray-500">Mobile: {addr.mobile || customer.mobile}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {shippingMethods.length ? (
            <div className="rounded-xl border border-gray-100 bg-[#fafafa] p-5 space-y-3">
              <h2 className="text-sm font-bold text-[#032C5E] uppercase tracking-wide border-b border-gray-200 pb-2 mb-3">
                Shipping method
              </h2>
              <div className="space-y-3">
                {shippingMethods.map((method) => (
                  <label
                    key={method.id}
                    className={`flex gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      shippingMethodId === method.id
                        ? 'border-teal-500 bg-teal-50/30 ring-1 ring-teal-500'
                        : 'border-gray-200 hover:border-teal-200 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="shippingMethod"
                      className="mt-1 w-4 h-4 text-teal-600 border-gray-300 focus:ring-teal-500"
                      checked={shippingMethodId === method.id}
                      onChange={() => setShippingMethodId(method.id)}
                    />
                    <div className="flex-1 text-sm">
                      <div className="flex justify-between gap-3">
                        <p className="font-bold text-gray-900">{method.name}</p>
                        <p className="font-medium text-[#222]">
                          {method.charge > 0 ? formatDisplayPrice(method.charge) : 'Free'}
                        </p>
                      </div>
                      {method.eta ? (
                        <p className="text-gray-500 mt-0.5">{method.eta}</p>
                      ) : null}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          ) : null}

          <div className="rounded-xl border border-gray-100 bg-[#fafafa] p-5 space-y-3">
            <h2 className="text-sm font-bold text-[#032C5E] uppercase tracking-wide border-b border-gray-200 pb-2 mb-3">
              Contact Info
            </h2>
            <div className="flex justify-between gap-4 text-sm">
              <span className="text-gray-500">Name</span>
              <span className="font-medium text-[#222] text-right">{customer.name}</span>
            </div>
            <div className="flex justify-between gap-4 text-sm">
              <span className="text-gray-500">Mobile</span>
              <span className="font-medium text-[#222] text-right">{customer.mobile}</span>
            </div>
            <div className="flex justify-between gap-4 text-sm">
              <span className="text-gray-500">Email</span>
              <span className="font-medium text-[#222] text-right break-all min-w-0">{customer.email}</span>
            </div>
          </div>

          {error ? (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2">
              {error}
            </p>
          ) : null}

          <button
            type="button"
            onClick={onPay}
            disabled={submitting}
            className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20bd5a] disabled:opacity-60 text-white font-bold text-[12px] uppercase tracking-widest px-10 py-3.5 rounded-full transition-all flex items-center justify-center gap-2.5 shadow-sm hover:shadow"
          >
            <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Order on WhatsApp
          </button>
        </div>

        <aside className="lg:col-span-2">
          <div className="border border-gray-100 rounded-lg p-5 bg-[#fafafa]">
            <p className="text-[11px] uppercase tracking-widest text-gray-400 mb-4">Order summary</p>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.tag_number} className="flex gap-4">
                  <div className="w-20 h-20 bg-white rounded overflow-hidden flex items-center justify-center shrink-0">
                    {item.image_url ? (
                      <img src={item.image_url} alt="" className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-[10px] text-gray-300">No image</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] text-gray-400 uppercase">Tag {item.tag_number}</p>
                    <p className="text-sm font-medium text-[#222] leading-snug mt-1">{item.name}</p>
                    <p className="text-sm font-bold text-[#222] mt-2">
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
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 space-y-2 border-t border-gray-200 pt-4 text-[13px] text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-[#222]">{formatDisplayPrice(subtotal)}</span>
              </div>
              {discount > 0 ? (
                <div className="flex justify-between text-[#00a699]">
                  <span>{quote?.applied?.name || 'Offer'}</span>
                  <span className="font-medium">-{formatDisplayPrice(discount)}</span>
                </div>
              ) : null}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className={`font-medium ${shippingCharge > 0 ? 'text-[#222]' : 'text-[#00a699]'}`}>
                  {shippingCharge > 0 ? formatDisplayPrice(shippingCharge) : 'Free'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Taxes</span>
                <span className="font-medium text-[#222]">Included</span>
              </div>
            </div>

            <div className="flex justify-between text-base font-bold text-[#222] border-t border-gray-200 pt-3 mt-3">
              <span>Total</span>
              <span>{formatDisplayPrice(payable)}</span>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="mt-6 border border-gray-100 rounded-lg p-5 bg-[#fafafa]">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[12px] font-bold text-[#032C5E] uppercase tracking-wide">Direct WhatsApp Orders</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">Order verified directly with our jewellery team</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                  </svg>
                </div>
                <div>
                  <p className="text-[12px] font-bold text-[#032C5E] uppercase tracking-wide">Insured Shipping</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">Free fast delivery</p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

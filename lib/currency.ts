// ─── Currency utility ────────────────────────────────────────────────────────
// Prices are stored in GBP. This utility converts to the visitor's local
// currency using the open.er-api.com free exchange rate API.
// Falls back gracefully to GBP if the API is unavailable.

'use client';
import { useState, useEffect } from 'react';

const CACHE_KEY = 'ks_fx_rates';
const CACHE_TTL = 1000 * 60 * 60 * 6; // 6 hours

type Rates = { [currency: string]: number };

export async function getExchangeRates(): Promise<Rates> {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { rates, ts } = JSON.parse(cached);
      if (Date.now() - ts < CACHE_TTL) return rates;
    }
    const res = await fetch('https://open.er-api.com/v6/latest/GBP');
    const data = await res.json();
    if (data.result === 'success') {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ rates: data.rates, ts: Date.now() }));
      return data.rates;
    }
  } catch {}
  return { GBP: 1 };
}

export async function detectCurrency(): Promise<string> {
  try {
    const cached = localStorage.getItem('ks_currency');
    if (cached) return cached;
    const res = await fetch('https://ipapi.co/json/');
    const data = await res.json();
    const currency = data.currency || 'GBP';
    localStorage.setItem('ks_currency', currency);
    return currency;
  } catch {}
  return 'GBP';
}

export function formatPrice(gbpPrice: number, rates: Rates, currency: string): string {
  const rate = rates[currency] ?? 1;
  const converted = gbpPrice * rate;
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(converted);
  } catch {
    return `£${gbpPrice}`;
  }
}

// React hook
export function useCurrency() {
  const [currency, setCurrency] = useState('GBP');
  const [rates, setRates] = useState<Rates>({ GBP: 1 });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    Promise.all([detectCurrency(), getExchangeRates()]).then(([cur, r]) => {
      setCurrency(cur);
      setRates(r);
      setReady(true);
    });
  }, []);

  const format = (gbpPrice: number) => {
    if (!ready || gbpPrice === 0) return null; // 0 = price managed in admin
    return formatPrice(gbpPrice, rates, currency);
  };

  return { currency, format, ready };
}

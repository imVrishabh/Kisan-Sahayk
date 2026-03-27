// ─── Market Price Data (Daily Mandi Rates) ─────────────────────────────────
export const MARKET_PRICES = [
  { crop: 'Rice',  emoji: '🌾', variety: 'Basmati',       state: 'Punjab',           min: 3000, max: 3500, avg: 3200, change: +50  },
  { crop: 'Rice',  emoji: '🌾', variety: 'Sona Masuri',   state: 'Andhra Pradesh',   min: 2800, max: 3100, avg: 2950, change: -20  },
  { crop: 'Rice',  emoji: '🌾', variety: 'IR-36',         state: 'West Bengal',      min: 2400, max: 2700, avg: 2550, change: +30  },
  { crop: 'Paddy', emoji: '🌿', variety: 'Dhan (Raw)',    state: 'Haryana',          min: 1750, max: 2050, avg: 1900, change: -30  },
  { crop: 'Paddy', emoji: '🌿', variety: 'Parboiled',     state: 'UP',               min: 1600, max: 1850, avg: 1720, change: +10  },
  { crop: 'Paddy', emoji: '🌿', variety: 'Fine Paddy',    state: 'Chhattisgarh',     min: 1900, max: 2100, avg: 2000, change: +45  },
  { crop: 'Wheat', emoji: '🚜', variety: 'Sharbati',      state: 'MP',               min: 2200, max: 2650, avg: 2400, change: +80  },
  { crop: 'Wheat', emoji: '🚜', variety: 'Lokwan',        state: 'Maharashtra',      min: 2100, max: 2400, avg: 2250, change: +60  },
  { crop: 'Wheat', emoji: '🚜', variety: 'HD-2967 (Gehu)',state: 'Punjab',           min: 2300, max: 2600, avg: 2450, change: +90  },
  { crop: 'Daal',  emoji: '🫘', variety: 'Chana Dal',     state: 'Rajasthan',        min: 5500, max: 6200, avg: 5850, change: +150 },
  { crop: 'Daal',  emoji: '🫘', variety: 'Moong Dal',     state: 'Gujarat',          min: 7800, max: 9200, avg: 8500, change: +200 },
  { crop: 'Daal',  emoji: '🫘', variety: 'Arhar / Tur Dal',state: 'Maharashtra',     min:10000, max:12000, avg:11000, change: +350 },
  { crop: 'Daal',  emoji: '🫘', variety: 'Masoor Dal',    state: 'UP',               min: 5200, max: 5800, avg: 5500, change: +100 },
];

// ─── Price Summary card config ─────────────────────────────────────────────
export const CROP_META = {
  Rice:  { emoji: '🌾', label: 'Rice',           style: 'pc-rice'  },
  Paddy: { emoji: '🌿', label: 'Paddy / Dhan',   style: 'pc-paddy' },
  Wheat: { emoji: '🚜', label: 'Wheat / Gehu',   style: 'pc-wheat' },
  Daal:  { emoji: '🫘', label: 'Pulses / Daal',  style: 'pc-daal'  },
};

/**
 * Returns summary stats (avg price + total change) for a given crop key,
 * supporting optional admin-overridden prices from localStorage.
 */
export function getSummaryForCrop(key, pricesSource = MARKET_PRICES) {
  const rows = pricesSource.filter(p => p.crop === key);
  const avg = rows.length ? Math.round(rows.reduce((s, r) => s + r.avg, 0) / rows.length) : 0;
  const totalChange = rows.length ? rows.reduce((s, r) => s + r.change, 0) : 0;
  return { avg, totalChange };
}

/** Load admin-overridden prices from localStorage if available. */
export function loadMarketPrices() {
  try {
    const stored = localStorage.getItem('kisan_admin_prices_v1');
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return MARKET_PRICES;
}

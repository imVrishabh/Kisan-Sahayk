/**
 * MarketPrices.jsx — Mandi rate summary cards and filterable table.
 * Fetches live data from the backend API; falls back gracefully on error.
 */
import { useState, useEffect, useCallback } from 'react';
import { useLang } from '../context/LangContext';
import { pricesApi } from '../services/api';

const CROP_KEYS = ['Rice', 'Paddy', 'Wheat', 'Daal'];
const FILTER_OPTIONS = ['all', 'Rice', 'Paddy', 'Wheat', 'Daal'];

const CROP_META = {
  Rice:  { label: 'Rice',  emoji: '🌾', style: 'pc-rice'  },
  Paddy: { label: 'Paddy', emoji: '🌿', style: 'pc-paddy' },
  Wheat: { label: 'Wheat', emoji: '🚜', style: 'pc-wheat' },
  Daal:  { label: 'Daal',  emoji: '🫘', style: 'pc-daal'  },
};

/** Compute an average and net change for a crop from all its varieties */
function getSummary(cropKey, prices) {
  const rows = prices.filter((r) => r.crop === cropKey);
  if (!rows.length) return { avg: 0, totalChange: 0 };
  const avg = Math.round(rows.reduce((s, r) => s + r.avg, 0) / rows.length);
  const totalChange = rows.reduce((s, r) => s + r.change, 0);
  return { avg, totalChange };
}

/** Summary card for one crop type */
function PriceSummaryCard({ cropKey, prices }) {
  const meta = CROP_META[cropKey];
  const { avg, totalChange } = getSummary(cropKey, prices);
  const isUp = totalChange >= 0;
  const changeStr = (isUp ? '+₹' : '-₹') + Math.abs(totalChange);
  return (
    <div className={`price-card ${meta.style}`}>
      <span className="pc-emoji">{meta.emoji}</span>
      <div className="pc-crop">{meta.label}</div>
      <div className="pc-price">₹{avg.toLocaleString('en-IN')}</div>
      <div className="pc-unit">₹/Qtl (avg)</div>
      <span className={`pc-change ${isUp ? 'change-up' : 'change-down'}`}>
        {isUp ? '▲' : '▼'} {changeStr}
      </span>
    </div>
  );
}

export default function MarketPrices() {
  const { t } = useLang();
  const [priceFilter, setPriceFilter] = useState('all');
  const [prices, setPrices]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const fetchPrices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await pricesApi.getAll();
      setPrices(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPrices(); }, [fetchPrices]);

  const todayStr = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  const tableRows =
    priceFilter === 'all' ? prices : prices.filter((r) => r.crop === priceFilter);

  return (
    <>
      {/* ── Header ─────────────────────────────────── */}
      <div className="prices-header">
        <h2>
          <i className="fa-solid fa-chart-line" /> {t('prices_header')}
        </h2>
        <p>
          {t('prices_sub')}
          <span> {todayStr}</span>
        </p>
      </div>

      <div className="prices-container">

        {/* ── Loading / Error ─────────────────────────── */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#718096' }}>
            <i className="fa-solid fa-spinner fa-spin fa-2x" />
            <p style={{ marginTop: '1rem' }}>Loading market prices…</p>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <i className="fa-solid fa-triangle-exclamation fa-2x" style={{ color: '#e65100' }} />
            <p style={{ color: '#e65100', marginTop: '1rem', fontWeight: 600 }}>{error}</p>
            <p style={{ fontSize: '0.85rem' }}>Make sure the backend is running on port 4000.</p>
            <button className="btn btn-prices-full" onClick={fetchPrices} style={{ marginTop: '1rem' }}>
              Retry
            </button>
          </div>
        ) : (
          <>
            {/* ── Summary Cards ────────────────────────── */}
            <div className="price-summary-cards">
              {CROP_KEYS.map((key) => (
                <PriceSummaryCard key={key} cropKey={key} prices={prices} />
              ))}
            </div>

            {/* ── Detailed Table ───────────────────────── */}
            <div className="price-table-section">
              <div className="price-table-header">
                <h3>
                  <i className="fa-solid fa-table" /> {t('prices_table_title')}
                </h3>
                <div className="table-filter-row">
                  {FILTER_OPTIONS.map((f) => (
                    <button
                      key={f}
                      className={`tbl-filter${priceFilter === f ? ' active' : ''}`}
                      onClick={() => setPriceFilter(f)}
                    >
                      {f === 'all' ? 'All Crops' : f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="price-table-wrapper">
                <table className="price-table">
                  <thead>
                    <tr>
                      <th>{t('col_crop')}</th>
                      <th>{t('col_variety')}</th>
                      <th>{t('col_state')}</th>
                      <th>{t('col_min')}</th>
                      <th>{t('col_max')}</th>
                      <th>{t('col_avg')}</th>
                      <th>{t('col_change')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableRows.map((item) => {
                      const chgClass = item.change > 0 ? 'change-up' : item.change < 0 ? 'change-down' : '';
                      const chgSign  = item.change > 0 ? '▲ +' : item.change < 0 ? '▼ ' : '';
                      const pUnit    = t('col_price_unit');
                      return (
                        <tr key={item._id}>
                          <td><span className="crop-icon">{item.emoji}</span> {item.crop}</td>
                          <td>{item.variety}</td>
                          <td>{item.state}</td>
                          <td style={{ fontWeight: 600 }}>₹{item.min.toLocaleString('en-IN')}</td>
                          <td style={{ fontWeight: 600 }}>₹{item.max.toLocaleString('en-IN')}</td>
                          <td style={{ fontWeight: 700 }}>₹{item.avg.toLocaleString('en-IN')} {pUnit}</td>
                          <td>
                            <span className={`pc-change ${chgClass}`}>
                              {chgSign}₹{Math.abs(item.change)}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

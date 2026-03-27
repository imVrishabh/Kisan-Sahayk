import { useState, useEffect } from 'react';
import { useLang } from '../context/LangContext';
import { useCrops } from '../context/CropsContext';
import CropCard from '../components/CropCard';
import AdminQuickEditModal from '../components/AdminQuickEditModal';

const FILTER_OPTIONS = [
  { value: 'all',  label: '🌐', langKey: 'filter_all' },
  { value: 'Rice',  label: '🌾 Rice'  },
  { value: 'Paddy', label: '🌿 Paddy' },
  { value: 'Wheat', label: '🚜 Wheat' },
  { value: 'Daal',  label: '🫘 Daal'  },
];

/**
 * Buy – marketplace grid with search, crop filters, and admin controls.
 */
export default function Buy() {
  const { t } = useLang();
  const { crops, loading, error } = useCrops();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [editingCrop, setEditingCrop] = useState(null); // crop being edited in modal

  // Check admin session (set from admin.html via sessionStorage)
  const isAdmin = sessionStorage.getItem('kisan_admin_auth') === '1';

  // Filter + search logic
  const filtered = crops.filter((c) => {
    const typeMatch = activeFilter === 'all' || c.cropType === activeFilter;
    const q = searchQuery.toLowerCase().trim();
    const searchMatch =
      !q ||
      [c.cropType, c.location, c.farmerName].some((v) =>
        v.toLowerCase().includes(q)
      );
    return typeMatch && searchMatch;
  });

  const resetFilters = () => {
    setSearchQuery('');
    setActiveFilter('all');
  };

  // Scroll to top when Buy view becomes active
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <>
      {/* Admin mode banner */}
      {isAdmin && (
        <div
          style={{
            background: 'linear-gradient(90deg,#1b5e20,#2e7d32)',
            color: 'white',
            textAlign: 'center',
            padding: '.75rem 1.5rem',
            fontSize: '.9rem',
            position: 'sticky',
            top: 68,
            zIndex: 500,
          }}
        >
          <i className="fa-solid fa-shield-halved" />{' '}
          <strong>Admin Mode Active</strong> — You can edit or delete any listing directly.{' '}
          <a
            href="admin.html"
            style={{ color: '#ffcc02', marginLeft: '1rem', fontWeight: 700, textDecoration: 'none' }}
          >
            <i className="fa-solid fa-gauge-high" /> Go to Dashboard
          </a>
        </div>
      )}

      {/* ── Market Header ──────────────────────────── */}
      <div className="market-header">
        <div className="market-titles">
          <h2>{t('market_title')}</h2>
          <p>{t('market_sub')}</p>
        </div>

        <div className="market-controls">
          {/* Search */}
          <div className="search-bar">
            <i className="fa-solid fa-search" />
            <input
              type="text"
              placeholder={t('search_ph')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div className="filters-container">
            {FILTER_OPTIONS.map((f) => (
              <button
                key={f.value}
                className={`filter-btn${activeFilter === f.value ? ' active' : ''}`}
                onClick={() => setActiveFilter(f.value)}
              >
                {f.value === 'all' ? t('filter_all') : f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Loading State ───────────────────────────── */}
      {loading ? (
        <div className="empty-state">
          <i className="fa-solid fa-spinner fa-spin" style={{ color: '#a0aec0' }} />
          <h3 style={{ marginTop: '1rem' }}>Loading listings…</h3>
        </div>
      ) : error ? (
        <div className="empty-state">
          <i className="fa-solid fa-triangle-exclamation" style={{ color: '#e65100' }} />
          <h3>Could not load listings</h3>
          <p>{error}</p>
          <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>Make sure the backend server is running on port 4000.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <i className="fa-solid fa-box-open" />
          <h3>{t('no_crops_title')}</h3>
          <p>{t('no_crops_sub')}</p>
          <button className="btn btn-buy-full" onClick={resetFilters}>
            {t('clear_filters')}
          </button>
        </div>
      ) : (
        // ── Crops Grid ───────────────────────────────
        <div className="crops-grid">
          {filtered.map((crop) => (
            <CropCard
              key={crop._id}
              crop={crop}
              isAdmin={isAdmin}
              onEdit={setEditingCrop}
            />
          ))}
        </div>
      )}

      {/* Admin quick-edit modal */}
      {editingCrop && (
        <AdminQuickEditModal
          crop={editingCrop}
          onClose={() => setEditingCrop(null)}
        />
      )}
    </>
  );
}

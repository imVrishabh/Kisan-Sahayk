import { useLang } from '../context/LangContext';
import logo from '../assets/kisan_sahayk_logo.png';

/**
 * Home – landing page with Hero, Action Cards, Crops We Trade, and Features.
 * Props:
 *   onNavigate – callback(viewId)
 */
export default function Home({ onNavigate }) {
  const { t } = useLang();

  // Hero stats
  const stats = [
    { value: '500+',    key: 'stat_farmers'  },
    { value: '2,000+', key: 'stat_listings'  },
    { value: '₹50L+',  key: 'stat_trade'     },
  ];

  // Action cards config
  const actionCards = [
    {
      view: 'buy', className: 'buy-card', icon: '🛒',
      titleKey: 'buy_card_title', descKey: 'buy_card_desc',
      items: ['buy_li1', 'buy_li2', 'buy_li3'],
      btnKey: 'buy_btn', btnClass: 'btn-buy-full',
    },
    {
      view: 'sell', className: 'sell-card', icon: '🌾',
      titleKey: 'sell_card_title', descKey: 'sell_card_desc',
      items: ['sell_li1', 'sell_li2', 'sell_li3'],
      btnKey: 'sell_btn', btnClass: 'btn-sell-full',
    },
    {
      view: 'prices', className: 'prices-card', icon: '📊',
      titleKey: 'prices_card_title', descKey: 'prices_card_desc',
      items: ['prices_li1', 'prices_li2', 'prices_li3'],
      btnKey: 'prices_btn', btnClass: 'btn-prices-full',
    },
  ];

  // Crops we trade chips
  const crops = [
    { emoji: '🌾', key: 'opt_rice',  className: 'rice-chip'  },
    { emoji: '🌿', key: 'opt_paddy', className: 'paddy-chip' },
    { emoji: '🚜', key: 'opt_wheat', className: 'wheat-chip' },
    { emoji: '🫘', key: 'opt_daal',  className: 'daal-chip'  },
  ];

  // Feature cards
  const features = [
    { icon: '🤝', titleKey: 'f1_title', descKey: 'f1_desc', className: 'fc-green' },
    { icon: '💰', titleKey: 'f2_title', descKey: 'f2_desc', className: 'fc-orange' },
    { icon: '📱', titleKey: 'f3_title', descKey: 'f3_desc', className: 'fc-blue' },
    { icon: '⚡', titleKey: 'f4_title', descKey: 'f4_desc', className: 'fc-purple' },
  ];

  return (
    <>
      {/* ── Hero ─────────────────────────────────────── */}
      <div className="hero">
        <div className="hero-overlay" />
        <div className="hero-content">
          {/* Badge */}
          <div className="hero-badge">
            <img src={logo} alt="" style={{ height: 20, verticalAlign: 'middle', marginRight: 4 }} />
            <span>{t('hero_badge')}</span>
          </div>

          <h1>KISAN <span className="hero-market">SAHAYK</span></h1>
          <p className="hero-subname">{t('hero_sub')}</p>

          {/* Description with embedded HTML (bold word) */}
          <p dangerouslySetInnerHTML={{ __html: t('hero_desc') }} />

          {/* CTA buttons */}
          <div className="hero-buttons">
            <button className="btn btn-buy-hero" onClick={() => onNavigate('buy')}>
              <i className="fa-solid fa-cart-shopping" /> {t('hero_btn_buy')}
            </button>
            <button className="btn btn-sell-hero" onClick={() => onNavigate('sell')}>
              <i className="fa-solid fa-tractor" /> {t('hero_btn_sell')}
            </button>
            <button className="btn btn-prices-hero" onClick={() => onNavigate('prices')}>
              <i className="fa-solid fa-chart-bar" /> {t('hero_btn_rates')}
            </button>
          </div>

          {/* Stats */}
          <div className="hero-stats">
            {stats.map((s) => (
              <div className="stat" key={s.key}>
                <span>{s.value}</span>
                <p>{t(s.key)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Action Cards ─────────────────────────────── */}
      <div className="action-section">
        <h2 className="section-title">{t('action_title')}</h2>
        <div className="action-cards">
          {actionCards.map((card) => (
            <div
              key={card.view}
              className={`action-card ${card.className}`}
              onClick={() => onNavigate(card.view)}
            >
              <div className="action-card-icon">{card.icon}</div>
              <h3>{t(card.titleKey)}</h3>
              <p>{t(card.descKey)}</p>
              <ul className="action-list">
                {card.items.map((ik) => (
                  <li key={ik}>
                    <i className="fa-solid fa-check" /> {t(ik)}
                  </li>
                ))}
              </ul>
              <button className={`btn ${card.btnClass}`}>
                <i className="fa-solid fa-arrow-right" /> {t(card.btnKey)}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ── Crops We Trade ───────────────────────────── */}
      <div className="crops-support-section">
        <h2 className="section-title">{t('crops_title')}</h2>
        <div className="crops-support-grid">
          {crops.map((c) => (
            <div key={c.key} className={`crop-chip ${c.className}`}>
              <span>{c.emoji}</span>
              <p>{t(c.key)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Features ─────────────────────────────────── */}
      <div className="features-section">
        <h2 className="section-title">{t('features_title')}</h2>
        <div className="features-grid">
          {features.map((f) => (
            <div key={f.titleKey} className={`feature-card ${f.className}`}>
              <div className="feature-icon">{f.icon}</div>
              <h3>{t(f.titleKey)}</h3>
              <p>{t(f.descKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

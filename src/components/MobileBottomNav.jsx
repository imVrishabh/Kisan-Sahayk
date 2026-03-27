import { useLang } from '../context/LangContext';

/**
 * MobileBottomNav – fixed bottom navigation bar for mobile screens.
 * Only visible below 768px via CSS.
 * Props:
 *   currentView – active view id
 *   onNavigate  – callback(viewId)
 */
export default function MobileBottomNav({ currentView, onNavigate }) {
  const { t } = useLang();

  const tabs = [
    { id: 'home',   icon: 'fa-house',       labelKey: 'nav_home'   },
    { id: 'prices', icon: 'fa-chart-line',  labelKey: 'nav_prices' },
    { id: 'buy',    icon: 'fa-cart-shopping', labelKey: 'nav_buy'  },
    { id: 'sell',   icon: 'fa-tractor',     labelKey: 'nav_sell'   },
  ];

  return (
    <nav className="mobile-bottom-nav">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`mbn-tab${currentView === tab.id ? ' mbn-active' : ''}`}
          onClick={() => onNavigate(tab.id)}
        >
          <i className={`fa-solid ${tab.icon}`} />
          <span>{t(tab.labelKey)}</span>
        </button>
      ))}
    </nav>
  );
}

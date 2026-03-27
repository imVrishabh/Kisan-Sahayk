import { useLang } from '../context/LangContext';
import logo from '../assets/kisan_sahayk_logo.png';

/**
 * Footer – brand, CTA buttons, copyright, and admin link.
 * Props:
 *   onNavigate – callback(viewId) to switch views
 */
export default function Footer({ onNavigate }) {
  const { t } = useLang();

  return (
    <footer>
      <div className="footer-content">
        <div className="footer-brand">
          <h3>
            <img src={logo} alt="" style={{ height: 28, verticalAlign: 'middle', marginRight: 6 }} />
            KISAN SAHAYK
          </h3>
          <p style={{ fontSize: '0.82rem', color: '#a0aec0', marginTop: '0.2rem' }}>
            Kisan Direct Market
          </p>
          <p>{t('footer_desc')}</p>
        </div>

        <div className="footer-actions">
          <button className="btn btn-buy-full" onClick={() => onNavigate('buy')}>
            <i className="fa-solid fa-cart-shopping" /> Buy Crops
          </button>
          <button className="btn btn-sell-full" onClick={() => onNavigate('sell')}>
            <i className="fa-solid fa-tractor" /> Sell Crops
          </button>
        </div>

        <p className="footer-copy">© 2026 Kisan Sahayk. Free to use. No commission.</p>
        <p className="footer-copy" style={{ marginTop: '0.75rem' }}>
          <a
            href="admin.html"
            style={{ color: '#718096', fontSize: '0.8rem', textDecoration: 'none', opacity: 0.6 }}
            onMouseOver={(e) => (e.target.style.opacity = 1)}
            onMouseOut={(e) => (e.target.style.opacity = 0.6)}
          >
            <i className="fa-solid fa-shield-halved" /> Admin Panel
          </a>
        </p>
      </div>
    </footer>
  );
}

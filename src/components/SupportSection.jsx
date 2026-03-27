import { useLang } from '../context/LangContext';

/**
 * SupportSection – customer support phone cards, shown below all views.
 */
export default function SupportSection() {
  const { t } = useLang();

  return (
    <section className="support-section">
      <div className="support-container">
        <h2 className="section-title" style={{ marginBottom: '1rem' }}>
          <i className="fa-solid fa-headset" /> {t('support_title')}
        </h2>
        <p className="support-desc">{t('support_desc')}</p>

        <div className="support-cards">
          <a href="tel:9098197054" className="support-card sc-green-hover">
            <div className="support-icon sg">
              <i className="fa-solid fa-phone-volume" />
            </div>
            <div className="support-info">
              <p>{t('support_call')}</p>
              <h3>+91 9098197054</h3>
            </div>
          </a>

          <a href="tel:9770850156" className="support-card sc-blue-hover">
            <div className="support-icon sb">
              <i className="fa-solid fa-phone-volume" />
            </div>
            <div className="support-info">
              <p>{t('support_call')}</p>
              <h3>+91 9770850156</h3>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}

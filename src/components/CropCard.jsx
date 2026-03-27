import { useLang } from '../context/LangContext';
import { useCrops } from '../context/CropsContext';

// Emoji and color badge class for each crop type
const EMOJI_MAP = { Rice: '🌾', Paddy: '🌿', Wheat: '🚜', Daal: '🫘' };

/**
 * CropCard – a single marketplace listing card.
 * Props:
 *   crop       – the crop object
 *   isAdmin    – whether admin controls should be visible
 *   onEdit     – callback(crop) to open the edit modal
 */
export default function CropCard({ crop, isAdmin, onEdit }) {
  const { lang, t } = useLang();
  const { deleteCrop } = useCrops();

  const emoji = EMOJI_MAP[crop.cropType] || '🌾';
  const pUnit = t('col_price_unit');
  const lblListed = t('listed_on');
  const lblCall = t('call_farmer');

  // Format listing date in the current language locale
  const localeMap = { en: 'en-IN', hi: 'hi-IN', cg: 'hi-IN' };
  const dateStr = new Date(crop.date).toLocaleDateString(
    localeMap[lang] || 'en-IN',
    { day: 'numeric', month: 'short' }
  );

  // Get translated crop name (strip non-letter chars to remove emoji duplication)
  const translatedName =
    t(`opt_${crop.cropType.toLowerCase()}`)
      ?.replace(/[^\u0900-\u097Fa-zA-Z\s]/g, '')
      ?.trim() || crop.cropType;

  const handleDelete = () => {
    if (window.confirm(`Delete listing by ${crop.farmerName}?`)) {
      deleteCrop(crop._id);
    }
  };

  return (
    <div className="crop-card" data-type={crop.cropType}>
      {/* Admin controls overlay */}
      {isAdmin && (
        <div className="admin-card-controls">
          <button
            className="admin-card-btn admin-edit-btn"
            onClick={() => onEdit(crop)}
            title="Admin: Edit"
          >
            <i className="fa-solid fa-pen" /> Edit
          </button>
          <button
            className="admin-card-btn admin-del-btn"
            onClick={handleDelete}
            title="Admin: Delete"
          >
            <i className="fa-solid fa-trash" /> Delete
          </button>
        </div>
      )}

      {/* Crop image */}
      <img
        src={crop.photoUrl || '/placeholder.png'}
        alt={crop.cropType}
        className="card-image"
        onError={(e) => { e.target.src = '/placeholder.png'; }}
      />

      {/* Card content */}
      <div className="card-content">
        <div className="card-header">
          <h3 className="crop-name">
            {emoji} {translatedName}
          </h3>
          <span className={`crop-badge badge-${crop.cropType}`}>{crop.quantity}</span>
        </div>

        <div className="card-price">
          ₹{parseInt(crop.price).toLocaleString('en-IN')}
          <span className="price-unit"> {pUnit}</span>
        </div>

        <div className="card-details">
          <p><i className="fa-regular fa-user" /> {crop.farmerName}</p>
          <p><i className="fa-solid fa-location-dot" /> {crop.location}</p>
          <p><i className="fa-solid fa-phone" /> {crop.phoneNumber}</p>
          <p><i className="fa-regular fa-clock" /> {lblListed} {dateStr}</p>
        </div>

        <div className="card-actions">
          <a href={`tel:${crop.phoneNumber}`} className="btn-call">
            <i className="fa-solid fa-phone" /> {lblCall} — {crop.phoneNumber}
          </a>
        </div>
      </div>
    </div>
  );
}

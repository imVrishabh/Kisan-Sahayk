import { useState, useRef } from 'react';
import { useLang } from '../context/LangContext';
import { useCrops } from '../context/CropsContext';

const CROP_OPTIONS = [
  { value: 'Rice',  label: '🌾 Rice',         langKey: 'opt_rice'  },
  { value: 'Paddy', label: '🌿 Paddy / Dhan',  langKey: 'opt_paddy' },
  { value: 'Wheat', label: '🚜 Wheat / Gehu',  langKey: 'opt_wheat' },
  { value: 'Daal',  label: '🫘 Pulses / Daal', langKey: 'opt_daal'  },
];

const INITIAL_FORM = {
  farmerName: '', phoneNumber: '', cropType: '',
  quantity: '', price: '', location: '',
};

/**
 * Sell – crop listing form with drag-and-drop image upload.
 * Props:
 *   onNavigate – callback to redirect to 'buy' after submission
 */
export default function Sell({ onNavigate }) {
  const { t } = useLang();
  const { addCrop } = useCrops();

  const [form, setForm] = useState(INITIAL_FORM);
  const [imageBase64, setImageBase64] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const fileInputRef = useRef(null);

  // ── Form helpers ──────────────────────────────
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // ── Image handling ────────────────────────────
  const processImage = (file) => {
    if (!file?.type.match('image.*')) {
      alert('Please select a valid image file.'); return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert('Image too large. Please choose an image under 2MB.'); return;
    }
    const reader = new FileReader();
    reader.onload = (e) => setImageBase64(e.target.result);
    reader.onerror = () => alert('Error reading file.');
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    processImage(e.dataTransfer.files?.[0]);
  };

  const removeImage = () => {
    setImageBase64(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ── Submission (async — calls backend API) ────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Number(form.price) <= 0) { alert('Price must be greater than 0'); return; }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await addCrop({
        farmerName:  form.farmerName.trim(),
        phoneNumber: form.phoneNumber.trim(),
        cropType:    form.cropType,
        quantity:    form.quantity.trim(),
        price:       Number(form.price),
        location:    form.location.trim(),
        photoUrl:    imageBase64 || '',
      });

      setShowSuccess(true);
      // Reset and redirect after short delay
      setTimeout(() => {
        setForm(INITIAL_FORM);
        removeImage();
        setIsSubmitting(false);
        setShowSuccess(false);
        onNavigate('buy');
      }, 1600);
    } catch (err) {
      setSubmitError(err.message || 'Failed to post listing. Make sure the backend server is running.');
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* ── Page Header ────────────────────────────── */}
      <div className="sell-page-header">
        <div className="sell-header-icon">🌾</div>
        <h2>{t('sell_page_title')}</h2>
        <p>{t('sell_page_sub')}</p>
      </div>

      {/* ── Form ───────────────────────────────────── */}
      <div className="form-container">
        <form className="glass-form" onSubmit={handleSubmit}>

          {/* Farmer Details */}
          <div className="form-section-label">{t('section_farmer')}</div>
          <div className="form-row">
            <div className="form-group half-width">
              <label htmlFor="farmerName">{t('lbl_name')}</label>
              <div className="input-with-icon">
                <i className="fa-regular fa-user" />
                <input
                  type="text" id="farmerName" name="farmerName"
                  required placeholder={t('ph_name')}
                  value={form.farmerName} onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-group half-width">
              <label htmlFor="phoneNumber">{t('lbl_phone')}</label>
              <div className="input-with-icon">
                <i className="fa-solid fa-phone" />
                <input
                  type="tel" id="phoneNumber" name="phoneNumber"
                  required pattern="[0-9]{10}" placeholder={t('ph_phone')}
                  value={form.phoneNumber} onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Crop Details */}
          <div className="form-section-label">{t('section_crop')}</div>
          <div className="form-row">
            <div className="form-group half-width">
              <label htmlFor="cropType">{t('lbl_crop')}</label>
              <div className="select-wrapper">
                <select
                  id="cropType" name="cropType"
                  required value={form.cropType} onChange={handleChange}
                >
                  <option value="" disabled>{t('ph_crop')}</option>
                  {CROP_OPTIONS.map((c) => (
                    <option key={c.value} value={c.value}>{t(c.langKey)}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-group half-width">
              <label htmlFor="quantity">{t('lbl_qty')}</label>
              <div className="input-with-icon">
                <i className="fa-solid fa-weight-scale" />
                <input
                  type="text" id="quantity" name="quantity"
                  required placeholder={t('ph_qty')}
                  value={form.quantity} onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group half-width">
              <label htmlFor="price">{t('lbl_price')}</label>
              <div className="input-with-icon">
                <i className="fa-solid fa-indian-rupee-sign" />
                <input
                  type="number" id="price" name="price"
                  required min="1" placeholder={t('ph_price')}
                  value={form.price} onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-group half-width">
              <label htmlFor="location">{t('lbl_location')}</label>
              <div className="input-with-icon">
                <i className="fa-solid fa-location-dot" />
                <input
                  type="text" id="location" name="location"
                  required placeholder={t('ph_location')}
                  value={form.location} onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Photo Upload */}
          <div className="form-section-label">{t('section_photo')}</div>
          <div className="form-group photo-upload">
            {!imageBase64 ? (
              <div
                className={`file-drop-area${isDragging ? ' is-active' : ''}`}
                onDragEnter={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
              >
                <span className="file-drop-icon">📸</span>
                <span className="fake-btn">{t('photo_choose')}</span>
                <span className="file-msg">{t('photo_or')}</span>
                <input
                  ref={fileInputRef}
                  className="file-input"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => processImage(e.target.files?.[0])}
                />
              </div>
            ) : (
              <div id="imagePreviewContainer">
                <img id="imagePreview" src={imageBase64} alt="Preview" />
                <button type="button" id="removeImageBtn" onClick={removeImage}>
                  <i className="fa-solid fa-times" /> Remove
                </button>
              </div>
            )}
          </div>

          {/* Submit */}
          <button type="submit" className="btn btn-submit" disabled={isSubmitting}>
            {isSubmitting
              ? <><i className="fa-solid fa-check" /> Posted!</>
              : <><i className="fa-solid fa-paper-plane" /> {t('submit_btn')}</>
            }
          </button>

          {/* Error Message */}
          {submitError && (
            <div className="success-message" style={{ background: '#fff3e0', borderColor: '#ff9800', color: '#e65100' }}>
              <i className="fa-solid fa-triangle-exclamation" /> {submitError}
            </div>
          )}

          {/* Success Message */}
          {showSuccess && (
            <div className="success-message">
              <i className="fa-solid fa-check-circle" /> {t('success_msg')}
            </div>
          )}
        </form>
      </div>
    </>
  );
}

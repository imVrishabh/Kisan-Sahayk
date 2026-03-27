import { useState } from 'react';
import { useLang } from '../context/LangContext';
import { useCrops } from '../context/CropsContext';

// Emoji map for crop types
const EMOJI_MAP = { Rice: '🌾', Paddy: '🌿', Wheat: '🚜', Daal: '🫘' };

/**
 * AdminQuickEditModal – modal to inline-edit a listing.
 * Visible when isAdmin is true and a crop has been selected for editing.
 *
 * Props:
 *   crop      – the crop object to edit (or null)
 *   onClose   – callback to close the modal
 */
export default function AdminQuickEditModal({ crop, onClose }) {
  const { updateCrop } = useCrops();

  // Local state mirrors the fields being edited
  const [form, setForm] = useState({
    farmerName: crop?.farmerName || '',
    phoneNumber: crop?.phoneNumber || '',
    cropType: crop?.cropType || 'Rice',
    quantity: crop?.quantity || '',
    price: crop?.price || '',
    location: crop?.location || '',
  });

  if (!crop) return null;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = () => {
    updateCrop(crop._id, form);
    onClose();
  };

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-box">
        {/* Header */}
        <div className="modal-header">
          <h3>
            <i className="fa-solid fa-shield-halved" /> Admin — Edit Listing
          </h3>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Row 1: Name + Phone */}
          <div className="modal-grid">
            <div>
              <label className="modal-label">Farmer Name</label>
              <input
                name="farmerName"
                type="text"
                value={form.farmerName}
                onChange={handleChange}
                className="modal-input"
              />
            </div>
            <div>
              <label className="modal-label">Phone Number</label>
              <input
                name="phoneNumber"
                type="tel"
                value={form.phoneNumber}
                onChange={handleChange}
                className="modal-input"
              />
            </div>
          </div>

          {/* Row 2: Crop + Quantity */}
          <div className="modal-grid">
            <div>
              <label className="modal-label">Crop Type</label>
              <select
                name="cropType"
                value={form.cropType}
                onChange={handleChange}
                className="modal-input"
              >
                {Object.entries(EMOJI_MAP).map(([k, e]) => (
                  <option key={k} value={k}>{e} {k}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="modal-label">Quantity</label>
              <input
                name="quantity"
                type="text"
                value={form.quantity}
                onChange={handleChange}
                className="modal-input"
              />
            </div>
          </div>

          {/* Row 3: Price + Location */}
          <div className="modal-grid">
            <div>
              <label className="modal-label">₹ Price / Quintal</label>
              <input
                name="price"
                type="number"
                min="1"
                value={form.price}
                onChange={handleChange}
                className="modal-input"
              />
            </div>
            <div>
              <label className="modal-label">Location</label>
              <input
                name="location"
                type="text"
                value={form.location}
                onChange={handleChange}
                className="modal-input"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="modal-actions">
            <button className="btn btn-sell-full" onClick={handleSave}>
              <i className="fa-solid fa-save" /> Save Changes
            </button>
            <button
              className="btn"
              style={{ background: '#f1f5f9', color: '#718096' }}
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

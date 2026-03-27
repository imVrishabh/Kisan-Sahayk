/**
 * Kisan Direct Market — Application Logic v2
 */

const STORAGE_KEY = 'kisan_market_crops_v2';
const PRICE_STORAGE_KEY = 'kisan_admin_prices_v1';  // Written by admin panel

// Load prices: prefer admin-saved version, fall back to defaults
function loadMarketPrices() {
    try {
        const stored = localStorage.getItem(PRICE_STORAGE_KEY);
        if (stored) return JSON.parse(stored);
    } catch (e) { }
    return null; // fall back to MARKET_PRICES array below
}

// ─── Market Price Data (Mock Daily Rates) ─────────────────────────────────────
const MARKET_PRICES = [
    { crop: 'Rice', emoji: '🌾', variety: 'Basmati', state: 'Punjab', min: 3000, max: 3500, avg: 3200, change: +50 },
    { crop: 'Rice', emoji: '🌾', variety: 'Sona Masuri', state: 'Andhra Pradesh', min: 2800, max: 3100, avg: 2950, change: -20 },
    { crop: 'Rice', emoji: '🌾', variety: 'IR-36', state: 'West Bengal', min: 2400, max: 2700, avg: 2550, change: +30 },
    { crop: 'Paddy', emoji: '🌿', variety: 'Dhan (Raw)', state: 'Haryana', min: 1750, max: 2050, avg: 1900, change: -30 },
    { crop: 'Paddy', emoji: '🌿', variety: 'Parboiled', state: 'UP', min: 1600, max: 1850, avg: 1720, change: +10 },
    { crop: 'Paddy', emoji: '🌿', variety: 'Fine Paddy', state: 'Chhattisgarh', min: 1900, max: 2100, avg: 2000, change: +45 },
    { crop: 'Wheat', emoji: '🚜', variety: 'Sharbati', state: 'MP', min: 2200, max: 2650, avg: 2400, change: +80 },
    { crop: 'Wheat', emoji: '🚜', variety: 'Lokwan', state: 'Maharashtra', min: 2100, max: 2400, avg: 2250, change: +60 },
    { crop: 'Wheat', emoji: '🚜', variety: 'HD-2967 (Gehu)', state: 'Punjab', min: 2300, max: 2600, avg: 2450, change: +90 },
    { crop: 'Daal', emoji: '🫘', variety: 'Chana Dal', state: 'Rajasthan', min: 5500, max: 6200, avg: 5850, change: +150 },
    { crop: 'Daal', emoji: '🫘', variety: 'Moong Dal', state: 'Gujarat', min: 7800, max: 9200, avg: 8500, change: +200 },
    { crop: 'Daal', emoji: '🫘', variety: 'Arhar / Tur Dal', state: 'Maharashtra', min: 10000, max: 12000, avg: 11000, change: +350 },
    { crop: 'Daal', emoji: '🫘', variety: 'Masoor Dal', state: 'UP', min: 5200, max: 5800, avg: 5500, change: +100 },
];

// Summary cards for the prices page top section
const PRICE_SUMMARY = [
    { key: 'Rice', emoji: '🌾', label: 'Rice', price: 3200, unit: '₹/Qtl', change: '+₹50', style: 'pc-rice', dir: 'up' },
    { key: 'Paddy', emoji: '🌿', label: 'Paddy / Dhan', price: 1900, unit: '₹/Qtl', change: '-₹30', style: 'pc-paddy', dir: 'down' },
    { key: 'Wheat', emoji: '🚜', label: 'Wheat / Gehu', price: 2400, unit: '₹/Qtl', change: '+₹80', style: 'pc-wheat', dir: 'up' },
    { key: 'Daal', emoji: '🫘', label: 'Pulses / Daal', price: 8500, unit: '₹/Qtl', change: '+₹200', style: 'pc-daal', dir: 'up' },
    { key: 'Maize', emoji: '🌽', label: 'Maize', price: 1750, unit: '₹/Qtl', change: '+₹25', style: 'pc-maize', dir: 'up' },
];

// ─── Dummy/seed listings ─────────────────────────────────────────────────────
const DUMMY_DATA = [
    { id: '1', farmerName: 'Ramesh Singh', phoneNumber: '9876543210', cropType: 'Wheat', quantity: '50 Quintals', price: '2400', location: 'Ludhiana, Punjab', date: new Date().toISOString(), photoUrl: '' },
    { id: '2', farmerName: 'Suresh Patil', phoneNumber: '9123456780', cropType: 'Rice', quantity: '100 Quintals', price: '3200', location: 'Karnal, Haryana', date: new Date(Date.now() - 86400000).toISOString(), photoUrl: '' },
    { id: '3', farmerName: 'Amtul Khan', phoneNumber: '8887776665', cropType: 'Daal', quantity: '20 Quintals', price: '8500', location: 'Indore, MP', date: new Date(Date.now() - 172800000).toISOString(), photoUrl: '' },
    { id: '4', farmerName: 'Gurpreet Kaur', phoneNumber: '9988776655', cropType: 'Paddy', quantity: '75 Quintals', price: '1850', location: 'Patiala, Punjab', date: new Date(Date.now() - 259200000).toISOString(), photoUrl: '' },
];

// ─── App Class ───────────────────────────────────────────────────────────────
class KisanMarketApp {
    constructor() {
        this.crops = [];
        this.currentFilter = 'all';
        this.searchQuery = '';
        this.tempImageBase64 = null;
        this.priceFilter = 'all';

        this.init();
    }

    init() {
        this.loadData();
        this.setupNavigation();
        this.setupForm();
        this.setupFilters();
        this.setupImageUpload();
        this.setupPriceFilters();
        this.renderPriceDate();
        this.renderPriceSummary();
        this.renderPriceTable('all');
        this.renderMarket();
    }

    // ── Data ──────────────────────────────────────────────────────
    loadData() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            this.crops = stored ? JSON.parse(stored) : [...DUMMY_DATA];
            if (!stored) this.saveData();
        } catch (e) {
            this.crops = [...DUMMY_DATA];
        }
    }

    saveData() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.crops));
        } catch (e) {
            alert("Storage is full. Try uploading a smaller image.");
        }
    }

    // ── Navigation ────────────────────────────────────────────────
    setupNavigation() {
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', e => this.navigate(e.currentTarget.dataset.target));
        });

        const mobileBtn = document.getElementById('mobileMenuBtn');
        const navLinks = document.getElementById('navLinks');

        mobileBtn?.addEventListener('click', () => navLinks.classList.toggle('show'));

        document.addEventListener('click', e => {
            if (navLinks?.classList.contains('show') &&
                !e.target.closest('.nav-links') &&
                !e.target.closest('.mobile-menu-btn')) {
                navLinks.classList.remove('show');
            }
        });
    }

    navigate(viewId) {
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        document.getElementById(`view-${viewId}`)?.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        document.getElementById('navLinks')?.classList.remove('show');

        if (viewId === 'buy') this.renderMarket();
        if (viewId === 'prices') {
            this.renderPriceSummary();
            this.renderPriceTable(this.priceFilter);
        }
    }

    // ── Daily Prices ───────────────────────────────────────────────
    renderPriceDate() {
        const el = document.getElementById('priceDate');
        if (!el) return;
        const now = new Date();
        el.textContent = now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    }

    renderPriceSummary() {
        const container = document.getElementById('priceSummaryCards');
        if (!container) return;

        // Build summary cards from admin-editable prices
        const allPrices = loadMarketPrices() || MARKET_PRICES;
        const cropKeys = ['Rice', 'Paddy', 'Wheat', 'Daal'];
        const styleMap = { Rice: 'pc-rice', Paddy: 'pc-paddy', Wheat: 'pc-wheat', Daal: 'pc-daal' };
        const emojiMap = { Rice: '🌾', Paddy: '🌿', Wheat: '🚜', Daal: '🫘' };
        const labelMap = { Rice: 'Rice', Paddy: 'Paddy / Dhan', Wheat: 'Wheat / Gehu', Daal: 'Pulses / Daal' };

        const cards = cropKeys.map(key => {
            const rows = allPrices.filter(p => p.crop === key);
            const avg = rows.length ? Math.round(rows.reduce((s, r) => s + r.avg, 0) / rows.length) : 0;
            const totalChange = rows.length ? rows.reduce((s, r) => s + r.change, 0) : 0;
            const dir = totalChange >= 0 ? 'up' : 'down';
            const changeStr = (totalChange >= 0 ? '+₹' : '-₹') + Math.abs(totalChange);
            return `
            <div class="price-card ${styleMap[key]}">
                <span class="pc-emoji">${emojiMap[key]}</span>
                <div class="pc-crop">${labelMap[key]}</div>
                <div class="pc-price">₹${avg.toLocaleString('en-IN')}</div>
                <div class="pc-unit">₹/Qtl (avg)</div>
                <span class="pc-change ${dir === 'up' ? 'change-up' : 'change-down'}">${dir === 'up' ? '▲' : '▼'} ${changeStr}</span>
            </div>`;
        });
        container.innerHTML = cards.join('');
    }

    setupPriceFilters() {
        document.querySelectorAll('.tbl-filter').forEach(btn => {
            btn.addEventListener('click', e => {
                document.querySelectorAll('.tbl-filter').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.priceFilter = e.target.dataset.tf;
                this.renderPriceTable(this.priceFilter);
            });
        });
    }

    renderPriceTable(filter) {
        const tbody = document.getElementById('priceTableBody');
        if (!tbody) return;

        // Use admin-saved prices if available
        const source = loadMarketPrices() || MARKET_PRICES;
        const data = filter === 'all'
            ? source
            : source.filter(r => r.crop === filter);

        tbody.innerHTML = ''; // Clear existing rows
        const pUnit = Lang.t('col_price_unit') || '/ Quintal';

        data.forEach(item => {
            const tr = document.createElement('tr');
            const chgClass = item.change > 0 ? 'change-up' : item.change < 0 ? 'change-down' : '';
            const chgSign = item.change > 0 ? '▲ +' : item.change < 0 ? '▼ ' : '';

            tr.innerHTML = `
                <td><span class="crop-icon">${item.emoji}</span> ${Lang.t('opt_' + item.crop.toLowerCase())?.replace(/[^a-zA-Zा-्\s]/g, '')?.trim() || item.crop}</td>
                <td>${item.variety}</td>
                <td>${item.state}</td>
                <td style="font-weight:600">₹${item.min}</td>
                <td style="font-weight:600">₹${item.max}</td>
                <td style="font-weight:700;color:var(--text-main)">₹${item.avg} ${pUnit}</td>
                <td><span class="pc-change ${chgClass}">${chgSign}₹${Math.abs(item.change)}</span></td>
            `;
            tbody.appendChild(tr);
        });
    }

    // ── Sell Form ──────────────────────────────────────────────────
    setupForm() {
        document.getElementById('sellCropForm')?.addEventListener('submit', e => {
            e.preventDefault();
            this.handleSubmission();
        });
    }

    handleSubmission() {
        const btn = document.getElementById('submitBtn');
        const originalHTML = btn.innerHTML;
        const price = document.getElementById('price').value;
        if (price <= 0) { alert("Price must be greater than 0"); return; }

        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Posting...';
        btn.disabled = true;

        const newCrop = {
            id: Date.now().toString(),
            farmerName: document.getElementById('farmerName').value.trim(),
            phoneNumber: document.getElementById('phoneNumber').value.trim(),
            cropType: document.getElementById('cropType').value,
            quantity: document.getElementById('quantity').value.trim(),
            price: price,
            location: document.getElementById('location').value.trim(),
            date: new Date().toISOString(),
            photoUrl: this.tempImageBase64 || ''
        };

        this.crops.unshift(newCrop);
        this.saveData();

        btn.innerHTML = '<i class="fa-solid fa-check"></i> Posted!';
        document.getElementById('formSuccessMessage').classList.remove('hidden');

        setTimeout(() => {
            document.getElementById('sellCropForm').reset();
            this.removeImagePreview();
            document.getElementById('formSuccessMessage').classList.add('hidden');
            btn.innerHTML = originalHTML;
            btn.disabled = false;
            this.navigate('buy');
            this.resetFilters();
        }, 1600);
    }

    // ── Image Upload ──────────────────────────────────────────────
    setupImageUpload() {
        const dropArea = document.getElementById('fileDropArea');
        const fileInput = document.getElementById('cropPhoto');
        const removeBtn = document.getElementById('removeImageBtn');
        if (!dropArea || !fileInput) return;

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(ev =>
            dropArea.addEventListener(ev, e => { e.preventDefault(); e.stopPropagation(); })
        );
        ['dragenter', 'dragover'].forEach(ev =>
            dropArea.addEventListener(ev, () => dropArea.classList.add('is-active'))
        );
        ['dragleave', 'drop'].forEach(ev =>
            dropArea.addEventListener(ev, () => dropArea.classList.remove('is-active'))
        );

        dropArea.addEventListener('drop', e => {
            const file = e.dataTransfer.files?.[0];
            if (file) { fileInput.files = e.dataTransfer.files; this.processImage(file); }
        });

        fileInput.addEventListener('change', e => {
            const file = e.target.files?.[0];
            if (file) this.processImage(file);
        });

        removeBtn?.addEventListener('click', () => {
            fileInput.value = '';
            this.removeImagePreview();
        });
    }

    processImage(file) {
        if (!file.type.match('image.*')) { alert("Please select a valid image file."); return; }
        if (file.size > 2 * 1024 * 1024) { alert("Image too large. Please choose an image under 2MB."); return; }

        const reader = new FileReader();
        reader.onload = e => {
            this.tempImageBase64 = e.target.result;
            document.getElementById('imagePreview').src = this.tempImageBase64;
            document.getElementById('imagePreviewContainer').classList.remove('hidden');
            document.getElementById('fileDropArea').classList.add('hidden');
        };
        reader.onerror = () => alert("Error reading file.");
        reader.readAsDataURL(file);
    }

    removeImagePreview() {
        this.tempImageBase64 = null;
        document.getElementById('imagePreview').src = '';
        document.getElementById('imagePreviewContainer').classList.add('hidden');
        document.getElementById('fileDropArea').classList.remove('hidden');
    }

    // ── Market Listing ─────────────────────────────────────────────
    setupFilters() {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', e => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.filter;
                this.renderMarket();
            });
        });

        document.getElementById('marketSearch')?.addEventListener('input', e => {
            this.searchQuery = e.target.value.toLowerCase().trim();
            this.renderMarket();
        });
    }

    resetFilters() {
        this.currentFilter = 'all';
        this.searchQuery = '';
        const searchEl = document.getElementById('marketSearch');
        if (searchEl) searchEl.value = '';
        document.querySelectorAll('.filter-btn').forEach(b =>
            b.classList.toggle('active', b.dataset.filter === 'all')
        );
        this.renderMarket();
    }

    getFilteredCrops() {
        return this.crops.filter(c => {
            const typeMatch = this.currentFilter === 'all' || c.cropType === this.currentFilter;
            const searchMatch = !this.searchQuery ||
                [c.cropType, c.location, c.farmerName].some(v => v.toLowerCase().includes(this.searchQuery));
            return typeMatch && searchMatch;
        });
    }

    renderMarket() {
        const grid = document.getElementById('cropsGrid');
        const emptyEl = document.getElementById('marketEmpty');
        if (!grid) return;

        // Show/hide admin banner when admin is logged in
        const isAdmin = sessionStorage.getItem('kisan_admin_auth') === '1';
        let adminBanner = document.getElementById('adminModeBanner');
        if (isAdmin && !adminBanner) {
            adminBanner = document.createElement('div');
            adminBanner.id = 'adminModeBanner';
            adminBanner.innerHTML = `
                <i class="fa-solid fa-shield-halved"></i> <strong>Admin Mode Active</strong> — You can edit or delete any listing directly.
                <a href="admin.html" style="color:#ffcc02;margin-left:1rem;font-weight:700;text-decoration:none;"><i class="fa-solid fa-gauge-high"></i> Go to Dashboard</a>
            `;
            adminBanner.style.cssText = 'background:linear-gradient(90deg,#1b5e20,#2e7d32);color:white;text-align:center;padding:.75rem 1.5rem;font-size:.9rem;position:sticky;top:108px;z-index:500;';
            grid.parentElement.insertBefore(adminBanner, grid);
        } else if (!isAdmin && adminBanner) {
            adminBanner.remove();
        }

        const filtered = this.getFilteredCrops();
        grid.innerHTML = '';

        if (filtered.length === 0) {
            emptyEl.classList.remove('hidden');
            grid.classList.add('hidden');
        } else {
            emptyEl.classList.add('hidden');
            grid.classList.remove('hidden');
            filtered.forEach(c => grid.appendChild(this.createCropCard(c)));
        }
    }

    createCropCard(crop) {
        const div = document.createElement('div');
        div.className = 'crop-card';
        div.dataset.type = crop.cropType;
        div.style.position = 'relative';

        const localeMap = { 'en': 'en-IN', 'hi': 'hi-IN', 'cg': 'hi-IN' };
        const dateStr = new Date(crop.date).toLocaleDateString(localeMap[Lang.current] || 'en-IN', { day: 'numeric', month: 'short' });
        const imgUrl = crop.photoUrl?.trim() ? crop.photoUrl : 'assets/placeholder.png';
        const emojiMap = { Rice: '🌾', Paddy: '🌿', Wheat: '🚜', Daal: '🫘' };
        const emoji = emojiMap[crop.cropType] || '🌾';

        const isAdmin = sessionStorage.getItem('kisan_admin_auth') === '1';
        const adminControls = isAdmin ? `
            <div class="admin-card-controls">
                <button class="admin-card-btn admin-edit-btn" onclick="adminEditListing('${crop.id}')" title="Admin: Edit">
                    <i class="fa-solid fa-pen"></i> Edit
                </button>
                <button class="admin-card-btn admin-del-btn" onclick="adminDeleteListing('${crop.id}')" title="Admin: Delete">
                    <i class="fa-solid fa-trash"></i> Delete
                </button>
            </div>` : '';

        const translatedCropName = Lang.t('opt_' + crop.cropType.toLowerCase())?.replace(/[^a-zA-Zा-्\s]/g, '')?.trim() || crop.cropType;
        const pUnit = Lang.t('col_price_unit') || '/ Quintal';
        const lblListed = Lang.t('listed_on') || 'Listed:';
        const lblCall = Lang.t('call_farmer') || 'Call Farmer';

        div.innerHTML = `
            ${adminControls}
            <img src="${imgUrl}" alt="${crop.cropType}" class="card-image" onerror="this.src='assets/placeholder.png'">
            <div class="card-content">
                <div class="card-header">
                    <h3 class="crop-name">${emoji} ${translatedCropName}</h3>
                    <span class="crop-badge badge-${crop.cropType}">${crop.quantity}</span>
                </div>
                <div class="card-price">₹${parseInt(crop.price).toLocaleString('en-IN')}<span class="price-unit"> ${pUnit}</span></div>
                <div class="card-details">
                    <p><i class="fa-regular fa-user"></i> ${crop.farmerName}</p>
                    <p><i class="fa-solid fa-location-dot"></i> ${crop.location}</p>
                    <p><i class="fa-solid fa-phone"></i> ${crop.phoneNumber}</p>
                    <p><i class="fa-regular fa-clock"></i> ${lblListed} ${dateStr}</p>
                </div>
                <div class="card-actions">
                    <a href="tel:${crop.phoneNumber}" class="btn-call">
                        <i class="fa-solid fa-phone"></i> ${lblCall} — ${crop.phoneNumber}
                    </a>
                </div>
            </div>
        `;
        return div;
    }
}

// Bootstrap
document.addEventListener('DOMContentLoaded', () => {
    window.app = new KisanMarketApp();
});

// ─── Admin Quick Utilities (called from inline onclick) ──────────────────────
window.adminDeleteListing = function (id) {
    const listings = JSON.parse(localStorage.getItem('kisan_market_crops_v2') || '[]');
    const updated = listings.filter(c => c.id !== id);
    localStorage.setItem('kisan_market_crops_v2', JSON.stringify(updated));
    window.app.crops = updated;
    window.app.renderMarket();
    showAdminToast('🗑️ Listing deleted by admin');
};

window.adminEditListing = function (id) {
    const listings = JSON.parse(localStorage.getItem('kisan_market_crops_v2') || '[]');
    const crop = listings.find(c => c.id === id);
    if (!crop) return;
    // populate quick-edit modal
    document.getElementById('qe_id').value = id;
    document.getElementById('qe_name').value = crop.farmerName || '';
    document.getElementById('qe_phone').value = crop.phoneNumber || '';
    document.getElementById('qe_crop').value = crop.cropType || '';
    document.getElementById('qe_qty').value = crop.quantity || '';
    document.getElementById('qe_price').value = crop.price || '';
    document.getElementById('qe_location').value = crop.location || '';
    document.getElementById('adminQuickEditModal').classList.remove('hidden');
};

window.adminSaveQuickEdit = function () {
    const id = document.getElementById('qe_id').value;
    const listings = JSON.parse(localStorage.getItem('kisan_market_crops_v2') || '[]');
    const idx = listings.findIndex(c => c.id === id);
    if (idx === -1) return;
    listings[idx] = {
        ...listings[idx],
        farmerName: document.getElementById('qe_name').value.trim(),
        phoneNumber: document.getElementById('qe_phone').value.trim(),
        cropType: document.getElementById('qe_crop').value,
        quantity: document.getElementById('qe_qty').value.trim(),
        price: document.getElementById('qe_price').value,
        location: document.getElementById('qe_location').value.trim(),
    };
    localStorage.setItem('kisan_market_crops_v2', JSON.stringify(listings));
    window.app.crops = listings;
    document.getElementById('adminQuickEditModal').classList.add('hidden');
    window.app.renderMarket();
    showAdminToast('✅ Listing updated by admin');
};

function showAdminToast(msg) {
    let t = document.getElementById('adminToast');
    if (!t) {
        t = document.createElement('div');
        t.id = 'adminToast';
        t.style.cssText = 'position:fixed;bottom:2rem;right:2rem;background:#1b5e20;color:#fff;padding:.9rem 1.5rem;border-radius:12px;font-weight:700;font-size:.9rem;z-index:9999;box-shadow:0 8px 24px rgba(0,0,0,.2);transform:translateY(150%);transition:transform .4s ease;display:flex;align-items:center;gap:.6rem;';
        document.body.appendChild(t);
    }
    t.textContent = msg;
    t.style.transform = 'translateY(0)';
    setTimeout(() => { t.style.transform = 'translateY(150%)'; }, 3000);
}

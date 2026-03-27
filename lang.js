/**
 * Kisan Sahayk — Language Translations
 * Supported: en (English), hi (Hindi), cg (Chhattisgarhi)
 */

const TRANSLATIONS = {
    en: {
        // Navbar
        nav_home: 'Home',
        nav_prices: 'Market Prices',
        nav_buy: 'Buy Crops',
        nav_sell: 'Sell Crops',

        // Hero
        hero_badge: "India's Farmer Marketplace",
        hero_sub: '🌾 Kisan Direct Market — India\'s Farmer Marketplace',
        hero_desc: 'Buy and sell crops <strong>directly</strong> without middlemen. Get fair prices, fresh produce, and transparent trade — straight from the farm!',
        hero_btn_buy: 'Buy Crops',
        hero_btn_sell: 'Sell Crops',
        hero_btn_rates: "Today's Rates",
        stat_farmers: 'Active Farmers',
        stat_listings: 'Listings Posted',
        stat_trade: 'Trade Done',

        // Action Cards
        action_title: 'What do you want to do?',
        buy_card_title: 'Buy Crops',
        buy_card_desc: 'Browse fresh listings from hundreds of farmers across India. Find the best prices for quality produce.',
        buy_li1: 'View farmer contact',
        buy_li2: 'Search & filter by crop',
        buy_li3: 'Direct farmer calling',
        buy_btn: 'Browse Market',
        sell_card_title: 'Sell Crops',
        sell_card_desc: 'Post your crop listing in 2 minutes. Get directly connected to thousands of buyers nationwide.',
        sell_li1: 'Free to list',
        sell_li2: 'No commission charges',
        sell_li3: 'Instant listing live',
        sell_btn: 'Post Listing',
        prices_card_title: 'Market Prices',
        prices_card_desc: 'Stay updated with daily fluctuating market rates (Mandi Bhav) for all major crops across states.',
        prices_li1: 'Live daily rates',
        prices_li2: 'Compare by region',
        prices_li3: 'Price trends & change',
        prices_btn: 'See Rates',

        // Crops Section
        crops_title: 'Crops We Trade',

        // Features
        features_title: 'Why Kisan Sahayk?',
        f1_title: 'Zero Middlemen',
        f1_desc: 'Transparent trade between farmer and buyer.',
        f2_title: 'Better Prices',
        f2_desc: 'Get the real market value for your hard work.',
        f3_title: 'Mobile Friendly',
        f3_desc: 'Works perfectly on all phones and tablets.',
        f4_title: 'Instant Listing',
        f4_desc: 'Your crop goes live within seconds of posting.',

        // Market Prices View
        prices_header: 'Daily Market Prices',
        prices_sub: 'Live Mandi Bhav — Updated: ',
        prices_table_title: 'Detailed Mandi Rates (per Quintal)',
        col_crop: 'Crop', col_variety: 'Variety / Type', col_state: 'State / Mandi',
        col_min: 'Min Price', col_max: 'Max Price', col_avg: 'Avg Price', col_change: 'Change',

        // Sell Form
        sell_page_title: 'Post Your Crop Listing',
        sell_page_sub: 'Fill in the details below. Your listing will be live instantly!',
        section_farmer: '👤 Farmer Details',
        lbl_name: 'Full Name',
        ph_name: 'e.g. Ramesh Kumar',
        lbl_phone: 'Phone Number',
        ph_phone: '10-digit number',
        section_crop: '🌾 Crop Details',
        lbl_crop: 'Crop Type',
        ph_crop: 'Select Crop',
        opt_rice: '🌾 Rice',
        opt_paddy: '🌿 Paddy / Dhan',
        opt_wheat: '🚜 Wheat / Gehu',
        opt_daal: '🫘 Pulses / Daal',
        lbl_qty: 'Quantity (Quintal / Kg)',
        ph_qty: 'e.g. 50 Quintals',
        lbl_price: 'Price per Quintal (₹)',
        ph_price: 'e.g. 2500',
        lbl_location: 'Location / Village',
        ph_location: 'e.g. Sangrur, Punjab',
        section_photo: '📷 Photo (Optional)',
        photo_choose: 'Choose Image',
        photo_or: 'or drag and drop here (max 2MB)',
        submit_btn: 'Post Listing Now',
        success_msg: 'Listing posted successfully! Redirecting to market...',

        // Buy / Marketplace
        market_title: '🛒 Crop Marketplace',
        market_sub: 'Connect directly with farmers. No middlemen, no hidden charges.',
        search_ph: 'Search crops, farmers, locations...',
        filter_all: '🌐 All',
        no_crops_title: 'No crops found',
        no_crops_sub: 'Try changing your search or filters.',
        clear_filters: 'Clear Filters',
        call_farmer: 'Call Farmer',
        listed_on: 'Listed:',

        // Footer
        support_title: 'Customer Support',
        support_desc: 'Need help? Contact our support team for assistance.',
        support_call: 'Call Us',
        footer_desc: 'Empowering Indian farmers through direct market access. Made with ❤️ for Bharat.',
    },

    hi: {
        // Navbar
        nav_home: 'होम',
        nav_prices: 'मंडी भाव',
        nav_buy: 'फसल खरीदें',
        nav_sell: 'फसल बेचें',

        // Hero
        hero_badge: 'भारत का किसान बाज़ार',
        hero_sub: '🌾 किसान डायरेक्ट मार्केट — भारत का किसान बाज़ार',
        hero_desc: 'बिना बिचौलियों के फसल सीधे <strong>खरीदें और बेचें</strong>। उचित मूल्य, ताजा उपज, और पारदर्शी व्यापार — सीधे खेत से!',
        hero_btn_buy: 'फसल खरीदें',
        hero_btn_sell: 'फसल बेचें',
        hero_btn_rates: 'आज के भाव',
        stat_farmers: 'सक्रिय किसान',
        stat_listings: 'पंजीकृत सूचियाँ',
        stat_trade: 'व्यापार हुआ',

        // Action Cards
        action_title: 'आप क्या करना चाहते हैं?',
        buy_card_title: 'फसल खरीदें',
        buy_card_desc: 'पूरे भारत के सैकड़ों किसानों की ताजा सूचियाँ देखें। बेहतरीन कीमत पर गुणवत्तापूर्ण उपज पाएं।',
        buy_li1: 'किसान का संपर्क देखें',
        buy_li2: 'फसल के अनुसार खोजें',
        buy_li3: 'किसान को सीधे कॉल करें',
        buy_btn: 'बाज़ार देखें',
        sell_card_title: 'फसल बेचें',
        sell_card_desc: '2 मिनट में अपनी फसल की सूची डालें। हजारों खरीदारों से सीधे जुड़ें।',
        sell_li1: 'मुफ्त में सूची डालें',
        sell_li2: 'कोई कमीशन नहीं',
        sell_li3: 'तुरंत लाइव हो जाएगी',
        sell_btn: 'सूची डालें',
        prices_card_title: 'मंडी भाव',
        prices_card_desc: 'सभी प्रमुख फसलों के दैनिक मंडी भाव (Mandi Bhav) देखें।',
        prices_li1: 'लाइव दैनिक भाव',
        prices_li2: 'क्षेत्र अनुसार तुलना',
        prices_li3: 'भाव में बदलाव',
        prices_btn: 'भाव देखें',

        // Crops Section
        crops_title: 'हम किन फसलों का व्यापार करते हैं',

        // Features
        features_title: 'किसान सहायक क्यों?',
        f1_title: 'बिना बिचौलिया',
        f1_desc: 'किसान और खरीदार के बीच पारदर्शी व्यापार।',
        f2_title: 'बेहतर कीमत',
        f2_desc: 'अपनी मेहनत का असली मूल्य पाएं।',
        f3_title: 'मोबाइल फ्रेंडली',
        f3_desc: 'सभी फोन और टैबलेट पर बेहतरीन काम करता है।',
        f4_title: 'तुरंत लाइव',
        f4_desc: 'पोस्ट करने के कुछ सेकंड में आपकी फसल लाइव हो जाती है।',

        // Market Prices View
        prices_header: 'दैनिक मंडी भाव',
        prices_sub: 'लाइव मंडी भाव — अपडेट: ',
        prices_table_title: 'विस्तृत मंडी दर (प्रति क्विंटल)',
        col_crop: 'फसल', col_variety: 'किस्म / प्रकार', col_state: 'राज्य / मंडी',
        col_min: 'न्यूनतम मूल्य', col_max: 'अधिकतम मूल्य', col_avg: 'औसत मूल्य', col_change: 'बदलाव',

        // Sell Form
        sell_page_title: 'अपनी फसल की सूची डालें',
        sell_page_sub: 'नीचे विवरण भरें। आपकी सूची तुरंत लाइव हो जाएगी!',
        section_farmer: '👤 किसान का विवरण',
        lbl_name: 'पूरा नाम',
        ph_name: 'जैसे: रमेश कुमार',
        lbl_phone: 'फोन नंबर',
        ph_phone: '10 अंकों का नंबर',
        section_crop: '🌾 फसल का विवरण',
        lbl_crop: 'फसल का प्रकार',
        ph_crop: 'फसल चुनें',
        opt_rice: '🌾 चावल',
        opt_paddy: '🌿 धान',
        opt_wheat: '🚜 गेहूँ',
        opt_daal: '🫘 दाल',
        lbl_qty: 'मात्रा (क्विंटल / किलो)',
        ph_qty: 'जैसे: 50 क्विंटल',
        lbl_price: 'मूल्य प्रति क्विंटल (₹)',
        ph_price: 'जैसे: 2500',
        lbl_location: 'स्थान / गाँव',
        ph_location: 'जैसे: संगरूर, पंजाब',
        section_photo: '📷 फोटो (वैकल्पिक)',
        photo_choose: 'फ़ोटो चुनें',
        photo_or: 'या यहाँ खींचकर छोड़ें (अधिकतम 2MB)',
        submit_btn: 'सूची अभी पोस्ट करें',
        success_msg: 'सूची सफलतापूर्वक पोस्ट हुई! बाज़ार पर जा रहे हैं...',

        // Buy / Marketplace
        market_title: '🛒 फसल बाज़ार',
        market_sub: 'किसानों से सीधे जुड़ें। कोई बिचौलिया नहीं, कोई छुपा शुल्क नहीं।',
        search_ph: 'फसल, किसान, स्थान खोजें...',
        filter_all: '🌐 सभी',
        no_crops_title: 'कोई फसल नहीं मिली',
        no_crops_sub: 'अपनी खोज या फ़िल्टर बदलने की कोशिश करें।',
        clear_filters: 'फ़िल्टर हटाएं',
        call_farmer: 'किसान को कॉल करें',
        listed_on: 'पोस्ट किया:',

        // Footer
        support_title: 'ग्राहक सहायता',
        support_desc: 'क्या आपको मदद चाहिए? सहायता के लिए हमारी सपोर्ट टीम से संपर्क करें।',
        support_call: 'हमें कॉल करें',
        footer_desc: 'सीधे बाज़ार पहुंच के माध्यम से भारतीय किसानों को सशक्त बनाना। ❤️ भारत के लिए बनाया।',
    },

    cg: {
        // Navbar
        nav_home: 'घर',
        nav_prices: 'बजार भाव',
        nav_buy: 'फसल किनें',
        nav_sell: 'फसल बेचें',

        // Hero
        hero_badge: 'छत्तीसगढ़ के किसान के सेती',
        hero_sub: '🌾 किसान डायरेक्ट मार्केट — छत्तीसगढ़ के किसान बाज़ार',
        hero_desc: 'बिना दलाल के फसल सीधे <strong>किनें अउ बेचें</strong>। उचित दाम, ताजा फसल, अउ सीधा खेत ले व्यापार!',
        hero_btn_buy: 'फसल किनें',
        hero_btn_sell: 'फसल बेचें',
        hero_btn_rates: 'आजके भाव',
        stat_farmers: 'सक्रिय किसान',
        stat_listings: 'दर्ज सूची',
        stat_trade: 'व्यापार होइस',

        // Action Cards
        action_title: 'तुम का करे चाहत हव?',
        buy_card_title: 'फसल किनें',
        buy_card_desc: 'छत्तीसगढ़ अउ पूरे भारत के किसान मन के ताजा फसल देखव। बढ़िया दाम म उपज पावव।',
        buy_li1: 'किसान के नंबर देखव',
        buy_li2: 'फसल के हिसाब से खोजव',
        buy_li3: 'सीधा किसान ला फोन करव',
        buy_btn: 'बजार देखव',
        sell_card_title: 'फसल बेचें',
        sell_card_desc: '2 मिनट म अपन फसल के सूची डालव। हजारों खरीददार मन से सीधा जुड़व।',
        sell_li1: 'मुफ्त म सूची डालव',
        sell_li2: 'कोनो कमीशन नई',
        sell_li3: 'तुरते लाइव हो जही',
        sell_btn: 'सूची डालव',
        prices_card_title: 'बजार भाव',
        prices_card_desc: 'सब्बो फसल के रोज के बजार भाव (मंडी भाव) देखव।',
        prices_li1: 'रोजके लाइव भाव',
        prices_li2: 'इलाका अनुसार तुलना',
        prices_li3: 'भाव बदलाव',
        prices_btn: 'भाव देखव',

        // Crops Section
        crops_title: 'हम कोन-कोन फसल के व्यापार करथन',

        // Features
        features_title: 'किसान सहायक काबर?',
        f1_title: 'बिना दलाल',
        f1_desc: 'किसान अउ खरीददार के बीच सीधा व्यापार।',
        f2_title: 'बढ़िया दाम',
        f2_desc: 'अपन मेहनत के असली दाम पावव।',
        f3_title: 'मोबाइल म चलथे',
        f3_desc: 'सब्बो फोन अउ टैबलेट म बढ़िया काम करथे।',
        f4_title: 'तुरते लाइव',
        f4_desc: 'पोस्ट करे के कुछ सेकेंड म फसल लाइव हो जथे।',

        // Market Prices View
        prices_header: 'रोजके बजार भाव',
        prices_sub: 'लाइव मंडी भाव — अपडेट: ',
        prices_table_title: 'विस्तृत मंडी दर (प्रति क्विंटल)',
        col_crop: 'फसल', col_variety: 'किस्म / प्रकार', col_state: 'राज्य / मंडी',
        col_min: 'न्यूनतम दाम', col_max: 'अधिकतम दाम', col_avg: 'औसत दाम', col_change: 'बदलाव',

        // Sell Form
        sell_page_title: 'अपन फसल के सूची डालव',
        sell_page_sub: 'नीचे जानकारी भरव। तुम्हार सूची तुरते लाइव हो जही!',
        section_farmer: '👤 किसान के जानकारी',
        lbl_name: 'पूरा नाव',
        ph_name: 'जइसे: रमेश कुमार',
        lbl_phone: 'फोन नंबर',
        ph_phone: '10 अंक के नंबर',
        section_crop: '🌾 फसल के जानकारी',
        lbl_crop: 'फसल के प्रकार',
        ph_crop: 'फसल चुनव',
        opt_rice: '🌾 धान / चाउर',
        opt_paddy: '🌿 धान (कच्चा)',
        opt_wheat: '🚜 गेहूँ',
        opt_daal: '🫘 दाल',
        lbl_qty: 'मात्रा (क्विंटल / किलो)',
        ph_qty: 'जइसे: 50 क्विंटल',
        lbl_price: 'दाम प्रति क्विंटल (₹)',
        ph_price: 'जइसे: 2500',
        lbl_location: 'गाँव / जगह',
        ph_location: 'जइसे: रायपुर, छत्तीसगढ़',
        section_photo: '📷 फोटो (वैकल्पिक)',
        photo_choose: 'फोटो चुनव',
        photo_or: 'या इहाँ खींचके छोड़व (अधिकतम 2MB)',
        submit_btn: 'सूची अभी डालव',
        success_msg: 'सूची सफलतापूर्वक पोस्ट होइस! बजार म जावत हन...',

        // Buy / Marketplace
        market_title: '🛒 फसल बजार',
        market_sub: 'किसान मन से सीधा जुड़व। न दलाल, न छुपा खर्चा।',
        search_ph: 'फसल, किसान, जगह खोजव...',
        filter_all: '🌐 सब्बो',
        no_crops_title: 'कोनो फसल नई मिलिस',
        no_crops_sub: 'खोज या फ़िल्टर बदल के देखव।',
        clear_filters: 'फ़िल्टर हटावव',
        call_farmer: 'किसान ला फोन करव',
        listed_on: 'पोस्ट होइस:',

        // Footer
        support_title: 'ग्राहक सहायता',
        support_desc: 'का तुमन ला मदद चाही? सहायता बर हमर सपोर्ट टीम ले संपर्क करव।',
        support_call: 'हमला फोन करव',
        footer_desc: 'छत्तीसगढ़ के किसान मन ला सीधा बजार से जोड़ना। ❤️ भारत बर बनाएन।',
    }
};

// ─── Language Engine ───────────────────────────────────────────────────────────
const Lang = {
    current: localStorage.getItem('kisan_lang') || 'en',

    t(key) {
        return TRANSLATIONS[this.current]?.[key] || TRANSLATIONS.en[key] || key;
    },

    set(code) {
        this.current = code;
        localStorage.setItem('kisan_lang', code);
        this.apply();
        // re-render dynamic content
        if (window.app) {
            window.app.renderMarket();
            window.app.renderPriceSummary?.();
            window.app.renderPriceTable?.();
        }
    },

    apply() {
        // Update all elements with data-lang attribute
        document.querySelectorAll('[data-lang]').forEach(el => {
            const key = el.getAttribute('data-lang');
            const val = this.t(key);
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = val;
            } else if (el.tagName === 'OPTION') {
                el.textContent = val;
            } else {
                el.innerHTML = val;
            }
        });

        // Update language switcher active state
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('lang-active', btn.dataset.lang === this.current);
        });

        // Update html lang attribute
        document.documentElement.lang = this.current === 'hi' ? 'hi' :
            this.current === 'cg' ? 'hi' : 'en';
    }
};

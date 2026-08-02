document.addEventListener("DOMContentLoaded", function () {
    loadComponents();
});

// Sitenin kök adresini otomatik bulan fonksiyon
function getSiteRoot() {
    const scriptTag = document.querySelector('script[src*="script.js"]');
    if (scriptTag) {
        const src = scriptTag.getAttribute('src');
        if (src.includes("../")) {
            const depth = (src.match(/\.\.\//g) || []).length;
            const pathSegments = window.location.pathname.split('/').filter(Boolean);
            const rootPath = pathSegments.slice(0, pathSegments.length - depth).join('/');
            return window.location.origin + '/' + rootPath;
        }
        return window.location.origin + window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'));
    }
    return window.location.origin;
}

async function loadComponents() {
    // 1. Kök dizini ve yolları ayarla
    const repoName = "/hasbierdogmus.github.io";
    const rootUrl = window.location.origin;

    // Script dosyasının olduğu yeri kök kabul et (en garanti yöntem)
    const scriptEl = document.querySelector('script[src*="script.js"]');
    let baseUrl = "";

    if (scriptEl && scriptEl.src) {
        baseUrl = scriptEl.src.replace('/script.js', '');
    } else {
        baseUrl = rootUrl + repoName;
    }

    // --- 1. HEADER YÜKLE ---
    try {
        const headerRes = await fetch(baseUrl + '/components/header.html');
        if (headerRes.ok) {
            const text = await headerRes.text();
            if (!text.includes("404")) {
                document.getElementById('global-header').innerHTML = text;

                // Menü geldikten sonra fonksiyonları çalıştır
                setActiveLink();
                initMenu();
                initTheme(); // Tema modunu başlat
                initLanguage(); // Dil desteğini başlat
            }
        }
    } catch (e) {
        console.log("Header yüklenemedi", e);
    }

    // --- 2. FOOTER YÜKLE ---
    try {
        const footerRes = await fetch(baseUrl + '/components/footer.html');
        if (footerRes.ok) {
            const text = await footerRes.text();
            if (!text.includes("404")) {
                document.getElementById('global-footer').innerHTML = text;
            }
        }
    } catch (e) {
        console.log("Footer yüklenemedi", e);
    }

    // --- 3. BANNER YÜKLE ---
    try {
        const bannerRes = await fetch(baseUrl + '/components/banner.html');
        if (bannerRes.ok) {
            const text = await bannerRes.text();
            if (!text.includes("404") && text.trim().length > 5) {
                const bannerDiv = document.getElementById('global-banner');
                if (bannerDiv) {
                    bannerDiv.innerHTML = text;
                }
            }
        }
    } catch (e) {
        console.log("Banner yüklenemedi", e);
    }

    // Tüm component'ler yüklendikten sonra body görünürlüğünü aç
    document.body.classList.add('page-loaded');
}

/* =========================================
   TEMA YÖNETİMİ (DARK MODE)
   ========================================= */
function initTheme() {
    const toggleBtn = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme');

    // 1. Kayıtlı tema varsa uygula
    if (currentTheme === 'dark' || currentTheme === 'light') {
        applyTheme(currentTheme);
    } else {
        applyTheme('light');
    }

    // 2. Inline onclick olmayan senaryolarda event bağla
    if (toggleBtn && !toggleBtn.getAttribute('onclick')) {
        toggleBtn.addEventListener('click', toggleTheme);
    }
}

function applyTheme(theme) {
    const icon = document.querySelector('#theme-toggle i');
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    if (icon) {
        icon.classList.toggle('fa-sun', theme === 'dark');
        icon.classList.toggle('fa-moon', theme !== 'dark');
    }
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
}

// --- MENÜ VE LİNK FONKSİYONLARI ---
function setActiveLink() {
    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    const menuLinks = document.querySelectorAll('.nav-menu a');

    menuLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPath || linkHref.endsWith("/" + currentPath)) {
            link.classList.add('active');
            const parentDropdown = link.closest('.dropdown');
            if (parentDropdown) {
                const dropdownLink = parentDropdown.querySelector('a');
                if (dropdownLink) {
                    dropdownLink.classList.add('active');
                }
            }
        }
    });
}

function initMenu() {
    const navMenu = document.getElementById('navMenu');
    const hamburger = document.getElementById('hamburgerBtn') || document.querySelector('.hamburger');

    if (hamburger && navMenu) {
        // Hamburger menüsünü aç/kapat
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });

        // Menüdeki linklere tıklama olayları
        navMenu.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (!link) return;

            const isDropdownToggle = link.classList.contains('dropdown-toggle');

            if (isDropdownToggle) {
                e.preventDefault(); // Sayfanın başına gitmesini engelle (Masaüstü ve mobil için)
                // Sadece mobil görünümde, tıklayınca alt menüyü aç/kapat
                if (window.innerWidth <= 968) {
                    const dropdown = link.parentElement;
                    dropdown.classList.toggle('open');
                }
            } else {
                // Normal bir linke veya alt menüdeki bir linke tıklandıysa mobil menüyü kapat
                closeMenu();
            }
        });
    }
}

function toggleMenu() {
    const hamburger = document.getElementById('hamburgerBtn') || document.querySelector('.hamburger');
    const navMenu = document.getElementById('navMenu');

    if (!hamburger || !navMenu) {
        return;
    }

    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
}

function closeMenu() {
    const hamburger = document.getElementById('hamburgerBtn') || document.querySelector('.hamburger');
    const navMenu = document.getElementById('navMenu');

    if (hamburger && navMenu) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
}

function closeBanner() {
    const banner = document.getElementById('global-banner');
    if (banner) {
        banner.style.display = 'none';
    }
}

/* =========================================
   DİL YÖNETİMİ (i18n)
   ========================================= */
function initLanguage() {
    const toggleBtn = document.getElementById('lang-toggle');
    const currentLang = localStorage.getItem('language') || 'tr';

    // Mevcut dili uygula
    applyLanguage(currentLang);

    // Butona event listener ekle
    if (toggleBtn && !toggleBtn.getAttribute('data-listener')) {
        toggleBtn.addEventListener('click', toggleLanguage);
        toggleBtn.setAttribute('data-listener', 'true');
    }
}

function applyLanguage(lang) {
    if (typeof translations === 'undefined') {
        console.warn("translations.js yüklenemedi.");
        return;
    }

    const dict = translations[lang];
    if (!dict) return;

    // Tüm data-i18n etiketli elementleri bul
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key]) {
            el.innerHTML = dict[key];
        }
    });

    // Html lang özelliğini güncelle
    document.documentElement.lang = lang;
    localStorage.setItem('language', lang);

    // Buton metnini güncelle (Türkçe'deyken 'EN', İngilizce'deyken 'TR' göster)
    const toggleBtn = document.getElementById('lang-toggle');
    if (toggleBtn) {
        toggleBtn.textContent = lang === 'tr' ? 'EN' : 'TR';
    }
}

function toggleLanguage() {
    const currentLang = localStorage.getItem('language') || 'tr';
    const nextLang = currentLang === 'tr' ? 'en' : 'tr';
    applyLanguage(nextLang);
}
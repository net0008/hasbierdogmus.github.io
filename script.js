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

    if (!hamburger || !navMenu) {
        return;
    }

    // Inline onclick olmayan senaryolarda event bağla
    if (!hamburger.getAttribute('onclick')) {
        hamburger.addEventListener('click', toggleMenu);
    }

    document.querySelectorAll(".nav-menu a").forEach(n =>
        n.addEventListener("click", () => {
            if (!n.parentElement.classList.contains('dropdown')) {
                hamburger.classList.remove("active");
                navMenu.classList.remove("active");
            }
        })
    );
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

function closeBanner() {
    const banner = document.getElementById('global-banner');
    if (banner) {
        banner.style.display = 'none';
    }
}
// --- Sayfa Bazlı Dinamik Güncelleme Tarihi ---
const sayfaTarihleri = {
    "/index.html": "12 Şubat 2026 - 10:00",
    "/": "15 Şubat 2026 - 10:00", 
    "/about.html": "15 Şubat 2026",
    "/other-works.html": "18 Şubat 2026",
    "/project-pardus-asistan.html": "11 Şubat 2026 - 20:30"
};

const varsayilanTarih = "10 Şubat 2026"; 

// Footer yüklendikten sonra çalışması için akıllı kontrol döngüsü
let footerBekleyici = setInterval(function () {
    const updateAlani = document.getElementById("last-update-date");
    
    // Footer HTML'i sayfaya yerleştirildiği an burası çalışır
    if (updateAlani) {
        clearInterval(footerBekleyici); // Döngüyü durdur

        let currentPath = window.location.pathname;
        let fileName = currentPath.substring(currentPath.lastIndexOf('/'));
        
        if (fileName === "" || fileName === "/") {
            fileName = "/index.html";
        }

        let tarih = sayfaTarihleri[fileName];
        
        if (!tarih) {
            tarih = varsayilanTarih;
        }

        updateAlani.innerHTML = `<i class="fas fa-history"></i> Bu Sayfanın Son Güncellemesi: <strong>${tarih}</strong>`;
    }
}, 100);
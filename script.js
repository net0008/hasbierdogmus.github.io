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
// --- Otomatik Güncelleme Tarihi (GitHub API ile) ---

/**
 * Sayfanın son güncellenme tarihini GitHub API'den çeker ve ilgili elementi günceller.
 * @param {HTMLElement} element - Tarihin yazılacağı HTML elementi.
 */
async function fetchLastUpdateDate(element) {
    const owner = "hasbierdogmus";
    const repo = "hasbierdogmus.github.io";

    // --- YENİ VE SAĞLAM YÖNTEM ---
    // Bu yöntem, hem canlı sunucuda (https://site.com/klasor/sayfa.html)
    // hem de yerel testlerde (file:///C:/.../klasor/sayfa.html) doğru çalışır.
    const repoName = "hasbierdogmus.github.io";
    let path = window.location.pathname;

    // Path'in içinde repo adını bul ve sonrasını al. Bu, GitHub Pages'in alt klasör yapısıyla uyumlu çalışır.
    const repoIndex = path.indexOf(repoName);
    if (repoIndex > -1) {
        path = path.substring(repoIndex + repoName.length + 1);
    } else if (path.startsWith('/')) {
        path = path.substring(1); // Baştaki / karakterini temizle
    }

    // Eğer path boş ise (ana sayfa), index.html olarak ayarla.
    if (path === "" || path.endsWith('/')) {
        path = "index.html";
    }

    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/commits?path=${path}&page=1&per_page=1`;

    try {
        const response = await fetch(apiUrl);
        // API'den cevap gelmezse veya dosya bulunamazsa hata vermemesi için kontrol
        if (!response.ok) {
            console.error(`GitHub API Hatası: ${path} için commit bilgisi alınamadı. Durum: ${response.status}`);
            element.parentElement.style.display = 'none'; // Hata durumunda alanı gizle
            return;
        }
        const commits = await response.json();

        if (commits && commits.length > 0) {
            const lastCommitDate = new Date(commits[0].commit.committer.date);

            // Tarihi "10 Mart 2026" formatında Türkçe olarak formatla
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            const formattedDate = lastCommitDate.toLocaleDateString('tr-TR', options);

            element.innerHTML = `<i class="fas fa-history"></i> Son Güncelleme: <strong>${formattedDate}</strong>`;
        } else {
            // Dosya için commit geçmişi bulunamazsa alanı gizle
            element.parentElement.style.display = 'none';
        }
    } catch (error) {
        console.error("Son güncelleme tarihi çekilirken hata oluştu:", error);
        // API hız limitine takılma veya ağ hatası gibi durumlarda alanı gizle
        element.parentElement.style.display = 'none';
    }
}

// Footer yüklendikten sonra güncelleme tarihini çekmek için kontrol döngüsü
let footerBekleyici = setInterval(function () {
    const updateAlani = document.getElementById("last-update-date");

    // Footer elementi sayfaya yüklendiğinde bu blok çalışır
    if (updateAlani) {
        clearInterval(footerBekleyici); // Döngüyü sonlandır
        fetchLastUpdateDate(updateAlani); // Otomatik tarihi çekme fonksiyonunu çağır
    }
}, 100);
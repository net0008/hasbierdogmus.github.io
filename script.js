document.addEventListener("DOMContentLoaded", function() {
    loadComponents();

/* =========================================
   TEMA YÖNETİMİ (DARK MODE)
   ========================================= */
function initTheme() {
    const toggleBtn = document.getElementById('theme-toggle');
    const icon = toggleBtn ? toggleBtn.querySelector('i') : null;
    const currentTheme = localStorage.getItem('theme');

    // 1. Kayıtlı tema varsa uygula
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        if (currentTheme === 'dark' && icon) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    }

    // 2. Butona tıklama olayı
    if (toggleBtn) {
        toggleBtn.addEventListener('click', function() {
            let theme = document.documentElement.getAttribute('data-theme');
            
            if (theme === 'dark') {
                // Gündüze Geç
                document.documentElement.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
                if(icon) {
                    icon.classList.remove('fa-sun');
                    icon.classList.add('fa-moon');
                }
            } else {
                // Geceye Geç
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                if(icon) {
                    icon.classList.remove('fa-moon');
                    icon.classList.add('fa-sun');
                }
            }
        });
    }
}

});
function initTheme() {
    const toggleBtn = document.getElementById('theme-toggle');
    const icon = toggleBtn ? toggleBtn.querySelector('i') : null;
    const currentTheme = localStorage.getItem('theme');

    // 1. Kayıtlı tema varsa uygula
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        if (currentTheme === 'dark' && icon) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    }
    
}

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
    let rootUrl = window.location.origin;
    
    // Script dosyasının olduğu yeri kök kabul et (En garanti yöntem)
    const scriptEl = document.querySelector('script[src*="script.js"]');
    let baseUrl = "";
    
    if(scriptEl) {
        const scriptPath = scriptEl.src; 
        baseUrl = scriptPath.replace('/script.js', ''); 
    } else {
        baseUrl = rootUrl + repoName;
    }

    // --- 1. HEADER YÜKLE ---
    try {
        const headerRes = await fetch(baseUrl + '/components/header.html');
        if (headerRes.ok) {
            const text = await headerRes.text();
            if(!text.includes("404")) {
                document.getElementById('global-header').innerHTML = text;
                
                // Menü geldikten sonra fonksiyonları çalıştır
                setActiveLink();
                initMenu();
                initTheme(); // Tema modunu başlat
            }
        }
    } catch (e) { console.log("Header yüklenemedi", e); }

    // --- 2. FOOTER YÜKLE ---
    try {
        const footerRes = await fetch(baseUrl + '/components/footer.html');
        if (footerRes.ok) {
            const text = await footerRes.text();
            if(!text.includes("404")) document.getElementById('global-footer').innerHTML = text;
        }
    } catch (e) { console.log("Footer yüklenemedi", e); }

    // --- 3. BANNER YÜKLE ---
    try {
        const bannerRes = await fetch(baseUrl + '/components/banner.html');
        if (bannerRes.ok) {
            const text = await bannerRes.text();
            if(!text.includes("404") && text.trim().length > 5) {
                const bannerDiv = document.getElementById('global-banner');
                if(bannerDiv) bannerDiv.innerHTML = text;
            }
        }
    } catch (e) { console.log("Banner yüklenemedi", e); }
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
            if (parentDropdown) parentDropdown.querySelector('a').classList.add('active');
        }
    });
}

function initMenu() {
    const hamburger = document.getElementById('hamburgerBtn');
    const navMenu = document.getElementById('navMenu');
    
    if (hamburger && navMenu) {
        // Eski eventleri temizle
        const newHamburger = hamburger.cloneNode(true);
        if(hamburger.parentNode) hamburger.parentNode.replaceChild(newHamburger, hamburger);
        
        newHamburger.addEventListener('click', function() {
            newHamburger.classList.toggle("active");
            navMenu.classList.toggle("active");
        });

        document.querySelectorAll(".nav-menu a").forEach(n => n.addEventListener("click", () => {
             if(!n.parentElement.classList.contains('dropdown')) {
                 newHamburger.classList.remove("active");
                 navMenu.classList.remove("active");
             }
        }));
    }
}

function closeBanner() { 
    const banner = document.getElementById('global-banner');
    if(banner) banner.style.display = 'none'; 
}
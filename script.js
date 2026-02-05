document.addEventListener("DOMContentLoaded", function() {
    loadComponents();
});

// Sitenin nerede olduğunu bulan akıllı yol tarifi (Bu kalmalı)
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
    let baseUrl = "";
    const scriptEl = document.querySelector('script[src*="script.js"]');
    
    // Kök dizini bul
    if(scriptEl) {
        const scriptPath = scriptEl.src; 
        baseUrl = scriptPath.replace('/script.js', ''); 
    } else {
        baseUrl = window.location.origin + "/hasbierdogmus.github.io";
    }

    // --- 1. HEADER YÜKLE ---
    try {
        const headerRes = await fetch(baseUrl + '/components/header.html');
        if (headerRes.ok) {
            const text = await headerRes.text();
            // Hata sayfası değilse ekle
            if(!text.includes("404")) {
                document.getElementById('global-header').innerHTML = text;
                setActiveLink(); // Linki boya
                initMenu();      // Hamburgeri çalıştır
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

// Menüde hangi sayfadaysak onu aktif yapan kod
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

// Hamburger Menü Aç/Kapa
function initMenu() {
    const hamburger = document.getElementById('hamburgerBtn');
    const navMenu = document.getElementById('navMenu');
    
    if (hamburger && navMenu) {
        // Eski eventleri temizle (clone yöntemi)
        const newHamburger = hamburger.cloneNode(true);
        if(hamburger.parentNode) hamburger.parentNode.replaceChild(newHamburger, hamburger);
        
        newHamburger.addEventListener('click', function() {
            newHamburger.classList.toggle("active");
            navMenu.classList.toggle("active");
        });

        // Linke tıklayınca menüyü kapat
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
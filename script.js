document.addEventListener("DOMContentLoaded", function() {
    loadComponents();
});

// Sitenin kök adresini script dosyasının nerede olduğuna bakarak bulan fonksiyon
function getSiteRoot() {
    // Sayfadaki script.js dosyasını bul
    const scriptTag = document.querySelector('script[src*="script.js"]');
    if (scriptTag) {
        // Dosyanın tam adresini al (örn: https://.../hasbierdogmus.github.io/script.js)
        const fullUrl = scriptTag.src;
        // Sonundaki "/script.js" kısmını at, geriye kök klasör kalsın
        return fullUrl.substring(0, fullUrl.lastIndexOf('/'));
    }
    // Bulamazsa standart yöntemi kullan
    return window.location.origin + window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'));
}

async function loadComponents() {
    // Kök adresi otomatik bul
    const basePath = getSiteRoot();
    console.log("Site Kök Adresi Tespit Edildi:", basePath); // Konsoldan kontrol etmek için

    // --- 1. HEADER YÜKLE ---
    try {
        // Otomatik bulunan adrese göre dosya iste
        const headerRes = await fetch(basePath + '/components/header.html');
        if (headerRes.ok) {
            const headerHtml = await headerRes.text();
            // Gelen şeyin hata sayfası olmadığını kontrol et
            if (!headerHtml.includes("404") && !headerHtml.includes("Not Found")) {
                document.getElementById('global-header').innerHTML = headerHtml;
                setActiveLink();
                initMenu();
            }
        }
    } catch (error) {
        console.error("Header yüklenemedi:", error);
    }

    // --- 2. FOOTER YÜKLE ---
    try {
        const footerRes = await fetch(basePath + '/components/footer.html');
        if (footerRes.ok) {
            const footerHtml = await footerRes.text();
            if (!footerHtml.includes("404")) {
                document.getElementById('global-footer').innerHTML = footerHtml;
            }
        }
    } catch (error) { console.error("Footer hatası:", error); }

    // --- 3. BANNER YÜKLE ---
    try {
        const bannerRes = await fetch(basePath + '/components/banner.html');
        if (bannerRes.ok) {
            const bannerHtml = await bannerRes.text();
            if (!bannerHtml.includes("404") && bannerHtml.trim().length > 10) {
                const bannerEl = document.getElementById('global-banner');
                if(bannerEl) bannerEl.innerHTML = bannerHtml;
            }
        }
    } catch (error) { console.error("Banner hatası:", error); }
}

// --- MENÜ İŞLEVLERİ (Aynı kalıyor) ---
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
        const newHamburger = hamburger.cloneNode(true);
        hamburger.parentNode.replaceChild(newHamburger, hamburger);
        
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
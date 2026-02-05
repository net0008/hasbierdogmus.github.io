document.addEventListener("DOMContentLoaded", function() {
    loadComponents();
});

async function loadComponents() {
    // URL'nin kökünü al (Örn: https://hasbierdogmus.github.io veya localhost)
    const baseUrl = window.location.origin;

    // --- 1. HEADER YÜKLE ---
    try {
        // Başına / koyarak mutlak yol veriyoruz
        const headerRes = await fetch(baseUrl + '/components/header.html');
        
        if (headerRes.ok) { 
            const headerHtml = await headerRes.text();
            // Gelen şeyin gerçekten HTML menüsü olup olmadığını kontrol et (DOCTYPE veya 404 yazısı içermesin)
            if (!headerHtml.includes("404") && !headerHtml.includes("Not Found")) {
                document.getElementById('global-header').innerHTML = headerHtml;
                setActiveLink();
                initMenu();
            } else {
                console.error("HATA: Header dosyası bulunamadı (404 döndü).");
            }
        } else {
            console.error("HATA: Header yüklenirken sunucu hatası:", headerRes.status);
        }
    } catch (error) {
        console.error("Header bağlantı hatası:", error);
    }

    // --- 2. FOOTER YÜKLE ---
    try {
        const footerRes = await fetch(baseUrl + '/components/footer.html');
        if (footerRes.ok) {
            const footerHtml = await footerRes.text();
            if (!footerHtml.includes("404")) {
                document.getElementById('global-footer').innerHTML = footerHtml;
            }
        }
    } catch (error) {
        console.error("Footer yüklenirken hata:", error);
    }

    // --- 3. BANNER YÜKLE ---
    try {
        const bannerRes = await fetch(baseUrl + '/components/banner.html');
        if (bannerRes.ok) {
            const bannerHtml = await bannerRes.text();
            // Hem 404 değilse, hem de içi boş değilse göster
            if (!bannerHtml.includes("404") && bannerHtml.trim().length > 10) {
                const bannerEl = document.getElementById('global-banner');
                if(bannerEl) bannerEl.innerHTML = bannerHtml;
            }
        }
    } catch (error) {
        console.error("Banner yüklenirken hata:", error);
    }
}

// --- MENÜ İŞLEVLERİ ---
function setActiveLink() {
    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    const menuLinks = document.querySelectorAll('.nav-menu a');

    menuLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        // Sadece dosya ismini karşılaştır (karmaşık yolları göz ardı et)
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
        // Eski event listener'ları temizlemek için klonlama yöntemi (Opsiyonel ama güvenli)
        const newHamburger = hamburger.cloneNode(true);
        hamburger.parentNode.replaceChild(newHamburger, hamburger);
        
        newHamburger.addEventListener('click', function() {
            newHamburger.classList.toggle("active");
            navMenu.classList.toggle("active");
        });

        // Linklere tıklayınca menüyü kapat
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
document.addEventListener("DOMContentLoaded", function() {
    loadComponents();
});

// Sitenin kök adresini otomatik bulan fonksiyon
function getSiteRoot() {
    const scriptTag = document.querySelector('script[src*="script.js"]');
    if (scriptTag) {
        const src = scriptTag.getAttribute('src');
        // Eğer script ../script.js diye çağrılmışsa, bulunduğumuz yerden bir yukarı çık
        if (src.includes("../")) {
            const depth = (src.match(/\.\.\//g) || []).length;
            const pathSegments = window.location.pathname.split('/').filter(Boolean);
            // Son (depth) kadar klasörü at
            const rootPath = pathSegments.slice(0, pathSegments.length - depth).join('/');
            return window.location.origin + '/' + rootPath;
        }
        // Eğer aynı dizindeyse direkt origin + path kullan
        return window.location.origin + window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'));
    }
    return window.location.origin;
}

async function loadComponents() {
    // Kök dizini bulma mantığını basitleştirelim:
    // Eğer components klasörü ana dizindeyse, dosya yollarını ona göre ayarlayalım.
    
    // ŞU ANKİ SAYFANIN KONUMUNA BAK:
    // Eğer adres "hasbierdogmus.github.io/index.html" ise (Ana Dizin) -> yol: "components/..."
    // Eğer adres "hasbierdogmus.github.io/projeler/abc.html" ise (Alt Dizin) -> yol: "../components/..."
    
    let pathPrefix = "";
    if (window.location.pathname.includes("/projeler/")) {
        // Eğer projeler klasörünün içindeysek bir geri çık
        pathPrefix = "../"; 
        // Eğer projeler/kategori/dosya.html ise iki geri çık (Bunu klasör yapına göre ayarlayabilirsin)
        if ((window.location.pathname.match(/\//g) || []).length > 2) {
             // Basit çözüm: components'e ulaşana kadar dene
        }
    }

    // EN GARANTİ YÖNTEM: Mutlak Yol (Absolute Path)
    // Senin GitHub adresin belli. Doğrudan orayı hedef gösterelim.
    // Böylece "neredeyim" derdi kalmaz.
    const repoName = "/hasbierdogmus.github.io"; // Senin depo adın
    const rootUrl = window.location.origin + repoName;

    // 1. HEADER
    try {
        // GitHub Pages'de bazen repo adı URL'de olur, bazen olmaz (custom domain yoksa olur)
        // O yüzden göreceli yol yerine, script.js'in yanındaki components'i arayalım.
        
        // Script dosyasının olduğu yeri kök kabul et
        const scriptEl = document.querySelector('script[src*="script.js"]');
        const scriptPath = scriptEl.src; // Tam adres: http://.../script.js
        const baseUrl = scriptPath.replace('/script.js', ''); // http://.../root

        const headerRes = await fetch(baseUrl + '/components/header.html');
        if (headerRes.ok) {
            const text = await headerRes.text();
            if(!text.includes("404")) document.getElementById('global-header').innerHTML = text;
            setActiveLink();
            initMenu();
        }
    } catch (e) { console.log("Header yüklenemedi"); }

    // 2. FOOTER
    try {
        const scriptEl = document.querySelector('script[src*="script.js"]');
        const baseUrl = scriptEl.src.replace('/script.js', '');
        
        const footerRes = await fetch(baseUrl + '/components/footer.html');
        if (footerRes.ok) {
            const text = await footerRes.text();
            if(!text.includes("404")) document.getElementById('global-footer').innerHTML = text;
        }
    } catch (e) { console.log("Footer yüklenemedi"); }

    // 3. BANNER
    try {
        const scriptEl = document.querySelector('script[src*="script.js"]');
        const baseUrl = scriptEl.src.replace('/script.js', '');

        const bannerRes = await fetch(baseUrl + '/components/banner.html');
        if (bannerRes.ok) {
            const text = await bannerRes.text();
            if(!text.includes("404") && text.trim().length > 5) {
                const bannerDiv = document.getElementById('global-banner');
                if(bannerDiv) bannerDiv.innerHTML = text;
            }
        }
    } catch (e) { console.log("Banner yüklenemedi"); }
}

function setActiveLink() { /* ... Eski kodun aynısı ... */ }
function initMenu() { /* ... Eski kodun aynısı ... */ }
function closeBanner() { document.getElementById('global-banner').style.display = 'none'; }
// update.js - Sayfa Bazlı Güncelleme Merkezi

// SAYFALARIN GÜNCELLEME TARİHLERİNİ BURAYA YAZACAKSIN
// Sol taraf: Sayfanın dosya adı, Sağ taraf: Tarih
const sayfaTarihleri = {
    "/index.html": "19 Şubat 2026 - 10:00",
    "/": "7 Şubat 2026 - 10:00", // Ana dizin (site.com.tr) açıldığında
    "/about.html": "7 Şubat 2026",
    "/other-works.html": "7 Şubat 2026",
    "/project-pardus-asistan.html": "15 Şubat 2026 - 20:30"
};

// Listeye eklemeyi unuttuğun veya henüz güncellemediğin sayfalar için varsayılan tarih
const varsayilanTarih = "12 Şubat 2026"; 

document.addEventListener("DOMContentLoaded", function () {
    
    function updateSayfaTarihi() {
        const updateAlani = document.getElementById("last-update-date");
        
        if (updateAlani) {
            // 1. Tarayıcının adres çubuğundaki yolu al (Örn: /project-pardus-asistan.html)
            let currentPath = window.location.pathname;
            let fileName = currentPath.substring(currentPath.lastIndexOf('/'));
            
            // Eğer adres sadece site.com.tr/ ise onu index.html'e eşitle
            if (fileName === "" || fileName === "/") {
                fileName = "/index.html";
            }

            // 2. Sözlükten o sayfanın tarihini çek
            let tarih = sayfaTarihleri[fileName];
            
            // 3. Eğer sayfa listede yoksa varsayılanı kullan
            if (!tarih) {
                tarih = varsayilanTarih;
            }

            // 4. HTML'in içine (Footer'a) bas
            updateAlani.innerHTML = `<i class="fas fa-history"></i> Bu Sayfanın Son Güncellemesi: <strong>${tarih}</strong>`;
        }
    }

    // script.js'nin footer'ı yüklemesi için 500ms (yarım saniye) bekleyip çalıştırıyoruz
    setTimeout(updateSayfaTarihi, 500); 
});
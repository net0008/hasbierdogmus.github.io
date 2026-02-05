import os
import re

# Bu dosyalara dokunma (Component dosyaları ve scriptin kendisi)
HARIC_TUTULACAKLAR = ["header.html", "footer.html", "banner.html", "temizlik.py"]

def temizlik_yap():
    # Bulunduğumuz klasördeki tüm dosyaları listele
    dosyalar = [f for f in os.listdir('.') if f.endswith('.html')]

    print(f"Toplam {len(dosyalar)} adet HTML dosyası tarandı.")
    print("-" * 40)

    for dosya_adi in dosyalar:
        # Harç tutulacak dosya ise pas geç
        if dosya_adi in HARIC_TUTULACAKLAR or "components" in dosya_adi:
            continue

        print(f"İşleniyor: {dosya_adi} ...")

        try:
            # 1. Dosyayı Oku
            with open(dosya_adi, 'r', encoding='utf-8') as f:
                icerik = f.read()

            # Eğer dosya zaten güncellenmişse (global-header varsa) pas geç
            if 'id="global-header"' in icerik and 'id="global-footer"' in icerik:
                print(f"  -> Bu dosya zaten güncel, atlanıyor.")
                continue

            # 2. Yedek Al (.bak dosyası oluştur)
            with open(dosya_adi + ".bak", 'w', encoding='utf-8') as f_yedek:
                f_yedek.write(icerik)

            # 3. HEADER DEĞİŞİMİ
            # <header ... > ... </header> bloğunu bul ve değiştir
            # re.DOTALL sayesinde satır atlamalarını da kapsar
            yeni_icerik = re.sub(
                r'<header.*?>.*?</header>', 
                '<header id="global-header"></header>', 
                icerik, 
                flags=re.DOTALL
            )

            # 4. FOOTER DEĞİŞİMİ
            yeni_icerik = re.sub(
                r'<footer.*?>.*?</footer>', 
                '<footer id="global-footer"></footer>', 
                yeni_icerik, 
                flags=re.DOTALL
            )

            # 5. BANNER EKLEME
            # <body> etiketini bul ve hemen altına banner divini ekle
            if 'id="global-banner"' not in yeni_icerik:
                yeni_icerik = re.sub(
                    r'<body(.*?)>', 
                    r'<body\1>\n    \n    <div id="global-banner"></div>', 
                    yeni_icerik, 
                    count=1
                )

            # 6. Dosyayı Kaydet
            with open(dosya_adi, 'w', encoding='utf-8') as f_yeni:
                f_yeni.write(yeni_icerik)
            
            print(f"  -> Başarıyla güncellendi! (Yedek: {dosya_adi}.bak)")

        except Exception as e:
            print(f"  -> HATA OLUŞTU: {e}")

    print("-" * 40)
    print("İşlem Tamamlandı. Lütfen siteni kontrol et.")
    print("Not: Eğer bir sorun varsa .bak dosyalarını kullanarak geri alabilirsin.")

if __name__ == "__main__":
    # Emin misin diye soralım
    onay = input("DİKKAT: Tüm HTML dosyalarındaki Header ve Footer alanları silinip yer tutucularla değiştirilecek.\nDosyaların yedeği (.bak) alınacaktır.\nDevam etmek istiyor musun? (e/h): ")
    
    if onay.lower() == 'e':
        temizlik_yap()
    else:
        print("İşlem iptal edildi.")
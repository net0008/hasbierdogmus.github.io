document.addEventListener('DOMContentLoaded', () => {
    const messagesContainer = document.getElementById('messages-container');
    const visitorForm = document.getElementById('visitor-form');
    const formStatus = document.getElementById('form-status');
    
    if (!messagesContainer || !visitorForm || !formStatus) return;

    // SİZİN GÜNCEL V3 URL'NİZ
    const scriptURL = 'https://script.google.com/macros/s/AKfycbzP_JxRe-BuPqEsPQMxVm9fHHs40q1GDoEj_uNYs_DBw56XF2BQlBqAwC1BgfcRfAvw/exec';

    const loadMessages = () => {
        messagesContainer.innerHTML = `<h2 style="color: var(--navy); margin-bottom: 30px;">Paylaşılan Mesajlar</h2>
                                       <p style="color: var(--medium-gray);">Mesajlar yükleniyor...</p>`;

        fetch(scriptURL)
            .then(response => response.json())
            .then(data => {
                // Başlık hariç temizle
                messagesContainer.innerHTML = `<h2 style="color: var(--navy); margin-bottom: 30px;">Paylaşılan Mesajlar</h2>`;

                if (Array.isArray(data) && data.length > 0) {
                    data.reverse().forEach(item => {
                        const messageCard = document.createElement('div');
                        messageCard.className = 'message-card';
                        
                        const date = new Date(item.tarih).toLocaleDateString('tr-TR', {
                            year: 'numeric', month: 'long', day: 'numeric'
                        });

                        messageCard.innerHTML = `
                            <div class="message-header">
                                <strong>${item.isim}</strong>
                                <span>${date}</span>
                            </div>
                            <p>${item.mesaj}</p>
                        `;
                        messagesContainer.appendChild(messageCard);
                    });
                } else {
                    messagesContainer.innerHTML += '<p style="color: var(--medium-gray);">Henüz hiç mesaj bırakılmamış. İlk mesajı siz bırakın!</p>';
                }
            })
            .catch(error => {
                console.error('Hata:', error);
                messagesContainer.innerHTML += '<p style="color: red;">Mesajlar şu an yüklenemiyor.</p>';
            });
    };

    visitorForm.addEventListener('submit', e => {
        e.preventDefault();
        formStatus.style.display = 'block';
        formStatus.innerText = 'Gönderiliyor...';

        // Veriyi Apps Script'in anlayacağı formata çeviriyoruz
        const formData = new URLSearchParams(new FormData(visitorForm));

        fetch(scriptURL, { 
            method: 'POST', 
            body: formData,
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
        })
        .then(() => {
            formStatus.innerText = 'Mesajınız başarıyla iletildi, teşekkürler!';
            visitorForm.reset();
            setTimeout(() => {
                formStatus.style.display = 'none';
                loadMessages();
            }, 3000);
        })
        .catch(error => {
            formStatus.innerText = 'Bir hata oluştu.';
            console.error('Hata!', error);
        });
    });

    loadMessages();
});
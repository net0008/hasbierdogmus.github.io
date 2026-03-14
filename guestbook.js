document.addEventListener('DOMContentLoaded', () => {
    const messagesContainer = document.getElementById('messages-container');
    const visitorForm = document.getElementById('visitor-form');
    const formStatus = document.getElementById('form-status');
    
    // Eğer bu elemanlar sayfada yoksa, scriptin bu bölümü çalışmasın.
    if (!messagesContainer || !visitorForm || !formStatus) return;

    const getMessagesUrl = 'https://script.google.com/macros/s/AKfycbynQ69ooN9Sav40ggNXT1mKhpFiePv5JV9vsQ9Ti9m2BDXtQEX5g9iTUZnrwuvmqVZr/exec';
    const postMessageUrl = 'https://script.google.com/macros/s/AKfycbw1rGOMsl9fpc0uuhCCOUZhTCVmVRD11G2OmEuHJzDE3qPzdfWo0rFCDKepQ9FXt_BJ/exec';

    const loadMessages = () => {
        // Mesajları yüklemeden önce mevcut içeriği temizle ve yükleniyor mesajı göster
        messagesContainer.innerHTML = `
            <h2 style="color: var(--navy); margin-bottom: 30px;">Paylaşılan Mesajlar</h2>
            <p class="loading-message" style="color: var(--medium-gray);">Mesajlar yükleniyor...</p>
        `;

        fetch(getMessagesUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Ağ yanıtı sorunluydu: ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                // Başlık hariç içini temizle
                messagesContainer.innerHTML = `<h2 style="color: var(--navy); margin-bottom: 30px;">Paylaşılan Mesajlar</h2>`;

                if (data && data.data && data.data.length > 0) {
                    const reversedData = data.data.reverse();

                    reversedData.forEach(item => {
                        const messageCard = document.createElement('div');
                        messageCard.className = 'message-card';

                        const cardHeader = document.createElement('div');
                        cardHeader.className = 'message-header';

                        const nameElement = document.createElement('strong');
                        nameElement.textContent = item.isim;

                        const dateElement = document.createElement('span');
                        const date = new Date(item.tarih);
                        dateElement.textContent = date.toLocaleDateString('tr-TR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        });

                        cardHeader.appendChild(nameElement);
                        cardHeader.appendChild(dateElement);

                        const messageBody = document.createElement('p');
                        messageBody.textContent = item.mesaj;

                        messageCard.appendChild(cardHeader);
                        messageCard.appendChild(messageBody);

                        messagesContainer.appendChild(messageCard);
                    });
                } else {
                    messagesContainer.innerHTML += '<p style="color: var(--medium-gray);">Henüz hiç mesaj bırakılmamış. İlk mesajı siz bırakın!</p>';
                }
            })
            .catch(error => {
                console.error('Ziyaretçi defteri mesajları alınırken hata oluştu:', error);
                messagesContainer.innerHTML = `
                    <h2 style="color: var(--navy); margin-bottom: 30px;">Paylaşılan Mesajlar</h2>
                    <p style="color: red;">Mesajlar yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.</p>
                `;
            });
    };

    // Form gönderimini dinle
    visitorForm.addEventListener('submit', e => {
        e.preventDefault();
        formStatus.style.display = 'block';
        formStatus.className = 'status-sending';
        formStatus.innerText = 'Gönderiliyor...';

        fetch(postMessageUrl, { method: 'POST', body: new FormData(visitorForm) })
            .then(response => {
                formStatus.className = 'status-success';
                formStatus.innerText = 'Mesajınız başarıyla iletildi, teşekkürler!';
                visitorForm.reset();
                setTimeout(() => {
                    formStatus.style.display = 'none';
                    loadMessages(); // Mesaj listesini tazele
                }, 3000);
            })
            .catch(error => {
                formStatus.className = 'status-error';
                formStatus.innerText = 'Bir hata oluştu. Lütfen tekrar deneyin.';
                console.error('Hata!', error.message);
            });
    });

    // Sayfa yüklendiğinde mesajları ilk kez yükle
    loadMessages();
});
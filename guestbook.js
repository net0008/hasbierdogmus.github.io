document.addEventListener('DOMContentLoaded', () => {
    const messagesContainer = document.getElementById('messages-container');
    if (!messagesContainer) return;

    const appsScriptUrl = 'https://script.google.com/macros/s/AKfycbynQ69ooN9Sav40ggNXT1mKhpFiePv5JV9vsQ9Ti9m2BDXtQEX5g9iTUZnrwuvmqVZr/exec';

    // Başlığı ve yükleniyor mesajını ayarla
    messagesContainer.innerHTML = `
        <h2 style="color: var(--navy); margin-bottom: 30px;">Paylaşılan Mesajlar</h2>
        <p class="loading-message" style="color: var(--medium-gray);">Mesajlar yükleniyor...</p>
    `;

    fetch(appsScriptUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Ağ yanıtı sorunluydu: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            // Yükleniyor mesajını temizle
            const loadingMessage = messagesContainer.querySelector('.loading-message');
            if (loadingMessage) {
                loadingMessage.remove();
            }

            // Gelen verinin "data" adlı bir dizi içerdiğini varsayıyoruz
            if (data && data.data && data.data.length > 0) {
                // Veriyi ters çevirerek en son mesajın en üstte olmasını sağla
                const reversedData = data.data.reverse();

                reversedData.forEach(item => {
                    const messageCard = document.createElement('div');
                    messageCard.className = 'message-card';

                    const cardHeader = document.createElement('div');
                    cardHeader.className = 'message-header';

                    const nameElement = document.createElement('strong');
                    nameElement.textContent = item.isim;

                    const dateElement = document.createElement('span');
                    // Tarihi Türkiye formatında göster
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
            const loadingMessage = messagesContainer.querySelector('.loading-message');
            if(loadingMessage) loadingMessage.remove();
            messagesContainer.innerHTML += '<p style="color: red;">Mesajlar yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.</p>';
        });
});
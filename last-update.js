/**
 * last-update.js
 * Her sayfa güncellendiğinde footer'da güncellenme tarihini ve saatini otomatik gösterir.
 * Açık / koyu tema ile tam uyumludur.
 */
(function () {
    'use strict';

    /* ── CSS: Tema değişkenlerine uyumlu stil ── */
    const style = document.createElement('style');
    style.textContent = `
        /* ── Footer güncelleme bilgisi ── */
        .footer-update-info {
            text-align: center;
            margin: 18px 0 10px;
        }

        #last-update-date {
            display: inline-flex;
            align-items: center;
            gap: 7px;
            font-family: 'Montserrat', sans-serif;
            font-size: 0.72rem;
            font-style: italic;
            letter-spacing: 0.4px;
            color: rgba(255, 255, 255, 0.38);
            transition: color 0.3s ease, opacity 0.3s ease;
        }

        #last-update-date i {
            font-size: 0.65rem;
            opacity: 0.75;
        }

        #last-update-date .update-label {
            opacity: 0.75;
        }

        #last-update-date .update-value {
            font-weight: 600;
            font-style: normal;
            color: rgba(255, 255, 255, 0.55);
            letter-spacing: 0.2px;
        }

        /* ── Açık tema ── */
        [data-theme="light"] #last-update-date {
            color: rgba(60, 60, 60, 0.42);
        }

        [data-theme="light"] #last-update-date .update-value {
            color: rgba(60, 60, 60, 0.62);
        }

        /* ── Sistem koyu tema (data-theme henüz set edilmemişse) ── */
        @media (prefers-color-scheme: dark) {
            #last-update-date:not([data-theme="light"] *) {
                color: rgba(255, 255, 255, 0.38);
            }
        }
    `;
    document.head.appendChild(style);

    /* ── Tarihi Türkçe biçimde formatla ── */
    function formatDate(date) {
        try {
            return date.toLocaleDateString('tr-TR', {
                year:   'numeric',
                month:  'long',
                day:    'numeric',
                hour:   '2-digit',
                minute: '2-digit',
                timeZone: 'Europe/Istanbul'
            });
        } catch (e) {
            // Fallback: sistem saat dilimiyle
            return date.toLocaleDateString('tr-TR', {
                year:   'numeric',
                month:  'long',
                day:    'numeric',
                hour:   '2-digit',
                minute: '2-digit'
            });
        }
    }

    /* ── #last-update-date elementini doldur ── */
    function renderUpdateDate() {
        const el = document.getElementById('last-update-date');
        if (!el) return false;

        const lastMod = new Date(document.lastModified);

        el.innerHTML =
            '<i class="fas fa-clock" aria-hidden="true"></i>' +
            '<span class="update-label">Son güncelleme:</span>' +
            '<span class="update-value">' + formatDate(lastMod) + '</span>';

        return true;
    }

    /* ── Footer asenkron yüklendiği için MutationObserver ile bekle ── */
    if (!renderUpdateDate()) {
        const observer = new MutationObserver(function () {
            if (renderUpdateDate()) {
                observer.disconnect();
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree:   true
        });
    }

})();
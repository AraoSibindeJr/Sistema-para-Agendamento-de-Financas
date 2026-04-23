const POPUP_ICONS = {
  success: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="28" height="28">
               <path d="M20 6L9 17l-5-5"/>
             </svg>`,
  error:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="28" height="28">
               <circle cx="12" cy="12" r="10"/>
               <line x1="15" y1="9" x2="9" y2="15"/>
               <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>`,
  warning: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="28" height="28">
               <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
               <line x1="12" y1="9" x2="12" y2="13"/>
               <line x1="12" y1="17" x2="12.01" y2="17"/>
             </svg>`
};

/**
 * Mostra o popup de feedback
 * @param {string} tipo - 'success', 'error' ou 'warning'
 * @param {string} titulo - Título do popup
 * @param {string} mensagem - Mensagem descritiva
 * @param {Function} [callbackAoFechar] - Funcao chamada ao fechar (opcional)
 * @param {number} [autoFecharMs] - Fecha automaticamente apos X milissegundos (opcional)
 */
function showPopup(tipo, titulo, mensagem, callbackAoFechar, autoFecharMs) {
  const overlay  = document.getElementById('popup-overlay');
  const iconeEl  = document.getElementById('popup-icon');
  const tituloEl = document.getElementById('popup-title');
  const msgEl    = document.getElementById('popup-message');

  if (!overlay || !iconeEl || !tituloEl || !msgEl) {
    console.warn('popup.js: Elementos do popup não encontrados no DOM.');
    return;
  }

  iconeEl.innerHTML = POPUP_ICONS[tipo] || POPUP_ICONS.warning;
  iconeEl.className = 'popup-icon popup-icon--' + tipo;
  tituloEl.textContent = titulo;
  msgEl.textContent = mensagem;

  overlay._callbackAoFechar = callbackAoFechar || null;

  overlay.setAttribute('aria-hidden', 'false');

  overlay.classList.add('popup-active');

  if (autoFecharMs && typeof autoFecharMs === 'number') {
    setTimeout(function () {
      closePopup();
    }, autoFecharMs);
  }
}

function closePopup() {
  const overlay = document.getElementById('popup-overlay');
  if (!overlay) return;

  overlay.classList.remove('popup-active');
  overlay.setAttribute('aria-hidden', 'true');


  setTimeout(function () {
    if (overlay._callbackAoFechar && typeof overlay._callbackAoFechar === 'function') {
      overlay._callbackAoFechar();
      overlay._callbackAoFechar = null;
    }
  }, 280);
}


document.addEventListener('DOMContentLoaded', function () {
  const overlay = document.getElementById('popup-overlay');
  if (overlay) {
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) {
        closePopup();
      }
    });
  }
});

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    closePopup();
  }
});

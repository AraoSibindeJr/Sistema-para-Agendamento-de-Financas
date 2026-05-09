const POPUP_ICONS = {
   success: `<img src="{css,js,assets/{images,icons},components}/check.png" alt="Logo AT" class="logo-image" style="width:    25px;"/>`,
   error:   `<img src="{css,js,assets/{images,icons},components}/remove.png" alt="Logo AT" class="logo-image" style="width: 25px;"/>`,
   warning: `<img src="{css,js,assets/{images,icons},components}/exclamation.png" alt="Logo AT" class="logo-image" style="width: 25px;"/>`
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

/**
 * popup.js — Componente de Pop-up Reutilizável
 *
 * Como usar em qualquer página:
 *   showPopup('success', 'Título', 'Mensagem aqui');
 *   showPopup('error', 'Erro', 'Algo correu mal.');
 *   showPopup('warning', 'Atenção', 'Verifique os dados.');
 *
 * Tipos disponíveis: 'success', 'error', 'warning'
 */

// Ícones SVG para cada tipo de popup
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
 * @param {Function} [callbackAoFechar] - Função chamada ao fechar (opcional)
 * @param {number} [autoFecharMs] - Fecha automaticamente após X milissegundos (opcional)
 */
function showPopup(tipo, titulo, mensagem, callbackAoFechar, autoFecharMs) {
  const overlay  = document.getElementById('popup-overlay');
  const iconeEl  = document.getElementById('popup-icon');
  const tituloEl = document.getElementById('popup-title');
  const msgEl    = document.getElementById('popup-message');

  // Verifica se os elementos existem
  if (!overlay || !iconeEl || !tituloEl || !msgEl) {
    console.warn('popup.js: Elementos do popup não encontrados no DOM.');
    return;
  }

  // Preenche o conteúdo
  iconeEl.innerHTML = POPUP_ICONS[tipo] || POPUP_ICONS.warning;
  iconeEl.className = 'popup-icon popup-icon--' + tipo;
  tituloEl.textContent = titulo;
  msgEl.textContent = mensagem;

  // Guarda o callback para usar ao fechar
  overlay._callbackAoFechar = callbackAoFechar || null;

  // Acessibilidade: define como visível para leitores de ecrã
  overlay.setAttribute('aria-hidden', 'false');

  // Activa o popup (a classe dispara a animação CSS)
  overlay.classList.add('popup-active');

  // Fecha automaticamente se um tempo foi definido
  if (autoFecharMs && typeof autoFecharMs === 'number') {
    setTimeout(function () {
      closePopup();
    }, autoFecharMs);
  }
}

/**
 * Fecha o popup e executa o callback (se existir)
 */
function closePopup() {
  const overlay = document.getElementById('popup-overlay');
  if (!overlay) return;

  // Remove a classe que activa o popup
  overlay.classList.remove('popup-active');
  overlay.setAttribute('aria-hidden', 'true');

  // Executa callback após a animação de saída terminar
  setTimeout(function () {
    if (overlay._callbackAoFechar && typeof overlay._callbackAoFechar === 'function') {
      overlay._callbackAoFechar();
      overlay._callbackAoFechar = null;
    }
  }, 280); // tempo ligeiramente maior que a transição CSS (0.25s)
}

// Fecha o popup ao clicar fora da caixa (no overlay)
document.addEventListener('DOMContentLoaded', function () {
  const overlay = document.getElementById('popup-overlay');
  if (overlay) {
    overlay.addEventListener('click', function (e) {
      // Só fecha se clicar directamente no overlay, não na caixa
      if (e.target === overlay) {
        closePopup();
      }
    });
  }
});

// Fecha o popup com a tecla Escape
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    closePopup();
  }
});

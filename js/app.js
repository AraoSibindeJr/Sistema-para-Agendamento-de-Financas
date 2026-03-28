/**
 * app.js — JavaScript da Splash Screen (index.html)
 * Funcionalidades: animações de entrada, redirecionamento
 */

// Aguarda o DOM carregar completamente
document.addEventListener('DOMContentLoaded', function () {

  // === Animação de entrada dos cards da secção info ===
  // Usamos IntersectionObserver para animar quando os elementos ficam visíveis
  const fadeElements = document.querySelectorAll('.info-card');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // Adiciona a animação quando o elemento entra no ecrã
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target); // Para de observar após animar
        }
      });
    }, { threshold: 0.1 });

    fadeElements.forEach(function (el) {
      // Estado inicial (antes de animar)
      el.style.opacity = '0';
      el.style.transform = 'translateY(16px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      observer.observe(el);
    });
  }

});

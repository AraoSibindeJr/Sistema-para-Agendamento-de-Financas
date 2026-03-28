// Aguarda o DOM carregar completamente
document.addEventListener('DOMContentLoaded', function () {

  // Animacao de entrada dos cards da seccao info
  // Usamos IntersectionObserver para animar quando os elementos ficam visiveis
  const fadeElements = document.querySelectorAll('.info-card');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // Adiciona a animacao quando o elemento entra no ecrã
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target); // Para de observar apos animar
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

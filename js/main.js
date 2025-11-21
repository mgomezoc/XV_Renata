// main.js

document.addEventListener('DOMContentLoaded', function () {
  // ===== AOS (animaciones on scroll) =====
  if (window.AOS) {
    AOS.init({
      duration: 700,
      easing: 'ease-out-cubic',
      once: true,
    });
  }

  // ===== Navegación con scroll suave =====
  const navLinks = document.querySelectorAll('a[data-scroll]');
  const navbarCollapse = document.getElementById('mainNavbar');

  navLinks.forEach(link => {
    link.addEventListener('click', evt => {
      const targetId = link.getAttribute('href');
      if (!targetId || !targetId.startsWith('#')) return;

      evt.preventDefault();
      const target = document.querySelector(targetId);
      if (target) {
        const headerOffset = document.querySelector('.navbar').offsetHeight || 0;
        const elementPosition = target.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - headerOffset + 2;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }

      // Cerrar el menú en mobile
      if (navbarCollapse && navbarCollapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
        if (bsCollapse) {
          bsCollapse.hide();
        }
      }
    });
  });

  // ===== Countdown =====
  const countdownSection = document.getElementById('countdown');
  if (countdownSection) {
    const eventDateStr = countdownSection.getAttribute('data-event-date');
    if (eventDateStr) {
      const eventDate = new Date(eventDateStr);
      const daysEl = document.getElementById('cd-days');
      const hoursEl = document.getElementById('cd-hours');
      const minutesEl = document.getElementById('cd-minutes');
      const secondsEl = document.getElementById('cd-seconds');

      const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = eventDate.getTime() - now;

        if (distance <= 0) {
          daysEl.textContent = '00';
          hoursEl.textContent = '00';
          minutesEl.textContent = '00';
          secondsEl.textContent = '00';
          return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((distance / (1000 * 60)) % 60);
        const seconds = Math.floor((distance / 1000) % 60);

        daysEl.textContent = String(days).padStart(2, '0');
        hoursEl.textContent = String(hours).padStart(2, '0');
        minutesEl.textContent = String(minutes).padStart(2, '0');
        secondsEl.textContent = String(seconds).padStart(2, '0');
      };

      updateCountdown();
      setInterval(updateCountdown, 1000);
    }
  }

  // ===== GLightbox (galería) =====
  if (window.GLightbox) {
    GLightbox({
      selector: '.glightbox',
      touchNavigation: true,
      loop: true,
    });
  }

  // ===== Audio toggle =====
  const audio = document.getElementById('bg-audio');
  const audioToggle = document.querySelector('[data-audio-toggle]');

  if (audio && audioToggle) {
    audioToggle.addEventListener('click', () => {
      if (audio.paused) {
        audio
          .play()
          .then(() => {
            audioToggle.classList.add('is-playing');
            audioToggle.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
          })
          .catch(() => {
            // Autoplay bloqueado
            alert('Por favor, toca de nuevo para permitir la reproducción de audio.');
          });
      } else {
        audio.pause();
        audioToggle.classList.remove('is-playing');
        audioToggle.innerHTML = '<i class="fa-solid fa-volume-off"></i>';
      }
    });
  }

  // ===== Control de personas en RSVP =====
  const personasField = document.querySelector('[data-personas]');
  if (personasField) {
    const valueSpan = personasField.querySelector('[data-personas-value]');
    const inputHidden = personasField.querySelector('input[type="hidden"][name="personas"]');
    const btnMinus = personasField.querySelector('[data-personas-minus]');
    const btnPlus = personasField.querySelector('[data-personas-plus]');

    const clamp = val => {
      if (val < 1) return 1;
      if (val > 10) return 10; // límite razonable, puedes ajustarlo
      return val;
    };

    const updateValue = newVal => {
      const safe = clamp(newVal);
      valueSpan.textContent = safe;
      if (inputHidden) {
        inputHidden.value = safe;
      }
    };

    let current = parseInt(valueSpan.textContent.trim(), 10) || 1;
    updateValue(current);

    btnMinus.addEventListener('click', () => {
      current = clamp(current - 1);
      updateValue(current);
    });

    btnPlus.addEventListener('click', () => {
      current = clamp(current + 1);
      updateValue(current);
    });
  }

  // ===== RSVP submit (simulado, tú conectarás al backend) =====
  const rsvpForm = document.getElementById('rsvp-form');
  const rsvpFeedback = document.getElementById('rsvp-feedback');

  if (rsvpForm && rsvpFeedback) {
    rsvpForm.addEventListener('submit', evt => {
      evt.preventDefault();

      // Aquí después haces tu fetch/AJAX a un script PHP o API
      // Por ahora solo mostramos mensaje de ejemplo.
      rsvpFeedback.textContent =
        '¡Gracias por confirmar tu asistencia! Hemos recibido tu respuesta.';
      rsvpFeedback.style.color = '#ffffff';

      rsvpForm.reset();
    });
  }

  // ===== Song form (simulado) =====
  const songForm = document.getElementById('song-form');
  const songFeedback = document.getElementById('song-feedback');

  if (songForm && songFeedback) {
    songForm.addEventListener('submit', evt => {
      evt.preventDefault();

      // Aquí también luego conectas al backend
      songFeedback.textContent = '¡Gracias! Tomaremos en cuenta tu canción.';
      songFeedback.style.color = '#222';

      songForm.reset();
    });
  }

  // ===== Año del footer =====
  const footerYearEl = document.getElementById('footer-year');
  if (footerYearEl) {
    footerYearEl.textContent = new Date().getFullYear();
  }
});

// main.js - XV Renata Alice in Wonderland

document.addEventListener('DOMContentLoaded', function () {
  // ===== AOS (animaciones on scroll) =====
  if (window.AOS) {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 100,
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

  // ===== Navbar transparente/sólido al hacer scroll =====
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 100) {
        navbar.style.background =
          'linear-gradient(90deg, rgba(26, 15, 46, 0.98), rgba(91, 154, 169, 0.95), rgba(139, 90, 157, 0.96)) !important';
        navbar.style.boxShadow = '0 8px 40px rgba(0, 0, 0, 0.5)';
      } else {
        navbar.style.background =
          'linear-gradient(90deg, rgba(26, 15, 46, 0.95), rgba(91, 154, 169, 0.85), rgba(139, 90, 157, 0.9)) !important';
        navbar.style.boxShadow = '0 5px 30px rgba(0, 0, 0, 0.4)';
      }
    });
  }

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
      autoplayVideos: false,
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
            alert(
              '🎵 Por favor, toca de nuevo para permitir la reproducción de audio. ¡La música hace la magia!',
            );
          });
      } else {
        audio.pause();
        audioToggle.classList.remove('is-playing');
        audioToggle.innerHTML = '<i class="fa-solid fa-volume-off"></i>';
      }
    });

    // Intentar reproducir automáticamente después de interacción
    document.addEventListener(
      'click',
      () => {
        if (audio.paused && !audioToggle.classList.contains('user-paused')) {
          audio.play().catch(() => {
            // Silenciosamente falla si no está permitido
          });
        }
      },
      { once: true },
    );
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
      if (val > 10) return 10;
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

  // ===== RSVP submit =====
  const rsvpForm = document.getElementById('rsvp-form');
  const rsvpFeedback = document.getElementById('rsvp-feedback');

  if (rsvpForm && rsvpFeedback) {
    rsvpForm.addEventListener('submit', evt => {
      evt.preventDefault();

      // Validación básica
      const nombre = rsvpForm.querySelector('#rsvp-nombre').value.trim();
      const telefono = rsvpForm.querySelector('#rsvp-telefono').value.trim();

      if (!nombre || !telefono) {
        rsvpFeedback.textContent = '⚠️ Por favor completa los campos obligatorios.';
        rsvpFeedback.style.color = '#ff7b6d';
        return;
      }

      // Aquí conectarás tu backend (PHP, API, etc.)
      // Por ahora simulamos el envío
      rsvpFeedback.textContent =
        '✨ ¡Gracias por confirmar! Nos vemos en Wonderland. Tu confirmación ha sido recibida.';
      rsvpFeedback.style.color = '#f4c542';

      // Resetear formulario después de 2 segundos
      setTimeout(() => {
        rsvpForm.reset();
        // Resetear el contador de personas
        if (personasField) {
          const valueSpan = personasField.querySelector('[data-personas-value]');
          const inputHidden = personasField.querySelector('input[type="hidden"][name="personas"]');
          valueSpan.textContent = '1';
          if (inputHidden) inputHidden.value = '1';
        }
      }, 2000);
    });
  }

  // ===== Song form =====
  const songForm = document.getElementById('song-form');
  const songFeedback = document.getElementById('song-feedback');

  if (songForm && songFeedback) {
    songForm.addEventListener('submit', evt => {
      evt.preventDefault();

      const cancion = songForm.querySelector('#song-nombre').value.trim();
      const dedicatoria = songForm.querySelector('#song-dedica').value.trim();

      if (!cancion || !dedicatoria) {
        songFeedback.textContent = '⚠️ Por favor completa todos los campos.';
        songFeedback.style.color = '#ff7b6d';
        return;
      }

      // Aquí también conectarás el backend
      songFeedback.textContent = '🎵 ¡Gracias por tu sugerencia! La añadiremos a la playlist.';
      songFeedback.style.color = '#f4c542';

      setTimeout(() => {
        songForm.reset();
      }, 2000);
    });
  }

  // ===== Año del footer =====
  const footerYearEl = document.getElementById('footer-year');
  if (footerYearEl) {
    footerYearEl.textContent = new Date().getFullYear();
  }

  // ===== Scroll to Top Button =====
  const scrollToTopBtn = document.getElementById('scrollToTop');
  if (scrollToTopBtn) {
    // Mostrar/ocultar botón según scroll
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        scrollToTopBtn.classList.add('visible');
      } else {
        scrollToTopBtn.classList.remove('visible');
      }
    });

    // Scroll suave al hacer click
    scrollToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    });
  }

  // ===== Efecto de partículas mágicas al hacer hover en timeline cards =====
  const timelineCards = document.querySelectorAll('.timeline-card');
  timelineCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      createMagicParticles(card);
    });
  });

  function createMagicParticles(element) {
    const particle = document.createElement('div');
    particle.style.position = 'absolute';
    particle.style.width = '4px';
    particle.style.height = '4px';
    particle.style.borderRadius = '50%';
    particle.style.background = '#f4c542';
    particle.style.boxShadow = '0 0 10px #f4c542';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '1000';

    const rect = element.getBoundingClientRect();
    particle.style.left = rect.left + Math.random() * rect.width + 'px';
    particle.style.top = rect.top + Math.random() * rect.height + 'px';

    document.body.appendChild(particle);

    // Animar y eliminar
    particle.animate(
      [
        { transform: 'translateY(0) scale(1)', opacity: 1 },
        { transform: 'translateY(-50px) scale(0)', opacity: 0 },
      ],
      {
        duration: 1000,
        easing: 'ease-out',
      },
    ).onfinish = () => particle.remove();
  }

  // ===== Cursor mágico (opcional - efecto sutil) =====
  const cursor = document.createElement('div');
  cursor.classList.add('magic-cursor');
  cursor.style.cssText = `
    position: fixed;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(244,197,66,0.3), transparent);
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
    transition: transform 0.1s ease;
    display: none;
  `;
  document.body.appendChild(cursor);

  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    cursor.style.display = 'block';
  });

  document.addEventListener('mouseleave', () => {
    cursor.style.display = 'none';
  });

  // ===== Efecto parallax suave en el hero =====
  const hero = document.querySelector('.hero');
  if (hero) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
      }
    });
  }

  // ===== Smooth reveal de secciones =====
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px',
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.section').forEach(section => {
    observer.observe(section);
  });

  console.log('🎩✨ Welcome to Wonderland! ✨🎩');
});

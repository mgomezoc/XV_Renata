console.log('✨ Iniciando XV Renata - Wonderland WebAR');

// REGISTRAR COMPONENTE KEEP-VISIBLE
AFRAME.registerComponent('keep-visible', {
  init: function () {
    this.wasDetected = false;
    this.el.object3D.visible = false;

    this.el.addEventListener('targetFound', () => {
      console.log('✅ Primera detección - Activando PERMANENTEMENTE');
      this.wasDetected = true;
      this.el.object3D.visible = true;
    });

    this.el.addEventListener('targetLost', () => {
      if (this.wasDetected) {
        this.el.object3D.visible = true;
        console.log('ℹ️ Rostro perdido - manteniendo visible');
      }
    });
  },

  tick: function () {
    if (this.wasDetected) {
      this.el.object3D.visible = true;
    }
  },
});

const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
  navigator.userAgent,
);
console.log('📱 Dispositivo móvil:', isMobile);

// Crear partículas mágicas flotantes
function createMagicParticles() {
  setInterval(() => {
    const particle = document.createElement('div');
    particle.className = 'magic-particle';

    // Posición aleatoria horizontal
    particle.style.left = Math.random() * 100 + '%';
    particle.style.bottom = '-10px';

    // Duración aleatoria
    const duration = Math.random() * 4 + 6 + 's';
    particle.style.animationDuration = duration;

    // Deriva horizontal aleatoria
    const drift = (Math.random() - 0.5) * 100 + 'px';
    particle.style.setProperty('--drift', drift);

    // Tamaño aleatorio
    const size = Math.random() * 3 + 2 + 'px';
    particle.style.width = size;
    particle.style.height = size;

    // Color aleatorio entre dorado, rosa y morado
    const colors = [
      'radial-gradient(circle, rgba(244, 197, 66, 0.9), rgba(255, 217, 125, 0.5))',
      'radial-gradient(circle, rgba(236, 91, 126, 0.9), rgba(255, 182, 193, 0.5))',
      'radial-gradient(circle, rgba(139, 90, 157, 0.9), rgba(181, 147, 197, 0.5))',
      'radial-gradient(circle, rgba(76, 163, 163, 0.9), rgba(152, 219, 219, 0.5))',
    ];
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];

    document.body.appendChild(particle);

    // Eliminar después de la animación
    setTimeout(() => particle.remove(), parseFloat(duration) * 1000);
  }, 300);
}

// Forzar fullscreen y ajustar a la pantalla
function forceFullscreen() {
  if (isMobile) {
    document.body.style.height = window.innerHeight + 'px';

    window.addEventListener('resize', () => {
      document.body.style.height = window.innerHeight + 'px';
    });

    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        document.body.style.height = window.innerHeight + 'px';
      }, 100);
    });
  }
}

// FUNCIÓN DE CAPTURA CON html2canvas
async function capturePhoto() {
  const flash = document.getElementById('flash');
  const notification = document.getElementById('download-notification');
  const captureBtn = document.getElementById('capture-btn');

  console.log('📸 Iniciando captura con html2canvas...');

  // Efecto flash
  flash.classList.add('active');
  setTimeout(() => {
    flash.classList.remove('active');
  }, 150);

  // Ocultar el botón de captura temporalmente
  captureBtn.style.display = 'none';

  try {
    // Capturar TODO el body (incluye video, canvas, overlays, partículas, etc.)
    const canvas = await html2canvas(document.body, {
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      scale: 2, // Mayor calidad
      logging: false,
      width: window.innerWidth,
      height: window.innerHeight,
      x: 0,
      y: 0,
      scrollX: 0,
      scrollY: 0,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
    });

    console.log('✅ Canvas capturado:', canvas.width, 'x', canvas.height);

    // Convertir a blob y descargar
    canvas.toBlob(
      blob => {
        if (!blob) {
          console.error('❌ Error al crear blob');
          alert('Error al generar imagen');
          captureBtn.style.display = 'flex';
          return;
        }

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        link.download = `xv-renata-wonderland-${timestamp}.png`;
        link.href = url;

        // Forzar descarga
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Mostrar notificación
        notification.classList.add('show');
        setTimeout(() => {
          notification.classList.remove('show');
        }, 2500);

        // Limpiar
        setTimeout(() => URL.revokeObjectURL(url), 100);

        console.log('✅ Foto capturada y descargada');
      },
      'image/png',
      1.0,
    );
  } catch (error) {
    console.error('❌ Error en captura:', error);
    alert('Error al capturar: ' + error.message);
  } finally {
    // Mostrar el botón nuevamente
    captureBtn.style.display = 'flex';
  }
}

// Animación de elementos 3D (rotación suave)
function animateARElements() {
  const sceneEl = document.querySelector('a-scene');
  if (!sceneEl) return;

  // Animar corona
  const crown = document.querySelector('a-entity[position="0 0.35 -0.15"]');
  if (crown) {
    let rotation = 0;
    setInterval(() => {
      rotation += 0.3;
      if (rotation >= 360) rotation = 0;
      crown.setAttribute('rotation', `0 ${rotation} 0`);
    }, 50);
  }

  // Animar cartas (flotación)
  const cards = document.querySelectorAll(
    'a-entity[position*="-0.45"], a-entity[position*="0.45"]',
  );
  cards.forEach((card, index) => {
    let offset = index * Math.PI;
    setInterval(() => {
      offset += 0.02;
      const y = Math.sin(offset) * 0.03;
      const currentPos = card.getAttribute('position');
      const parts = currentPos.split(' ');
      card.setAttribute('position', `${parts[0]} ${parseFloat(parts[1]) + y} ${parts[2]}`);
    }, 30);
  });

  // Animar estrellas (pulso)
  const stars = document.querySelectorAll('a-octahedron');
  stars.forEach((star, index) => {
    let scale = 1;
    let growing = true;
    setInterval(() => {
      if (growing) {
        scale += 0.01;
        if (scale >= 1.2) growing = false;
      } else {
        scale -= 0.01;
        if (scale <= 0.8) growing = true;
      }
      star.setAttribute('scale', `${scale} ${scale} ${scale}`);
    }, 50 + index * 10);
  });
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  const sceneEl = document.querySelector('a-scene');
  const captureBtn = document.getElementById('capture-btn');

  forceFullscreen();

  sceneEl.addEventListener('renderstart', () => {
    console.log('✅ Renderizado iniciado');
    createMagicParticles();
  });

  sceneEl.addEventListener('arReady', () => {
    console.log('✅ AR Ready');
    animateARElements();
  });

  sceneEl.addEventListener('arError', event => {
    console.error('❌ Error de AR:', event.detail);
  });

  // Evento del botón de captura
  if (captureBtn) {
    captureBtn.addEventListener('click', capturePhoto);
    console.log('📸 Botón de captura configurado (html2canvas)');
  }

  // Verificar que html2canvas esté disponible
  if (typeof html2canvas === 'undefined') {
    console.error('❌ html2canvas no está cargado');
  } else {
    console.log('✅ html2canvas disponible');
  }

  // Efecto de entrada suave para los overlays
  setTimeout(() => {
    const overlays = document.querySelectorAll(
      '.title-overlay, .theme-badge, .invitation-sign, .event-info, .dress-code, .corner-decoration',
    );
    overlays.forEach((overlay, index) => {
      setTimeout(() => {
        overlay.style.opacity = '1';
      }, index * 100);
    });
  }, 500);

  console.log('👑 Sistema de captura listo - Wonderland AR');
});

// Añadir listener para visibilidad de la página
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    console.log('📱 Página oculta');
  } else {
    console.log('📱 Página visible');
  }
});

// Detectar cuando se pierde/recupera el tracking
window.addEventListener('targetFound', () => {
  console.log('🎯 Rostro detectado');
});

window.addEventListener('targetLost', () => {
  console.log('🎯 Rostro perdido');
});

// Añadir soporte para debug (activar con hash #debug)
if (window.location.hash === '#debug') {
  const debugInfo = document.getElementById('debug-info');
  if (debugInfo) {
    debugInfo.style.display = 'block';

    setInterval(() => {
      const status = document.getElementById('status');
      const tracking = document.getElementById('tracking-status');

      if (status) {
        status.textContent = 'AR Activo';
      }

      if (tracking) {
        const scene = document.querySelector('a-scene');
        if (scene && scene.systems['mindar-face-system']) {
          tracking.textContent = 'Tracking: ON';
        } else {
          tracking.textContent = 'Tracking: --';
        }
      }
    }, 1000);
  }
}

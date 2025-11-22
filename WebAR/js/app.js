console.log('🎄 Iniciando Posada Panzones 2025 WebAR');

// REGISTRAR COMPONENTE KEEP-VISIBLE
AFRAME.registerComponent('keep-visible', {
  init: function() {
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
  
  tick: function() {
    if (this.wasDetected) {
      this.el.object3D.visible = true;
    }
  }
});

const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
console.log('📱 Dispositivo móvil:', isMobile);

// Crear nieve
function createSnowflakes() {
  setInterval(() => {
    const snowflake = document.createElement('div');
    snowflake.className = 'snowflake';
    snowflake.textContent = '❄';
    snowflake.style.left = Math.random() * 100 + '%';
    snowflake.style.animationDuration = (Math.random() * 3 + 4) + 's';
    snowflake.style.opacity = Math.random() * 0.6 + 0.4;
    snowflake.style.fontSize = (Math.random() * 10 + 10) + 'px';
    document.body.appendChild(snowflake);
    setTimeout(() => snowflake.remove(), 8000);
  }, 400);
}

// Forzar fullscreen
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
    // Capturar TODO el body (incluye video, canvas, overlays, nieve, etc.)
    const canvas = await html2canvas(document.body, {
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#000000',
      scale: 2, // Mayor calidad
      logging: false,
      width: window.innerWidth,
      height: window.innerHeight,
      x: 0,
      y: 0,
      scrollX: 0,
      scrollY: 0,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight
    });
    
    console.log('✅ Canvas capturado:', canvas.width, 'x', canvas.height);
    
    // Convertir a blob y descargar
    canvas.toBlob((blob) => {
      if (!blob) {
        console.error('❌ Error al crear blob');
        alert('Error al generar imagen');
        captureBtn.style.display = 'flex';
        return;
      }
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      link.download = `posada-panzones-2025-${timestamp}.png`;
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
    }, 'image/png', 1.0);
    
  } catch (error) {
    console.error('❌ Error en captura:', error);
    alert('Error al capturar: ' + error.message);
  } finally {
    // Mostrar el botón nuevamente
    captureBtn.style.display = 'flex';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const sceneEl = document.querySelector('a-scene');
  const captureBtn = document.getElementById('capture-btn');
  
  forceFullscreen();
  
  sceneEl.addEventListener('renderstart', () => {
    console.log('✅ Renderizado iniciado');
    createSnowflakes();
  });
  
  sceneEl.addEventListener('arReady', () => {
    console.log('✅ AR Ready');
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
  
  console.log('🎅 Sistema de captura listo');
});
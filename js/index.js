function reproducirSonidoYRedirigir() {
    const sonido = document.getElementById('click-sound');
    sonido.play();
    sonido.onended = () => {
        window.location.href = 'menu-completo.html';
    };
}

function cambiarTema() {
    const body = document.body;
    const icono = document.getElementById('iconoTema');
    const esOscuro = body.classList.toggle('bg-dark');
    body.classList.toggle('text-light');
    const contenedorResenas = document.getElementById('contenedorResenas');
    if (contenedorResenas) {
    contenedorResenas.classList.toggle('bg-gray-100', !esOscuro);
    contenedorResenas.classList.toggle('bg-neutral-900', esOscuro);
    contenedorResenas.classList.toggle('text-gray-900', !esOscuro);
    contenedorResenas.classList.toggle('text-gray-100', esOscuro);
}
    icono.textContent = esOscuro ? '🌙' : '☀️';
    localStorage.setItem('tema', esOscuro ? 'oscuro' : 'claro');

    // Actualizar tarjetas de reseñas
    const tarjetas = document.querySelectorAll('.carta-reseña');
    tarjetas.forEach((tarjeta) => {
        tarjeta.classList.toggle('bg-white', !esOscuro);
        tarjeta.classList.toggle('bg-neutral-800', esOscuro);
         // Cambiar color de texto general
        tarjeta.classList.toggle('text-gray-900', !esOscuro); // para modo claro
        tarjeta.classList.toggle('text-white', esOscuro);  // para modo oscuro
        tarjeta.classList.toggle('border-gray-200', !esOscuro);
        tarjeta.classList.toggle('border-white', esOscuro);
        const textos = tarjeta.querySelectorAll('p, span, a');
        textos.forEach(el => {
            el.style.color = esOscuro ? '#e5e7eb' : ''; // text-gray-100 en Tailwind
        });
    });

    if (typeof actualizarCarrito === "function") {
        actualizarCarrito();
    }
}

function setupFooterAccordion() {
    const sections = document.querySelectorAll(".footer-seccion");
    if (window.innerWidth <= 768) {
        sections.forEach(section => {
            const header = section.querySelector("h3");
            header.style.cursor = "pointer";
            header.addEventListener("click", () => {
                section.classList.toggle("accordion-active");
            });
        });
    } else {
        sections.forEach(section => {
            section.classList.add("accordion-active");
        });
    }
}

function renderAuthButtons() {
    const authButtons = document.getElementById('auth-buttons');
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    
    authButtons.innerHTML = '';

    if (token && user && user.email === 'test@test.com') {
        // Modo administrador
        authButtons.innerHTML = `
            <div class="registro">
                <a href="admin.html" class="admin-btn">
                    <i class="bi bi-basket-fill"></i> Registrar Productos
                </a>
            </div>
            <div class="registro">
                <a href="#" onclick="logout()" class="admin-btn">
                    <i class="bi bi-box-arrow-right"></i> Salir Modo Admin
                </a>
            </div>
        `;
    } else if (token && user) {
        // Usuario común logeado
        authButtons.innerHTML = `
            <div class="registro">
                <a href="#" onclick="logout()">Cerrar sesión</a>
            </div>
            <div class="carrito">
                <a href="carrito.html"><img src="Icon/carrito-de-compras.png" alt=""></a>
            </div>
        `;
    } else {
        // No autenticado
        authButtons.innerHTML = `
            <div class="registro">
                <a href="login.html">Inicia sesión <img src="Icon/iniciar_sesion.png" alt=""></a>
            </div>
            <div class="carrito">
                <a href="carrito.html"><img src="Icon/carrito-de-compras.png" alt=""></a>
            </div>
        `;
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    renderAuthButtons();
    window.location.href = 'index.html';
}

document.addEventListener("DOMContentLoaded", () => {
    const icono = document.getElementById('iconoTema');
    if (localStorage.getItem('tema') === 'oscuro') {
        document.body.classList.add('bg-dark', 'text-light');
        if (icono) icono.textContent = '🌙';
    }
    setupFooterAccordion();
    renderAuthButtons();
});

window.addEventListener("resize", () => {
    document.querySelectorAll(".footer-seccion").forEach(section => {
        section.classList.remove("accordion-active");
    });
    setupFooterAccordion();
});

const container = document.querySelector('.video-btn-container');
const video = container.querySelector('video');
container.addEventListener('mouseenter', () => {
    video.play();
});
container.addEventListener('mouseleave', () => {
    video.pause();
    video.currentTime = 0;
});
const carrusel = document.getElementById('carruselResenas');
let tarjetas = [];
let posicion = 0;

function mostrar(pos) {
  if (tarjetas.length === 0) return;
  const desplazamiento = tarjetas[pos].offsetLeft || 0;
  carrusel.scrollTo({ left: desplazamiento, behavior: 'smooth' });
}

function siguiente() {
  if (tarjetas.length === 0) return;
  posicion = (posicion + 1) % tarjetas.length;
  mostrar(posicion);
  reiniciar();
}

function anterior() {
  if (tarjetas.length === 0) return;
  posicion = (posicion - 1 + tarjetas.length) % tarjetas.length;
  mostrar(posicion);
  reiniciar();
}

let autoSlide = setInterval(siguiente, 5000);

function reiniciar() {
  clearInterval(autoSlide);
  autoSlide = setInterval(siguiente, 5000);
}

function abrirFormularioComentario() {
  document.getElementById('modalComentario').classList.remove('hidden');
}

function cerrarFormularioComentario() {
  document.getElementById('modalComentario').classList.add('hidden');
}

function agregarResenaAlCarrusel(nombre, medio, comentario, puntuacion, fecha) {
  const fechaFormateada = new Date(fecha).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const nuevaTarjeta = document.createElement('div');
  nuevaTarjeta.className = "carta-reseña bg-white rounded-lg shadow-md p-4 border border-gray-200 text-black";
  nuevaTarjeta.innerHTML = `
    <div class="flex justify-between items-center mb-2">
      <div>
        <p class="font-semibold text-sm">${nombre}</p>
        <p class="text-xs text-gray-500">${medio}</p>
      </div>
      <span class="text-red-600 text-xs font-bold flex items-center gap-1">⭐ USER</span>
    </div>
    <p class="text-sm text-gray-700 mb-4">${comentario}</p>
    <div class="flex items-center justify-between text-xs text-gray-500 border-t pt-2">
      <div class="flex items-center gap-1">
        <span>Rated: ${puntuacion} • ${fechaFormateada}</span>
      </div>
      <a href="#" class="text-blue-600 hover:underline">Ver más</a>
    </div>
  `;

  carrusel.appendChild(nuevaTarjeta);
  tarjetas = document.querySelectorAll('.carta-reseña');
}

async function cargarReviews() {
  try {
    const res = await fetch('data/comentarios.json');
    const data = await res.json();

    // Mostrar desde el JSON original
    data.forEach(cliente => {
      cliente.comentarios.forEach(review => {
        agregarResenaAlCarrusel(
          cliente.nombre_cliente,
          review.medio,
          review.texto,
          review.puntuacion,
          review.fecha
        );
      });
    });

    // Mostrar desde localStorage
    const comentariosExtra = JSON.parse(localStorage.getItem('comentariosExtra')) || [];
    comentariosExtra.forEach(review => {
      agregarResenaAlCarrusel(
        review.nombre,
        review.medio,
        review.comentario,
        review.puntuacion,
        review.fecha
      );
    });

    tarjetas = document.querySelectorAll('.carta-reseña');
    posicion = 0;
    mostrar(posicion);
  } catch (error) {
    console.error('Error al cargar comentarios:', error);
  }
}

function agregarComentario() {
  const nombre = document.getElementById('nombreCritico').value.trim();
  const medio = document.getElementById('medioCritico').value.trim();
  const comentario = document.getElementById('textoComentario').value.trim();
  const puntuacion = document.getElementById('puntuacion').value.trim();

  if (!nombre || !medio || !comentario || !puntuacion) {
    alert("Por favor, completa todos los campos.");
    return;
  }

  const fecha = new Date().toISOString();

  // Mostrar en la vista
  agregarResenaAlCarrusel(nombre, medio, comentario, puntuacion, fecha);

  // Guardar en localStorage
  const nuevo = { nombre, medio, comentario, puntuacion, fecha };
  const comentariosExtra = JSON.parse(localStorage.getItem('comentariosExtra')) || [];
  comentariosExtra.push(nuevo);
  localStorage.setItem('comentariosExtra', JSON.stringify(comentariosExtra));

  cerrarFormularioComentario();

  // Limpiar campos
  document.getElementById('nombreCritico').value = '';
  document.getElementById('medioCritico').value = '';
  document.getElementById('textoComentario').value = '';
  document.getElementById('puntuacion').value = '';
}

// Iniciar
cargarReviews();

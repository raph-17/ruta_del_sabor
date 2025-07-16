document.addEventListener("DOMContentLoaded", () => {
  // Selecciona los elementos clave del DOM para interactuar con ellos.
  const carritoGrid = document.getElementById("carrito-grid");
  const subtotalElement = document.getElementById("subtotal");
  const btnConfirmar = document.getElementById("btn-confirmar");

  // Almacena los ítems del carrito. Se inicializa vacío y se carga desde localStorage.
  let carrito = [];

  /**
   * Muestra los productos en el carrito, los carga desde localStorage y calcula el subtotal.
   */
  function mostrarCarrito() {
    // Carga el carrito desde localStorage o lo inicializa como un array vacío.
    carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carritoGrid.innerHTML = ""; // Limpia el contenedor del carrito.

    if (carrito.length === 0) {
      // Si el carrito está vacío, muestra un mensaje y deshabilita el botón de confirmar.
      carritoGrid.innerHTML = "<p>No hay items en tu pedido.</p>";
      btnConfirmar.disabled = true;
    } else {
      // Itera sobre cada ítem del carrito y lo muestra en la interfaz.
      carrito.forEach((item) => {
        const itemElement = document.createElement("div");
        itemElement.className = "col-md-4 mb-4"; // Clases para el diseño.
        itemElement.innerHTML = `
          <div class="card h-100 shadow-sm">
            <img src="${item.imagen}" alt="${item.nombre}" class="card-img-top carrito-img" onerror="this.onerror=null;this.src='https://placehold.co/600x400/CCCCCC/FFFFFF?text=${item.nombre}';">
            <div class="card-body text-center">
              <h5 class="card-title">${item.nombre}</h5>
              <p class="card-text">Precio: S/ ${item.precio.toFixed(2)}</p>
              <p class="card-text">Cantidad: ${item.cantidad}</p>
            </div>
          </div>
        `;
        carritoGrid.appendChild(itemElement);
      });
      btnConfirmar.disabled = false; // Habilita el botón si hay ítems.
    }

    // Calcula el subtotal sumando el precio * cantidad de cada ítem.
    const subtotal = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
    subtotalElement.textContent = subtotal.toFixed(2); // Muestra el subtotal formateado.
  }

  // --- Evento del botón Confirmar Pedido ---
  btnConfirmar.addEventListener("click", () => {
    if (carrito.length === 0) {
      alert("Tu carrito está vacío.");
      return;
    }
    // Redirige a la página de detalles de pago si el carrito no está vacío.
    window.location.href = "pago_detalles.html";
  });

  // --- Funcionalidad de Tema (Claro/Oscuro) ---
  const icono = document.getElementById('iconoTema');
  // Aplica el tema guardado en localStorage al cargar la página.
  if (localStorage.getItem('tema') === 'oscuro') {
    document.body.classList.add('bg-dark', 'text-light');
    if (icono) icono.textContent = '🌙';
  }

  /**
   * Función global para alternar entre el tema claro y oscuro.
   * Guarda la preferencia en localStorage.
   */
  window.cambiarTema = function() {
    const body = document.body;
    const icono = document.getElementById('iconoTema');
    body.classList.toggle('bg-dark');
    body.classList.toggle('text-light');
    const esOscuro = body.classList.contains('bg-dark');
    if (icono) icono.textContent = esOscuro ? '🌙' : '☀️';
    localStorage.setItem('tema', esOscuro ? 'oscuro' : 'claro');
  };

  // Llama a mostrarCarrito para cargar el carrito al iniciar la página.
  mostrarCarrito();
});
document.addEventListener("DOMContentLoaded", () => {
  // Selecciona los elementos del DOM que se van a actualizar con la información del pedido.
  const pedidoGrid = document.getElementById("pedido-grid");
  const mensajeEntrega = document.getElementById("mensaje-entrega");
  const clienteNombre = document.getElementById("cliente-nombre");
  const comprobanteElement = document.getElementById("comprobante");
  const subtotalElement = document.getElementById("subtotal");
  const deliveryCostElement = document.getElementById("delivery-cost");
  const totalElement = document.getElementById("total");
  const confirmacionHeader = document.getElementById("confirmacion-header");

  // Recupera el último pedido guardado en el localStorage. Si no existe, inicializa un objeto vacío.
  const ultimoPedido = JSON.parse(localStorage.getItem("ultimo_pedido")) || {};

  /**
   * Muestra el resumen del pedido en la página de confirmación.
   */
  function mostrarResumen() {
    // Si no hay ítems en el pedido, muestra un mensaje y termina la función.
    if (!ultimoPedido.items || ultimoPedido.items.length === 0) {
      pedidoGrid.innerHTML = "<p>No hay items en el pedido.</p>";
      return;
    }

    // Actualiza el encabezado con el nombre del cliente.
    confirmacionHeader.textContent = `PEDIDO CONFIRMADO, ${ultimoPedido.cliente.nombres} ${ultimoPedido.cliente.apellidos}`;

    // Limpia el contenedor y añade cada ítem del pedido dinámicamente.
    pedidoGrid.innerHTML = "";
    ultimoPedido.items.forEach((item) => {
      const itemElement = document.createElement("div");
      itemElement.className = "col-md-4 mb-4";
      itemElement.innerHTML = `
        <div class="card h-100 shadow-sm">
          <div class="card-body text-center">
            <h5 class="card-title">${item.nombre}</h5>
            <p class="card-text">Precio: S/ ${item.precio.toFixed(2)}</p>
            <p class="card-text">Cantidad: ${item.cantidad}</p>
            <p class="card-text">Subtotal: S/ ${item.subtotal.toFixed(2)}</p>
          </div>
        </div>
      `;
      pedidoGrid.appendChild(itemElement);
    });

    // Rellena los detalles del cliente y los costos del pedido.
    clienteNombre.textContent = `${ultimoPedido.cliente.nombres} ${ultimoPedido.cliente.apellidos}`;
    comprobanteElement.textContent =
      ultimoPedido.cliente.comprobante === "boleta"
        ? `Boleta (DNI: ${ultimoPedido.cliente.dni})`
        : `Factura (RUC: ${ultimoPedido.cliente.ruc})`;
    subtotalElement.textContent = ultimoPedido.items
      .reduce((sum, item) => sum + item.subtotal, 0)
      .toFixed(2);
    deliveryCostElement.textContent = ultimoPedido.deliveryCost.toFixed(2);
    totalElement.textContent = ultimoPedido.total.toFixed(2);

    // Muestra el mensaje de entrega según el método seleccionado.
    mensajeEntrega.textContent =
      ultimoPedido.entrega.metodo === "delivery"
        ? "Tu pedido llegará en aproximadamente 15-30 minutos."
        : "Tu pedido estará listo para recojo en aproximadamente 15 minutos.";
  }

  // --- Funcionalidad de Tema (Claro/Oscuro) ---
  const icono = document.getElementById("iconoTema");

  // Aplica el tema guardado en localStorage al cargar la página.
  if (localStorage.getItem("tema") === "oscuro") {
    document.body.classList.add("bg-dark", "text-light");
    if (icono) icono.textContent = "🌙";
  }

  /**
   * Alterna el tema de la aplicación entre claro y oscuro y guarda la preferencia.
   */
  window.cambiarTema = function () {
    const body = document.body;
    const icono = document.getElementById("iconoTema");
    body.classList.toggle("bg-dark");
    body.classList.toggle("text-light");
    const esOscuro = body.classList.contains("bg-dark");
    if (icono) icono.textContent = esOscuro ? "🌙" : "☀️";
    localStorage.setItem("tema", esOscuro ? "oscuro" : "claro");
  };

  // Muestra el resumen del pedido al cargar la página.
  mostrarResumen();
});
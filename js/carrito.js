// Espera a que el DOM esté completamente cargado antes de ejecutar el código principal
document.addEventListener("DOMContentLoaded", () => {
    // Selecciona los elementos del DOM necesarios para interactuar con el carrito
    const carritoGrid = document.getElementById("carrito-grid");
    const subtotalElement = document.getElementById("subtotal");
    const igvElement = document.getElementById("igv");
    const totalElement = document.getElementById("total");
    const btnComprar = document.getElementById("btn-comprar");
    const btnSeguir = document.getElementById("btn-seguir");
    const iconoTema = document.getElementById("iconoTema");

    // Actualiza la visualización del carrito en la página, mostrando productos y subtotal
    function actualizarCarrito() {
        let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        carritoGrid.innerHTML = "";
        console.log("Carrito al actualizar:", carrito); // Depuración

        if (carrito.length === 0) {
            carritoGrid.innerHTML = "<p>El carrito está vacío.</p>";
        } else {
            carrito.forEach((item, index) => {
                const itemElement = document.createElement("div");
                itemElement.classList.add("item");
                itemElement.innerHTML = `
                    <img src="${item.imagen}" alt="${item.nombre}">
                    <div class="item-info">
                        <h3>${item.nombre}</h3>
                        <p class="precio-unitario">S/ ${item.precio.toFixed(2)}</p>
                        <input type="number" value="${item.cantidad}" class="cantidad" min="1" data-index="${index}">
                    </div>
                    <button class="eliminar" data-index="${index}">Eliminar</button>
                `;
                console.log(`Añadiendo item ${index}: ${item.nombre}`); // Depuración
                carritoGrid.appendChild(itemElement);
            });
        }

        const subtotal = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
        subtotalElement.textContent = subtotal.toFixed(2);
    }

    // Evento para actualizar la cantidad de un producto en el carrito
    carritoGrid.addEventListener("change", (e) => {
        if (e.target.classList.contains("cantidad")) {
            const index = parseInt(e.target.dataset.index);
            let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
            const nuevaCantidad = parseInt(e.target.value);
            if (nuevaCantidad >= 1 && !isNaN(index) && index >= 0 && index < carrito.length) {
                carrito[index].cantidad = nuevaCantidad;
                localStorage.setItem("carrito", JSON.stringify(carrito));
                actualizarCarrito();
            } else {
                console.warn("Cantidad o índice inválido:", nuevaCantidad, index);
            }
        }
    });

    // Evento para eliminar un producto del carrito al hacer clic en el botón "Eliminar"
    carritoGrid.removeEventListener("click", handleClickCarrito); // Evita duplicados
    // Maneja el evento de eliminar un producto del carrito
    function handleClickCarrito(e) {
        if (e.target.classList.contains("eliminar")) {
            e.stopPropagation();
            const index = parseInt(e.target.dataset.index);
            console.log("Índice del botón clicado:", index);
            let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
            console.log("Carrito antes de eliminar:", carrito);
            if (!isNaN(index) && index >= 0 && index < carrito.length) {
                const eliminado = carrito.splice(index, 1);
                console.log("Producto eliminado:", eliminado);
                console.log("Carrito después de eliminar:", carrito);
                localStorage.setItem("carrito", JSON.stringify(carrito));
                actualizarCarrito();
            } else {
                console.warn("Índice inválido:", index);
            }
        }
    }
    carritoGrid.addEventListener("click", handleClickCarrito);

    // Evento para el botón "Comprar": redirige a la página de pago si el carrito no está vacío
    btnComprar.addEventListener("click", () => {
        let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        if (carrito.length === 0) {
            alert("No puedes ir a pagar porque el carrito está vacío.");
            return;
        }
        window.location.href = "pago.html";
    });

    // Evento para el botón "Seguir comprando": redirige a la página del menú
    btnSeguir.addEventListener("click", () => {
        window.location.href = "menu-completo.html";
    });

    // Carga el tema guardado al iniciar
    if (localStorage.getItem("tema") === "oscuro") {
        document.body.classList.add("bg-dark", "text-light");
        if (iconoTema) iconoTema.textContent = "🌙"; // Previene el error si el icono no existe
    }

    // Inicializa el carrito al cargar la página
    actualizarCarrito();
    renderAuthButtons(); // <-- Agrega esta línea
});

// Aplica el tema oscuro al cargar la página (duplicado, asegura el tema)
window.addEventListener('DOMContentLoaded', () => {
    const icono = document.getElementById('iconoTema');
    if (localStorage.getItem('tema') === 'oscuro') {
        document.body.classList.add('bg-dark', 'text-light');
        icono.textContent = '🌙';
    }
});

// Renderiza los botones de autenticación según el estado del usuario (admin o normal)
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

// Cierra la sesión del usuario y redirige al inicio
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    renderAuthButtons();
    window.location.href = 'index.html';
}
// Agrega un listener al objeto document que se activa cuando el documento HTML está cargado
document.addEventListener('DOMContentLoaded', async () => {
    // Contenedores principales del DOM
    const categoriasContainer = document.getElementById("categorias-container");
    const productosContainer = document.getElementById("productos-container");
    /*Define la URL base de la API a la que se harán las peticiones de autenticación.*/
    const API_URL = 'https://hamburguer-xmx8.onrender.com/api';

    let categories = [];
    let products = [];

    // Inicializa el menú: carga categorías y productos, y configura el swiper
    async function initMenu() {
        try {
            const catResponse = await fetch(`${API_URL}/categories`);
            const catData = await catResponse.json();
            if (catData.success) {
                categories = catData.data;
                renderCategoriasSwiper(); // Renderiza las categorías en el swiper
                initSwiperCategorias();   // Inicializa el swiper
            } else {
                throw new Error('Error al cargar categorías');
            }

            await renderProductos('todo', document.querySelector("#categorias-container button.active"));

        } catch (error) {
            console.log("Error al cargar el menú:", error.message);
            categoriasContainer.innerHTML = "<p>Error al cargar el menú.</p>";
        }
    }

    // Renderiza los productos según la categoría seleccionada
    async function renderProductos(categoryId, btn) {
        const allBtns = document.querySelectorAll("#categorias-container .swiper-slide button");
        allBtns.forEach(b => b.classList.remove("active"));
        if (btn) btn.classList.add("active");

        productosContainer.innerHTML = "<h4>Cargando...</h4>";

        try {
            let url = `${API_URL}/products`;
            if (categoryId !== 'todo') {
                url = `${API_URL}/products?categoria=${categoryId}`;
            }
            const response = await fetch(url);
            const prodData = await response.json();

            if (prodData.success) {
                products = prodData.data;
                productosContainer.innerHTML = "";
                if (products.length === 0) {
                    productosContainer.innerHTML = "<p>No hay productos en esta categoría.</p>";
                }
                // Crea una tarjeta para cada producto
                products.forEach(producto => {
                    const card = document.createElement("div");
                    card.className = "producto galeria-item";
                    card.innerHTML = `
                        <img src="${producto.imagen}" alt="${producto.nombre}" onerror="this.onerror=null;this.src='https://placehold.co/600x400/CCCCCC/FFFFFF?text=${producto.nombre}';">
                        <h3>${producto.nombre}</h3>
                        <p>${producto.descripcion}</p>
                        <p class="precio">S/ ${producto.precio.toFixed(2)}</p>
                    `;
                    card.addEventListener("click", () => showProductModal(producto));
                    productosContainer.appendChild(card);
                });
            } else {
                productosContainer.innerHTML = "<p>Error al cargar productos.</p>";
            }
        } catch (error) {
            console.log('Error al obtener productos:', error.message);
            productosContainer.innerHTML = "<p>Error de conexión al cargar productos.</p>";
        }
    }
    
    // Muestra el modal con la información del producto seleccionado
    function showProductModal(producto) {
        document.getElementById("modalNombre").textContent = producto.nombre;
        document.getElementById("modalDesc").textContent = producto.descripcion;
        document.getElementById("modalPrecio").textContent = producto.precio.toFixed(2);
        document.getElementById("modalImg").src = producto.imagen;
        
        const modal = document.getElementById("modalProducto");
        modal.classList.add("show");

        document.getElementById("btnAgregar").onclick = () => addToCart(producto);
        document.getElementById("btnSalir").onclick = () => modal.classList.remove("show");
    }

    // Agrega el producto seleccionado al carrito en localStorage
    function addToCart(producto) {
        const user = JSON.parse(localStorage.getItem("user"));
        const token = localStorage.getItem("token");
        const isAdmin = token && user && user.email === 'test@test.com';

        if (isAdmin) {
            alert('Modo administrador: No puedes agregar productos al carrito.');
            return;
        }

        let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        const existente = carrito.find(p => p._id === producto._id);

        if (existente) {
            existente.cantidad += 1;
        } else {
            const nuevoProducto = {
                _id: producto._id, 
                nombre: producto.nombre,
                precio: producto.precio,
                imagen: producto.imagen,
                cantidad: 1
            };
            carrito.push(nuevoProducto);
        }
        localStorage.setItem("carrito", JSON.stringify(carrito));
        alert(`${producto.nombre} ha sido agregado al carrito!`);
        document.getElementById("modalProducto").classList.remove("show");
    }

    // Renderiza las categorías en el swiper
    function renderCategoriasSwiper() {
        const categoriasWrapper = document.querySelector("#categorias-container .swiper-wrapper");
        categoriasWrapper.innerHTML = "";

        // Botón para ver todos los productos
        const slideTodo = document.createElement("div");
        slideTodo.classList.add("swiper-slide");
        const btnTodo = document.createElement('button');
        btnTodo.className = "active";
        btnTodo.innerHTML = "🍽️ Ver Todo";
        btnTodo.onclick = () => renderProductos("todo", btnTodo);
        slideTodo.appendChild(btnTodo);
        categoriasWrapper.appendChild(slideTodo);

        // Botones para cada categoría
        categories.forEach(categoria => {
            const slide = document.createElement("div");
            slide.classList.add("swiper-slide");
            const btnCat = document.createElement('button');
            btnCat.innerHTML = `${categoria.icono} ${categoria.nombre}`;
            btnCat.dataset.categoryId = categoria._id; 
            btnCat.onclick = () => renderProductos(categoria._id, btnCat);
            slide.appendChild(btnCat);
            categoriasWrapper.appendChild(slide);
        });
    }

    // Inicializa el swiper de categorías
    function initSwiperCategorias() {
        return new Swiper("#categorias-container", {
            slidesPerView: "auto", // Permite que los slides tengan ancho variable
            spaceBetween: 20, // Espacio entre slides
            loop: true, // Habilita el bucle continuo para un efecto de 360 grados
            speed: 600, // Aumenta la velocidad de transición para un deslizamiento más suave
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
            centeredSlides: false, // Evita centrar los slides para un flujo más natural
            watchOverflow: false, // Desactiva watchOverflow para permitir navegación incluso con pocos slides
            loopAdditionalSlides: 1, // Añade slides adicionales para un bucle más fluido
        });
    }

    // Renderiza los botones de autenticación según el estado del usuario
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

    // Escucha el evento DOMContentLoaded para aplicar el tema guardado al cargar la página.
    const icono = document.getElementById('iconoTema');
    if (localStorage.getItem('tema') === 'oscuro') {
        document.body.classList.add('bg-dark', 'text-light');
        // Actualiza el icono del tema a la luna.
        if (icono) icono.textContent = '🌙';
    }

    // Inicializar menú y renderizar botones
    await initMenu();
    renderAuthButtons();
});

// --- Funciones de tema ---
/* Cambia entre el tema claro y oscuro de la aplicación.*/
function cambiarTema() {
    const body = document.body;
    const icono = document.getElementById('iconoTema');
    // Alterna las clases CSS para el tema oscuro/claro en el body.
    body.classList.toggle('bg-dark'); //Alterna la clase bg-dark en el <body>
    body.classList.toggle('text-light');
    // Verifica si el tema actual es oscuro.
    const esOscuro = body.classList.contains('bg-dark');
    // Actualiza el icono del tema (sol/luna).
    if (icono) icono.textContent = esOscuro ? '🌙' : '☀️';
    // Guarda la preferencia del tema en localStorage para persistencia.
    localStorage.setItem('tema', esOscuro ? 'oscuro' : 'claro');
}

// Cierra la sesión del usuario y redirige al inicio
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    renderAuthButtons(); // Actualiza los botones de autenticación
    window.location.href = 'index.html';
}
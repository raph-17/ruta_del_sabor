document.addEventListener("DOMContentLoaded", () => {
  const loginPage = document.querySelector(".login-page");
  const API_URL = "https://hamburguer-xmx8.onrender.com/api";

  function mostrarVista(templateId) {
    const template = document.getElementById(templateId);
    if (template) {
      loginPage.innerHTML = "";
      loginPage.appendChild(template.content.cloneNode(true));
      attachFormListeners();
    }
  }

  function mostrarError(formId, mensaje) {
    const form = document.getElementById(formId);
    if (!form) return;

    let errorDiv = form.querySelector(".error-message");
    if (!errorDiv) {
      errorDiv = document.createElement("div");
      errorDiv.className = "error-message";
      errorDiv.style.color = "red";
      errorDiv.style.marginTop = "10px";
      errorDiv.style.fontWeight = "bold";
      form.appendChild(errorDiv);
    }
    errorDiv.textContent = mensaje;
  }

  async function validarInicioSesion(event) {
    event.preventDefault();
    const email = document.getElementById("usuario").value.trim();
    const password = document.getElementById("contrasena").value.trim();

    if (email === "" || password === "") {
      return mostrarError("formulario-login", "Por favor, completa todos los campos.");
    }

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || "Hubo un error en el servidor.");
      }

      localStorage.setItem("token", data.token);

      const userResponse = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${data.token}` },
      });
      const userData = await userResponse.json();
      if (userData.success) {
        localStorage.setItem("user", JSON.stringify(userData.data));
      }
      window.location.href = "/index.html";
    } catch (error) {
      console.error("Error en el inicio de sesión:", error.message);
      mostrarError("formulario-login", error.message);
    }
  }

  async function validarRegistro(event) {
    event.preventDefault();

    const nombre = document.getElementById("nombreRegistro").value.trim();
    const apellidos = document.getElementById("apellidosRegistro").value.trim();
    const email = document.getElementById("emailRegistro").value.trim();
    const password = document.getElementById("passwordRegistro").value.trim();
    const direccion = document.getElementById("direccionRegistro").value.trim();

    const nombreCompleto = `${nombre} ${apellidos}`.trim();

    if (!nombreCompleto || !email || !password) {
      return mostrarError("registroForm", "Completa Nombres, Apellidos, Correo y Contraseña.");
    }

    try {
      const requestBody = {
        nombre: nombreCompleto,
        email,
        password
      };
      
      if (direccion) {
        requestBody.direccion = direccion;
      }

      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || "Hubo un error en el registro.");
      }

      console.log("Registro exitoso. Redirigiendo a la vista de inicio de sesión.");
      mostrarVista("login-template");
    } catch (error) {
      console.error("Error en el registro:", error.message);
      mostrarError("registroForm", error.message);
    }
  }

  function attachFormListeners() {
    const loginForm = document.getElementById("formulario-login");
    if (loginForm) {
      loginForm.addEventListener("submit", validarInicioSesion);
    }

    const registroForm = document.getElementById("registroForm");
    if (registroForm) {
      registroForm.addEventListener("submit", validarRegistro);
    }

    const mostrarRegistroBtn = document.getElementById("mostrar-registro");
    if (mostrarRegistroBtn) {
      mostrarRegistroBtn.addEventListener("click", (e) => {
        e.preventDefault();
        mostrarVista("registro-template");
      });
    }

    const mostrarLoginBtn = document.getElementById("mostrar-login");
    if (mostrarLoginBtn) {
      mostrarLoginBtn.addEventListener("click", (e) => {
        e.preventDefault();
        mostrarVista("login-template");
      });
    }
  }

  mostrarVista("login-template");
});

function cambiarTema() {
  const body = document.body;
  const icono = document.getElementById("iconoTema");
  body.classList.toggle("bg-dark");
  body.classList.toggle("text-light");
  const esOscuro = body.classList.contains("bg-dark");
  if (icono) icono.textContent = esOscuro ? "🌙" : "☀️";
  localStorage.setItem("tema", esOscuro ? "oscuro" : "claro");
}

window.addEventListener("DOMContentLoaded", () => {
  const icono = document.getElementById("iconoTema");
  if (localStorage.getItem("tema") === "oscuro") {
    document.body.classList.add("bg-dark", "text-light");
    if (icono) icono.textContent = "🌙";
  }
});
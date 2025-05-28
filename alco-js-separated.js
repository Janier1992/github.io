// Credenciales de administrador (definidas al principio para mayor claridad)
const validUsers = [
    { user: "Janier", pass: "admin" },
    { user: "Gean", pass: "admin1" },
    { user: "Campo", pass: "123456" }
    { user: "Emma", pass: "123" }
];

// Simulación de la autenticación
function intentLogin() {
    console.log("Intentando login...");
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const username = usernameInput.value;
    const password = passwordInput.value;

    // Verificación de credenciales
    const validUser = validUsers.find(u => u.user === username && u.pass === password);

    if (validUser) {
        console.log("Login exitoso!");
        document.getElementById('loginContainer').classList.remove('active');
        document.getElementById('mainContainer').classList.add('active');
        document.getElementById('userDisplay').textContent = `Usuario: ${username}`;
        // Limpiar campos después de login exitoso (opcional pero buena práctica)
        usernameInput.value = '';
        passwordInput.value = '';
    } else {
        alert('Credenciales incorrectas. Inténtelo nuevamente.');
        console.log("Login fallido");

        passwordInput.value = '';
    }
    return false; // Evitar el envío del formulario
}

// NUEVO: Función para cerrar sesión
function logout() {
    console.log("Cerrando sesión...");
    document.getElementById('mainContainer').classList.remove('active');
    document.getElementById('loginContainer').classList.add('active');

    // Opcional: Limpiar el nombre de usuario en el display al cerrar sesión
    document.getElementById('userDisplay').textContent = 'Usuario:';
    // Asegurar que los campos de login estén vacíos para el próximo intento
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    if (usernameInput) usernameInput.value = '';
    if (passwordInput) passwordInput.value = '';
}

// Configurar los manejadores de eventos una vez que la página está cargada
window.onload = function () {
    console.log("Página cargada");

    // Configurar evento del formulario de login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.onsubmit = function (e) {
            e.preventDefault();
            return intentLogin();
        };
    }

    // Añadir también evento al botón de login para mayor compatibilidad
    const loginButton = document.querySelector('.login-button');
    if (loginButton) {
        loginButton.onclick = function (e) {
            e.preventDefault();
            return intentLogin(); // Llama a la función de login
        };
    }

    // NUEVO: Configurar evento del botón de Cerrar Sesión
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    }

    // Navegación entre módulos
    document.querySelectorAll('.card-button').forEach(button => {
        button.addEventListener('click', function () {
            const moduleId = this.getAttribute('data-module');
            document.querySelectorAll('.module-container').forEach(module => {
                module.classList.remove('active');
            });
            const targetModule = document.getElementById(moduleId);
            if (targetModule) {
                targetModule.classList.add('active');
                // Ocultar el contenedor de cards y el título principal cuando un módulo está activo
                document.querySelector('.cards-container').style.display = 'none';
                document.querySelector('.main-title').style.display = 'none';
                document.querySelector('.pagination').style.display = 'none';
            } else {
                console.error("Módulo no encontrado: " + moduleId);
            }
        });
    });

    // Función para volver al menú principal desde un módulo
    function goBackToMenu() {
        document.querySelectorAll('.module-container').forEach(module => {
            module.classList.remove('active');
        });
        // Mostrar nuevamente el contenedor de cards y el título principal
        document.querySelector('.cards-container').style.display = 'flex'; // o 'block' según tu layout
        document.querySelector('.main-title').style.display = 'block';
        document.querySelector('.pagination').style.display = 'flex'; // o 'block'
    }

    // Botones para volver al menú principal
    const backFromFormularios = document.getElementById('backFromFormularios');
    if (backFromFormularios) {
        backFromFormularios.addEventListener('click', goBackToMenu);
    }

    const backFromBiblioteca = document.getElementById('backFromBiblioteca');
    if (backFromBiblioteca) {
        backFromBiblioteca.addEventListener('click', goBackToMenu);
    }

    const backFromIndicadores = document.getElementById('backFromIndicadores');
    if (backFromIndicadores) {
        backFromIndicadores.addEventListener('click', goBackToMenu);
    }

    // Inicializar los gráficos con datos de muestra
    if (typeof Chart !== 'undefined' &&
        document.getElementById('defectsChart') &&
        document.getElementById('timeChart') &&
        document.getElementById('approvalChart') &&
        document.getElementById('trendChart')) {
        initCharts();
    } else {
        console.error("Chart.js no está cargado o los elementos canvas no se encuentran. Los gráficos no se inicializarán.");
    }
};

// Función para inicializar los gráficos (sin cambios, se mantiene igual)
function initCharts() {
    // Gráfico de defectos por área
    const defectsCtx = document.getElementById('defectsChart').getContext('2d');
    new Chart(defectsCtx, {
        type: 'bar',
        data: {
            labels: ['Perfilería', 'Pintura', 'Troquelados', 'Felpa', 'Vidrio', 'Despachos'],
            datasets: [{
                label: '% de Defectos',
                data: [2.3, 1.7, 3.5, 0.9, 1.2, 0.5],
                backgroundColor: '#004282',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Porcentaje (%)'
                    }
                }
            }
        }
    });

    // Gráfico de tiempos de inspección
    const timeCtx = document.getElementById('timeChart').getContext('2d');
    new Chart(timeCtx, {
        type: 'line',
        data: {
            labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
            datasets: [{
                label: 'Tiempo promedio (min)',
                data: [12, 15, 10, 9, 11],
                borderColor: '#0056b3',
                backgroundColor: 'rgba(0, 86, 179, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Gráfico de productos rechazados vs aprobados
    const approvalCtx = document.getElementById('approvalChart').getContext('2d');
    new Chart(approvalCtx, {
        type: 'pie',
        data: {
            labels: ['Aprobados', 'Rechazados', 'Pendientes'],
            datasets: [{
                data: [85, 10, 5],
                backgroundColor: ['#28a745', '#dc3545', '#ffc107']
            }]
        }
    });

    // Gráfico de tendencia mensual de calidad
    const trendCtx = document.getElementById('trendChart').getContext('2d');
    new Chart(trendCtx, {
        type: 'line',
        data: {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May'],
            datasets: [{
                label: 'Calidad General',
                data: [92, 94, 91, 95, 97],
                borderColor: '#004282',
                backgroundColor: 'transparent'
            }, {
                label: 'Meta',
                data: [90, 90, 90, 90, 90],
                borderColor: '#a5a7a8',
                borderDash: [5, 5],
                backgroundColor: 'transparent'
            }]
        },
        options: {
            scales: {
                y: {
                    min: 85,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Puntuación (%)'
                    }
                }
            }
        }
    });
    console.log("Gráficos inicializados.");
}

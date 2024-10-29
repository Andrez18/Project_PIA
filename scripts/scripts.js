document.addEventListener('DOMContentLoaded', function () {
    const userInfo = document.getElementById('user-info');
    const loginBtn = document.querySelector('.btn-login');

    function checkSession() {
        fetch('../php/check_session.php')
            .then(response => response.json())
            .then(data => {
                if (data.loggedIn) {
                    userInfo.innerHTML = `
                        <span>Bienvenido, ${data.name}</span>
                        <a href="perfil.html">Mi Perfil</a>
                        <button id="logout-btn">Cerrar Sesión</button>
                    `;
                    if (loginBtn) loginBtn.style.display = 'none';
                    
                    document.getElementById('logout-btn').addEventListener('click', logout);
                } else {
                    userInfo.innerHTML = '';
                    if (loginBtn) loginBtn.style.display = 'inline-block';
                }
            });
    }

    function logout() {
        fetch('../php/logout.php')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    checkSession();
                    window.location.href = 'inicio.html';
                }
            });
    }

    checkSession();

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const name = document.getElementById('contact-name').value;
            const email = document.getElementById('contact-email').value;
            const message = document.getElementById('contact-message').value;

            alert(`Enviando mensaje: \nNombre: ${name}\nEmail: ${email}\nMensaje: ${message}`);
        });
    }
});

document.addEventListener("DOMContentLoaded", function() {
    const bookItems = document.querySelectorAll(".book-item");
    bookItems.forEach(item => {
        const img = item.querySelector("img");
        img.addEventListener("click", (event) => {
            event.stopPropagation(); 
            
            document.querySelectorAll(".book-options").forEach(options => {
                options.classList.add("hidden");
            });
            
            const options = item.querySelector(".book-options");
            options.classList.toggle("hidden");
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const dropdowns = document.querySelectorAll('.dropdown');

    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('a');
        const content = dropdown.querySelector('.dropdown-content');

        // Toggle dropdown on click
        link.addEventListener('click', function(e) {
            e.preventDefault();
            content.style.display = content.style.display === 'block' ? 'none' : 'block';
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!dropdown.contains(e.target)) {
                content.style.display = 'none';
            }
        });

        // Handle hover events for desktop
        dropdown.addEventListener('mouseenter', function() {
            content.style.display = 'block';
        });

        dropdown.addEventListener('mouseleave', function() {
            content.style.display = 'none';
        });
    });
});


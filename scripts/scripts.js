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
                    window.location.href = '../html/index.html';
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


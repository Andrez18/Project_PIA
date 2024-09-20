document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('container');
    const registerButton = document.getElementById('register');
    const loginButton = document.getElementById('login');

    registerButton.addEventListener('click', () => {
        container.classList.add('active');
    });

    loginButton.addEventListener('click', () => {
        container.classList.remove('active');
    });

    const registerForm = document.getElementById('register-form');
    registerForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;

        fetch('../php/register.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                'name': name,
                'email': email,
                'password': password
            })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            if (data.success) {
                window.location.href = 'inicio.html';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Ocurrió un error durante el registro');
        });
    });

    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        fetch('../php/login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                'email': email,
                'password': password
            })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            if (data.success) {
                window.location.href = 'inicio.html';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Ocurrió un error durante el inicio de sesión');
        });
    });
});
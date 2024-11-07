document.addEventListener('DOMContentLoaded', () => {
    initBookFormHandler();
    initModalHandlers(); // Nueva función para manejar el modal
    loadBooks();
    obtenerEstadisticas();
    obtenerActividadReciente();
    initMenuNavigation();
    initLogoutHandler();
    initUserManagement();
});

// Nuevo: Manejo del modal
function initModalHandlers() {
    const modal = document.getElementById('modal-book');
    const btnOpenModal = document.getElementById('btn-new-book'); 
    const closeButtons = modal.querySelectorAll('.close-modal, .cancel-modal'); 

    // Abrir modal
    if (btnOpenModal) {
        btnOpenModal.addEventListener('click', () => {
            const form = document.getElementById('book-form');
            if (form) {
                form.reset(); 
                const idInput = form.querySelector('[name="book_id"]');
                if (idInput) idInput.remove();
            }
            modal.style.display = 'block';
        });
    }

    // Cerrar modal con botones
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    });

    // Cerrar modal haciendo clic fuera
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Manejo del formulario de libros
function initBookFormHandler() {
    const bookForm = document.getElementById('book-form');
    const modal = document.getElementById('modal-book');

    if (bookForm) {
        bookForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitButton = bookForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = 'Guardando...';
            submitButton.disabled = true;

            try {
                const formData = new FormData(bookForm);
                const response = await fetch('../php/admin/guardar_libros.php', {
                    method: 'POST',
                    body: formData,
                });
                const data = await response.json();

                if (data.success) {
                    alert('Libro guardado correctamente');
                    bookForm.reset();
                    modal.style.display = 'none';
                    await loadBooks();
                } else {
                    throw new Error(data.error || 'Error al guardar el libro');
                }
            } catch (error) {
                alert('Error: ' + error.message);
            } finally {
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
            }
        });
    }
}


// Cargar lista de libros
async function loadBooks() {
    const tableBody = document.querySelector('#books-table tbody');
    if (!tableBody) return;

    try {
        const response = await fetch('../php/admin/conseguir_libros.php');
        const data = await response.json();

        if (data.success) {
            tableBody.innerHTML = data.books.map((book) => `
                <tr>
                    <td>${book.titulo}</td>
                    <td>${book.autor}</td>
                    <td>${book.fecha_publicacion}</td>
                    <td>${book.estado}</td>
                    <td>
                        <button onclick="editBook(${book.id})" class="btn-edit"><i class="ri-edit-line"></i></button>
                        <button onclick="deleteBook(${book.id})" class="btn-delete"><i class="ri-delete-bin-line"></i></button>
                    </td>
                </tr>
            `).join('');
        }
    } catch (error) {
        console.error('Error al cargar los libros:', error);
    }
}

// Editar libro
async function editBook(id) {
    try {
        const response = await fetch(`../php/admin/conseguir_libro.php?id=${id}`);
        const data = await response.json();

        if (data.success) {
            const book = data.book;
            const form = document.getElementById('book-form');
            form.querySelector('[name="titulo"]').value = book.titulo;
            form.querySelector('[name="autor"]').value = book.autor;
            form.querySelector('[name="fecha"]').value = book.fecha_publicacion;
            form.querySelector('[name="introduccion"]').value = book.introduccion;

            let idInput = form.querySelector('[name="book_id"]');
            if (!idInput) {
                idInput = document.createElement('input');
                idInput.type = 'hidden';
                idInput.name = 'book_id';
                form.appendChild(idInput);
            }
            idInput.value = id;
            document.getElementById('modal-book').style.display = 'block';
        }
    } catch (error) {
        console.error('Error al cargar el libro:', error);
        alert('Error al cargar los datos del libro');
    }
}

// Eliminar libro
async function deleteBook(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este libro?')) {
        try {
            const response = await fetch('../php/admin/borrar_libro.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });
            const data = await response.json();

            if (data.success) {
                alert('Libro eliminado correctamente');
                await loadBooks();
            } else {
                throw new Error(data.error || 'Error al eliminar el libro');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al eliminar el libro');
        }
    }
}

// Obtener estadísticas
function obtenerEstadisticas() {
    fetch('../php/admin/obtener_estadisticas.php')
        .then((response) => response.json())
        .then((data) => {
            document.getElementById('total-users').textContent = data.totalUsuarios;
            document.getElementById('total-books').textContent = data.totalLibros;
            document.getElementById('active-loans').textContent = data.totalPrestamosActivos;
        })
        .catch((error) => console.error('Error en estadísticas:', error));
}

// Obtener actividad reciente
function obtenerActividadReciente() {
    fetch('../php/admin/obtener_actividad_reciente.php')
        .then((response) => response.json())
        .then((data) => {
            const activityList = document.getElementById('activity-list');
            activityList.innerHTML = '';
            data.forEach((item) => {
                const activityItem = document.createElement('div');
                activityItem.className = 'activity-item';
                activityItem.innerHTML = `
                    <p><strong>${item.tipo}:</strong> ${item.nombre}</p>
                    <p><small>Fecha: ${item.fecha}</small></p>
                `;
                activityList.appendChild(activityItem);
            });
        })
        .catch((error) => console.error('Error en actividad reciente:', error));
}

// Manejo de navegación del menú
function initMenuNavigation() {
    const menuLinks = document.querySelectorAll('.admin-menu a');
    const sections = document.querySelectorAll('.admin-section');

    menuLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.dataset.section;
            showSection(sectionId);
        });
    });

    function showSection(sectionId) {
        sections.forEach((section) => section.classList.remove('active'));
        const selectedSection = document.getElementById(sectionId);
        if (selectedSection) selectedSection.classList.add('active');
        menuLinks.forEach((link) => {
            link.classList.toggle('active', link.dataset.section === sectionId);
        });
    }
}

// Manejo de cierre de sesión
function initLogoutHandler() {
    const logoutButton = document.getElementById('logout-admin');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
                window.location.href = '../html/index.html';
            }
        });
    }
}

// Manejo de usuarios
function initUserManagement() {
    const userForm = document.getElementById('user-form');
    const modal = document.getElementById('modal-user');
    const btnAddUser = document.getElementById('add-user'); 
    const closeButtons = modal.querySelectorAll('.close-modal, .cancel-modal');

    // Inicializar el modal
    function initModalHandler() {
        // Abrir modal con el botón de nuevo usuario
        if (btnAddUser) {
            btnAddUser.addEventListener('click', () => {
                if (userForm) userForm.reset();
                const idInput = userForm.querySelector('[name="user_id"]');
                if (idInput) idInput.remove();
                modal.style.display = 'block';
            });
        }

        // Cerrar modal con botones
        closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        });

        // Cerrar modal haciendo clic fuera
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    // Manejo del formulario
    if (userForm) {
        userForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const submitButton = userForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = 'Guardando...';
            submitButton.disabled = true;

            try {
                const formData = {
                    nombre: userForm.querySelector('[name="name"]').value,
                    email: userForm.querySelector('[name="email"]').value,
                    password: userForm.querySelector('[name="password"]').value,
                    rol: userForm.querySelector('[name="role"]').value
                };

                const userId = userForm.querySelector('[name="user_id"]');
                if (userId && userId.value) {
                    formData.user_id = userId.value;
                }

                const response = await fetch('../php/admin/guardar_usuarios.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();

                if (data.success) {
                    alert(data.message || 'Usuario guardado correctamente');
                    userForm.reset();
                    modal.style.display = 'none';
                    await loadUsers();
                } else {
                    throw new Error(data.error || 'Error al guardar el usuario');
                }
            } catch (error) {
                alert('Error: ' + error.message);
            } finally {
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
            }
        });
    }

    // Cargar lista de usuarios
    async function loadUsers() {
        const tableBody = document.querySelector('#users-table tbody');
        if (!tableBody) return;

        try {
            const response = await fetch('../php/admin/conseguir_usuarios.php');
            const data = await response.json();

            if (data.success) {
                tableBody.innerHTML = data.users.map(user => `
                    <tr>
                        <td>${user.nombre}</td>
                        <td>${user.email}</td>
                        <td>${user.fecha_registro || ''}</td>
                        <td>${user.rol}</td>
                        <td>
                            <button onclick="editUser(${user.id})" class="btn-edit">
                                <i class="ri-edit-line"></i>
                            </button>
                            <button onclick="deleteUser(${user.id})" class="btn-delete">
                                <i class="ri-delete-bin-line"></i>
                            </button>
                        </td>
                    </tr>
                `).join('');
            }
        } catch (error) {
            console.error('Error al cargar usuarios:', error);
        }
    }

    // Inicializar todo
    initModalHandler();
    loadUsers();
}

// Función global para editar usuario
async function editUser(id) {
    try {
        const response = await fetch(`../php/admin/conseguir_usuario.php?id=${id}`);
        const data = await response.json();

        if (data.success) {
            const user = data.user;
            const form = document.getElementById('user-form');
            const modal = document.getElementById('modal-user');
            
            form.querySelector('[name="name"]').value = user.nombre;
            form.querySelector('[name="email"]').value = user.email;
            form.querySelector('[name="role"]').value = user.rol;
            form.querySelector('[name="password"]').value = '';
            
            let idInput = form.querySelector('[name="user_id"]');
            if (!idInput) {
                idInput = document.createElement('input');
                idInput.type = 'hidden';
                idInput.name = 'user_id';
                form.appendChild(idInput);
            }
            idInput.value = id;

            modal.style.display = 'block';
        }
    } catch (error) {
        console.error('Error al cargar el usuario:', error);
        alert('Error al cargar los datos del usuario');
    }
}

// Función global para eliminar usuario
const deleteUser  = async (userId) => {
    if (confirm('¿Está seguro de que desea eliminar a este usuario?')) {
        try {
            const response = await fetch('../php/admin/borrar_usuario.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: userId })
            });

            const data = await response.json();

            if (data.success) {
                alert('Usuario eliminado exitosamente');
                await loadUsers(); // Llama a la función que recarga la lista de usuarios
            } else {
                console.error('Error:', data.error);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
};

// Cargar lista de usuarios
async function loadUsers() {
    const tableBody = document.querySelector('#users-table tbody');
    if (!tableBody) return;

    try {
        const response = await fetch('../php/admin/conseguir_usuarios.php');
        const data = await response.json();

        if (data.success) {
            tableBody.innerHTML = data.users.map(user => `
                <tr>
                    <td>${user.nombre}</td>
                    <td>${user.email}</td>
                    <td>${user.fecha_registro || ''}</td>
                    <td>${user.rol}</td>
                    <td>
                        <button onclick="editUser (${user.id})" class="btn-edit">
                            <i class="ri-edit-line"></i>
                        </button>
                        <button onclick="deleteUser (${user.id})" class="btn-delete">
                            <i class="ri-delete-bin-line"></i>
                        </button>
                    </td>
                </tr>
            `).join('');
        }
    } catch (error) {
        console.error('Error al cargar usuarios:', error);
    }
}
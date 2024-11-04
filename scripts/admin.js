document.addEventListener('DOMContentLoaded', () => {
    initBookFormHandler();
    initModalHandlers(); // Nueva función para manejar el modal
    loadBooks();
    obtenerEstadisticas();
    obtenerActividadReciente();
    initMenuNavigation();
    initLogoutHandler();
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

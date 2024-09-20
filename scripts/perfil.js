document.addEventListener('DOMContentLoaded', function() {
    const userInfoDiv = document.getElementById('user-info');
    const borrowedBooksDiv = document.getElementById('borrowed-books');
    const logoutBtn = document.getElementById('logout-btn');

    function loadUserInfo() {
        fetch('../php/check_session.php')
            .then(response => response.json())
            .then(data => {
                if (data.loggedIn) {
                    userInfoDiv.innerHTML = `
                        <p><strong>Nombre:</strong> ${data.name}</p>
                        <p><strong>Email:</strong> ${data.email}</p>
                    `;
                    loadBorrowedBooks();
                } else {
                    window.location.href = 'login.html';
                }
            });
    }

    function loadBorrowedBooks() {
        fetch('../php/get_borrowed_books.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({})
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                if (data.books.length > 0) {
                    let booksHTML = '<ul>';
                    data.books.forEach(book => {
                        booksHTML += `
                            <li class="book-item">
                                <h3>${book.titulo}</h3>
                                <p><strong>Autor:</strong> ${book.autor}</p>
                                <p><strong>Fecha de préstamo:</strong> ${book.fecha_prestamo}</p>
                            </li>
                        `;
                    });
                    booksHTML += '</ul>';
                    borrowedBooksDiv.innerHTML = booksHTML;
                } else {
                    borrowedBooksDiv.innerHTML = '<p>No tienes libros prestados actualmente.</p>';
                }
            } else {
                borrowedBooksDiv.innerHTML = '<p>Error al cargar los libros prestados.</p>';
            }
        });
    }

    logoutBtn.addEventListener('click', function() {
        fetch('../php/logout.php')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.location.href = 'inicio.html';
                }
            });
    });

    loadUserInfo();
});
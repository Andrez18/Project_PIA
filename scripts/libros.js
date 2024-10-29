document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const librosRecomendados = document.getElementById('libros-recomendados');
    const librosResultados = document.getElementById('libros-resultados');
    const loader = document.getElementById('loader');
    const panelInfo = document.createElement('div');
    document.body.appendChild(panelInfo);
    panelInfo.id = 'panel-info';
    panelInfo.style.display = 'none';

    const libros = [
        { titulo: 'Cien años de soledad', autor: 'Gabriel García Márquez', fecha: '1967', imagen: 'https://m.media-amazon.com/images/I/71YoFJSz3LL._SY425_.jpg' },
        { titulo: '1984', autor: 'George Orwell', fecha: '1949', imagen: 'https://lahistoriadeldiablog.wordpress.com/wp-content/uploads/2009/06/orwell-1984.jpg?w=640' },
        { titulo: 'El señor de los anillos', autor: 'J.R.R. Tolkien', fecha: '1954', imagen: 'https://m.media-amazon.com/images/I/81U5RVCuTHL._SL1500_.jpg' },
        { titulo: 'Don Quijote de la Mancha', autor: 'Miguel de Cervantes', fecha: '1605', imagen: 'https://images.cdn2.buscalibre.com/fit-in/360x360/be/d0/bed04fba38961a7ddff395958d9123d4.jpg' },
        { titulo: 'Orgullo y prejuicio', autor: 'Jane Austen', fecha: '1813', imagen: 'https://m.media-amazon.com/images/I/81smOptGtLL._SL1500_.jpg' },
        { titulo: 'El principito', autor: 'Antoine de Saint-Exupéry', fecha: '1943', imagen: 'https://sarasvatilibreria.com/cdn/shop/products/el-principito-portada-blanca-antoine-de-saint-exupery-205894.jpg?v=1698902528' },
    ];

    function mostrarLibros(libros, contenedor) {
        contenedor.innerHTML = '';
        libros.forEach(libro => {
            const libroElement = document.createElement('div');
            libroElement.classList.add('libro');
            libroElement.innerHTML = `
                <img src="${libro.imagen}" alt="${libro.titulo}">
                <div class="libro-info">
                    <h3>${libro.titulo}</h3>
                    <p>${libro.autor}</p>
                    <p>${libro.fecha}</p>
                </div>
            `;

            libroElement.addEventListener('click', () => {
                mostrarPanelLibro(libro);
            });

            contenedor.appendChild(libroElement);
        });
    }

    mostrarLibros(libros.slice(0, 3), librosRecomendados);

    function buscarLibros(query) {
        return libros.filter(libro => 
            libro.titulo.toLowerCase().includes(query.toLowerCase()) ||
            libro.autor.toLowerCase().includes(query.toLowerCase()) ||
            libro.fecha.includes(query)
        );
    }

    searchButton.addEventListener('click', () => {
        loader.style.display = 'block';
        setTimeout(() => {
            loader.style.display = 'none';
            const query = searchInput.value.trim();
            if (query) {
                const resultados = buscarLibros(query);
                if (resultados.length > 0) {
                    mostrarLibros(resultados, librosResultados);
                } else {
                    librosResultados.innerHTML = '<p>No se encontraron resultados.</p>';
                }
            } else {
                librosResultados.innerHTML = '<p>Por favor ingrese un término de búsqueda.</p>';
            }
        }, 1000);
    });

    function mostrarPanelLibro(libro) {
        panelInfo.innerHTML = `
            <div class="panel-content">
                <h2>${libro.titulo}</h2>
                <p><strong>Autor:</strong> ${libro.autor}</p>
                <p><strong>Fecha de publicación:</strong> ${libro.fecha}</p>
                <button id="prestar-libro">Prestar</button>
                <button id="previsualizar-libro">Previsualizar</button>
                <button id="cerrar-panel">Cerrar</button>
            </div>
        `;
        panelInfo.style.display = 'block';

        document.getElementById('prestar-libro').addEventListener('click', () => {
            fetch('../php/check_session.php')
            .then(response => response.json())
            .then(data => {
                if (data.loggedIn) {
                    prestarLibro(libro, data.email);
                } else {
                    alert('Debe iniciar sesión para prestar un libro.');
                    window.location.href = 'login.html';
                }
            });
        });

        document.getElementById('cerrar-panel').addEventListener('click', () => {
            panelInfo.style.display = 'none';
        });
    }

 function prestarLibro(libroId) {
    fetch('../php/prestar_libro.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            libro_id: libroId
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('El libro ha sido prestado.');
            panelInfo.style.display = 'none';
        } else {
            alert('Hubo un error al prestar el libro: ' + data.message);
        }
    });
}
});



document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const librosRecomendados = document.getElementById('libros-recomendados');
    const librosResultados = document.getElementById('libros-resultados');
    const loader = document.getElementById('loader');
    const panelInfo = document.createElement('div');
    const suggestionsContainer = document.getElementById('suggestions-container');
    document.body.appendChild(panelInfo);
    panelInfo.id = 'panel-info';
    panelInfo.style.display = 'none';

    const libros = [
        { 
            titulo: 'Cien años de soledad', 
            autor: 'Gabriel García Márquez', 
            fecha: '1967', 
            imagen: 'https://m.media-amazon.com/images/I/71YoFJSz3LL._SY425_.jpg',
            introduccion: 'Una saga familiar que narra la historia de Macondo a través de siete generaciones de los Buendía, explorando temas de amor, soledad y la naturaleza cíclica del tiempo.'
        },
        { 
            titulo: '1984', 
            autor: 'George Orwell', 
            fecha: '1949', 
            imagen: 'https://lahistoriadeldiablog.wordpress.com/wp-content/uploads/2009/06/orwell-1984.jpg?w=640',
            introduccion: 'Una distopía que explora los peligros del totalitarismo y la vigilancia gubernamental, siguiendo la vida de Winston Smith en un mundo de control absoluto.'
        },
        { 
            titulo: 'El señor de los anillos', 
            autor: 'J.R.R. Tolkien', 
            fecha: '1954', 
            imagen: 'https://m.media-amazon.com/images/I/81U5RVCuTHL._SL1500_.jpg',
            introduccion: 'Una épica fantasía que sigue el viaje de Frodo Bolsón para destruir un anillo mágico y salvar a la Tierra Media de la oscuridad.'
        },
        { 
            titulo: 'Don Quijote de la Mancha', 
            autor: 'Miguel de Cervantes', 
            fecha: '1605', 
            imagen: 'https://images.cdn2.buscalibre.com/fit-in/360x360/be/d0/bed04fba38961a7ddff395958d9123d4.jpg',
            introduccion: 'La historia de un hidalgo que, enloquecido por la lectura de novelas de caballerías, decide convertirse en caballero andante y vivir aventuras.'
        },
        { 
            titulo: 'Orgullo y prejuicio', 
            autor: 'Jane Austen', 
            fecha: '1813', 
            imagen: 'https://m.media-amazon.com/images/I/81smOptGtLL._SL1500_.jpg',
            introduccion: 'Una novela de costumbres que explora temas de amor, matrimonio y clase social en la Inglaterra de principios del siglo XIX.'
        },
        { 
            titulo: 'El principito', 
            autor: 'Antoine de Saint-Exupéry', 
            fecha: '1943', 
            imagen: 'https://sarasvatilibreria.com/cdn/shop/products/el-principito-portada-blanca-antoine-de-saint-exupery-205894.jpg?v=1698902528',
            introduccion: 'Un cuento filosófico que narra las aventuras de un pequeño príncipe que viaja por diferentes planetas, aprendiendo sobre la vida y el amor.'
        },
        { 
            titulo: 'Matar a un ruiseñor', 
            autor: 'Harper Lee', 
            fecha: '1960', 
            imagen: 'https://m.media-amazon.com/images/I/81OtwFtEl0L._SL1500_.jpg',
            introduccion: 'Una novela que aborda temas de racismo e injusticia en el sur de Estados Unidos a través de los ojos de una niña y su padre abogado.'
        },
        { 
            titulo: 'Crimen y castigo', 
            autor: 'Fiódor Dostoyevski', 
            fecha: '1866', 
            imagen: 'https://m.media-amazon.com/images/I/81YPgi4vpDL.jpg',
            introduccion: 'Un thriller psicológico que explora la mente atormentada de un estudiante que comete un asesinato y lucha con su conciencia.'
        },
        { 
            titulo: 'La Odisea', 
            autor: 'Homero', 
            fecha: 'Siglo VIII a.C.', 
            imagen: 'https://m.media-amazon.com/images/I/91SCwL9fH9L.jpg',
            introduccion: 'Un poema épico que narra el viaje de regreso a casa del héroe griego Odiseo tras la Guerra de Troya, enfrentando numerosos peligros y aventuras.'
        },
        { 
            titulo: 'Rayuela', 
            autor: 'Julio Cortázar', 
            fecha: '1963', 
            imagen: 'https://m.media-amazon.com/images/I/81w44VOg1fL._SL1500_.jpg',
            introduccion: 'Una novela experimental que invita al lector a "jugar" con el orden de lectura, explorando temas de amor, arte y existencialismo.'
        },
        { 
            titulo: 'Fahrenheit 451', 
            autor: 'Ray Bradbury', 
            fecha: '1953', 
            imagen: 'https://upload.wikimedia.org/wikipedia/commons/1/12/Fahrenheit451HUNcover.jpg',
            introduccion: 'Una distopía que presenta un futuro donde los libros están prohibidos y los bomberos tienen la tarea de quemarlos, explorando temas de censura y conocimiento.'
        },
        { 
            titulo: 'La divina comedia', 
            autor: 'Dante Alighieri', 
            fecha: '1320', 
            imagen: 'https://m.media-amazon.com/images/I/71aG+xDKSYL.jpg',
            introduccion: 'Un poema épico que narra el viaje de Dante a través del Infierno, el Purgatorio y el Paraíso, explorando temas religiosos y filosóficos.'
        },
        { 
            titulo: 'La metamorfosis', 
            autor: 'Franz Kafka', 
            fecha: '1915', 
            imagen: 'https://m.media-amazon.com/images/I/616PVMGZt9L._SY425_.jpg',
            introduccion: 'La historia de Gregor Samsa, quien se despierta un día convertido en un insecto gigante, explorando temas de alienación y absurdo.'
        },
        { 
            titulo: 'Moby Dick', 
            autor: 'Herman Melville', 
            fecha: '1851', 
            imagen: 'https://upload.wikimedia.org/wikipedia/commons/3/36/Moby-Dick_FE_title_page.jpg',
            introduccion: 'La obsesiva búsqueda del capitán Ahab de una ballena blanca gigante, explorando temas de obsesión, naturaleza y el destino del hombre.'
        },
        { 
            titulo: 'En busca del tiempo perdido', 
            autor: 'Marcel Proust', 
            fecha: '1913', 
            imagen: 'https://cdn.agapea.com/Alianza-Editorial/En-busca-del-tiempo-perdido-1-i1n4916057.jpg',
            introduccion: 'Una novela monumental que explora temas de memoria, tiempo y arte a través de los recuerdos y reflexiones del narrador.'
        },
        { 
            titulo: 'Los miserables', 
            autor: 'Victor Hugo', 
            fecha: '1862', 
            imagen: 'https://m.media-amazon.com/images/I/81VStYnDGrL.jpg',
            introduccion: 'Una epopeya social que sigue la vida de varios personajes en la Francia del siglo XIX, explorando temas de justicia, redención y revolución.'
        },
        { 
            titulo: 'Las mil y una noches', 
            autor: 'Anónimo', 
            fecha: 'Compilado en el siglo IX', 
            imagen: 'https://m.media-amazon.com/images/I/81SbICfAHML.jpg',
            introduccion: 'Una colección de cuentos del Medio Oriente y el sur de Asia, narrados por Scheherazade para entretener al rey y salvar su vida.'
        },
        { 
            titulo: 'Ulises', 
            autor: 'James Joyce', 
            fecha: '1922', 
            imagen: 'https://m.media-amazon.com/images/I/51NQ33bFn2L._SY445_SX342_.jpg',
            introduccion: 'Una novela modernista que narra un día en la vida de Leopold Bloom en Dublín, explorando la condición humana a través de técnicas narrativas innovadoras.'
        },
        { 
            titulo: 'Anna Karenina', 
            autor: 'León Tolstói', 
            fecha: '1877', 
            imagen: 'https://m.media-amazon.com/images/I/71dDgWXZhtL.jpg',
            introduccion: 'Una novela que explora las complejidades del amor, el matrimonio y la sociedad rusa del siglo XIX a través de la historia de Anna Karenina y otros personajes.'
        },
        { 
            titulo: 'El gran Gatsby', 
            autor: 'F. Scott Fitzgerald', 
            fecha: '1925', 
            imagen: 'https://m.media-amazon.com/images/I/81Lgt4vTiUL.jpg',
            introduccion: 'Una crítica al Sueño Americano ambientada en los años 20, siguiendo la vida del misterioso millonario Jay Gatsby y su obsesión con un amor del pasado.'
        }
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

    function mostrarSugerencias(sugerencias) {
        suggestionsContainer.innerHTML = '';
        sugerencias.forEach(sugerencia => {
            const sugerenciaElement = document.createElement('div');
            sugerenciaElement.classList.add('sugerencia');
            sugerenciaElement.textContent = sugerencia.titulo;
            sugerenciaElement.addEventListener('click', () => {
                searchInput.value = sugerencia.titulo;
                suggestionsContainer.innerHTML = '';
                realizarBusqueda(sugerencia.titulo);
            });
            suggestionsContainer.appendChild(sugerenciaElement);
        });
    }

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim().toLowerCase();
        if (query.length > 0) {
            const sugerencias = libros.filter(libro => 
                libro.titulo.toLowerCase().includes(query) ||
                libro.autor.toLowerCase().includes(query)
            ).slice(0, 5);
            mostrarSugerencias(sugerencias);
        } else {
            suggestionsContainer.innerHTML = '';
        }
    });

    document.addEventListener('click', (e) => {
        if (!suggestionsContainer.contains(e.target) && e.target !== searchInput) {
            suggestionsContainer.innerHTML = '';
        }
    });

    function realizarBusqueda(query) {
        loader.style.display = 'block';
        setTimeout(() => {
            loader.style.display = 'none';
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
    }

    searchButton.addEventListener('click', () => {
        realizarBusqueda(searchInput.value.trim());
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            realizarBusqueda(searchInput.value.trim());
        }
    });

    function mostrarPanelLibro(libro) {
        panelInfo.innerHTML = `
            <div class="panel-content">
                <h2>${libro.titulo}</h2>
                <p><strong>Autor:</strong> ${libro.autor}</p>
                <p><strong>Fecha de publicación:</strong> ${libro.fecha}</p>
                <div id="introduccion" style="display: none;">
                    <h3>Introducción</h3>
                    <p>${libro.introduccion}</p>
                </div>
                <button id="prestar-libro">Prestar</button>
                <button id="previsualizar-libro">Previsualizar</button>
                <button id="downloadButton">Descargar PDF</button>
                <button id="cerrar-panel">Cerrar</button>
            </div>
        `;
        panelInfo.style.display = 'block';
    
        document.getElementById('prestar-libro').addEventListener('click', () => {
            verificarSesion(() => prestarLibro(libro.titulo));
        });
    
        document.getElementById('cerrar-panel').addEventListener('click', () => {
            panelInfo.style.display = 'none';
        });
    
        document.getElementById('downloadButton').addEventListener('click', () => {
            verificarSesion(() => descargarPDF(libro));
        });
    
        document.getElementById('previsualizar-libro').addEventListener('click', () => {
            const introduccion = document.getElementById('introduccion');
            if (introduccion.style.display === 'none') {
                introduccion.style.display = 'block';
                document.getElementById('previsualizar-libro').textContent = 'Ocultar previsualización';
            } else {
                introduccion.style.display = 'none';
                document.getElementById('previsualizar-libro').textContent = 'Previsualizar';
            }
        });
    }
    
    function verificarSesion(callback) {
        fetch('../php/check_session.php')
            .then(response => response.json())
            .then(data => {
                
                if (data.loggedIn) {
                    callback();
                } else {
                    alert('Debe iniciar sesión para realizar esta acción.');
                    window.location.href = 'login.html';
                }
            })
            .catch(error => {
                console.error('Error al verificar la sesión:', error);
                alert('Hubo un error al verificar su sesión. Por favor, inténtelo de nuevo.');
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

    function descargarPDF(libro) {
        const tituloFormateado = libro.titulo.replace(/\s+/g, '_').toLowerCase();
        const urlPDF = `../pdfs/${tituloFormateado}.pdf`;

        fetch(urlPDF)
            .then(response => {
                if (response.ok) {
                    return response.blob();
                }
                throw new Error('El PDF no está disponible.');
            })
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = `${libro.titulo}.pdf`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            })
            .catch(error => {
                console.error('Error al descargar el PDF:', error);
                alert('Lo sentimos, no se pudo descargar el PDF. Por favor, inténtelo de nuevo más tarde.');
            });
    }
});


function insertarLibros() {
    fetch('../php/insertar_libros.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(libros)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            console.log("Libros insertados correctamente en la base de datos.");
        } else {
            console.error("Error al insertar los libros:", data.message);
        }
    })
    .catch(error => {
        console.error("Error en la solicitud:", error);
    });
}

// Llama a la función para insertar los libros en la base de datos
insertarLibros();
function obtenerEstadisticas() {
    fetch('../php/admin/obtener_estadisticas.php')
        .then(response => response.json())
        .then(data => {
            // Actualizar cada sección con los valores obtenidos
            document.getElementById('total-users').textContent = data.totalUsuarios;
            document.getElementById('total-books').textContent = data.totalLibros;
            document.getElementById('active-loans').textContent = data.totalPrestamosActivos;
        })
        .catch(error => console.error('Error:', error));
}

obtenerEstadisticas();
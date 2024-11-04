function obtenerEstadisticas() {
    fetch('../php/admin/obtener_estadisticas.php')
        .then(response => response.json())
        .then(data => {
            document.getElementById('total-users').textContent = data.totalUsuarios;
            document.getElementById('total-books').textContent = data.totalLibros;
            document.getElementById('active-loans').textContent = data.totalPrestamosActivos;
        })
        .catch(error => console.error('Error en estadísticas:', error));
}

// Obtener y mostrar la actividad reciente
function obtenerActividadReciente() {
    fetch('../php/admin/obtener_actividad_reciente.php')
        .then(response => response.json())
        .then(data => {
            const activityList = document.getElementById('activity-list');
            activityList.innerHTML = ''; 

            // Generar el contenido para cada actividad reciente
            data.forEach(item => {
                const activityItem = document.createElement('div');
                activityItem.className = 'activity-item';
                activityItem.innerHTML = `
                    <p><strong>${item.tipo}:</strong> ${item.nombre}</p>
                    <p><small>Fecha: ${item.fecha}</small></p>
                `;
                activityList.appendChild(activityItem);
            });
        })
        .catch(error => console.error('Error en actividad reciente:', error));
}

const logoutBtn = document.getElementById('logout-admin');

logoutBtn.addEventListener('click', function() {
    fetch('../php/logout.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = '../html/index.html';
            }
        });
});

obtenerEstadisticas();
obtenerActividadReciente();
obtenerEstadisticas();

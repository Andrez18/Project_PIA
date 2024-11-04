<?php
// obtener_actividad_reciente.php
$host = "localhost";
$username = "root";
$password = "";
$dbname = "orebok";

$conn = new mysqli($host, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Consultas para cada tabla (suponiendo que hay una columna `fecha` en cada tabla para ordenar por la más reciente)
$usuariosRecientes = $conn->query("SELECT id, nombre, 'Usuario' AS tipo, fecha FROM usuarios ORDER BY fecha DESC LIMIT 10")->fetch_all(MYSQLI_ASSOC);
$librosRecientes = $conn->query("SELECT id, titulo AS nombre, 'Libro' AS tipo, fecha FROM libros ORDER BY fecha DESC LIMIT 10")->fetch_all(MYSQLI_ASSOC);
$prestamosRecientes = $conn->query("SELECT id, CONCAT('Préstamo de usuario ', id_usuario) AS nombre, 'Préstamo' AS tipo, fecha FROM prestamos ORDER BY fecha DESC LIMIT 10")->fetch_all(MYSQLI_ASSOC);

// Combina todos los resultados en un solo arreglo
$actividadesRecientes = array_merge($usuariosRecientes, $librosRecientes, $prestamosRecientes);

// Ordena los resultados combinados por fecha, de más reciente a más antiguo
usort($actividadesRecientes, function($a, $b) {
    return strtotime($b['fecha']) - strtotime($a['fecha']);
});

// Limita los resultados a los 10 más recientes en total
$actividadesRecientes = array_slice($actividadesRecientes, 0, 10);

// Devolver los resultados en formato JSON
echo json_encode($actividadesRecientes);

$conn->close();
?>

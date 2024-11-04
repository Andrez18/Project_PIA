<?php
$host = "localhost";
$username = "root";
$password = "";
$dbname = "orebok";

$conn = new mysqli($host, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

$totalUsuarios = $conn->query("SELECT COUNT(*) AS total FROM usuarios")->fetch_assoc()['total'];
$totalLibros = $conn->query("SELECT COUNT(*) AS total FROM libros")->fetch_assoc()['total'];
$totalPrestamosActivos = $conn->query("SELECT COUNT(*) AS total FROM prestamos WHERE estado = 'activo'")->fetch_assoc()['total'];

$resultados = [
    'totalUsuarios' => $totalUsuarios,
    'totalLibros' => $totalLibros,
    'totalPrestamosActivos' => $totalPrestamosActivos
];

echo json_encode($resultados);

$conn->close();
?>

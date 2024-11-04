<?php
// insertar_libros.php

$host = "localhost";
$username = "root";
$password = "";
$dbname = "orebok";

// Conectar a la base de datos
$conn = new mysqli($host, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Leer el JSON enviado por POST
$datos = json_decode(file_get_contents('php://input'), true);

if (is_array($datos)) {
    foreach ($datos as $libro) {
        // Preparar la consulta de inserción
        $stmt = $conn->prepare("INSERT INTO libros (titulo, autor, anio_publicacion, imagen_url, disponible, cantidad) VALUES (?, ?, ?, ?, 1, 1)");
        $stmt->bind_param("ssis", $libro['titulo'], $libro['autor'], $libro['fecha'], $libro['imagen']);
        
        // Ejecutar la consulta
        $stmt->execute();
    }
    echo json_encode(["status" => "success", "message" => "Libros insertados correctamente."]);
} else {
    echo json_encode(["status" => "error", "message" => "Datos inválidos."]);
}

// Cerrar la conexión
$conn->close();
?>

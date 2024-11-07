<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

// Configuración de la conexión a la base de datos
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "orebok";

// Crear la conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar la conexión
if ($conn->connect_error) {
    echo json_encode([
        "success" => false,
        "error" => "Error de conexión: " . $conn->connect_error
    ]);
    exit;
}

// Verificar si se proporcionó un ID
if (!isset($_GET['id'])) {
    echo json_encode([
        "success" => false,
        "error" => "ID de usuario no proporcionado"
    ]);
    exit;
}

try {
    $user_id = intval($_GET['id']);
    
    // Preparar y ejecutar la consulta
    $sql = "SELECT id, nombre, email, rol FROM usuarios WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        echo json_encode([
            "success" => false,
            "error" => "Usuario no encontrado"
        ]);
        exit;
    }
    
    $user = $result->fetch_assoc();
    
    echo json_encode([
        "success" => true,
        "user" => $user
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "error" => "Error: " . $e->getMessage()
    ]);
}

$conn->close();
?>
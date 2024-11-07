<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
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

// Verificar si la solicitud es POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Obtener los datos JSON de la solicitud
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!isset($data['id'])) {
        echo json_encode([
            "success" => false,
            "error" => "ID de usuario no proporcionado"
        ]);
        exit;
    }

    $user_id = intval($data['id']);

    try {
        // Primero verificamos si el usuario existe
        $check_sql = "SELECT id FROM usuarios WHERE id = ?";
        $check_stmt = $conn->prepare($check_sql);
        $check_stmt->bind_param("i", $user_id);
        $check_stmt->execute();
        $result = $check_stmt->get_result();

        if ($result->num_rows === 0) {
            echo json_encode([
                "success" => false,
                "error" => "Usuario no encontrado"
            ]);
            exit;
        }

        // Si el usuario existe, procedemos a eliminarlo
        $sql = "DELETE FROM usuarios WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $user_id);

        if ($stmt->execute()) {
            if ($stmt->affected_rows > 0) {
                echo json_encode([
                    "success" => true,
                    "message" => "Usuario eliminado correctamente"
                ]);
            } else {
                throw new Exception("No se pudo eliminar el usuario");
            }
        } else {
            throw new Exception("Error al ejecutar la consulta");
        }

    } catch (Exception $e) {
        echo json_encode([
            "success" => false,
            "error" => "Error: " . $e->getMessage()
        ]);
    }
}

$conn->close();
?>
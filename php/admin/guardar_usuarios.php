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

    // Validar y sanitizar datos
    $nombre = $conn->real_escape_string($data['nombre'] ?? '');
    $email = $conn->real_escape_string($data['email'] ?? '');
    $password = $data['password'] ?? '';
    
    // Validación específica del rol
    $rol = strtolower($data['rol'] ?? 'estudiante'); // Convertir a minúsculas
    if (!in_array($rol, ['estudiante', 'administrador'])) {
        $rol = 'estudiante'; // Valor por defecto si no es válido
    }
    
    $user_id = isset($data['user_id']) ? intval($data['user_id']) : null;

    // Debug: Imprimir los valores recibidos
    error_log("Datos recibidos: " . print_r($data, true));
    error_log("Rol procesado: " . $rol);

    // Validar datos obligatorios
    if (empty($nombre) || empty($email)) {
        echo json_encode([
            "success" => false,
            "error" => "Nombre y email son obligatorios"
        ]);
        exit;
    }

    try {
        if ($user_id) {
            // Actualización de usuario existente
            if (!empty($password)) {
                // Si se proporciona nueva contraseña, actualizarla
                $password_hash = password_hash($password, PASSWORD_DEFAULT);
                $sql = "UPDATE usuarios SET nombre = ?, email = ?, password = ?, rol = ? WHERE id = ?";
                $stmt = $conn->prepare($sql);
                $stmt->bind_param("ssssi", $nombre, $email, $password_hash, $rol, $user_id);
            } else {
                // Si no hay nueva contraseña, mantener la existente
                $sql = "UPDATE usuarios SET nombre = ?, email = ?, rol = ? WHERE id = ?";
                $stmt = $conn->prepare($sql);
                $stmt->bind_param("sssi", $nombre, $email, $rol, $user_id);
            }
        } else {
            // Creación de nuevo usuario
            if (empty($password)) {
                echo json_encode([
                    "success" => false,
                    "error" => "La contraseña es obligatoria para nuevos usuarios"
                ]);
                exit;
            }
            
            // Verificar si el email ya existe
            $check_sql = "SELECT id FROM usuarios WHERE email = ?";
            $check_stmt = $conn->prepare($check_sql);
            $check_stmt->bind_param("s", $email);
            $check_stmt->execute();
            $result = $check_stmt->get_result();
            
            if ($result->num_rows > 0) {
                echo json_encode([
                    "success" => false,
                    "error" => "El email ya está registrado"
                ]);
                exit;
            }

            $password_hash = password_hash($password, PASSWORD_DEFAULT);
            $sql = "INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("ssss", $nombre, $email, $password_hash, $rol);
        }

        if ($stmt->execute()) {
            echo json_encode([
                "success" => true,
                "message" => $user_id ? "Usuario actualizado exitosamente" : "Usuario creado exitosamente"
            ]);
        } else {
            throw new Exception("Error en la operación de base de datos: " . $stmt->error);
        }

    } catch (Exception $e) {
        echo json_encode([
            "success" => false,
            "error" => "Error: " . $e->getMessage()
        ]);
    }
}

// Cerrar la conexión
$conn->close();
?>
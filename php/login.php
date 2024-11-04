<?php
session_start();

$host = 'localhost';
$db   = 'orebok';
$user = 'root';
$pass = '';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error de conexión: ' . $e->getMessage()]);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
    $password = $_POST['password'];
    $selectedRole = filter_var($_POST['role'], FILTER_SANITIZE_STRING); // El rol que el usuario selecciona en el login

    try {
        // Verificamos si el usuario existe en la base de datos
        $stmt = $pdo->prepare("SELECT id, email, password, rol FROM usuarios WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password'])) {
            // Verificamos que el rol seleccionado sea el mismo con el que se registró
            if ($user['rol'] === $selectedRole) {
                // Guardamos la información relevante en la sesión
                $_SESSION['user'] = [
                    'id' => $user['id'],
                    'email' => $user['email'],
                    'role' => $user['rol']
                ];
                http_response_code(200);
                echo json_encode(['success' => true, 'message' => 'Login exitoso']);
            } else {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Rol incorrecto. Verifica el rol seleccionado.']);
            }
        } else {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Email o contraseña incorrectos']);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error al realizar la consulta']);
    }
}
?>
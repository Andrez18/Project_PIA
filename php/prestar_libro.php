<?php
session_start();

if (!isset($_SESSION['user'])) {
    echo json_encode(['success' => false, 'message' => 'Usuario no autenticado']);
    exit;
}

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
} catch (\PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Error de conexión a la base de datos']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$libro_id = $data['libro_id'];
$usuario_id = $_SESSION['user']['id'];

// Verificar disponibilidad del libro
$stmt = $pdo->prepare("SELECT disponible FROM libros WHERE id = ?");
$stmt->execute([$libro_id]);
$libro = $stmt->fetch();

if ($libro && $libro['disponible'] == 1) {
    // El libro está disponible, proceder con el préstamo
    $pdo->beginTransaction();
    try {
        $stmt = $pdo->prepare("INSERT INTO prestamos (libro_id, usuario_id, fecha_prestamo) VALUES (?, ?, NOW())");
        $stmt->execute([$libro_id, $usuario_id]);

        $stmt = $pdo->prepare("UPDATE libros SET disponible = 0 WHERE id = ?");
        $stmt->execute([$libro_id]);

        $pdo->commit();
        echo json_encode(['success' => true, 'message' => 'Libro prestado con éxito']);
    } catch (\Exception $e) {
        $pdo->rollBack();
        echo json_encode(['success' => false, 'message' => 'Error al prestar el libro']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'El libro no está disponible']);
}
?>
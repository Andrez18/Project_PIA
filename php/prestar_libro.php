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
} catch (\PDOException $e) {
    throw new \PDOException($e->getMessage(), (int)$e->getCode());
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $libro_id = $data['libro_id'];
    $usuario_id = $_SESSION['user']['id'];
    
    try {
        $pdo->beginTransaction();
        
        // Verificar si el libro está disponible
        $stmt = $pdo->prepare("SELECT disponible FROM libros WHERE id = ?");
        $stmt->execute([$libro_id]);
        $libro = $stmt->fetch();
        
        if (!$libro || !$libro['disponible']) {
            throw new Exception("El libro no está disponible para préstamo.");
        }
        
        // Registrar el préstamo
        $stmt = $pdo->prepare("INSERT INTO prestamos (usuario_id, libro_id) VALUES (?, ?)");
        $stmt->execute([$usuario_id, $libro_id]);
        
        // Actualizar el estado del libro
        $stmt = $pdo->prepare("UPDATE libros SET disponible = FALSE WHERE id = ?");
        $stmt->execute([$libro_id]);
        
        $pdo->commit();
        
        echo json_encode([
            'success' => true,
            'message' => "Libro prestado exitosamente"
        ]);
    } catch (Exception $e) {
        $pdo->rollBack();
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Método no permitido'
    ]);
}
?>
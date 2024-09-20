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
    $usuario_id = $_SESSION['user']['id'];

    $stmt = $pdo->prepare("
        SELECT l.titulo, l.autor, p.fecha_prestamo
        FROM prestamos p
        JOIN libros l ON p.libro_id = l.id
        WHERE p.usuario_id = ? AND p.fecha_devolucion IS NULL
    ");
    $stmt->execute([$usuario_id]);
    $libros_prestados = $stmt->fetchAll();

    echo json_encode([
        'success' => true,
        'books' => $libros_prestados
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Método no permitido'
    ]);
}
?>
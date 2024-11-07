<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'DELETE') {
        throw new Exception('Método no permitido');
    }
    
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['id'])) {
        throw new Exception('ID del libro no proporcionado');
    }
    
    $host = 'localhost';
    $dbname = 'orebok';
    $username = 'root';
    $password = '';
    
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $stmt = $pdo->prepare("SELECT imagen FROM libros WHERE id = :id");
    $stmt->execute([':id' => $data['id']]);
    $book = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($book && $book['imagen']) {
        $imagePath = '../uploads/books/' . $book['imagen'];
        if (file_exists($imagePath)) {
            unlink($imagePath);
        }
    }
    
    $stmt = $pdo->prepare("DELETE FROM libros WHERE id = :id");
    $result = $stmt->execute([':id' => $data['id']]);
    
    if ($result) {
        echo json_encode([
            'success' => true,
            'message' => 'Libro eliminado correctamente'
        ]);
    } else {
        throw new Exception('Error al eliminar el libro');
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Error: ' . $e->getMessage()
    ]);
}
?>
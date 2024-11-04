<?php
// get_book.php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");

try {
    // Verificar si se proporcionó un ID
    if (!isset($_GET['id'])) {
        throw new Exception('ID del libro no proporcionado');
    }
    
    // Configuración de la base de datos
    $host = 'localhost';
    $dbname = 'orebok';
    $username = 'root';
    $password = '';
    
    // Conexión a la base de datos
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Preparar y ejecutar la consulta
    $stmt = $pdo->prepare("SELECT id, titulo, autor, 
                          DATE_FORMAT(fecha_publicacion, '%Y-%m-%d') as fecha_publicacion, 
                          imagen, introduccion, estado 
                          FROM libros 
                          WHERE id = :id");
    
    $stmt->execute([':id' => $_GET['id']]);
    $book = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$book) {
        throw new Exception('Libro no encontrado');
    }
    
    // Añadir la URL de la imagen si existe
    if ($book['imagen']) {
        $book['imagen_url'] = '../uploads/books/' . $book['imagen'];
    }
    
    echo json_encode([
        'success' => true,
        'book' => $book
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Error: ' . $e->getMessage()
    ]);
}
?>
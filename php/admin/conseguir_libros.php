<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");

try {
    // Configuración de la base de datos
    $host = 'localhost';
    $dbname = 'orebok';
    $username = 'root';
    $password = '';
    
    // Conexión a la base de datos
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Preparar la consulta SQL base
    $sql = "SELECT id, titulo, autor, DATE_FORMAT(fecha_publicacion, '%d/%m/%Y') as fecha_publicacion, 
            imagen, introduccion, estado, fecha_creacion 
            FROM libros";
    
    // Verificar si hay término de búsqueda
    if (isset($_GET['search']) && !empty($_GET['search'])) {
        $search = $_GET['search'];
        $sql .= " WHERE titulo LIKE :search OR autor LIKE :search";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([':search' => "%$search%"]);
    } else {
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
    }
    
    // Obtener todos los libros
    $books = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Añadir la URL completa de la imagen
    foreach ($books as &$book) {
        if ($book['imagen']) {
            $book['imagen_url'] = '../uploads/books/' . $book['imagen'];
        }
    }
    
    echo json_encode([
        'success' => true,
        'books' => $books
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Error: ' . $e->getMessage()
    ]);
}
?>
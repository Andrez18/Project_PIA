<?php
header('Content-Type: application/json');

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
    exit;
}

try {
    $host = 'localhost';
    $dbname = 'orebok';
    $username = 'root';
    $password = '';
    
    // Conexión a la base de datos usando PDO
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Procesar la imagen
    $imagen = null;
    if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = '../uploads/books/';
        if (!file_exists($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }
        
        // Generar nombre único para la imagen
        $fileExtension = pathinfo($_FILES['imagen']['name'], PATHINFO_EXTENSION);
        $fileName = uniqid() . '.' . $fileExtension;
        $uploadFile = $uploadDir . $fileName;
        
        // Mover la imagen al directorio de uploads
        if (move_uploaded_file($_FILES['imagen']['tmp_name'], $uploadFile)) {
            $imagen = $fileName;
        }
    }
    
    // Preparar la consulta SQL
    $sql = "INSERT INTO libros (titulo, autor, fecha_publicacion, imagen, introduccion, estado, fecha_creacion) 
            VALUES (:titulo, :autor, :fecha, :imagen, :introduccion, :estado, NOW())";
    
    $stmt = $pdo->prepare($sql);
    
    // Ejecutar la consulta con los datos recibidos
    $resultado = $stmt->execute([
        ':titulo' => $_POST['titulo'],
        ':autor' => $_POST['autor'],
        ':fecha' => $_POST['fecha'],
        ':imagen' => $imagen,
        ':introduccion' => $_POST['introduccion'],
        ':estado' => 'disponible'
    ]);
    
    if ($resultado) {
        echo json_encode([
            'success' => true,
            'message' => 'Libro guardado correctamente',
            'id' => $pdo->lastInsertId()
        ]);
    } else {
        throw new Exception('Error al guardar el libro');
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Error: ' . $e->getMessage()
    ]);
}
?>
<?php
// get_users.php
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
    
    // Preparar la consulta SQL
    $sql = "SELECT id, nombre, email, rol FROM usuarios";
    
    // Verificar si hay término de búsqueda
    if (isset($_GET['search']) && !empty($_GET['search'])) {
        $search = $_GET['search'];
        $sql .= " WHERE nombre LIKE :search OR email LIKE :search";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([':search' => "%$search%"]);
    } else {
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
    }
    
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'users' => $users
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Error: ' . $e->getMessage()
    ]);
}
?>
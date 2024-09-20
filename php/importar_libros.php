<?php
require 'vendor/autoload.php';
use PhpOffice\PhpSpreadsheet\IOFactory;

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
    die("Error de conexión: " . $e->getMessage());
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nombreArchivo = $_FILES['archivo_excel']['tmp_name'];

    if (!$nombreArchivo) {
        die("Error: No se pudo cargar el archivo.");
    }

    try {
        $documento = IOFactory::load($nombreArchivo);
    } catch (Exception $e) {
        die('Error al cargar el archivo: ' . $e->getMessage());
    }

    $hojaActual = $documento->getActiveSheet();

        foreach ($hojaActual->getRowIterator() as $fila) {
        $cellIterator = $fila->getCellIterator();
        $cellIterator->setIterateOnlyExistingCells(false);

        $datosFila = [];
        foreach ($cellIterator as $celda) {
            $datosFila[] = $celda->getValue();
        }

        if (count($datosFila) >= 8) {
            $titulo = $datosFila[1];
            $autor = $datosFila[2];
            $isbn = $datosFila[5];  
            $paginas = (int)$datosFila[4];
            $cantidad = (int)$datosFila[6]; 
            $editorial = $datosFila[7];

            $sql = "INSERT INTO libros (titulo, autor, isbn, paginas, cantidad, editorial, disponible) 
                    VALUES (?, ?, ?, ?, ?, ?, TRUE)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$titulo, $autor, $isbn, $paginas, $cantidad, $editorial]);
        }
    }

    echo "Datos importados exitosamente.";
}
?>

<form method="post" enctype="multipart/form-data">
    <label for="archivo_excel">Selecciona el archivo Excel:</label>
    <input type="file" name="archivo_excel" id="archivo_excel" required>
    <button type="submit">Importar</button>
</form>

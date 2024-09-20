<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Recoger los datos del formulario
    $nombre = htmlspecialchars($_POST['nombre']);
    $correo = htmlspecialchars($_POST['correo']);
    $mensaje = htmlspecialchars($_POST['mensaje']);

    // Validación básica
    if (!empty($nombre) && !empty($correo) && !empty($mensaje) && filter_var($correo, FILTER_VALIDATE_EMAIL)) {
        
        // Configuración del correo
        $to = "ieca.andresgomez@gmail.com";
        $subject = "Nuevo mensaje de contacto de $nombre";
        $body = "Nombre: $nombre\nCorreo: $correo\nMensaje: $mensaje";
        $headers = "From: $correo\r\n";
        
        // Enviar el correo
        if (mail($to, $subject, $body, $headers)) {
            echo "Mensaje enviado correctamente";
        } else {
            echo "Error al enviar el mensaje";
        }
    } else {
        echo "Por favor completa todos los campos correctamente.";
    }
}
?>

<?php
session_start();

if (isset($_SESSION['user'])) {
    echo json_encode([
        'loggedIn' => true,
        'name' => $_SESSION['user']['name'],
        'email' => $_SESSION['user']['email'],
        'id' => $_SESSION['user']['id']
    ]);
} else {
    echo json_encode(['loggedIn' => false]);
}
?>
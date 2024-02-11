<?php

include_once('connection.php');

$db->exec("CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    message TEXT NOT NULL
)");

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $query = $db->query('SELECT * FROM messages ORDER BY id DESC LIMIT 20');

    echo json_encode($query->fetchAll(PDO::FETCH_ASSOC));
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $message = $_POST['message'];
    $username = $_POST['username'];

    $query = $db->prepare('INSERT INTO messages (username, message) VALUES (?, ?)');
    $query->execute([$username, $message]);
}

?>
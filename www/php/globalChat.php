<?php

include_once('connection.php');

// Create the 'messages' table if it doesn't exist
$db->exec("CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    message TEXT NOT NULL
)");

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Retrieve the last 20 messages from the 'messages' table
    $query = $db->query('SELECT * FROM messages ORDER BY id DESC LIMIT 20');

    echo json_encode($query->fetchAll(PDO::FETCH_ASSOC));
} 
elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the message and username from the POST data
    $message = $_POST['message'];
    $username = $_POST['username'];

    // add the message to the 'messages' table
    $query = $db->prepare('INSERT INTO messages (username, message) VALUES (?, ?)');
    $query->execute([$username, $message]);
}

?>
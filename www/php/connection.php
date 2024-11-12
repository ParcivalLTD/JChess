<?php
$servername = "127.0.0.1"; 
$username = "mysql";
$password = "zInzfVr9sXOcZxTUQZcQ6PuERY12Frg4SjMVlxsp6ZPe888BTjUc4pPi1uCWEJiQ";
$database = "default";

// Create connection
$conn = new mysqli($servername, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

echo "Connected successfully";

// Close connection
$conn->close();
?>

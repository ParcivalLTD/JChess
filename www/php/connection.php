<?php
$url = parse_url(getenv('DATABASE_URL'));

$servername = $url["host"];
$username = $url["user"];
$password = $url["pass"];
$database = ltrim($url["path"], '/');
$port = $url["port"] ?? 3306;

// Create a new MySQLi connection
$conn = new mysqli($servername, $username, $password, $database, $port);

// Check if the connection was successful
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

echo "Connected successfully";

// Only close if the connection is active
if ($conn && $conn->ping()) {
    $conn->close();
}
?>

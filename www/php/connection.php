<?php
// Parse the URL
$url = parse_url("mysql://mariadb:xtvSyBCEjX3bFJM9ZO8NKey3T6O4Hw9HBNmYG9WsyrRoB1ugZao1BcLGbznOMiI7@tosoos4s0ow0ww84w4co0w80:3306/default");

$servername = $url["host"];
$username = $url["user"];
$password = $url["pass"];
$database = ltrim($url["path"], '/');
$port = $url["port"];

// Create a new MySQLi connection
$conn = new mysqli($servername, $username, $password, $database, $port);
$conn = new mysqli($servername, $username, $password, $database, $port);

// Check if the connection was successful
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
echo "Connected successfully";

// Close the connection
$conn->close();

// Close the connection
$conn->close();
?>
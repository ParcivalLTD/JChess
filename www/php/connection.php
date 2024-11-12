<?php
$servername = "localhost:3306"; 
$username = "mysql";
$password = getenv('DB_PASSWORD');
$database = "default";

echo $password;

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

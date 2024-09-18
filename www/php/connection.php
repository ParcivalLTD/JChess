<?php
$servername = "localhost"; 
$username = "mysql";
$password = "DVFueeDxbjo7tvb0jkXintLK6gIK00sklA5OWejE92IoE8GVBmbvwLIIqXVrJUCl";
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

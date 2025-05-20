<?php
// Parse the URL
$url = parse_url("mysql://mysql:NgrQkA7soMIEN5REyRmESImerNI0wZtrATZWdj4CwFzDcPCeWJwTUbF4AZhX50Jb@acc8kw0sog4ws4wo8s0kwggc:3306/default");

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
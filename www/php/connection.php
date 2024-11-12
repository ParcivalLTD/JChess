<?php
$servername = "mysql-db"; // Host from the connection string
$username = "mysql";                       // Username from the connection string
$password = "NgrQkA7soMIEN5REyRmESImerNI0wZtrATZWdj4CwFzDcPCeWJwTUbF4AZhX50Jb"; // Password from the connection string
$dbname = "default";                       // Database name from the connection string
$port = 3306;                              // Port from the connection string

// Create a new MySQLi connection
$conn = new mysqli($servername, $username, $password, $dbname, $port);

// Check if the connection was successful
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
echo "Connected successfully";
?>

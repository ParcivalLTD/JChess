<?php
// Set the necessary headers for CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");

$db_host = "130.61.244.127";
$db_port = "5432"; 
$db_name = "default";
$db_user = "mysql";
$db_pass = "DVFueeDxbjo7tvb0jkXintLK6gIK00sklA5OWejE92IoE8GVBmbvwLIIqXVrJUCl"; 

$dsn = "mysql:host=$db_host;port=$db_port;dbname=$db_name";

try {
    // Create a new PDO instance for the database connection
    $db = new PDO($dsn, $db_user, $db_pass);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "Connection successful!";
} catch (Exception $e) {
    // Handle connection error
    echo "Error: " . $e->getMessage();
    exit;
}
?>

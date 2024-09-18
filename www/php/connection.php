<?php
$dsn = "mysql:host=localhost;dbname=default";
$username = "mysql";
$password = "DVFueeDxbjo7tvb0jkXintLK6gIK00sklA5OWejE92IoE8GVBmbvwLIIqXVrJUCl";

try {
    $pdo = new PDO($dsn, $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "Connected successfully";
} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
}
?>

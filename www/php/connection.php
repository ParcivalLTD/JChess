<?php
$url = parse_url(getenv('DATABASE_URL'));
$host = $url["host"];
$dbname = ltrim($url["path"], '/');
$user = $url["user"];
$pass = $url["pass"];
$port = $url["port"] ?? 3306;

try {
    $db = new PDO("mysql:host=$host;port=$port;dbname=$dbname", $user, $pass);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $sql = "
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ";

    $db->exec($sql);
    echo "Table 'users' created or already exists.";
} catch (PDOException $e) {
    die("Setup failed: " . $e->getMessage());
}
?>

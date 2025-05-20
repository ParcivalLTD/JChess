<?php
// Optional: restrict access (e.g., to localhost or with a secret token)
header("Access-Control-Allow-Origin: https://jchess.wavebeef.com");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Parse connection string
$url = parse_url(getenv('DATABASE_URL'));

$host = $url["host"];
$dbname = ltrim($url["path"], '/');
$user = $url["user"];
$pass = $url["pass"];
$port = $url["port"] ?? 3306;

try {
    // Connect to DB
    $db = new PDO("mysql:host=$host;port=$port;dbname=$dbname", $user, $pass);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Drop users table if it exists
    $db->exec("DROP TABLE IF EXISTS users");

    // Recreate users table
    $db->exec("
        CREATE TABLE users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            trophies INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ");

    echo json_encode(['status' => 'success', 'message' => 'users table reset successfully.']);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    exit;
}
?>

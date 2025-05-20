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
    echo "Connected successfully";
} catch (PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}
?>

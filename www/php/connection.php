<?php
// Set the necessary headers for CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");

// Define the database connection URI
$uri = "mysql://avnadmin:AVNS_Ww0zuzpscfo0aQPRXrY@test-ju20gabriel-5cf8.a.aivencloud.com:25251/defaultdb?ssl-mode=REQUIRED";

$fields = parse_url($uri);

$conn = "mysql:";
$conn .= "host=" . $fields["host"];
$conn .= ";port=" . $fields["port"];
$conn .= ";dbname=defaultdb";
$conn .= ";sslmode=verify-ca;sslrootcert=ca.pem";

try {
  // Create a new PDO instance for the database connection
  $db = new PDO($conn, $fields["user"], $fields["pass"]);
  $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (Exception $e) {
  echo "Error: " . $e->getMessage();
  exit;
}
?>
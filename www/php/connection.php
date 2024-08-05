<?php
header("Access-Control-Allow-Origin: *");
$uri = "mysql://avnadmin:AVNS_Ww0zuzpscfo0aQPRXrY@test-ju20gabriel-5cf8.a.aivencloud.com:25251/defaultdb?ssl-mode=REQUIRED";

$fields = parse_url($uri);

$conn = "mysql:";
$conn .= "host=" . $fields["host"];
$conn .= ";port=" . $fields["port"];;
$conn .= ";dbname=defaultdb";
$conn .= ";sslmode=verify-ca;sslrootcert=ca.pem";

try {
  $db = new PDO($conn, $fields["user"], $fields["pass"]);
  $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (Exception $e) {
  echo "Error: " . $e->getMessage();
  exit;
}
?>
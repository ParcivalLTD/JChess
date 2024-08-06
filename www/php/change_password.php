<?php
include_once('connection.php');

$username = $_POST['username'];
$oldPassword = $_POST['oldPassword'];
$newPassword = $_POST['newPassword'];
$currentPassword = $_POST['currentPassword'];

if (empty($oldPassword) || empty($newPassword) || empty($currentPassword)) {
  echo "Bitte füllen Sie alle Felder aus.";
  exit;
}

if ($oldPassword !== $currentPassword) {
  echo "Falsches Passwort.";
  exit;
} else {
    $sql = "UPDATE users SET password = :newPassword WHERE username = :username";
    $stmt = $db->prepare($sql);
    $stmt->execute(['newPassword' => json_encode($newPassword), 'username' => $username]);
    
    echo "Passwort erfolgreich geändert.";
}
?>
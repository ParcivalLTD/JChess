<?php
include_once('connection.php');

$username = $_POST['username'];
$oldPassword = $_POST['oldPassword']; // Entschlüsseln Sie das alte Passwort
$newPassword = $_POST['newPassword']; // Entschlüsseln Sie das neue Passwort
$currentPassword = $_POST['currentPassword']; // Entschlüsseln Sie das aktuelle Passwort

if (empty($oldPassword) || empty($newPassword) || empty($currentPassword)) {
  echo "Bitte füllen Sie alle Felder aus.";
  exit;
}

// Vergleichen Sie das aktuelle Passwort mit dem in der Datenbank gespeicherten Passwort
if ($oldPassword !== $currentPassword) {
  echo "Falsches Passwort.";
  exit;
} else {
    $sql = "UPDATE users SET password = :newPassword WHERE username = :username";
    $stmt = $db->prepare($sql);
    $stmt->execute(['newPassword' => json_encode($newPassword), 'username' => $username]); // Verschlüsseln Sie das neue Passwort
    
    echo "Passwort erfolgreich geändert.";
}
?>
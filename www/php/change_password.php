<?php
include_once('connection.php');

// Get the values from the form
$username = $_POST['username'];
$oldPassword = $_POST['oldPassword'];
$newPassword = $_POST['newPassword'];
$currentPassword = $_POST['currentPassword'];

// Check if any of the fields are empty
if (empty($oldPassword) || empty($newPassword) || empty($currentPassword)) {
  echo "Bitte füllen Sie alle Felder aus.";
  exit;
}

// Check if the old password matches the current password
if ($oldPassword !== $currentPassword) {
  echo "Falsches Passwort.";
  exit;
} else {
    // Update the password in the database
    $sql = "UPDATE users SET password = :newPassword WHERE username = :username";
    $stmt = $db->prepare($sql);
    $stmt->execute(['newPassword' => json_encode($newPassword), 'username' => $username]);
    
    echo "Passwort erfolgreich geändert.";
}
?>
<?php

include_once('connection.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  if (isset($_POST['loginUsername']) && isset($_POST['loginPassword'])) {
    $username = $_POST['loginUsername'];
    $password = $_POST['loginPassword'];

    // Prepare and execute a SELECT query to check if the username exists in the database
    $stmt = $db->prepare("SELECT * FROM users WHERE username = :username");
    $stmt->bindParam(':username', $username);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // Check if the user exists and the password is correct
    if ($user && password_verify($password, $user['password'])) {
      echo json_encode(['success' => 'Login successful.']);
    } else {
      echo json_encode(['error' => 'Invalid username or password.']);
    }
  } elseif (isset($_POST['registerUsername']) && isset($_POST['registerPassword'])) {
    $username = $_POST['registerUsername'];
    $password = $_POST['registerPassword'];

    // Prepare and execute a SELECT query to check if the username is already taken
    $stmt = $db->prepare("SELECT * FROM users WHERE username = :username");
    $stmt->bindParam(':username', $username);
    $stmt->execute();

    // Check if the username is already taken
    if ($stmt->fetch(PDO::FETCH_ASSOC)) {
        echo json_encode(['error' => 'Username already taken.']);
    } else {
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        // Prepare and execute an INSERT query to register the new user
        $stmt = $db->prepare("INSERT INTO users (username, password) VALUES (:username, :password)");
        $stmt->bindParam(':username', $username);
        $stmt->bindParam(':password', $hashedPassword);

        // Check if the registration was successful
        if ($stmt->execute()) {
            echo json_encode(['success' => 'Registration successful.']);
        } else {
            $errorInfo = $stmt->errorInfo();
            echo json_encode(['error' => 'Registration failed. ' . $errorInfo[2]]);
        }
    }
} else {
    echo json_encode(['error' => 'Invalid request.']);
  }
} else {
  echo json_encode(['error' => 'Invalid request method.']);
}
?>

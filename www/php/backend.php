<?php

include_once('connection.php');

// Create the 'users' table if it does not exist
$tableCreationQuery = "
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
";
$db->exec($tableCreationQuery);

// Handle the POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Login handling
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
    } 
    // Register handling
    elseif (isset($_POST['registerUsername']) && isset($_POST['registerPassword'])) {
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
            // Hash the password before storing it
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

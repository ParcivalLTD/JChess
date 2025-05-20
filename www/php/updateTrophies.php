<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

include_once('connection.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $content = file_get_contents("php://input");
    $data = json_decode($content, true);

    // Check if username and trophies are provided
    if (isset($data['username']) && isset($data['trophies'])) {
        $username = $data['username'];
        $trophies = $data['trophies'];

        try {
            // Update the trophies for the specified username
            $sql = "UPDATE users SET trophies = trophies + :trophies WHERE username = :username";
            $stmt = $db->prepare($sql);
            $stmt->execute(['username' => $username, 'trophies' => $trophies]);

            echo json_encode(['status' => 'success']);
        } catch (PDOException $e) {
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'No username or trophies provided']);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Check if a specific username is provided
    if (isset($_GET['username'])) {
        $username = $_GET['username'];
        try {
            $sql = "SELECT trophies FROM users WHERE username = :username";
            $stmt = $db->prepare($sql);
            $stmt->execute(['username' => $username]);
            $trophies = $stmt->fetchColumn();
            echo json_encode(['status' => 'success', 'trophies' => $trophies]);
        } catch (PDOException $e) {
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
    } else {
        // Retrieve top 5 users with highest trophies
        try {
            $sql = "SELECT username, trophies FROM users ORDER BY trophies DESC LIMIT 5";
            $stmt = $db->prepare($sql);
            $stmt->execute();

            $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode(['status' => 'success', 'users' => $users]);
        } catch (PDOException $e) {
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }
}
?>

<?php
include_once('connection.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $content = file_get_contents("php://input");
    $data = json_decode($content, true);

    if (isset($data['username']) && isset($data['trophies'])) {
        $username = $data['username'];
        $trophies = $data['trophies'];

        try {
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
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
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
}

?>
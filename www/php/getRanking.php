<?php
include_once('connection.php');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['username'])) {
        $username = strtolower($_GET['username']);
        try {
            // Select username and trophies from the users table, ordered by trophies in descending order
            $sql = "SELECT username, trophies FROM users ORDER BY trophies DESC";
            $stmt = $db->prepare($sql);
            $stmt->execute();
            $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $rank = 1;
            foreach ($users as $user) {
                // Check if the current user's username matches the provided username
                if (strtolower($user['username']) == $username) {
                    // If a match is found, return the rank of the user as a JSON response
                    echo json_encode(['status' => 'success', 'rank' => $rank]);
                    exit;
                }
                $rank++;
            }
            // If no match is found, return an error message
            echo json_encode(['status' => 'error', 'message' => 'Username not found']);
        } catch (PDOException $e) {
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
    } else {
        // If no username is provided, return an error message
        echo json_encode(['status' => 'error', 'message' => 'No username provided']);
    }
}
?>
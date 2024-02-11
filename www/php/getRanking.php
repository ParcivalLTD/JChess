<?php
include_once('connection.php');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['username'])) {
        $username = strtolower($_GET['username']);
        try {
            $sql = "SELECT username, trophies FROM users ORDER BY trophies DESC";
            $stmt = $db->prepare($sql);
            $stmt->execute();
            $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $rank = 1;
            foreach ($users as $user) {
                if (strtolower($user['username']) == $username) {
                    echo json_encode(['status' => 'success', 'rank' => $rank]);
                    exit;
                }
                $rank++;
            }
            echo json_encode(['status' => 'error', 'message' => 'Username not found']);
        } catch (PDOException $e) {
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'No username provided']);
    }
}
?>

?>
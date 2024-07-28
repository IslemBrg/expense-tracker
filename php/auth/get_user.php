<?php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

include '../database/db.php';
include '../utils.php';

try {
    $user_id = verifyJWT(getBearerToken(), $secretKey)['id'];
    if (!$user_id) {
        echo json_encode(['status' => 401, 'message' => 'Unauthorized']);
        exit;
    }
    $stmt = $pdo->query("SELECT id, name, email FROM users WHERE id = $user_id");
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    echo json_encode($user);
} catch (PDOException $e) {
    echo json_encode([500 => $e->getMessage()]);
}

?>
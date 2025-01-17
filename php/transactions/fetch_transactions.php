<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
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
    $stmt = $pdo->query("SELECT * FROM transactions WHERE owner = $user_id");
    $transactions = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($transactions);
} catch (PDOException $e) {
    echo json_encode([500 => $e->getMessage()]);
}
?>

<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Include database connection
include '../database/db.php';
// Read input data
$input = json_decode(file_get_contents('php://input'), true);

if (isset($input['text']) && isset($input['amount'])) {
    $text = $input['text'];
    $amount = $input['amount'];

    if (is_string($text) && is_numeric($amount)) {
        try {
            // Prepare and execute SQL statement
            $stmt = $pdo->prepare("INSERT INTO transactions (text, amount) VALUES (:text, :amount)");
            $stmt->bindParam(':text', $text);
            $stmt->bindParam(':amount', $amount);
            $stmt->execute();

            // Respond with success
            echo json_encode(['status' => 201, 'id' => $pdo->lastInsertId()]);
        } catch (PDOException $e) {
            // Respond with error
            echo json_encode(['status' => 500, 'message' => $e->getMessage()]);
        }
    } else {
        // Invalid input
        echo json_encode(['status' => 400, 'message' => 'Invalid input data']);
    }
} else {
    // Missing data
    echo json_encode(['status' => 400, 'message' => 'Missing required fields']);
}
?>

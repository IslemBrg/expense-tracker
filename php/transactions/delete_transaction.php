<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: DELETE');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Include database connection
include '../database/db.php';
include '../utils.php';
// Read input data
$id = $_GET['id'] ?? null;

$user_id = verifyJWT(getBearerToken(), $secretKey)['id'];

if ($id) {

    if (is_numeric($id)) {
        try {
            $stmt = $pdo->prepare("SELECT * FROM transactions WHERE id = :id AND owner = :owner");
            $stmt->bindParam(':id', $id);
            $stmt->bindParam(':owner', $user_id);
            $stmt->execute();

            $transaction = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$transaction) {
                // Transaction not found
                echo json_encode(['status' => 404, 'message' => 'Transaction not found']);
                exit;
            }
            
            // Prepare and execute SQL statement
            $stmt = $pdo->prepare("DELETE FROM transactions WHERE id = :id");
            $stmt->bindParam(':id', $id);
            $stmt->execute();

            // Respond with success
            echo json_encode(['status' => 201, 'message' => 'deleted']);
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
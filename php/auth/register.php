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

if (isset($input['email']) && isset($input['password'])) {
    $name = $input['name'];
    $email = $input['email'];
    $password = $input['password'];
    $cost = 9;
    $hash_url = 'https://www.toptal.com/developers/bcrypt/api/generate-hash.json';

    if (is_string($email) && is_string($password)) {
        try {

            // Check if the email already exists
            $sql = 'SELECT COUNT(*) FROM users WHERE email = :email';
            $stmt = $pdo->prepare($sql);
            $stmt->bindParam(':email', $email);
            $stmt->execute();
            $emailCount = $stmt->fetchColumn();

            if ($emailCount > 0) {
                // Email already exists
                echo json_encode(['status' => 409, 'message' => "Email already exists"]);
                exit;
            }

            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $hash_url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
                'password' => $password,
                'cost' => $cost
            ]));
            curl_setopt($ch, CURLOPT_VERBOSE, true);
            $response = curl_exec($ch);

            if (curl_errno($ch)) {
                echo 'cURL error: ' . curl_error($ch);
                curl_close($ch);
                exit;
            }

            curl_close($ch);

            $hash = json_decode($response, true)['hash'];

            $stmt = $pdo->prepare('INSERT INTO users (name, email, password) VALUES (:name, :email, :hash)');
            $stmt->bindParam(':name', $name);
            $stmt->bindParam(':email', $email);
            $stmt->bindParam(':hash', $hash);
            $stmt->execute();

            echo json_encode(['status' => 201, 'message' => "user created"]);
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

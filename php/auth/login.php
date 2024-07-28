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
include '../utils.php';

// Read input data
$input = json_decode(file_get_contents('php://input'), true);

if (isset($input['email']) && isset($input['password'])) {
    $email = $input['email'];
    $password = $input['password'];
    $cost = 9;
    $hash_url = 'https://www.toptal.com/developers/bcrypt/api/check-password.json';

    if (is_string($email) && is_string($password)) {
        try {

            // get the user data
            $sql = 'SELECT * FROM users WHERE email = :email';
            $stmt = $pdo->prepare($sql);
            $stmt->bindParam(':email', $email);
            $stmt->execute();

            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$user) {
                http_response_code(401); // Unauthorized
                echo json_encode(['status' => 401, 'message' => "Invalid credentials"]);
                exit;
            }

            $storedHash = $user['password'];

            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $hash_url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
                'hash' => $storedHash,
                'password' => $password
            ]));

            curl_setopt($ch, CURLOPT_VERBOSE, true);
            $response = curl_exec($ch);

            if (curl_errno($ch)) {
                echo 'cURL error: ' . curl_error($ch);
                curl_close($ch);
                exit;
            }

            curl_close($ch);

            $ok = json_decode($response, true)['ok'];

            if ($ok) {

                $header = [
                    'alg' => 'HS256',
                    'typ' => 'JWT'
                ];
                
                $payload = [
                    'iat' => time(),
                    'exp' => time() + 3600, // 1 hour
                    'id' => $user['id'] // User ID or other identifier
                ];

                $jwt = createJWT($header, $payload, $secretKey);

                echo json_encode(['status' => 200, 'message' => "Login successful", 'jwt' => $jwt]);

            } else {
                http_response_code(401); // Unauthorized
                echo json_encode(['status' => 401, 'message' => "Invalid credentials"]);
            }

            // echo json_encode(['status' => 201, 'message' => "user created"]);
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

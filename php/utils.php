<?php

$secretKey = 'toto';

function base64UrlDecode($data) {
    return base64_decode(strtr($data, '-_', '+/'));
}

function base64UrlEncode($data) {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function createJWT($header, $payload, $secretKey) {
    $headerJson = json_encode($header);
    $payloadJson = json_encode($payload);

    $headerEncoded = base64UrlEncode($headerJson);
    $payloadEncoded = base64UrlEncode($payloadJson);

    $signature = hash_hmac('sha256', "$headerEncoded.$payloadEncoded", $secretKey, true);
    $signatureEncoded = base64UrlEncode($signature);

    return "$headerEncoded.$payloadEncoded.$signatureEncoded";
}


function verifyJWT($jwt, $secretKey) {
    if ($jwt=="null") {
        echo json_encode(['status' => 401, 'message' => "Token not provided"]);
        exit;
    }
    list($headerEncoded, $payloadEncoded, $signatureEncoded) = explode('.', $jwt);

    $headerJson = base64UrlDecode($headerEncoded);
    $payloadJson = base64UrlDecode($payloadEncoded);
    $signature = base64UrlDecode($signatureEncoded);

    // Recompute the signature using the header and payload
    $signatureCheck = hash_hmac('sha256', "$headerEncoded.$payloadEncoded", $secretKey, true);

    // Verify if the computed signature matches the signature from the JWT
    if (hash_equals($signature, $signatureCheck)) {
        // Decode the payload and check expiration
        $payload = json_decode($payloadJson, true);
        if ($payload['exp'] >= time()) {
            return $payload; // Token is valid
        } else {
            echo json_encode(['status' => 401, 'message' => "Token expired"]);
            exit;
        }
    } else {
        echo json_encode(['status' => 401, 'message' => "Invalid token"]);
        exit;
    }
}

function getAuthorizationHeader() {
    $headers = apache_request_headers();
    if (isset($headers['Authorization'])) {
        return $headers['Authorization'];
    } elseif (isset($headers['authorization'])) {
        return $headers['authorization'];
    }
    return null;
}

function getBearerToken() {
    $header = getAuthorizationHeader();
    if ($header && preg_match('/Bearer\s(\S+)/', $header, $matches)) {
        return $matches[1];
    }
    return null;
}
?>

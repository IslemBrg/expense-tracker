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

include 'db.php';

try {
    // Create users table
    $sql_users = "CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
    )";
    $pdo->exec($sql_users);

    // Create transactions table with owner column
    $sql_transactions = "CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        text TEXT NOT NULL,
        amount REAL NOT NULL,
        owner INTEGER NOT NULL,
        FOREIGN KEY (owner) REFERENCES users(id)
    )";
    $pdo->exec($sql_transactions);

    echo "Tables created or modified successfully.";
} catch (PDOException $e) {
    die("Could not create or modify the tables: " . $e->getMessage());
}
?>

#!/usr/bin/env php
<?php

// Read username and password from stdin
$input = file_get_contents('php://stdin');
$lines = explode("\n", trim($input));
if (count($lines) < 2) {
    echo "Usage: provide username and password on separate lines via stdin\n";
    exit(1);
}
$username = trim($lines[0]);
$password = trim($lines[1]);

if (empty($username) || empty($password)) {
    echo "Username and password cannot be empty\n";
    exit(1);
}

// Hash the password
$password_hash = password_hash($password, PASSWORD_DEFAULT);

// Database connection
$host = getenv('DB_HOST') ?? null;
$name = getenv('DB_NAME') ?? null;
$user = getenv('DB_USER') ?? null;
$pass = getenv('DB_PASS') ?? null;

if (!$host || !$name || !$user || !$pass) {
    echo "Database configuration error\n";
    exit(1);
}

try {
    $pdo = new PDO(
        "mysql:host=$host;dbname=$name;charset=utf8mb4",
        $user,
        $pass,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );

    $stmt = $pdo->prepare("INSERT INTO user (username, password_hash) VALUES (?, ?)");
    $stmt->execute([$username, $password_hash]);

    echo "User inserted successfully\n";
} catch (PDOException $e) {
    if ($e->getCode() == 23000) { // Duplicate entry
        echo "Username already exists\n";
    } else {
        echo "Error: " . $e->getMessage() . "\n";
    }
    exit(1);
}
?>

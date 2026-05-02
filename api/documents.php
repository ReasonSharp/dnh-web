<?php
header('Content-Type: application/json; charset=utf-8');

session_start();
if (!isset($_SESSION['user_id'])) {
 http_response_code(401);
 echo json_encode(['success' => false, 'message' => 'Unauthorized']);
 exit;
}

$host = $_ENV['DB_HOST'] ?? $_SERVER['DB_HOST'] ?? getenv('DB_HOST') ?? null;
$name = $_ENV['DB_NAME'] ?? $_SERVER['DB_NAME'] ?? getenv('DB_NAME') ?? null;
$user = $_ENV['DB_USER'] ?? $_SERVER['DB_USER'] ?? getenv('DB_USER') ?? null;
$pass = $_ENV['DB_PASS'] ?? $_SERVER['DB_PASS'] ?? getenv('DB_PASS') ?? null;
if (!$host || !$name || !$user || !$pass) {
 echo json_encode(['success' => false, 'message' => 'Database configuration error']);
 exit;
}

$pdo = new PDO(
 'mysql:host='.$host.';dbname='.$name.';charset=utf8mb4',
 $user,
 $pass,
 [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
);

$docs = $pdo->query("SELECT documentID AS id, `name`, url FROM `document` ORDER BY uploaded_at DESC")->fetchAll(PDO::FETCH_ASSOC);

echo json_encode(['success' => true, 'documents' => $docs, 'total' => count($docs)]);
?>

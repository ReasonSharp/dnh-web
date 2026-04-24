<?php
header('Content-Type: application/json; charset=utf-8');

session_start();
if (!isset($_SESSION['user_id'])) {
 http_response_code(401);
 echo json_encode(['success' => false, 'message' => 'Unauthorized']);
 exit;
}

$type = $_GET['type'] ?? '';
if (!in_array($type, ['news', 'announcement'])) {
 http_response_code(400);
 echo json_encode(['success' => false, 'message' => 'Invalid type']);
 exit;
}

$host = $_ENV['DB_HOST'] ?? $_SERVER['DB_HOST'] ?? getenv('DB_HOST') ?? null;
$name = $_ENV['DB_NAME'] ?? $_SERVER['DB_NAME'] ?? getenv('DB_NAME') ?? null;
$user = $_ENV['DB_USER'] ?? $_SERVER['DB_USER'] ?? getenv('DB_USER') ?? null;
$pass = $_ENV['DB_PASS'] ?? $_SERVER['DB_PASS'] ?? getenv('DB_PASS') ?? null;
if (!$host || !$name || !$user || !$pass) {
 http_response_code(500);
 echo json_encode(['success' => false, 'message' => 'Database configuration error']);
 exit;
}

$pdo = new PDO(
 'mysql:host='.$host.';dbname='.$name.';charset=utf8mb4',
 $user,
 $pass,
 [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
);

$table = $type === 'news' ? 'news' : 'announcement';
$idCol = $type === 'news' ? 'newsID' : 'announcementID';

$stmt = $pdo->query(
 "SELECT `$idCol` AS `id`, `date`, `blurb`, `imageURL`, `link`, `body` FROM `$table` ORDER BY `$idCol` DESC"
);
$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode(array_values($rows), JSON_UNESCAPED_UNICODE);
?>

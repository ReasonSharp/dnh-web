<?php
header('Content-Type: application/json; charset=utf-8');

session_start();
if (!isset($_SESSION['user_id'])) {
 http_response_code(401);
 echo json_encode(['success' => false, 'message' => 'Unauthorized']);
 exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
 http_response_code(405);
 echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
 exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$old_password = $input['old_password'] ?? '';
$new_password = $input['new_password'] ?? '';

if (empty($old_password) || empty($new_password)) {
 http_response_code(400);
 echo json_encode(['success' => false, 'message' => 'Missing old or new password']);
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

$stmt = $pdo->prepare("SELECT password_hash FROM user WHERE userID = ?");
$stmt->execute([$_SESSION['user_id']]);
$dbUser = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$dbUser || !password_verify($old_password, $dbUser['password_hash'])) {
 http_response_code(401);
 echo json_encode(['success' => false, 'message' => 'Invalid old password']);
 exit;
}

$new_hash = password_hash($new_password, PASSWORD_DEFAULT);

$stmt = $pdo->prepare("UPDATE user SET password_hash = ? WHERE userID = ?");
$stmt->execute([$new_hash, $_SESSION['user_id']]);

echo json_encode(['success' => true, 'message' => 'Password changed successfully']);
?>

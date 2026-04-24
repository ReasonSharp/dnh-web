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

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
 $stmt = $pdo->prepare("SELECT `username`, `name` FROM `user` WHERE `userID` = ?");
 $stmt->execute([$_SESSION['user_id']]);
 $row = $stmt->fetch(PDO::FETCH_ASSOC);
 echo json_encode([
  'success'  => true,
  'username' => $row['username'],
  'name'     => $row['name'] ?? $row['username'],
 ]);
 exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
 $input = json_decode(file_get_contents('php://input'), true);
 $newName = trim($input['name'] ?? '');
 if ($newName === '') {
  http_response_code(400);
  echo json_encode(['success' => false, 'message' => 'Name cannot be empty']);
  exit;
 }
 $stmt = $pdo->prepare("UPDATE `user` SET `name` = ? WHERE `userID` = ?");
 $stmt->execute([$newName, $_SESSION['user_id']]);
 echo json_encode(['success' => true, 'message' => 'Podaci uspješno ažurirani.']);
 exit;
}

http_response_code(405);
echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
?>

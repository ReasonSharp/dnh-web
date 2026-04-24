<?php
header('Content-Type: application/json; charset=utf-8');

session_start();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
 http_response_code(405);
 echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
 exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$username = $input['username'] ?? '';
$password = $input['password'] ?? '';

if (empty($username) || empty($password)) {
 http_response_code(400);
 echo json_encode(['success' => false, 'message' => 'Missing username or password']);
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

$stmt = $pdo->prepare("SELECT userID, password_hash FROM user WHERE username = ?");
$stmt->execute([$username]);
$dbUser = $stmt->fetch(PDO::FETCH_ASSOC);

if ($dbUser && password_verify($password, $dbUser['password_hash'])) {
 $_SESSION['user_id'] = $dbUser['userID'];
 echo json_encode(['success' => true]);
} else {
 http_response_code(401);
 echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
}
?>

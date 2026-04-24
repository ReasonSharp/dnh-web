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

$perPage = 10;
$page    = max(1, (int) ($_GET['page'] ?? 1));
$offset  = ($page - 1) * $perPage;

$total = (int) $pdo->query("SELECT COUNT(*) FROM `image`")->fetchColumn();

$stmt = $pdo->prepare("SELECT `imageID`, `url` FROM `image` ORDER BY `imageID` DESC LIMIT ? OFFSET ?");
$stmt->bindValue(1, $perPage, PDO::PARAM_INT);
$stmt->bindValue(2, $offset,  PDO::PARAM_INT);
$stmt->execute();
$images = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
 'success'  => true,
 'images'   => $images,
 'total'    => $total,
 'page'     => $page,
 'perPage'  => $perPage,
]);
?>

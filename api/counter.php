<?php
header('Content-Type: application/json; charset=utf-8');

$page = isset($_GET['page']) ? substr(trim($_GET['page']), 0, 255) : '/';

$ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
 $ip = trim(explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'])[0]);
}
if (!filter_var($ip, FILTER_VALIDATE_IP)) {
 $ip = '0.0.0.0';
}

$host = $_ENV['DB_HOST'] ?? $_SERVER['DB_HOST'] ?? getenv('DB_HOST') ?? null;
$name = $_ENV['DB_NAME'] ?? $_SERVER['DB_NAME'] ?? getenv('DB_NAME') ?? null;
$user = $_ENV['DB_USER'] ?? $_SERVER['DB_USER'] ?? getenv('DB_USER') ?? null;
$pass = $_ENV['DB_PASS'] ?? $_SERVER['DB_PASS'] ?? getenv('DB_PASS') ?? null;
if (!$host || !$name || !$user || !$pass) {
 http_response_code(500);
 echo json_encode(['success' => false, 'message' => 'Neispravno konfigurirana baza podataka.'], JSON_UNESCAPED_UNICODE);
 exit;
}

$pdo = new PDO(
 'mysql:host='.$host.';dbname='.$name.';charset=utf8mb4',
 $user,
 $pass,
 [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
);

$tz = new DateTimeZone('Europe/Zagreb');
$now = new DateTime('now', $tz);
$today = $now->format('Y-m-d');
$todayTime = $now->format('H:i:s');
$yesterday = (clone $now)->modify('-1 day')->format('Y-m-d');

$stmt = $pdo->prepare('SELECT 1 FROM `visitcount` WHERE `date` = ?');
$stmt->execute([$yesterday]);
if (!$stmt->fetch()) {
 $countStmt = $pdo->prepare('SELECT COUNT(*) FROM `visitlog` WHERE `date` = ?');
 $countStmt->execute([$yesterday]);
 $count = (int) $countStmt->fetchColumn();
 $pdo->prepare('INSERT IGNORE INTO `visitcount` (`date`, `count`) VALUES (?, ?)')
  ->execute([$yesterday, $count]);
}

$pdo->prepare('INSERT IGNORE INTO `visitlog` (`date`, `ip`, `time`, `landingPage`) VALUES (?, ?, ?, ?)')
 ->execute([$today, $ip, $todayTime, $page]);

echo json_encode(['success' => true], JSON_UNESCAPED_UNICODE);
exit;
?>

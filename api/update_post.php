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

$input    = json_decode(file_get_contents('php://input'), true);
$type     = $input['type']     ?? '';
$id       = (int) ($input['id'] ?? 0);
$blurb    = trim($input['blurb']    ?? '');
$imageURL = trim($input['imageURL'] ?? '');
$link     = trim($input['link']     ?? '') ?: null;
$title    = trim($input['title']    ?? '') ?: null;
$body     = trim($input['body']     ?? '') ?: null;
if ($body !== null) {
 $body = str_replace(['&nbsp;', "\xc2\xa0"], ' ', $body);
}

if (!in_array($type, ['news', 'announcement'])) {
 http_response_code(400);
 echo json_encode(['success' => false, 'message' => 'Invalid type']);
 exit;
}
if ($id <= 0 || $blurb === '' || $imageURL === '') {
 http_response_code(400);
 echo json_encode(['success' => false, 'message' => 'id, blurb and imageURL are required']);
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

$stmt = $pdo->prepare(
 "UPDATE `$table` SET `blurb` = ?, `imageURL` = ?, `link` = ?, `title` = ?, `body` = ? WHERE `$idCol` = ?"
);
$stmt->execute([$blurb, $imageURL, $link, $title, $body, $id]);

echo json_encode(['success' => true, 'message' => 'Promjene uspješno spremljene.']);
?>

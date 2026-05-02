<?php
header('Content-Type: application/json; charset=utf-8');

session_start();

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

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  $statutes = $pdo->query(
    "SELECT s.statuteID AS id, s.documentID, d.`name`, d.url, s.display_order, s.is_current 
     FROM `statute` s 
     JOIN `document` d ON s.documentID = d.documentID 
     ORDER BY s.display_order ASC"
  )->fetchAll(PDO::FETCH_ASSOC);

  if (isset($_SESSION['user_id'])) {
    echo json_encode(['success' => true, 'statutes' => $statutes]);
  } else {
    $current = null;
    $archive = [];
    foreach ($statutes as $s) {
      $entry = ['name' => $s['name'], 'url' => $s['url']];
      if ($s['is_current']) {
        $current = $entry;
      } else {
        $archive[] = $entry;
      }
    }
    echo json_encode(['current' => $current, 'archive' => $archive]);
  }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
  if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
  }

  $data = json_decode(file_get_contents('php://input'), true);
  $action = $data['action'] ?? '';

  if ($action === 'update') {
    $items = $data['items'] ?? [];
    $currentCount = count(array_filter($items, function($i) { return $i['is_current']; }));
    if ($currentCount !== 1) {
      echo json_encode(['success' => false, 'message' => 'Točno jedan mora biti trenutni.']);
      exit;
    }

    $pdo->exec("DELETE FROM `statute`");

    $stmt = $pdo->prepare("INSERT INTO `statute` (documentID, display_order, is_current) VALUES (?, ?, ?)");
    foreach ($items as $item) {
      $stmt->execute([$item['documentID'], $item['display_order'], $item['is_current'] ? 1 : 0]);
    }

    echo json_encode(['success' => true]);
  } else {
    echo json_encode(['success' => false, 'message' => 'Invalid action']);
  }
} else {
  http_response_code(405);
  echo json_encode(['success' => false, 'message' => 'Method not allowed']);
}
?>

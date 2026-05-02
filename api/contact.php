<?php
header('Content-Type: application/json; charset=utf-8');

function getDB(): PDO {
    $host = $_ENV['DB_HOST'] ?? $_SERVER['DB_HOST'] ?? getenv('DB_HOST') ?? null;
    $name = $_ENV['DB_NAME'] ?? $_SERVER['DB_NAME'] ?? getenv('DB_NAME') ?? null;
    $user = $_ENV['DB_USER'] ?? $_SERVER['DB_USER'] ?? getenv('DB_USER') ?? null;
    $pass = $_ENV['DB_PASS'] ?? $_SERVER['DB_PASS'] ?? getenv('DB_PASS') ?? null;
    if (!$host || !$name || !$user || !$pass) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Neispravno konfigurirana baza podataka.'], JSON_UNESCAPED_UNICODE);
        exit;
    }
    return new PDO(
        'mysql:host='.$host.';dbname='.$name.';charset=utf8mb4',
        $user, $pass,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $pdo = getDB();

    $cats = $pdo->query(
        "SELECT `id`, `title`, `display_order` FROM `contact_category` ORDER BY `display_order` ASC"
    )->fetchAll(PDO::FETCH_ASSOC);

    $stmt = $pdo->prepare(
        "SELECT `id`, `value`, `link`, `display_order` FROM `contact_item` WHERE `category_id` = ? ORDER BY `display_order` ASC"
    );

    $result = [];
    foreach ($cats as $cat) {
        $stmt->execute([$cat['id']]);
        $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $result[] = [
            'id'            => (int)$cat['id'],
            'title'         => $cat['title'],
            'display_order' => (int)$cat['display_order'],
            'items'         => array_map(fn($i) => [
                'id'            => (int)$i['id'],
                'value'         => $i['value'],
                'link'          => $i['link'],
                'display_order' => (int)$i['display_order'],
            ], $items),
        ];
    }

    echo json_encode(['success' => true, 'categories' => $result], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($method === 'POST') {
    session_start();
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Unauthorized']);
        exit;
    }

    $body = json_decode(file_get_contents('php://input'), true);
    if (!isset($body['categories']) || !is_array($body['categories'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Neispravan zahtjev.'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $pdo = getDB();
    $pdo->beginTransaction();

    $pdo->exec("DELETE FROM `contact_category`");

    $stmtCat  = $pdo->prepare("INSERT INTO `contact_category` (`title`, `display_order`) VALUES (?, ?)");
    $stmtItem = $pdo->prepare("INSERT INTO `contact_item` (`category_id`, `value`, `link`, `display_order`) VALUES (?, ?, ?, ?)");

    foreach ($body['categories'] as $ci => $cat) {
        $title = trim($cat['title'] ?? '');
        $stmtCat->execute([$title, $ci]);
        $catId = (int)$pdo->lastInsertId();

        foreach (($cat['items'] ?? []) as $ii => $item) {
            $value = trim($item['value'] ?? '');
            $link  = isset($item['link']) && $item['link'] !== '' ? trim($item['link']) : null;
            $stmtItem->execute([$catId, $value, $link, $ii]);
        }
    }

    $pdo->commit();
    echo json_encode(['success' => true, 'message' => 'Kontakt podaci uspješno spremljeni.'], JSON_UNESCAPED_UNICODE);
    exit;
}

http_response_code(405);
echo json_encode(['success' => false, 'message' => 'Metoda nije podržana.'], JSON_UNESCAPED_UNICODE);

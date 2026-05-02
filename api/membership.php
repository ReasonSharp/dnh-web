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
    if (isset($_GET['all'])) {
        session_start();
        if (!isset($_SESSION['user_id'])) {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Unauthorized']);
            exit;
        }
        $pdo = getDB();
        $stmt = $pdo->query("SELECT `year` FROM `membership_config` ORDER BY `year` DESC");
        $years = $stmt->fetchAll(PDO::FETCH_COLUMN);
        echo json_encode(['success' => true, 'years' => array_map('intval', $years)], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $year = isset($_GET['year']) ? (int)$_GET['year'] : (int)date('Y');
    $pdo = getDB();
    $stmt = $pdo->prepare(
        "SELECT mc.*, d.url AS admission_form_url
         FROM `membership_config` mc
         LEFT JOIN `document` d ON mc.admission_form_document_id = d.id
         WHERE mc.year = ?"
    );
    $stmt->execute([$year]);
    $config = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$config) {
        echo json_encode(['success' => false, 'message' => 'Konfiguracija nije pronađena.'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $stmt = $pdo->prepare(
        "SELECT `id`, `name`, `price`, `discounted_price`, `display_order`
         FROM `membership_category` WHERE `config_id` = ? ORDER BY `display_order` ASC"
    );
    $stmt->execute([$config['id']]);
    $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'year' => (int)$config['year'],
        'iban' => $config['iban'],
        'swift' => $config['swift'],
        'enrollment_fee_enabled' => (bool)(int)$config['enrollment_fee_enabled'],
        'enrollment_fee' => (float)$config['enrollment_fee'],
        'enrollment_fee_discounted' => $config['enrollment_fee_discounted'] !== null ? (float)$config['enrollment_fee_discounted'] : null,
        'admission_form_url' => $config['admission_form_url'] ?? null,
        'admission_form_document_id' => $config['admission_form_document_id'] !== null ? (int)$config['admission_form_document_id'] : null,
        'categories' => array_map(fn($c) => [
            'id' => (int)$c['id'],
            'name' => $c['name'],
            'price' => (float)$c['price'],
            'discounted_price' => $c['discounted_price'] !== null ? (float)$c['discounted_price'] : null,
            'display_order' => (int)$c['display_order'],
        ], $categories),
    ], JSON_UNESCAPED_UNICODE);
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
    if (!$body) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Neispravan zahtjev.'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $year = isset($body['year']) ? (int)$body['year'] : 0;
    if ($year < 2000 || $year > 2100) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Neispravna godina.'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $iban = trim($body['iban'] ?? '');
    $swift = trim($body['swift'] ?? '');
    $enrollmentEnabled = !empty($body['enrollment_fee_enabled']);
    $enrollmentFee = (float)($body['enrollment_fee'] ?? 0);
    $enrollmentDiscounted = isset($body['enrollment_fee_discounted']) && $body['enrollment_fee_discounted'] !== null && $body['enrollment_fee_discounted'] !== ''
        ? (float)$body['enrollment_fee_discounted']
        : null;
    $admissionDocId = isset($body['admission_form_document_id']) && $body['admission_form_document_id'] !== null
        ? (int)$body['admission_form_document_id']
        : null;
    $categories = $body['categories'] ?? [];

    if ($enrollmentEnabled && $enrollmentDiscounted !== null && $enrollmentDiscounted >= $enrollmentFee) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Snižena cijena upisnine mora biti manja od pune cijene.'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    foreach ($categories as $cat) {
        $price = (float)($cat['price'] ?? 0);
        $disc = isset($cat['discounted_price']) && $cat['discounted_price'] !== null && $cat['discounted_price'] !== ''
            ? (float)$cat['discounted_price']
            : null;
        if ($disc !== null && $disc >= $price) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Snižena cijena mora biti manja od pune cijene za kategoriju "'.htmlspecialchars($cat['name'] ?? '').'".'], JSON_UNESCAPED_UNICODE);
            exit;
        }
    }

    $pdo = getDB();
    $pdo->beginTransaction();

    $stmt = $pdo->prepare(
        "INSERT INTO `membership_config` (`year`, `iban`, `swift`, `enrollment_fee_enabled`, `enrollment_fee`, `enrollment_fee_discounted`, `admission_form_document_id`)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           `iban` = VALUES(`iban`),
           `swift` = VALUES(`swift`),
           `enrollment_fee_enabled` = VALUES(`enrollment_fee_enabled`),
           `enrollment_fee` = VALUES(`enrollment_fee`),
           `enrollment_fee_discounted` = VALUES(`enrollment_fee_discounted`),
           `admission_form_document_id` = VALUES(`admission_form_document_id`)"
    );
    $stmt->execute([$year, $iban, $swift, $enrollmentEnabled ? 1 : 0, $enrollmentFee, $enrollmentDiscounted, $admissionDocId]);

    $stmt = $pdo->prepare("SELECT `id` FROM `membership_config` WHERE `year` = ?");
    $stmt->execute([$year]);
    $configId = (int)$stmt->fetchColumn();

    $pdo->prepare("DELETE FROM `membership_category` WHERE `config_id` = ?")->execute([$configId]);

    foreach ($categories as $i => $cat) {
        $price = (float)($cat['price'] ?? 0);
        $disc = isset($cat['discounted_price']) && $cat['discounted_price'] !== null && $cat['discounted_price'] !== ''
            ? (float)$cat['discounted_price']
            : null;
        $name = trim($cat['name'] ?? '');
        $stmt = $pdo->prepare(
            "INSERT INTO `membership_category` (`config_id`, `name`, `price`, `discounted_price`, `display_order`) VALUES (?, ?, ?, ?, ?)"
        );
        $stmt->execute([$configId, $name, $price, $disc, $i]);
    }

    $pdo->commit();
    echo json_encode(['success' => true, 'message' => 'Konfiguracija uspješno spremljena.'], JSON_UNESCAPED_UNICODE);
    exit;
}

http_response_code(405);
echo json_encode(['success' => false, 'message' => 'Metoda nije podržana.'], JSON_UNESCAPED_UNICODE);

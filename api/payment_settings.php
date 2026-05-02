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
    $stmt = $pdo->query(
        "SELECT ps.iban, ps.swift, ps.admission_form_document_id, d.url AS admission_form_url
         FROM `payment_settings` ps
         LEFT JOIN `document` d ON ps.admission_form_document_id = d.documentID
         LIMIT 1"
    );
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$row) {
        echo json_encode([
            'success' => true,
            'iban' => '',
            'swift' => '',
            'admission_form_url' => null,
            'admission_form_document_id' => null,
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }
    echo json_encode([
        'success' => true,
        'iban' => $row['iban'],
        'swift' => $row['swift'],
        'admission_form_url' => $row['admission_form_url'] ?? null,
        'admission_form_document_id' => $row['admission_form_document_id'] !== null ? (int)$row['admission_form_document_id'] : null,
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

    $iban = trim($body['iban'] ?? '');
    $swift = trim($body['swift'] ?? '');
    $admissionDocId = isset($body['admission_form_document_id']) && $body['admission_form_document_id'] !== null
        ? (int)$body['admission_form_document_id']
        : null;

    $pdo = getDB();
    $pdo->prepare(
        "INSERT INTO `payment_settings` (`id`, `iban`, `swift`, `admission_form_document_id`)
         VALUES (1, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           `iban` = VALUES(`iban`),
           `swift` = VALUES(`swift`),
           `admission_form_document_id` = VALUES(`admission_form_document_id`)"
    )->execute([$iban, $swift, $admissionDocId]);

    echo json_encode(['success' => true, 'message' => 'Podaci za uplatu uspješno spremljeni.'], JSON_UNESCAPED_UNICODE);
    exit;
}

http_response_code(405);
echo json_encode(['success' => false, 'message' => 'Metoda nije podržana.'], JSON_UNESCAPED_UNICODE);

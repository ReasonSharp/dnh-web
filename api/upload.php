<?php
header('Content-Type: application/json; charset=utf-8');

session_start();
if (!isset($_SESSION['user_id'])) {
 http_response_code(401);
 echo json_encode(['success' => false, 'message' => 'Unauthorized']);
 exit;
}

$webRoot            = dirname(__DIR__);
$uploadDirImages    = $webRoot . '/images/';
$uploadDirDocuments = $webRoot . '/documents/';

$maxFileSize = 10 * 1024 * 1024;

$allowedImages    = ['image/jpeg', 'image/png'];
$allowedDocuments = ['application/pdf'];

if ($_SERVER['REQUEST_METHOD'] !== 'POST' || empty($_FILES['file'])) {
 echo json_encode(['success' => false, 'message' => 'No file uploaded']);
 exit;
}

$file = $_FILES['file'];
$type = $_POST['type'] ?? 'document';

if ($file['error'] !== UPLOAD_ERR_OK) {
 echo json_encode(['success' => false, 'message' => 'Upload error']);
 exit;
}
if ($file['size'] > $maxFileSize) {
 echo json_encode(['success' => false, 'message' => 'File too large (max 10MB)']);
 exit;
}

$mime = mime_content_type($file['tmp_name']);
$isImage = in_array($mime, $allowedImages);

if ($type === 'image' && !$isImage) {
 echo json_encode(['success' => false, 'message' => 'Not a valid image']);
 exit;
}
if ($type !== 'image' && !in_array($mime, $allowedDocuments)) {
 echo json_encode(['success' => false, 'message' => 'Not a supported document']);
 exit;
}

$targetDir = ($type === 'image') ? $uploadDirImages : $uploadDirDocuments;

$ext = pathinfo($file['name'], PATHINFO_EXTENSION);
$newFilename = bin2hex(random_bytes(16)) . '.' . strtolower($ext);
$targetPath = $targetDir . $newFilename;

if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
 echo json_encode(['success' => false, 'message' => 'Failed to save file']);
 exit;
}

$publicUrl = ($type === 'image' ? 'images/' : 'documents/') . $newFilename;

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

$name = trim($_POST['name'] ?? '');
if (empty($name)) {
 echo json_encode(['success' => false, 'message' => 'Naziv je obavezan.']);
 exit;
}

if ($type === 'image') {
 $stmt = $pdo->prepare("INSERT INTO `image` (`url`) VALUES (?)");
 $stmt->execute([$publicUrl]);
} else {
 $stmt = $pdo->prepare("INSERT INTO `document` (`url`, `original_filename`, `name`) VALUES (?, ?, ?)");
 $stmt->execute([$publicUrl, $file['name'], $name]);
}

echo json_encode([
 'success'  => true,
 'message'  => 'File uploaded',
 'filename' => $newFilename,
 'url'      => $publicUrl
]);
?>

<?php
require_once __DIR__ . '/config.php';

// CORS headers
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: ' . ALLOWED_ORIGIN);
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Simple JWT implementation (base64-based HMAC)
function createToken(string $userId, string $email): string {
    $header = base64url_encode(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
    $payload = base64url_encode(json_encode([
        'sub' => $userId,
        'email' => $email,
        'iat' => time(),
        'exp' => time() + 86400 * 7, // 7 days
    ]));
    $signature = base64url_encode(hash_hmac('sha256', "$header.$payload", JWT_SECRET, true));
    return "$header.$payload.$signature";
}

function verifyToken(string $token): ?array {
    $parts = explode('.', $token);
    if (count($parts) !== 3) return null;
    
    [$header, $payload, $signature] = $parts;
    $expectedSig = base64url_encode(hash_hmac('sha256', "$header.$payload", JWT_SECRET, true));
    
    if (!hash_equals($expectedSig, $signature)) return null;
    
    $data = json_decode(base64url_decode($payload), true);
    if (!$data || ($data['exp'] ?? 0) < time()) return null;
    
    return $data;
}

function requireAuth(): array {
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (!preg_match('/^Bearer\s+(.+)$/i', $authHeader, $matches)) {
        http_response_code(401);
        echo json_encode(['error' => 'Требуется авторизация']);
        exit;
    }
    $user = verifyToken($matches[1]);
    if (!$user) {
        http_response_code(401);
        echo json_encode(['error' => 'Невалидный токен']);
        exit;
    }
    return $user;
}

function base64url_encode(string $data): string {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function base64url_decode(string $data): string {
    return base64_decode(strtr($data, '-_', '+/') . str_repeat('=', 3 - (3 + strlen($data)) % 4));
}

function jsonInput(): array {
    return json_decode(file_get_contents('php://input'), true) ?? [];
}

function jsonResponse(mixed $data, int $code = 200): void {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

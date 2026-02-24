<?php
/**
 * PHP-обёртка для ИИ-чата через OpenAI API.
 * 
 * Endpoint: POST /api/ai-chat.php
 * Body: { "messages": [{ "role": "user", "content": "..." }] }
 * 
 * Требуется: OPENAI_API_KEY в config.php
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/middleware.php';

// CORS
header('Access-Control-Allow-Origin: ' . ALLOWED_ORIGIN);
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Проверка авторизации
$user = authenticate();
if (!$user) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

// Получение тела запроса
$input = json_decode(file_get_contents('php://input'), true);
$messages = $input['messages'] ?? [];

if (empty($messages) || !is_array($messages)) {
    http_response_code(400);
    echo json_encode(['error' => 'Messages array is required']);
    exit;
}

// Системный промпт
$systemMessage = [
    'role' => 'system',
    'content' => 'Ты — ИИ-ассистент компании КИБЕРВИЛЛ. Ты помогаешь пользователям с вопросами о:
- Мониторинге строительства и промышленных объектов
- Платёжных системах и финансовой автоматизации
- Цифровизации образования и VR-обучении
- Мониторинге территорий и городской среды
- Станкостроении и импортозамещении
- Разработке программного обеспечения

Отвечай кратко, по делу, на русском языке. Будь дружелюбным и профессиональным.
Если вопрос не связан с деятельностью компании, всё равно постарайся помочь.',
];

// Запрос к OpenAI API
$apiKey = defined('OPENAI_API_KEY') ? OPENAI_API_KEY : null;
if (!$apiKey) {
    http_response_code(500);
    echo json_encode(['error' => 'OPENAI_API_KEY not configured']);
    exit;
}

$payload = json_encode([
    'model' => defined('OPENAI_MODEL') ? OPENAI_MODEL : 'gpt-4o-mini',
    'messages' => array_merge([$systemMessage], $messages),
    'max_tokens' => 2000,
    'temperature' => 0.7,
]);

$ch = curl_init('https://api.openai.com/v1/chat/completions');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $payload,
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $apiKey,
    ],
    CURLOPT_TIMEOUT => 60,
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

if ($curlError) {
    http_response_code(500);
    echo json_encode(['error' => 'Ошибка соединения с OpenAI: ' . $curlError]);
    exit;
}

if ($httpCode !== 200) {
    $errorData = json_decode($response, true);
    $errorMsg = $errorData['error']['message'] ?? 'Unknown OpenAI error';
    http_response_code($httpCode === 429 ? 429 : 500);
    echo json_encode(['error' => $errorMsg]);
    exit;
}

$data = json_decode($response, true);
$content = $data['choices'][0]['message']['content'] ?? null;

if (!$content) {
    http_response_code(500);
    echo json_encode(['error' => 'No content in AI response']);
    exit;
}

// Сохраняем в историю
try {
    $pdo = getDB();
    $userMessage = end($messages)['content'] ?? '';
    $stmt = $pdo->prepare('INSERT INTO chat_history (user_id, user_message, assistant_message) VALUES (?, ?, ?)');
    $stmt->execute([$user['id'], $userMessage, $content]);
} catch (Exception $e) {
    // Не блокируем ответ при ошибке сохранения
    error_log('Chat history save error: ' . $e->getMessage());
}

echo json_encode(['content' => $content]);

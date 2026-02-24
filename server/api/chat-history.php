<?php
require_once __DIR__ . '/middleware.php';

$method = $_SERVER['REQUEST_METHOD'];
$user = requireAuth();
$userId = $user['sub'];

if ($method === 'GET') {
    $db = getDB();
    $stmt = $db->prepare('SELECT id, user_message, assistant_message, created_at FROM chat_history WHERE user_id = ? ORDER BY created_at DESC LIMIT 100');
    $stmt->execute([$userId]);
    jsonResponse($stmt->fetchAll());
}

if ($method === 'POST') {
    $input = jsonInput();
    $userMsg = trim($input['user_message'] ?? '');
    $assistantMsg = trim($input['assistant_message'] ?? '');

    if (!$userMsg) {
        jsonResponse(['error' => 'Сообщение не может быть пустым'], 400);
    }

    $id = bin2hex(random_bytes(16));
    $db = getDB();
    $stmt = $db->prepare('INSERT INTO chat_history (id, user_id, user_message, assistant_message, created_at) VALUES (?, ?, ?, ?, NOW())');
    $stmt->execute([$id, $userId, $userMsg, $assistantMsg]);

    jsonResponse(['id' => $id, 'success' => true]);
}

if ($method === 'DELETE') {
    $id = $_GET['id'] ?? '';
    if (!$id) jsonResponse(['error' => 'ID не указан'], 400);

    $db = getDB();
    $stmt = $db->prepare('DELETE FROM chat_history WHERE id = ? AND user_id = ?');
    $stmt->execute([$id, $userId]);

    jsonResponse(['success' => true]);
}

jsonResponse(['error' => 'Метод не поддерживается'], 405);

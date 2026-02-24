<?php
require_once __DIR__ . '/middleware.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

if ($method === 'POST' && $action === 'register') {
    $input = jsonInput();
    $email = trim($input['email'] ?? '');
    $password = $input['password'] ?? '';

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        jsonResponse(['error' => 'Некорректный email'], 400);
    }
    if (strlen($password) < 6) {
        jsonResponse(['error' => 'Пароль должен быть не менее 6 символов'], 400);
    }

    $db = getDB();
    
    // Check if user exists
    $stmt = $db->prepare('SELECT id FROM users WHERE email = ?');
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        jsonResponse(['error' => 'Пользователь с таким email уже существует'], 409);
    }

    $id = bin2hex(random_bytes(16));
    $hash = password_hash($password, PASSWORD_BCRYPT);

    $stmt = $db->prepare('INSERT INTO users (id, email, password_hash, created_at) VALUES (?, ?, ?, NOW())');
    $stmt->execute([$id, $email, $hash]);

    $token = createToken($id, $email);
    jsonResponse([
        'token' => $token,
        'user' => ['id' => $id, 'email' => $email],
    ]);
}

if ($method === 'POST' && $action === 'login') {
    $input = jsonInput();
    $email = trim($input['email'] ?? '');
    $password = $input['password'] ?? '';

    $db = getDB();
    $stmt = $db->prepare('SELECT id, email, password_hash FROM users WHERE email = ?');
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password_hash'])) {
        jsonResponse(['error' => 'Неверный email или пароль'], 401);
    }

    $token = createToken($user['id'], $user['email']);
    jsonResponse([
        'token' => $token,
        'user' => ['id' => $user['id'], 'email' => $user['email']],
    ]);
}

if ($method === 'GET' && $action === 'session') {
    $user = requireAuth();
    jsonResponse(['user' => ['id' => $user['sub'], 'email' => $user['email']]]);
}

jsonResponse(['error' => 'Неизвестное действие'], 404);

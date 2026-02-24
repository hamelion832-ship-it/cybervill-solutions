<?php
// Конфигурация базы данных MySQL
define('DB_HOST', 'localhost');
define('DB_NAME', 'u3131876_kyberwheel_db');
define('DB_USER', 'u3131876_admin');     // Замените на ваш логин
define('DB_PASS', 'YOUR_PASSWORD');       // Замените на ваш пароль
define('DB_CHARSET', 'utf8mb4');

// Секретный ключ для JWT-токенов
define('JWT_SECRET', 'CHANGE_THIS_TO_A_RANDOM_STRING_64_CHARS');

// CORS — укажите домен вашего фронтенда
define('ALLOWED_ORIGIN', '*'); // В продакшене замените на конкретный домен

// OpenAI API
define('OPENAI_API_KEY', 'sk-YOUR_OPENAI_API_KEY'); // Замените на ваш ключ OpenAI
define('OPENAI_MODEL', 'gpt-4o-mini');               // Можно заменить на gpt-4o, gpt-3.5-turbo и т.д.

function getDB(): PDO {
    static $pdo = null;
    if ($pdo === null) {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
    }
    return $pdo;
}

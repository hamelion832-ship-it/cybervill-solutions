# Инструкция по развёртыванию на своём сервере

## 1. Подготовка базы данных

Откройте phpMyAdmin и выполните SQL из файла `server/api/setup.sql`.
Это создаст таблицы `users` и `chat_history`.

## 2. Настройка PHP API

1. Скопируйте папку `server/api/` на ваш хостинг (например, в `/api/`)
2. Отредактируйте `config.php`:
   - `DB_NAME` — имя вашей базы данных
   - `DB_USER` — логин MySQL
   - `DB_PASS` — пароль MySQL
   - `JWT_SECRET` — случайная строка 64+ символов
   - `ALLOWED_ORIGIN` — домен вашего фронтенда

## 3. Сборка фронтенда

```bash
git clone https://github.com/ваш-аккаунт/ваш-проект.git
cd ваш-проект
npm install
npm run build
```

Папку `dist/` загрузите на сервер (корень сайта или поддомен).

## 4. Настройка Nginx

```nginx
server {
    listen 80;
    server_name ваш-домен.ru;
    root /var/www/site/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        alias /var/www/site/api/;
        fastcgi_pass unix:/run/php/php8.1-fpm.sock;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $request_filename;
    }
}
```

## 5. Переключение с Lovable Cloud на PHP API

Откройте `src/lib/php-api.ts` и замените `API_BASE_URL` на URL вашего API.

Затем замените импорты в компонентах:
- Вместо `import { supabase } from "@/integrations/supabase/client"` 
- Используйте `import { phpAuth, phpChatHistory } from "@/lib/php-api"`

## 6. HTTPS

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d ваш-домен.ru
```

## Структура файлов на сервере

```
/var/www/site/
├── dist/           ← собранный фронтенд
│   ├── index.html
│   ├── assets/
│   └── ...
└── api/            ← PHP API
    ├── config.php
    ├── middleware.php
    ├── auth.php
    └── chat-history.php
```

## Важно

- ИИ-функции (чат, генератор ТЗ) требуют API-ключ LLM-провайдера (OpenAI, Google AI и т.д.)
- Текущая версия приложения работает через Lovable Cloud — для полного переноса нужно заменить вызовы supabase на php-api

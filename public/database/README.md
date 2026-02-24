# База данных КИБЕРВИЛЛ — Инструкция по развёртыванию

## Структура файлов

| Файл | Описание |
|------|----------|
| `schema.sql` | Полная схема БД + начальные данные пользователей |
| `chat-history.json` | История запросов к ИИ (экспорт) |
| `README.md` | Эта инструкция |

## Развёртывание на своём сервере

### 1. Установите PostgreSQL 15+

```bash
sudo apt update && sudo apt install postgresql-15
```

### 2. Создайте базу данных

```bash
sudo -u postgres createdb cyberville
```

### 3. Импортируйте схему

```bash
sudo -u postgres psql cyberville < schema.sql
```

### 4. Импортируйте историю чата

Используйте скрипт или вручную вставьте данные из `chat-history.json`.

### 5. Обновите пароли пользователей

В `schema.sql` пароли установлены как `CHANGE_ME`. Обновите их:

```sql
UPDATE public.users
SET encrypted_password = crypt('новый_пароль', gen_salt('bf'))
WHERE email = 'danilr219@gmail.com';
```

### 6. Обновите переменные окружения в `.env`

Укажите подключение к вашей БД вместо Lovable Cloud:

```
VITE_SUPABASE_URL=https://your-server.com
VITE_SUPABASE_PUBLISHABLE_KEY=your_key
```

## Текущие данные

- **Пользователей:** 3
- **Записей истории чата:** 9
- **Дата экспорта:** 2026-02-24

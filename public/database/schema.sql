-- ============================================
-- КИБЕРВИЛЛ — Схема базы данных для селф-хостинга
-- Дубликат структуры Lovable Cloud
-- Дата экспорта: 2026-02-24
-- ============================================

-- Расширения
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- Таблица пользователей (замена auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE,
  phone TEXT UNIQUE,
  encrypted_password TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_sign_in_at TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT true
);

CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_phone ON public.users(phone);

-- ============================================
-- Таблица OTP-кодов
-- ============================================
CREATE TABLE IF NOT EXISTS public.otp_codes (
  phone TEXT NOT NULL PRIMARY KEY,
  code TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- Таблица истории чата с ИИ
-- ============================================
CREATE TABLE IF NOT EXISTS public.chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  user_message TEXT NOT NULL,
  assistant_message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_chat_history_user_id ON public.chat_history(user_id);
CREATE INDEX idx_chat_history_created_at ON public.chat_history(created_at DESC);

-- ============================================
-- Начальные данные: пользователи
-- ============================================
INSERT INTO public.users (id, email, encrypted_password, created_at, last_sign_in_at) VALUES
  ('4b6f9220-0f09-43b9-8b6e-013ee3ce5d12', 'danilr219@gmail.com', crypt('CHANGE_ME', gen_salt('bf')), '2026-02-24 10:02:59.480852+00', '2026-02-24 16:22:10.268837+00'),
  ('be4e417d-5e69-4cab-83dd-b8f41535aed1', 'hamelion832@gmail.com', crypt('CHANGE_ME', gen_salt('bf')), '2026-02-24 10:16:05.489561+00', '2026-02-24 16:42:01.541966+00'),
  ('df3a5082-ffd6-4842-8b59-25a421198ced', 'danilred100@gmail.com', crypt('CHANGE_ME', gen_salt('bf')), '2026-02-24 15:54:37.70015+00', '2026-02-24 15:54:50.552241+00')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- Примечание: история чата экспортируется отдельно
-- через /database/chat-history.json
-- ============================================

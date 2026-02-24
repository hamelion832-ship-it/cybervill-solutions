-- Выполните этот SQL в phpMyAdmin для создания таблиц

CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(32) NOT NULL PRIMARY KEY,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `chat_history` (
  `id` VARCHAR(32) NOT NULL PRIMARY KEY,
  `user_id` VARCHAR(32) NOT NULL,
  `user_message` TEXT NOT NULL,
  `assistant_message` TEXT NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_chat_user ON chat_history(user_id);
CREATE INDEX idx_chat_date ON chat_history(created_at);

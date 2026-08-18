-- ────────────────────────────────────────────────
--  VetCare – Schema MySQL
--  Ruleaza: mysql -u root -p < vetcare_schema.sql
-- ────────────────────────────────────────────────

CREATE DATABASE IF NOT EXISTS `vetcare`
  /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */;
USE `vetcare`;

-- ── Users ──
DROP TABLE IF EXISTS `appointments`;
DROP TABLE IF EXISTS `contact_messages`;
DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id`        VARCHAR(36)   NOT NULL,
  `email`     VARCHAR(255)  NOT NULL,
  `password`  VARCHAR(255)  NOT NULL,
  `name`      VARCHAR(255)           DEFAULT '',
  `role`      ENUM('user','admin')   DEFAULT 'user',
  `createdAt` DATETIME               DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ── Appointments ──
CREATE TABLE `appointments` (
  `id`         VARCHAR(36)  NOT NULL,
  `userId`     VARCHAR(36)           DEFAULT NULL,
  `date`       DATETIME              DEFAULT NULL,
  `service`    VARCHAR(255)          DEFAULT NULL,
  `animalType` VARCHAR(255)          DEFAULT '',
  `message`    VARCHAR(1000)         DEFAULT '',
  `status`     ENUM('pending','confirmed','cancelled') DEFAULT 'pending',
  `createdAt`  DATETIME              DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `date_idx` (`date`),
  CONSTRAINT `appointments_ibfk_1`
    FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ── Contact messages ──
CREATE TABLE `contact_messages` (
  `id`         VARCHAR(36)   NOT NULL,
  `firstName`  VARCHAR(100)  NOT NULL,
  `lastName`   VARCHAR(100)  NOT NULL,
  `email`      VARCHAR(255)  NOT NULL,
  `phone`      VARCHAR(30)            DEFAULT '',
  `animalType` VARCHAR(50)            DEFAULT '',
  `subject`    VARCHAR(200)  NOT NULL,
  `message`    VARCHAR(2000) NOT NULL,
  `read`       TINYINT(1)             DEFAULT 0,
  `createdAt`  DATETIME               DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `email_idx` (`email`),
  KEY `read_idx`  (`read`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

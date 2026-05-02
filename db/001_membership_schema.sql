CREATE TABLE IF NOT EXISTS `membership_config` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `year` INT NOT NULL UNIQUE,
  `iban` VARCHAR(40) NOT NULL DEFAULT '',
  `swift` VARCHAR(20) NOT NULL DEFAULT '',
  `enrollment_fee_enabled` TINYINT(1) NOT NULL DEFAULT 0,
  `enrollment_fee` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `enrollment_fee_discounted` DECIMAL(10,2) NULL DEFAULT NULL,
  `admission_form_document_id` INT UNSIGNED NULL DEFAULT NULL,
  FOREIGN KEY (`admission_form_document_id`) REFERENCES `document` (`documentID`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_croatian_ci;

CREATE TABLE IF NOT EXISTS `membership_category` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `config_id` INT UNSIGNED NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `discounted_price` DECIMAL(10,2) NULL DEFAULT NULL,
  `display_order` INT NOT NULL DEFAULT 0,
  FOREIGN KEY (`config_id`) REFERENCES `membership_config` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_croatian_ci;

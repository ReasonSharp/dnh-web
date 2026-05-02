CREATE TABLE IF NOT EXISTS `payment_settings` (
  `id` INT UNSIGNED NOT NULL DEFAULT 1 PRIMARY KEY,
  `iban` VARCHAR(40) NOT NULL DEFAULT '',
  `swift` VARCHAR(20) NOT NULL DEFAULT '',
  `admission_form_document_id` INT UNSIGNED NULL DEFAULT NULL,
  FOREIGN KEY (`admission_form_document_id`) REFERENCES `document` (`documentID`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_croatian_ci;

INSERT IGNORE INTO `payment_settings` (`id`, `iban`, `swift`) VALUES (1, '', '');

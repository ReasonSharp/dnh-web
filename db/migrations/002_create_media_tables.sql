CREATE TABLE IF NOT EXISTS `image` (
  `imageID`     INT AUTO_INCREMENT PRIMARY KEY,
  `url`         TEXT          NOT NULL,
  `uploaded_at` TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `document` (
  `documentID`        INT AUTO_INCREMENT PRIMARY KEY,
  `url`               TEXT          NOT NULL,
  `original_filename` VARCHAR(255)  NOT NULL,
  `uploaded_at`       TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

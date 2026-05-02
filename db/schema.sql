CREATE TABLE `news` (
 `newsID` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
 `date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
 `blurb` TEXT CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_croatian_ci' NOT NULL,
 `imageURL` TEXT CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_croatian_ci' NOT NULL,
 `link` TEXT CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_croatian_ci' DEFAULT NULL,
 `author` TEXT CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_croatian_ci' DEFAULT NULL,
 `body` LONGTEXT CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_croatian_ci' DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET 'utf8mb4' COLLATE 'utf8mb4_croatian_ci';

CREATE TABLE `announcement` (
 `announcementID` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
 `date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
 `blurb` TEXT CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_croatian_ci' NOT NULL,
 `imageURL` TEXT CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_croatian_ci' NOT NULL,
 `link` TEXT CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_croatian_ci' DEFAULT NULL,
 `author` TEXT CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_croatian_ci' DEFAULT NULL,
 `body` LONGTEXT CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_croatian_ci' DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET 'utf8mb4' COLLATE 'utf8mb4_croatian_ci';

CREATE TABLE `visitlog` (
 `date` DATE NOT NULL,
 `ip` VARCHAR(45) NOT NULL,
 `time` TIME NOT NULL,
 `landingPage` TEXT NOT NULL DEFAULT '/',
 PRIMARY KEY (`date`, `ip`)
) ENGINE=InnoDB DEFAULT CHARSET 'utf8mb4' COLLATE 'utf8mb4_croatian_ci';
 
CREATE TABLE `visitcount` (
 `date` DATE NOT NULL PRIMARY KEY,
 `count` INT UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET 'utf8mb4' COLLATE 'utf8mb4_croatian_ci';

CREATE TABLE `user` (
 `userID` INT NOT NULL AUTO_INCREMENT,
 `username` VARCHAR(255) NOT NULL,
 `password_hash` VARCHAR(255) NOT NULL,
 `name` TEXT CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_croatian_ci' NULL,
 PRIMARY KEY (`userID`),
 UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET 'utf8mb4' COLLATE 'utf8mb4_croatian_ci';

CREATE TABLE IF NOT EXISTS `image` (
 `imageID` INT AUTO_INCREMENT PRIMARY KEY,
 `url` TEXT NOT NULL,
 `uploaded_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET 'utf8mb4' COLLATE 'utf8mb4_croatian_ci';

CREATE TABLE IF NOT EXISTS `document` (
 `documentID` INT AUTO_INCREMENT PRIMARY KEY,
 `url` TEXT NOT NULL,
 `original_filename` TEXT NOT NULL,
 `name` TEXT NOT NULL,
 `uploaded_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET 'utf8mb4' COLLATE 'utf8mb4_croatian_ci';

CREATE TABLE IF NOT EXISTS `statute` (
 `statuteID` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
 `documentID` INT UNSIGNED NOT NULL,
 `display_order` INT NOT NULL DEFAULT 0,
 `is_current` TINYINT(1) NOT NULL DEFAULT 0,
 KEY `display_order` (`display_order`),
 FOREIGN KEY (`documentID`) REFERENCES `document` (`documentID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET 'utf8mb4' COLLATE 'utf8mb4_croatian_ci';

INSERT INTO `news` (`date`, `blurb`, `imageURL`, `link`, `author`, `body`) VALUES
 ('2025-09-06 00:00:00', 'Proslavljen dan naturizma na Jarunu.', '/assets/jarun.jpg', NULL, NULL, NULL),
 ('2025-10-05 00:00:00', 'DNH sudjelovao na sastanku EuNat-a.', '/assets/eunat.jpg', NULL, NULL, NULL),
 ('2025-11-08 00:00:00', 'Druženje u saunama spa & wellness hotela Paradiso.', '/assets/paradiso.jpg', NULL, NULL, NULL),
 ('2025-12-07 00:00:00', 'Novo druženje u saunama spa & wellness hotela Paradiso.', '/assets/paradiso2.jpg', NULL, NULL, NULL),
 ('2026-03-07 00:00:00', 'Održana redovna sjednica DNH u starom prostoru kod Martinovke.', '/assets/skupstina.jpg', NULL, NULL, NULL),
 ('2026-03-26 00:00:00', 'Pogledajte novi video Nick&Lins o hrvatskim naturističkim plažama.', '/assets/nicklins.png', 'https://www.youtube.com/watch?v=deMVuzba9lI', NULL, NULL);

INSERT INTO `announcement` (`date`, `blurb`, `imageURL`, `link`, `author`, `body`) VALUES
 ('2026-04-05 00:00:00', 'Druženje mladih od 27. lipnja do 1. srpnja u Gironi.', '/assets/youth-gathering.png', 'https://fienta.com/inf-fni-2024-international-naturist-youth-gathering-171864?fbclid=IwT01FWAQta6lleHRuA2FlbQIxMABzcnRjBmFwcF9pZAwzNTA2ODU1MzE3MjgAAR6HARG-j_VOoJJF5HD1djBdQy-eG_Aq5P1wIsf0tlVQ4U7EynGW7g3qzBkujg_aem_oJL9dgiZvTI9YaD0FVG-hg', NULL, NULL),
 ('2025-04-19 19:49:53', 'Primamo prijave za 54. susrete Alpe Adria od 18. do 21. lipnja, 2026.', '/assets/alpe-adria.png', 'mailto:dnh@dnh.hr', NULL, NULL);

ALTER TABLE `jobs`
  ADD COLUMN `view_count` INTEGER NOT NULL DEFAULT 0;

ALTER TABLE `companies`
  ADD COLUMN `industry` VARCHAR(100) NULL,
  ADD COLUMN `size` VARCHAR(100) NULL;

CREATE TABLE `company_reviews` (
  `id` VARCHAR(191) NOT NULL,
  `rating` INTEGER NOT NULL,
  `comment` TEXT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL,
  `user_id` VARCHAR(191) NOT NULL,
  `company_id` VARCHAR(191) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `company_reviews_user_id_company_id_key`(`user_id`, `company_id`),
  INDEX `company_reviews_company_id_idx`(`company_id`),
  INDEX `company_reviews_user_id_idx`(`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `cv_templates` (
  `id` VARCHAR(191) NOT NULL,
  `title` VARCHAR(191) NOT NULL,
  `industry` VARCHAR(100) NULL,
  `level` VARCHAR(50) NULL,
  `content` LONGTEXT NOT NULL,
  `preview_url` TEXT NULL,
  `is_active` BOOLEAN NOT NULL DEFAULT true,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `cover_letter_templates` (
  `id` VARCHAR(191) NOT NULL,
  `title` VARCHAR(191) NOT NULL,
  `industry` VARCHAR(100) NULL,
  `level` VARCHAR(50) NULL,
  `content` LONGTEXT NOT NULL,
  `is_active` BOOLEAN NOT NULL DEFAULT true,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `posts` (
  `id` VARCHAR(191) NOT NULL,
  `title` VARCHAR(191) NOT NULL,
  `slug` VARCHAR(191) NULL,
  `excerpt` TEXT NULL,
  `content` LONGTEXT NOT NULL,
  `cover_url` TEXT NULL,
  `category` VARCHAR(100) NULL,
  `author_name` VARCHAR(120) NULL,
  `is_published` BOOLEAN NOT NULL DEFAULT true,
  `view_count` INTEGER NOT NULL DEFAULT 0,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `posts_slug_key`(`slug`),
  INDEX `posts_category_idx`(`category`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `company_reviews`
  ADD CONSTRAINT `company_reviews_user_id_fkey`
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `company_reviews`
  ADD CONSTRAINT `company_reviews_company_id_fkey`
  FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

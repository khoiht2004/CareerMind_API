/*
  Warnings:

  - You are about to alter the column `tags` on the `jobs` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Json`.
  - You are about to alter the column `benefits` on the `jobs` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Json`.

*/
-- AlterTable
ALTER TABLE `chat_messages` ADD COLUMN `message_type` ENUM('TEXT', 'CV_ANALYSIS', 'SYSTEM_NOTE') NOT NULL DEFAULT 'TEXT';

-- AlterTable
ALTER TABLE `jobs` MODIFY `tags` JSON NULL,
    MODIFY `benefits` JSON NULL;

-- CreateTable
CREATE TABLE `cv_analyses` (
    `id` VARCHAR(191) NOT NULL,
    `score` INTEGER NOT NULL,
    `strengths` JSON NOT NULL,
    `weaknesses` JSON NOT NULL,
    `improvements` JSON NOT NULL,
    `summary` TEXT NOT NULL,
    `raw_cv_text` LONGTEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `message_id` VARCHAR(191) NOT NULL,
    `job_id` VARCHAR(191) NULL,
    `cv_id` VARCHAR(191) NULL,

    UNIQUE INDEX `cv_analyses_message_id_key`(`message_id`),
    INDEX `cv_analyses_job_id_idx`(`job_id`),
    INDEX `cv_analyses_cv_id_idx`(`cv_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `cv_analyses` ADD CONSTRAINT `cv_analyses_message_id_fkey` FOREIGN KEY (`message_id`) REFERENCES `chat_messages`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cv_analyses` ADD CONSTRAINT `cv_analyses_job_id_fkey` FOREIGN KEY (`job_id`) REFERENCES `jobs`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cv_analyses` ADD CONSTRAINT `cv_analyses_cv_id_fkey` FOREIGN KEY (`cv_id`) REFERENCES `cvs`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

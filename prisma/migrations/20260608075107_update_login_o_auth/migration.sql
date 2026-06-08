/*
  Warnings:

  - You are about to drop the column `confirm_deadline` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `interview_date` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `interview_format` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `interview_location` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `interview_time` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `office_address` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `start_date` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `start_time` on the `applications` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `applications` DROP COLUMN `confirm_deadline`,
    DROP COLUMN `interview_date`,
    DROP COLUMN `interview_format`,
    DROP COLUMN `interview_location`,
    DROP COLUMN `interview_time`,
    DROP COLUMN `office_address`,
    DROP COLUMN `start_date`,
    DROP COLUMN `start_time`;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `provider` VARCHAR(191) NOT NULL DEFAULT 'credentials',
    ADD COLUMN `provider_id` VARCHAR(191) NULL,
    MODIFY `password` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `conversations` (
    `id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `user_one_id` VARCHAR(191) NOT NULL,
    `user_two_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `conversations_user_one_id_user_two_id_key`(`user_one_id`, `user_two_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `conversation_messages` (
    `id` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `message_type` ENUM('TEXT', 'CV_ANALYSIS', 'SYSTEM_NOTE') NOT NULL DEFAULT 'TEXT',
    `attachments` JSON NULL,
    `is_read` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `conversation_id` VARCHAR(191) NOT NULL,
    `sender_id` VARCHAR(191) NOT NULL,

    INDEX `conversation_messages_conversation_id_idx`(`conversation_id`),
    INDEX `conversation_messages_conversation_id_created_at_idx`(`conversation_id`, `created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `interviews` (
    `id` VARCHAR(191) NOT NULL,
    `application_id` VARCHAR(191) NOT NULL,
    `interview_date` DATETIME(3) NOT NULL,
    `interview_time` VARCHAR(10) NULL,
    `interview_format` VARCHAR(20) NOT NULL,
    `interview_location` VARCHAR(500) NULL,
    `confirm_deadline` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `interviews_application_id_key`(`application_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `job_offers` (
    `id` VARCHAR(191) NOT NULL,
    `application_id` VARCHAR(191) NOT NULL,
    `start_date` DATETIME(3) NOT NULL,
    `start_time` VARCHAR(10) NULL,
    `office_address` VARCHAR(500) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `job_offers_application_id_key`(`application_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notifications` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `is_read` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `user_id` VARCHAR(191) NOT NULL,

    INDEX `notifications_user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `conversations` ADD CONSTRAINT `conversations_user_one_id_fkey` FOREIGN KEY (`user_one_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `conversations` ADD CONSTRAINT `conversations_user_two_id_fkey` FOREIGN KEY (`user_two_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `conversation_messages` ADD CONSTRAINT `conversation_messages_conversation_id_fkey` FOREIGN KEY (`conversation_id`) REFERENCES `conversations`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `conversation_messages` ADD CONSTRAINT `conversation_messages_sender_id_fkey` FOREIGN KEY (`sender_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `interviews` ADD CONSTRAINT `interviews_application_id_fkey` FOREIGN KEY (`application_id`) REFERENCES `applications`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `job_offers` ADD CONSTRAINT `job_offers_application_id_fkey` FOREIGN KEY (`application_id`) REFERENCES `applications`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

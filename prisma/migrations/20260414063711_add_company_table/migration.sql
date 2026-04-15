/*
  Warnings:

  - You are about to drop the column `company` on the `jobs` table. All the data in the column will be lost.
  - Added the required column `company_id` to the `jobs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `applications` ADD COLUMN `companyId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `jobs` DROP COLUMN `company`,
    ADD COLUMN `company_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `company_id` VARCHAR(191) NULL,
    MODIFY `role` ENUM('CANDIDATE', 'COMPANY', 'RECRUITER', 'ADMIN') NOT NULL DEFAULT 'CANDIDATE';

-- CreateTable
CREATE TABLE `companies` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `description` TEXT NULL,
    `address` VARCHAR(191) NULL,
    `logo_url` VARCHAR(191) NULL,
    `cover_image_url` VARCHAR(191) NULL,
    `social_links` JSON NULL,
    `is_verified` BOOLEAN NOT NULL DEFAULT false,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `total_jobs` INTEGER NOT NULL DEFAULT 0,
    `total_applications` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `jobs` ADD CONSTRAINT `jobs_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `applications` ADD CONSTRAINT `applications_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `companies`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

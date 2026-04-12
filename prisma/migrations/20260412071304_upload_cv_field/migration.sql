-- AlterTable
ALTER TABLE `applications` ADD COLUMN `cv_id` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `cvs` ADD COLUMN `file_size` INTEGER NULL,
    ADD COLUMN `file_type` VARCHAR(10) NULL;

-- CreateIndex
CREATE INDEX `applications_cv_id_idx` ON `applications`(`cv_id`);

-- AddForeignKey
ALTER TABLE `applications` ADD CONSTRAINT `applications_cv_id_fkey` FOREIGN KEY (`cv_id`) REFERENCES `cvs`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

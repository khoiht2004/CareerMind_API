-- AlterTable
ALTER TABLE `companies` ADD COLUMN `map_url` TEXT NULL,
    ADD COLUMN `sub_description` TEXT NULL,
    MODIFY `address` VARCHAR(255) NULL,
    MODIFY `logo_url` TEXT NULL;

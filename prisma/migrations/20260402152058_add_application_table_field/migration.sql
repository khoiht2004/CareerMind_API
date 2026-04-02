-- AlterTable
ALTER TABLE `applications` ADD COLUMN `confirm_deadline` DATETIME(3) NULL,
    ADD COLUMN `interview_date` DATETIME(3) NULL,
    ADD COLUMN `interview_format` VARCHAR(20) NULL,
    ADD COLUMN `interview_location` VARCHAR(500) NULL,
    ADD COLUMN `interview_time` VARCHAR(10) NULL,
    ADD COLUMN `office_address` VARCHAR(500) NULL,
    ADD COLUMN `report_time` VARCHAR(10) NULL,
    ADD COLUMN `start_date` DATETIME(3) NULL;

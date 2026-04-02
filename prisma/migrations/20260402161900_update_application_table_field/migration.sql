/*
  Warnings:

  - You are about to drop the column `report_time` on the `applications` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `applications` DROP COLUMN `report_time`,
    ADD COLUMN `start_time` VARCHAR(10) NULL;

/*
  Warnings:

  - You are about to alter the column `group` on the `permissions` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.

*/
-- AlterTable
ALTER TABLE `jobs` ADD COLUMN `industry` JSON NULL;

-- AlterTable
ALTER TABLE `permissions` MODIFY `group` JSON NOT NULL;

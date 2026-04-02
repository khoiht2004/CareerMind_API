/*
  Warnings:

  - Made the column `type` on table `queues` required. This step will fail if there are existing NULL values in that column.
  - Made the column `payload` on table `queues` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `queues` MODIFY `type` VARCHAR(255) NOT NULL,
    MODIFY `payload` TEXT NOT NULL;

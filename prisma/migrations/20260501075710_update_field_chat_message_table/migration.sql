/*
  Warnings:

  - You are about to drop the column `images` on the `chat_messages` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `chat_messages` DROP COLUMN `images`,
    ADD COLUMN `attachments` JSON NULL;

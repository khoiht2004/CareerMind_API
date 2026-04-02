/*
  Warnings:

  - You are about to alter the column `skills` on the `profiles` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Json`.

*/
-- AlterTable
ALTER TABLE `profiles` MODIFY `skills` JSON NULL;

/*
  Warnings:

  - The values [COMPANY] on the enum `users_role` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `users` ADD COLUMN `can_company_manage` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `role` ENUM('CANDIDATE', 'RECRUITER', 'ADMIN') NOT NULL DEFAULT 'CANDIDATE';

/*
  Warnings:

  - Added the required column `activationLink` to the `Agent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Agent` ADD COLUMN `activationLink` VARCHAR(191) NOT NULL;

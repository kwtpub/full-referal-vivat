-- AlterTable
ALTER TABLE `Admin` ADD COLUMN `refresh_token` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Agent` ADD COLUMN `refresh_token` VARCHAR(191) NULL;

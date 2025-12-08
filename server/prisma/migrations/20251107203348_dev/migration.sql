/*
  Warnings:

  - You are about to drop the column `adminId` on the `Agent` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Agent` table. All the data in the column will be lost.
  - You are about to drop the column `refresh_token` on the `Agent` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `createAt` on the `Deal` table. All the data in the column will be lost.
  - You are about to drop the `Admin` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Agent` DROP FOREIGN KEY `Agent_adminId_fkey`;

-- DropIndex
DROP INDEX `Agent_adminId_fkey` ON `Agent`;

-- DropIndex
DROP INDEX `Agent_phone_key` ON `Agent`;

-- AlterTable
ALTER TABLE `Agent` DROP COLUMN `adminId`,
    DROP COLUMN `phone`,
    DROP COLUMN `refresh_token`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `isAdmin` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `isActive` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `Client` DROP COLUMN `created_at`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `Deal` DROP COLUMN `createAt`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- DropTable
DROP TABLE `Admin`;

-- CreateTable
CREATE TABLE `Token` (
    `id` VARCHAR(191) NOT NULL,
    `refreshToken` VARCHAR(191) NOT NULL,
    `userAgent` VARCHAR(191) NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `agentId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Token_refreshToken_key`(`refreshToken`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Token` ADD CONSTRAINT `Token_agentId_fkey` FOREIGN KEY (`agentId`) REFERENCES `Agent`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

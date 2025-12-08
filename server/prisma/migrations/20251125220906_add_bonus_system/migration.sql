/*
  Warnings:

  - You are about to drop the column `rewardType` on the `Bonus` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[dealId]` on the table `Bonus` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `Bonus` DROP FOREIGN KEY `Bonus_dealId_fkey`;

-- DropIndex
DROP INDEX `Bonus_dealId_fkey` ON `Bonus`;

-- AlterTable
ALTER TABLE `Bonus` DROP COLUMN `rewardType`;

-- CreateIndex
CREATE UNIQUE INDEX `Bonus_dealId_key` ON `Bonus`(`dealId`);

-- AddForeignKey
ALTER TABLE `Bonus` ADD CONSTRAINT `Bonus_dealId_fkey` FOREIGN KEY (`dealId`) REFERENCES `Deal`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

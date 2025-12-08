/*
  Warnings:

  - You are about to drop the column `interestBoat` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `stage` on the `Client` table. All the data in the column will be lost.
  - Added the required column `interestBoat` to the `Deal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `Deal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stage` to the `Deal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Client` DROP COLUMN `interestBoat`,
    DROP COLUMN `quantity`,
    DROP COLUMN `stage`;

-- AlterTable
ALTER TABLE `Deal` ADD COLUMN `interestBoat` ENUM('HardTop', 'ClassicBoat', 'Bowrider') NOT NULL,
    ADD COLUMN `quantity` INTEGER NOT NULL,
    ADD COLUMN `stage` VARCHAR(191) NOT NULL,
    MODIFY `amount` DECIMAL(65, 30) NULL;

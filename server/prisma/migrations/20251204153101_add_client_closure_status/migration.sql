-- AlterTable
ALTER TABLE `Client` ADD COLUMN `closedAt` DATETIME(3) NULL,
    ADD COLUMN `closureRequestedAt` DATETIME(3) NULL,
    ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `pendingClosure` BOOLEAN NOT NULL DEFAULT false;

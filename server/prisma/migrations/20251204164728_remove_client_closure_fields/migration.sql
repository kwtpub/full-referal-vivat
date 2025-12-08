/*
  Warnings:

  - You are about to drop the column `closedAt` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `closureRequestedAt` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `pendingClosure` on the `Client` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Client` DROP COLUMN `closedAt`,
    DROP COLUMN `closureRequestedAt`,
    DROP COLUMN `isActive`,
    DROP COLUMN `pendingClosure`;

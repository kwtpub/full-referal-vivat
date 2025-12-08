/*
  Warnings:

  - A unique constraint covering the columns `[activationLink]` on the table `Agent` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Agent_activationLink_key` ON `Agent`(`activationLink`);

-- AlterTable
ALTER TABLE `Deal` MODIFY `interestBoat` VARCHAR(191) NOT NULL;

-- DropEnum
DROP TYPE IF EXISTS `InterestBoat`;

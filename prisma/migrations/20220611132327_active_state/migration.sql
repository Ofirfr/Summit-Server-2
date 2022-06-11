-- AlterTable
ALTER TABLE "coach" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "district" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "trainingType" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true;

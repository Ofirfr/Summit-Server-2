/*
  Warnings:

  - Added the required column `districtId` to the `training` table without a default value. This is not possible if the table is not empty.
  - Added the required column `typeId` to the `training` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "training" ADD COLUMN     "districtId" INTEGER NOT NULL,
ADD COLUMN     "typeId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "trainingType" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "trainingType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "district" (
    "id" SERIAL NOT NULL,
    "district" TEXT NOT NULL,

    CONSTRAINT "district_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "trainingType_type_key" ON "trainingType"("type");

-- CreateIndex
CREATE UNIQUE INDEX "district_district_key" ON "district"("district");

-- AddForeignKey
ALTER TABLE "training" ADD CONSTRAINT "training_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "trainingType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training" ADD CONSTRAINT "training_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "district"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

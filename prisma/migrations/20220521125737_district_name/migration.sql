/*
  Warnings:

  - You are about to drop the column `district` on the `district` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `district` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `district` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "district_district_key";

-- AlterTable
ALTER TABLE "district" DROP COLUMN "district",
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "district_name_key" ON "district"("name");

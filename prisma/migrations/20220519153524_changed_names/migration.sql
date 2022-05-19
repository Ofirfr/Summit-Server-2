/*
  Warnings:

  - You are about to drop the column `name` on the `coach` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[coachName]` on the table `coach` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userName]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `coachName` to the `coach` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userName` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "coach_name_key";

-- AlterTable
ALTER TABLE "coach" DROP COLUMN "name",
ADD COLUMN     "coachName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "name",
ADD COLUMN     "userName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "coach_coachName_key" ON "coach"("coachName");

-- CreateIndex
CREATE UNIQUE INDEX "user_userName_key" ON "user"("userName");

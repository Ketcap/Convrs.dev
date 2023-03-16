/*
  Warnings:

  - A unique constraint covering the columns `[userId,application]` on the table `Config` will be added. If there are existing duplicate values, this will fail.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "name" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Config_userId_application_key" ON "Config"("userId", "application");

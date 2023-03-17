/*
  Warnings:

  - A unique constraint covering the columns `[userId,application,type]` on the table `Config` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Config_userId_application_key";

-- CreateIndex
CREATE UNIQUE INDEX "Config_userId_application_type_key" ON "Config"("userId", "application", "type");

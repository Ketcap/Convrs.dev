/*
  Warnings:

  - Added the required column `type` to the `Config` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ConfigType" AS ENUM ('Key', 'Voice');

-- AlterTable
ALTER TABLE "Config" ADD COLUMN     "type" "ConfigType" NOT NULL;

-- CreateEnum
CREATE TYPE "RoomFeature" AS ENUM ('OnlyLastMessage');

-- AlterTable
ALTER TABLE "Chatroom" ADD COLUMN     "RoomFeatures" "RoomFeature"[];

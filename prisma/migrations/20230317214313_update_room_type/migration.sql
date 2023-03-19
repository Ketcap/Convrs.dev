/*
  Warnings:

  - The values [PreDefined] on the enum `RoomType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RoomType_new" AS ENUM ('Chat', 'Summarize', 'Explanation', 'Tutor');
ALTER TABLE "Chatroom" ALTER COLUMN "roomType" TYPE "RoomType_new" USING ("roomType"::text::"RoomType_new");
ALTER TYPE "RoomType" RENAME TO "RoomType_old";
ALTER TYPE "RoomType_new" RENAME TO "RoomType";
DROP TYPE "RoomType_old";
COMMIT;

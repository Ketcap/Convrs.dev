/*
  Warnings:

  - The `directives` column on the `Chatroom` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Chatroom" DROP COLUMN "directives",
ADD COLUMN     "directives" JSONB[];

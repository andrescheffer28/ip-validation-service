/*
  Warnings:

  - The primary key for the `cookies` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `cookies` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "cookies" DROP CONSTRAINT "cookies_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "cookies_pkey" PRIMARY KEY ("user_id");

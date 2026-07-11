/*
  Warnings:

  - The primary key for the `cookies` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "cookies" DROP CONSTRAINT "cookies_pkey",
ADD CONSTRAINT "cookies_pkey" PRIMARY KEY ("user_ip");

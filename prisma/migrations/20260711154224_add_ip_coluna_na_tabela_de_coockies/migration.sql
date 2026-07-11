/*
  Warnings:

  - Added the required column `user_ip` to the `cookies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "cookies" ADD COLUMN     "user_ip" TEXT NOT NULL;

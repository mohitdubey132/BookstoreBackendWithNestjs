/*
  Warnings:

  - A unique constraint covering the columns `[mobileNo]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `mobileNo` to the `Address` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Address" ADD COLUMN     "mobileNo" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_mobileNo_key" ON "User"("mobileNo");

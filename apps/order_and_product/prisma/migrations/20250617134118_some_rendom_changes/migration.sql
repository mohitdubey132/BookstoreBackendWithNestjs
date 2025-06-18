/*
  Warnings:

  - Made the column `name` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Product_name_key";

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "name" SET NOT NULL;

-- CreateEnum
CREATE TYPE "UserTypes" AS ENUM ('normal', 'admin', 'staff');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "emailId" TEXT,
    "hashPassword" TEXT NOT NULL,
    "mobileNo" VARCHAR(10) NOT NULL,
    "userType" "UserTypes" NOT NULL DEFAULT 'normal',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "ShippingAddress" ALTER COLUMN "firstName" DROP NOT NULL,
ALTER COLUMN "lastName" DROP NOT NULL,
ALTER COLUMN "landMark" DROP NOT NULL,
ALTER COLUMN "road" DROP NOT NULL,
ALTER COLUMN "city" DROP NOT NULL,
ALTER COLUMN "pinCode" DROP NOT NULL;

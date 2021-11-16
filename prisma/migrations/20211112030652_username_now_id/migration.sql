/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `ShoppingHistory` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Books" ALTER COLUMN "price" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "discountedPrice" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "ShoppingHistory" ALTER COLUMN "totalPrice" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "ShoppingHistoryItem" ALTER COLUMN "bookPrice" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "cep" DROP NOT NULL,
ALTER COLUMN "country" DROP NOT NULL,
ALTER COLUMN "state" DROP NOT NULL,
ALTER COLUMN "city" DROP NOT NULL,
ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "phonenumber" DROP NOT NULL,
ALTER COLUMN "profilePhoto" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ShoppingHistory_username_key" ON "ShoppingHistory"("username");

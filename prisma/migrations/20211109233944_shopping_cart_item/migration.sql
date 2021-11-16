/*
  Warnings:

  - You are about to drop the column `bookId` on the `ShoppingCartItems` table. All the data in the column will be lost.
  - Added the required column `totalPrice` to the `ShoppingCartItems` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ShoppingCartItems" DROP CONSTRAINT "ShoppingCartItems_bookId_fkey";

-- AlterTable
ALTER TABLE "ShoppingCartItems" DROP COLUMN "bookId",
ADD COLUMN     "totalPrice" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "price" SET DATA TYPE DOUBLE PRECISION;

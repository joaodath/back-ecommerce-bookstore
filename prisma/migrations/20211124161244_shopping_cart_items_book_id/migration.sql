/*
  Warnings:

  - Added the required column `bookId` to the `ShoppingCartItems` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ShoppingCartItems" ADD COLUMN     "bookId" INTEGER NOT NULL;

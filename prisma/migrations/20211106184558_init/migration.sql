/*
  Warnings:

  - Added the required column `quantity` to the `ShoppingCartItems` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ShoppingCartItems" ADD COLUMN     "quantity" INTEGER NOT NULL;

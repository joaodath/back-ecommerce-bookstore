/*
  Warnings:

  - Added the required column `isAnonymous` to the `ShoppingCart` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ShoppingCart" ADD COLUMN     "isAnonymous" BOOLEAN NOT NULL;

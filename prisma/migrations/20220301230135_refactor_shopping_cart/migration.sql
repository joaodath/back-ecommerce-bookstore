/*
  Warnings:

  - You are about to drop the `_CouponCodesToShoppingCart` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ShoppingCartToUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ShoppingHistoryToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ShoppingCartItems" DROP CONSTRAINT "ShoppingCartItems_shoppingCartId_fkey";

-- DropForeignKey
ALTER TABLE "ShoppingHistory" DROP CONSTRAINT "ShoppingHistory_couponCodeId_fkey";

-- DropForeignKey
ALTER TABLE "ShoppingHistoryItem" DROP CONSTRAINT "ShoppingHistoryItem_bookId_fkey";

-- DropForeignKey
ALTER TABLE "ShoppingHistoryItem" DROP CONSTRAINT "ShoppingHistoryItem_shoppingHistoryId_fkey";

-- DropForeignKey
ALTER TABLE "_CouponCodesToShoppingCart" DROP CONSTRAINT "_CouponCodesToShoppingCart_A_fkey";

-- DropForeignKey
ALTER TABLE "_CouponCodesToShoppingCart" DROP CONSTRAINT "_CouponCodesToShoppingCart_B_fkey";

-- DropForeignKey
ALTER TABLE "_ShoppingCartToUser" DROP CONSTRAINT "_ShoppingCartToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_ShoppingCartToUser" DROP CONSTRAINT "_ShoppingCartToUser_B_fkey";

-- DropForeignKey
ALTER TABLE "_ShoppingHistoryToUser" DROP CONSTRAINT "_ShoppingHistoryToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_ShoppingHistoryToUser" DROP CONSTRAINT "_ShoppingHistoryToUser_B_fkey";

-- DropTable
DROP TABLE "_CouponCodesToShoppingCart";

-- DropTable
DROP TABLE "_ShoppingCartToUser";

-- DropTable
DROP TABLE "_ShoppingHistoryToUser";

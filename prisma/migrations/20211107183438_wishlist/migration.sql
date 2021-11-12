/*
  Warnings:

  - You are about to drop the `WishListItems` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_BooksToWishListItems` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_WishListToWishListItems` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "WishListItems" DROP CONSTRAINT "WishListItems_bookId_fkey";

-- DropForeignKey
ALTER TABLE "WishListItems" DROP CONSTRAINT "WishListItems_wishListId_fkey";

-- DropForeignKey
ALTER TABLE "_BooksToWishListItems" DROP CONSTRAINT "_BooksToWishListItems_A_fkey";

-- DropForeignKey
ALTER TABLE "_BooksToWishListItems" DROP CONSTRAINT "_BooksToWishListItems_B_fkey";

-- DropForeignKey
ALTER TABLE "_WishListToWishListItems" DROP CONSTRAINT "_WishListToWishListItems_A_fkey";

-- DropForeignKey
ALTER TABLE "_WishListToWishListItems" DROP CONSTRAINT "_WishListToWishListItems_B_fkey";

-- DropTable
DROP TABLE "WishListItems";

-- DropTable
DROP TABLE "_BooksToWishListItems";

-- DropTable
DROP TABLE "_WishListToWishListItems";

-- CreateTable
CREATE TABLE "_BooksToWishList" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BooksToWishList_AB_unique" ON "_BooksToWishList"("A", "B");

-- CreateIndex
CREATE INDEX "_BooksToWishList_B_index" ON "_BooksToWishList"("B");

-- AddForeignKey
ALTER TABLE "_BooksToWishList" ADD FOREIGN KEY ("A") REFERENCES "Books"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BooksToWishList" ADD FOREIGN KEY ("B") REFERENCES "WishList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

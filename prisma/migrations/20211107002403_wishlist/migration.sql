-- CreateTable
CREATE TABLE "WishList" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "WishList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WishListItems" (
    "id" SERIAL NOT NULL,
    "wishListId" INTEGER,
    "bookId" INTEGER,

    CONSTRAINT "WishListItems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserToWishList" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_BooksToWishListItems" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_WishListToWishListItems" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserToWishList_AB_unique" ON "_UserToWishList"("A", "B");

-- CreateIndex
CREATE INDEX "_UserToWishList_B_index" ON "_UserToWishList"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BooksToWishListItems_AB_unique" ON "_BooksToWishListItems"("A", "B");

-- CreateIndex
CREATE INDEX "_BooksToWishListItems_B_index" ON "_BooksToWishListItems"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_WishListToWishListItems_AB_unique" ON "_WishListToWishListItems"("A", "B");

-- CreateIndex
CREATE INDEX "_WishListToWishListItems_B_index" ON "_WishListToWishListItems"("B");

-- AddForeignKey
ALTER TABLE "WishList" ADD CONSTRAINT "WishList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WishListItems" ADD CONSTRAINT "WishListItems_wishListId_fkey" FOREIGN KEY ("wishListId") REFERENCES "WishList"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WishListItems" ADD CONSTRAINT "WishListItems_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Books"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToWishList" ADD FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToWishList" ADD FOREIGN KEY ("B") REFERENCES "WishList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BooksToWishListItems" ADD FOREIGN KEY ("A") REFERENCES "Books"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BooksToWishListItems" ADD FOREIGN KEY ("B") REFERENCES "WishListItems"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WishListToWishListItems" ADD FOREIGN KEY ("A") REFERENCES "WishList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WishListToWishListItems" ADD FOREIGN KEY ("B") REFERENCES "WishListItems"("id") ON DELETE CASCADE ON UPDATE CASCADE;

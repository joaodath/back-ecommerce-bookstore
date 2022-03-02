-- CreateTable
CREATE TABLE "_ShoppingCartToUser" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ShoppingHistoryToUser" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CouponCodesToShoppingCart" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ShoppingCartToUser_AB_unique" ON "_ShoppingCartToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ShoppingCartToUser_B_index" ON "_ShoppingCartToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ShoppingHistoryToUser_AB_unique" ON "_ShoppingHistoryToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ShoppingHistoryToUser_B_index" ON "_ShoppingHistoryToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CouponCodesToShoppingCart_AB_unique" ON "_CouponCodesToShoppingCart"("A", "B");

-- CreateIndex
CREATE INDEX "_CouponCodesToShoppingCart_B_index" ON "_CouponCodesToShoppingCart"("B");

-- AddForeignKey
ALTER TABLE "ShoppingCartItems" ADD CONSTRAINT "ShoppingCartItems_shoppingCartId_fkey" FOREIGN KEY ("shoppingCartId") REFERENCES "ShoppingCart"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShoppingHistory" ADD CONSTRAINT "ShoppingHistory_couponCodeId_fkey" FOREIGN KEY ("couponCodeId") REFERENCES "CouponCodes"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShoppingHistoryItem" ADD CONSTRAINT "ShoppingHistoryItem_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Books"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShoppingHistoryItem" ADD CONSTRAINT "ShoppingHistoryItem_shoppingHistoryId_fkey" FOREIGN KEY ("shoppingHistoryId") REFERENCES "ShoppingHistory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ShoppingCartToUser" ADD FOREIGN KEY ("A") REFERENCES "ShoppingCart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ShoppingCartToUser" ADD FOREIGN KEY ("B") REFERENCES "User"("username") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ShoppingHistoryToUser" ADD FOREIGN KEY ("A") REFERENCES "ShoppingHistory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ShoppingHistoryToUser" ADD FOREIGN KEY ("B") REFERENCES "User"("username") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CouponCodesToShoppingCart" ADD FOREIGN KEY ("A") REFERENCES "CouponCodes"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CouponCodesToShoppingCart" ADD FOREIGN KEY ("B") REFERENCES "ShoppingCart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

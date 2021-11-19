-- CreateTable
CREATE TABLE "User" (
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "profilePhoto" TEXT,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "cpf" TEXT NOT NULL,
    "cep" TEXT,
    "country" TEXT,
    "state" TEXT,
    "city" TEXT,
    "address" TEXT,
    "phonenumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("username")
);

-- CreateTable
CREATE TABLE "ShoppingCart" (
    "id" SERIAL NOT NULL,
    "username" TEXT,
    "couponCodeId" TEXT,
    "discountAmount" DOUBLE PRECISION,
    "shippingPrice" DOUBLE PRECISION,
    "totalPrice" DOUBLE PRECISION,
    "isAnonymous" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShoppingCart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShoppingCartItems" (
    "id" SERIAL NOT NULL,
    "shoppingCartId" INTEGER,
    "price" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ShoppingCartItems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CouponCodes" (
    "code" TEXT NOT NULL,
    "discountAmount" DOUBLE PRECISION NOT NULL,
    "validUntil" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "useLimit" INTEGER NOT NULL,
    "useCount" INTEGER NOT NULL,

    CONSTRAINT "CouponCodes_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "Books" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "edition" INTEGER NOT NULL,
    "description" VARCHAR(1000) NOT NULL,
    "coverImg" TEXT NOT NULL,
    "ebook" BOOLEAN NOT NULL DEFAULT true,
    "hardCover" BOOLEAN NOT NULL DEFAULT false,
    "height" INTEGER NOT NULL DEFAULT 0,
    "width" INTEGER NOT NULL DEFAULT 0,
    "length" INTEGER NOT NULL DEFAULT 0,
    "weight" INTEGER NOT NULL DEFAULT 0,
    "isbn13" INTEGER NOT NULL DEFAULT 0,
    "isbn10" INTEGER NOT NULL DEFAULT 0,
    "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "price" DOUBLE PRECISION NOT NULL,
    "discountedPrice" DOUBLE PRECISION,
    "discountCheck" BOOLEAN NOT NULL DEFAULT false,
    "inventoryAmount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Books_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Authors" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Authors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Publisher" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Publisher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShoppingHistory" (
    "id" SERIAL NOT NULL,
    "username" TEXT,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "couponCodeId" TEXT,
    "couponCodeStr" TEXT,
    "discountAmount" DOUBLE PRECISION NOT NULL,
    "shippingPrice" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShoppingHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShoppingHistoryItem" (
    "id" SERIAL NOT NULL,
    "bookId" INTEGER,
    "bookPrice" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "shoppingHistoryId" INTEGER,

    CONSTRAINT "ShoppingHistoryItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BooksToUser" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

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
CREATE TABLE "_ShoppingCartToShoppingCartItems" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_CouponCodesToShoppingCart" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_BooksToShoppingCartItems" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_CouponCodesToShoppingHistory" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_AuthorsToBooks" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_BooksToPublisher" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_BooksToCategory" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_BooksToShoppingHistoryItem" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ShoppingHistoryToShoppingHistoryItem" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_cpf_key" ON "User"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "ShoppingCart_username_key" ON "ShoppingCart"("username");

-- CreateIndex
CREATE UNIQUE INDEX "CouponCodes_code_key" ON "CouponCodes"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Books_isbn13_key" ON "Books"("isbn13");

-- CreateIndex
CREATE UNIQUE INDEX "Books_isbn10_key" ON "Books"("isbn10");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ShoppingHistory_username_key" ON "ShoppingHistory"("username");

-- CreateIndex
CREATE UNIQUE INDEX "_BooksToUser_AB_unique" ON "_BooksToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_BooksToUser_B_index" ON "_BooksToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ShoppingCartToUser_AB_unique" ON "_ShoppingCartToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ShoppingCartToUser_B_index" ON "_ShoppingCartToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ShoppingHistoryToUser_AB_unique" ON "_ShoppingHistoryToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ShoppingHistoryToUser_B_index" ON "_ShoppingHistoryToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ShoppingCartToShoppingCartItems_AB_unique" ON "_ShoppingCartToShoppingCartItems"("A", "B");

-- CreateIndex
CREATE INDEX "_ShoppingCartToShoppingCartItems_B_index" ON "_ShoppingCartToShoppingCartItems"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CouponCodesToShoppingCart_AB_unique" ON "_CouponCodesToShoppingCart"("A", "B");

-- CreateIndex
CREATE INDEX "_CouponCodesToShoppingCart_B_index" ON "_CouponCodesToShoppingCart"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BooksToShoppingCartItems_AB_unique" ON "_BooksToShoppingCartItems"("A", "B");

-- CreateIndex
CREATE INDEX "_BooksToShoppingCartItems_B_index" ON "_BooksToShoppingCartItems"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CouponCodesToShoppingHistory_AB_unique" ON "_CouponCodesToShoppingHistory"("A", "B");

-- CreateIndex
CREATE INDEX "_CouponCodesToShoppingHistory_B_index" ON "_CouponCodesToShoppingHistory"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AuthorsToBooks_AB_unique" ON "_AuthorsToBooks"("A", "B");

-- CreateIndex
CREATE INDEX "_AuthorsToBooks_B_index" ON "_AuthorsToBooks"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BooksToPublisher_AB_unique" ON "_BooksToPublisher"("A", "B");

-- CreateIndex
CREATE INDEX "_BooksToPublisher_B_index" ON "_BooksToPublisher"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BooksToCategory_AB_unique" ON "_BooksToCategory"("A", "B");

-- CreateIndex
CREATE INDEX "_BooksToCategory_B_index" ON "_BooksToCategory"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BooksToShoppingHistoryItem_AB_unique" ON "_BooksToShoppingHistoryItem"("A", "B");

-- CreateIndex
CREATE INDEX "_BooksToShoppingHistoryItem_B_index" ON "_BooksToShoppingHistoryItem"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ShoppingHistoryToShoppingHistoryItem_AB_unique" ON "_ShoppingHistoryToShoppingHistoryItem"("A", "B");

-- CreateIndex
CREATE INDEX "_ShoppingHistoryToShoppingHistoryItem_B_index" ON "_ShoppingHistoryToShoppingHistoryItem"("B");

-- AddForeignKey
ALTER TABLE "ShoppingCart" ADD CONSTRAINT "ShoppingCart_username_fkey" FOREIGN KEY ("username") REFERENCES "User"("username") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShoppingCart" ADD CONSTRAINT "ShoppingCart_couponCodeId_fkey" FOREIGN KEY ("couponCodeId") REFERENCES "CouponCodes"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShoppingCartItems" ADD CONSTRAINT "ShoppingCartItems_shoppingCartId_fkey" FOREIGN KEY ("shoppingCartId") REFERENCES "ShoppingCart"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShoppingHistory" ADD CONSTRAINT "ShoppingHistory_username_fkey" FOREIGN KEY ("username") REFERENCES "User"("username") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShoppingHistory" ADD CONSTRAINT "ShoppingHistory_couponCodeId_fkey" FOREIGN KEY ("couponCodeId") REFERENCES "CouponCodes"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShoppingHistoryItem" ADD CONSTRAINT "ShoppingHistoryItem_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Books"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShoppingHistoryItem" ADD CONSTRAINT "ShoppingHistoryItem_shoppingHistoryId_fkey" FOREIGN KEY ("shoppingHistoryId") REFERENCES "ShoppingHistory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BooksToUser" ADD FOREIGN KEY ("A") REFERENCES "Books"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BooksToUser" ADD FOREIGN KEY ("B") REFERENCES "User"("username") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ShoppingCartToUser" ADD FOREIGN KEY ("A") REFERENCES "ShoppingCart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ShoppingCartToUser" ADD FOREIGN KEY ("B") REFERENCES "User"("username") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ShoppingHistoryToUser" ADD FOREIGN KEY ("A") REFERENCES "ShoppingHistory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ShoppingHistoryToUser" ADD FOREIGN KEY ("B") REFERENCES "User"("username") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ShoppingCartToShoppingCartItems" ADD FOREIGN KEY ("A") REFERENCES "ShoppingCart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ShoppingCartToShoppingCartItems" ADD FOREIGN KEY ("B") REFERENCES "ShoppingCartItems"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CouponCodesToShoppingCart" ADD FOREIGN KEY ("A") REFERENCES "CouponCodes"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CouponCodesToShoppingCart" ADD FOREIGN KEY ("B") REFERENCES "ShoppingCart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BooksToShoppingCartItems" ADD FOREIGN KEY ("A") REFERENCES "Books"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BooksToShoppingCartItems" ADD FOREIGN KEY ("B") REFERENCES "ShoppingCartItems"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CouponCodesToShoppingHistory" ADD FOREIGN KEY ("A") REFERENCES "CouponCodes"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CouponCodesToShoppingHistory" ADD FOREIGN KEY ("B") REFERENCES "ShoppingHistory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AuthorsToBooks" ADD FOREIGN KEY ("A") REFERENCES "Authors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AuthorsToBooks" ADD FOREIGN KEY ("B") REFERENCES "Books"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BooksToPublisher" ADD FOREIGN KEY ("A") REFERENCES "Books"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BooksToPublisher" ADD FOREIGN KEY ("B") REFERENCES "Publisher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BooksToCategory" ADD FOREIGN KEY ("A") REFERENCES "Books"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BooksToCategory" ADD FOREIGN KEY ("B") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BooksToShoppingHistoryItem" ADD FOREIGN KEY ("A") REFERENCES "Books"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BooksToShoppingHistoryItem" ADD FOREIGN KEY ("B") REFERENCES "ShoppingHistoryItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ShoppingHistoryToShoppingHistoryItem" ADD FOREIGN KEY ("A") REFERENCES "ShoppingHistory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ShoppingHistoryToShoppingHistoryItem" ADD FOREIGN KEY ("B") REFERENCES "ShoppingHistoryItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

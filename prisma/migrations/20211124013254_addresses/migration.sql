-- CreateTable
CREATE TABLE "UserAddresses" (
    "id" SERIAL NOT NULL,
    "username" TEXT,
    "isMain" BOOLEAN NOT NULL DEFAULT false,
    "cep" TEXT,
    "country" TEXT,
    "state" TEXT,
    "city" TEXT,
    "address" TEXT,

    CONSTRAINT "UserAddresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserToUserAddresses" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "UserAddresses_username_key" ON "UserAddresses"("username");

-- CreateIndex
CREATE UNIQUE INDEX "_UserToUserAddresses_AB_unique" ON "_UserToUserAddresses"("A", "B");

-- CreateIndex
CREATE INDEX "_UserToUserAddresses_B_index" ON "_UserToUserAddresses"("B");

-- AddForeignKey
ALTER TABLE "UserAddresses" ADD CONSTRAINT "UserAddresses_username_fkey" FOREIGN KEY ("username") REFERENCES "User"("username") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToUserAddresses" ADD FOREIGN KEY ("A") REFERENCES "User"("username") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToUserAddresses" ADD FOREIGN KEY ("B") REFERENCES "UserAddresses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

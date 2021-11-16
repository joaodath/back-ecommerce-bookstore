/*
  Warnings:

  - You are about to drop the column `userId` on the `ShoppingCart` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `ShoppingHistory` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ShoppingCart" DROP CONSTRAINT "ShoppingCart_userId_fkey";

-- DropForeignKey
ALTER TABLE "ShoppingHistory" DROP CONSTRAINT "ShoppingHistory_userId_fkey";

-- DropForeignKey
ALTER TABLE "_BooksToUser" DROP CONSTRAINT "_BooksToUser_B_fkey";

-- DropForeignKey
ALTER TABLE "_ShoppingCartToUser" DROP CONSTRAINT "_ShoppingCartToUser_B_fkey";

-- DropForeignKey
ALTER TABLE "_ShoppingHistoryToUser" DROP CONSTRAINT "_ShoppingHistoryToUser_B_fkey";

-- DropIndex
DROP INDEX "User_username_key";

-- AlterTable
ALTER TABLE "ShoppingCart" DROP COLUMN "userId",
ADD COLUMN     "username" TEXT;

-- AlterTable
ALTER TABLE "ShoppingHistory" DROP COLUMN "userId",
ADD COLUMN     "username" TEXT;

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("username");

-- AlterTable
ALTER TABLE "_BooksToUser" ALTER COLUMN "B" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "_ShoppingCartToUser" ALTER COLUMN "B" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "_ShoppingHistoryToUser" ALTER COLUMN "B" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "ShoppingCart" ADD CONSTRAINT "ShoppingCart_username_fkey" FOREIGN KEY ("username") REFERENCES "User"("username") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShoppingHistory" ADD CONSTRAINT "ShoppingHistory_username_fkey" FOREIGN KEY ("username") REFERENCES "User"("username") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BooksToUser" ADD FOREIGN KEY ("B") REFERENCES "User"("username") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ShoppingCartToUser" ADD FOREIGN KEY ("B") REFERENCES "User"("username") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ShoppingHistoryToUser" ADD FOREIGN KEY ("B") REFERENCES "User"("username") ON DELETE CASCADE ON UPDATE CASCADE;

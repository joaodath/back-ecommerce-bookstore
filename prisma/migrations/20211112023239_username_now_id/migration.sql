/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `ShoppingCart` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ShoppingCart_username_key" ON "ShoppingCart"("username");

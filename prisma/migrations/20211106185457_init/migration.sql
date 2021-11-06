-- AlterTable
ALTER TABLE "ShoppingCart" ALTER COLUMN "discountAmount" DROP NOT NULL,
ALTER COLUMN "shippingPrice" DROP NOT NULL,
ALTER COLUMN "totalPrice" DROP NOT NULL;

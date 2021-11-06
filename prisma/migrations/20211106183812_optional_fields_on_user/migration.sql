-- AlterTable
ALTER TABLE "Books" ALTER COLUMN "price" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "discountedPrice" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "ShoppingCartItems" ALTER COLUMN "price" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "ShoppingHistory" ALTER COLUMN "totalPrice" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "ShoppingHistoryItem" ALTER COLUMN "bookPrice" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "cep" DROP NOT NULL,
ALTER COLUMN "country" DROP NOT NULL,
ALTER COLUMN "state" DROP NOT NULL,
ALTER COLUMN "city" DROP NOT NULL,
ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "phonenumber" DROP NOT NULL,
ALTER COLUMN "profilePhoto" DROP NOT NULL;

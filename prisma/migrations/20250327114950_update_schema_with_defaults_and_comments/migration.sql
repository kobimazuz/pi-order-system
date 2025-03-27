/*
  Warnings:

  - You are about to drop the `Settings` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "parent" UUID;

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "notes" TEXT;

-- AlterTable
ALTER TABLE "products" ALTER COLUMN "units_per_pack" SET DEFAULT 1,
ALTER COLUMN "units_per_carton" SET DEFAULT 1;

-- AlterTable
ALTER TABLE "sizes" ADD COLUMN     "category" TEXT;

-- DropTable
DROP TABLE "Settings";

-- CreateTable
CREATE TABLE "settings" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "settings_userId_key_key" ON "settings"("userId", "key");

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_fkey" FOREIGN KEY ("parent") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "settings" ADD CONSTRAINT "settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

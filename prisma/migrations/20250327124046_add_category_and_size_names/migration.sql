-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "parent_name" TEXT;

-- AlterTable
ALTER TABLE "sizes" ADD COLUMN     "category_name" TEXT;

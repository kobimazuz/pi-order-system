/*
  Warnings:

  - You are about to drop the `ImportLog` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "ImportLog";

-- CreateTable
CREATE TABLE "import_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "total_rows" INTEGER NOT NULL,
    "success" INTEGER NOT NULL,
    "errors" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "import_logs_pkey" PRIMARY KEY ("id")
);

/*
  Warnings:

  - You are about to drop the column `image` on the `Vehicle` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Vehicle" DROP COLUMN "image",
ADD COLUMN     "archivedAt" TIMESTAMP(3),
ADD COLUMN     "imagePath" TEXT,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "isArchived" BOOLEAN NOT NULL DEFAULT false;

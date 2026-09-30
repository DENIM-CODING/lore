-- AlterTable
ALTER TABLE "LibraryEntry" ADD COLUMN     "isFavorite" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "LibraryEntry_userId_isFavorite_idx" ON "LibraryEntry"("userId", "isFavorite");

/*
  Warnings:

  - You are about to drop the column `candidates` on the `Poll` table. All the data in the column will be lost.
  - Added the required column `options` to the `Poll` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Poll" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "options" TEXT NOT NULL,
    "grades" TEXT NOT NULL,
    "preventMultipleVotes" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Poll" ("createdAt", "description", "grades", "id", "title", "updatedAt") SELECT "createdAt", "description", "grades", "id", "title", "updatedAt" FROM "Poll";
DROP TABLE "Poll";
ALTER TABLE "new_Poll" RENAME TO "Poll";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- AlterTable
ALTER TABLE "Vote" ADD COLUMN "name" TEXT;

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
    "expiresAt" DATETIME,
    "askName" BOOLEAN NOT NULL DEFAULT false,
    "showParticipants" TEXT NOT NULL DEFAULT 'never',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Poll" ("createdAt", "description", "expiresAt", "grades", "id", "options", "preventMultipleVotes", "title", "updatedAt") SELECT "createdAt", "description", "expiresAt", "grades", "id", "options", "preventMultipleVotes", "title", "updatedAt" FROM "Poll";
DROP TABLE "Poll";
ALTER TABLE "new_Poll" RENAME TO "Poll";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

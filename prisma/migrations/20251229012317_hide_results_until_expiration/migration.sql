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
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" DATETIME,
    "hideResultsUntilExpiration" BOOLEAN NOT NULL DEFAULT false,
    "askName" BOOLEAN NOT NULL DEFAULT false,
    "showParticipants" TEXT NOT NULL DEFAULT 'never',
    "participants" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Poll" ("askName", "createdAt", "description", "expiresAt", "grades", "id", "isPublic", "options", "participants", "preventMultipleVotes", "showParticipants", "title", "updatedAt") SELECT "askName", "createdAt", "description", "expiresAt", "grades", "id", "isPublic", "options", "participants", "preventMultipleVotes", "showParticipants", "title", "updatedAt" FROM "Poll";
DROP TABLE "Poll";
ALTER TABLE "new_Poll" RENAME TO "Poll";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

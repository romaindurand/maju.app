/*
  Warnings:

  - You are about to drop the column `name` on the `Vote` table. All the data in the column will be lost.

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
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" DATETIME,
    "askName" BOOLEAN NOT NULL DEFAULT false,
    "showParticipants" TEXT NOT NULL DEFAULT 'never',
    "participants" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Poll" ("askName", "createdAt", "description", "expiresAt", "grades", "id", "isPublic", "options", "preventMultipleVotes", "showParticipants", "title", "updatedAt") SELECT "askName", "createdAt", "description", "expiresAt", "grades", "id", "isPublic", "options", "preventMultipleVotes", "showParticipants", "title", "updatedAt" FROM "Poll";
DROP TABLE "Poll";
ALTER TABLE "new_Poll" RENAME TO "Poll";
CREATE TABLE "new_Vote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pollId" TEXT NOT NULL,
    "ballot" TEXT NOT NULL,
    "voterIdentifier" TEXT NOT NULL,
    "fingerprint" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Vote_pollId_fkey" FOREIGN KEY ("pollId") REFERENCES "Poll" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Vote" ("ballot", "createdAt", "fingerprint", "id", "pollId", "voterIdentifier") SELECT "ballot", "createdAt", "fingerprint", "id", "pollId", "voterIdentifier" FROM "Vote";
DROP TABLE "Vote";
ALTER TABLE "new_Vote" RENAME TO "Vote";
CREATE INDEX "Vote_pollId_idx" ON "Vote"("pollId");
CREATE INDEX "Vote_voterIdentifier_pollId_idx" ON "Vote"("voterIdentifier", "pollId");
CREATE INDEX "Vote_fingerprint_pollId_idx" ON "Vote"("fingerprint", "pollId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

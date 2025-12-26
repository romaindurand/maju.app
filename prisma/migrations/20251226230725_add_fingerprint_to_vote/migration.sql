-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Vote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pollId" TEXT NOT NULL,
    "ballot" TEXT NOT NULL,
    "voterIdentifier" TEXT NOT NULL,
    "fingerprint" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Vote_pollId_fkey" FOREIGN KEY ("pollId") REFERENCES "Poll" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Vote" ("ballot", "createdAt", "id", "pollId", "voterIdentifier") SELECT "ballot", "createdAt", "id", "pollId", "voterIdentifier" FROM "Vote";
DROP TABLE "Vote";
ALTER TABLE "new_Vote" RENAME TO "Vote";
CREATE INDEX "Vote_pollId_idx" ON "Vote"("pollId");
CREATE INDEX "Vote_voterIdentifier_pollId_idx" ON "Vote"("voterIdentifier", "pollId");
CREATE INDEX "Vote_fingerprint_pollId_idx" ON "Vote"("fingerprint", "pollId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Card" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "deckId" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'QUESTION_ANSWER',
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "optionsJson" TEXT,
    "due" BOOLEAN NOT NULL DEFAULT true,
    "repetitions" INTEGER NOT NULL DEFAULT 0,
    "intervalDays" INTEGER NOT NULL DEFAULT 0,
    "easeFactor" REAL NOT NULL DEFAULT 2.5,
    "dueAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Card_deckId_fkey" FOREIGN KEY ("deckId") REFERENCES "Deck" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Card" ("answer", "createdAt", "deckId", "due", "id", "optionsJson", "question", "type", "updatedAt") SELECT "answer", "createdAt", "deckId", "due", "id", "optionsJson", "question", "type", "updatedAt" FROM "Card";
DROP TABLE "Card";
ALTER TABLE "new_Card" RENAME TO "Card";
CREATE INDEX "Card_deckId_idx" ON "Card"("deckId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

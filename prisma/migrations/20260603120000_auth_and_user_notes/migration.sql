-- Require email on User
UPDATE "User" SET "email" = "id" || '@legacy.local' WHERE "email" IS NULL;
ALTER TABLE "User" ALTER COLUMN "email" SET NOT NULL;

-- Scope notes to users
DELETE FROM "Note";

ALTER TABLE "Note" ADD COLUMN "userId" TEXT NOT NULL;
ALTER TABLE "Note" ADD CONSTRAINT "Note_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
CREATE INDEX "Note_userId_idx" ON "Note"("userId");

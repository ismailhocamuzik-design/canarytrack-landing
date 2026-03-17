-- CreateEnum
CREATE TYPE "EarlyAccessRole" AS ENUM ('breeder', 'association_leader', 'federation_representative', 'veterinarian', 'enthusiast');

-- CreateTable
CREATE TABLE "EarlyAccess" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,
    "role" "EarlyAccessRole" NOT NULL,
    "referralCode" TEXT NOT NULL,
    "referralCount" INTEGER NOT NULL DEFAULT 0,
    "waitlistRank" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EarlyAccess_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EarlyAccess_email_key" ON "EarlyAccess"("email");

-- CreateIndex
CREATE UNIQUE INDEX "EarlyAccess_referralCode_key" ON "EarlyAccess"("referralCode");

-- CreateIndex
CREATE INDEX "EarlyAccess_countryCode_idx" ON "EarlyAccess"("countryCode");

-- CreateIndex
CREATE INDEX "EarlyAccess_role_idx" ON "EarlyAccess"("role");

-- CreateIndex
CREATE INDEX "EarlyAccess_createdAt_idx" ON "EarlyAccess"("createdAt");

-- CreateIndex
CREATE INDEX "EarlyAccess_waitlistRank_idx" ON "EarlyAccess"("waitlistRank");

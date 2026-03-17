-- AlterTable
ALTER TABLE "EarlyAccess" ADD COLUMN     "referredByCode" TEXT;

-- CreateIndex
CREATE INDEX "EarlyAccess_referredByCode_idx" ON "EarlyAccess"("referredByCode");

-- AddForeignKey
ALTER TABLE "EarlyAccess" ADD CONSTRAINT "EarlyAccess_referredByCode_fkey" FOREIGN KEY ("referredByCode") REFERENCES "EarlyAccess"("referralCode") ON DELETE SET NULL ON UPDATE CASCADE;

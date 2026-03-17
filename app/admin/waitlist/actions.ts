"use server";

import { revalidatePath } from "next/cache";
import { recalculateEarlyAccessWaitlistRanks } from "../../../lib/early-access/ranking";

export async function recalculateWaitlistRanksAction() {
  await recalculateEarlyAccessWaitlistRanks();

  revalidatePath("/admin");
  revalidatePath("/admin/waitlist");
  revalidatePath("/leaderboard");
}
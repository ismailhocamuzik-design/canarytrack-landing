import { prisma } from "@/lib/prisma";

export async function getWaitlistRank(userId: string) {
  const users = await prisma.earlyAccess.findMany({
    orderBy: [
      { referralCount: "desc" },
      { createdAt: "asc" },
    ],
    select: {
      id: true,
    },
  });

  const index = users.findIndex((u) => u.id === userId);

  if (index === -1) {
    return null;
  }

  return index + 1;
}
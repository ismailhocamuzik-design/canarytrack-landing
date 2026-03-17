import { prisma } from "../prisma";

export async function recalculateEarlyAccessRanks() {
  const users = await prisma.earlyAccess.findMany({
    orderBy: [{ referralCount: "desc" }, { createdAt: "asc" }],
    select: {
      id: true,
    },
  });

  if (users.length === 0) {
    return;
  }

  await prisma.$transaction(
    users.map((user, index) =>
      prisma.earlyAccess.update({
        where: {
          id: user.id,
        },
        data: {
          waitlistRank: index + 1,
        },
      }),
    ),
  );
}

export async function getEarlyAccessByEmail(email: string) {
  return prisma.earlyAccess.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      username: true,
      email: true,
      referralCode: true,
      referralCount: true,
      waitlistRank: true,
      createdAt: true,
    },
  });
}
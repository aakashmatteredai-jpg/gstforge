import { prisma } from "@gstforge/prisma";
import type { BusinessDetails } from "@gstforge/types";

type ResolveUserInput = {
  userId?: string;
  authUserId?: string;
  email?: string;
  businessDetails?: BusinessDetails;
};

const FALLBACK_EMAIL = "demo@gstforge.local";

function startOfToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

async function refreshDailyCredits(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return null;
  }

  const today = startOfToday();
  const lastCreditRefreshAt = (user as any).lastCreditRefreshAt as Date | null;

  if (!lastCreditRefreshAt || lastCreditRefreshAt < today) {
    try {
      return await prisma.user.update({
        where: { id: userId },
        data: {
          credits: 50,
          lastCreditRefreshAt: new Date(),
        } as any,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "";

      // Gracefully handle the period before `prisma db push` has added the new field.
      if (!message.includes("lastCreditRefreshAt")) {
        throw error;
      }
    }
  }

  return user;
}

export async function resolveOrCreateUser(input: ResolveUserInput) {
  let user = input.userId
    ? await prisma.user.findUnique({ where: { id: input.userId } })
    : null;

  if (!user && input.authUserId) {
    user = await prisma.user.findUnique({ where: { authUserId: input.authUserId } });
  }

  if (!user && input.email) {
    user = await prisma.user.findUnique({ where: { email: input.email } });
  }

  const email = input.email ?? FALLBACK_EMAIL;

  if (!user) {
    user = await prisma.user.create({
      data: {
        authUserId: input.authUserId,
        email,
        name: input.businessDetails?.name ?? "GSTForge Demo User",
        businessDetails: input.businessDetails,
        credits: 50,
      },
    });
  } else if (input.businessDetails) {
    user = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: input.businessDetails.name,
        businessDetails: input.businessDetails,
      },
    });
  }

  return refreshDailyCredits(user.id);
}

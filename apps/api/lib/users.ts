import { prisma } from "@gstforge/prisma";
import type { BusinessDetails } from "@gstforge/types";

type ResolveUserInput = {
  userId?: string;
  authUserId?: string;
  email?: string;
  businessDetails?: BusinessDetails;
};

const FALLBACK_EMAIL = "demo@gstforge.local";

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

  return user;
}

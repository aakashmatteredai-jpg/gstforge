import { NextResponse } from "next/server";
import { prisma } from "@gstforge/prisma";
import { BusinessDetailsSchema } from "@gstforge/types";
import { z } from "zod";
import { getCurrentUser } from "../../../../lib/auth";

const profileSchema = z.object({
  businessDetails: BusinessDetailsSchema,
});

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const payload = profileSchema.parse(await req.json());

    const user = await prisma.user.update({
      where: { id: currentUser.user.id },
      data: {
        name: payload.businessDetails.name,
        businessDetails: payload.businessDetails,
      },
      select: {
        id: true,
        credits: true,
        businessDetails: true,
      },
    });

    return NextResponse.json({
      user,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.errors[0]?.message ?? "Invalid profile data" }, { status: 400 });
    }

    console.error("[ACCOUNT_PROFILE_ERROR]", error);
    return NextResponse.json({ message: "Unable to save business profile" }, { status: 500 });
  }
}

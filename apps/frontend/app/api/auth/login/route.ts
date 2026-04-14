import { NextResponse } from "next/server";
import { prisma } from "@gstforge/prisma";
import { z } from "zod";
import { buildSessionCookie, createSessionToken, verifyPassword } from "../../../../lib/auth";

const loginSchema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(req: Request) {
  try {
    const { email, password } = loginSchema.parse(await req.json());
    const normalizedEmail = email.toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user || !user.passwordHash || !verifyPassword(password, user.passwordHash)) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    const response = NextResponse.json({
      user: {
        userId: user.id,
        authUserId: user.authUserId,
        name: user.name,
        email: user.email,
      },
    });

    response.cookies.set(
      buildSessionCookie(
        createSessionToken({
          userId: user.id,
          authUserId: user.authUserId ?? undefined,
          name: user.name,
          email: user.email,
        }),
      ),
    );

    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.errors[0]?.message ?? "Invalid login data" }, { status: 400 });
    }

    console.error("[AUTH_LOGIN_ERROR]", error);
    return NextResponse.json({ message: "Unable to sign in" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@gstforge/prisma";
import { z } from "zod";
import { buildSessionCookie, createAuthUserId, createSessionToken, hashPassword } from "../../../../lib/auth";

const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(req: Request) {
  try {
    const { name, email, password } = signupSchema.parse(await req.json());
    const normalizedEmail = email.toLowerCase();

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json({ message: "An account with this email already exists" }, { status: 409 });
    }

    const user = await prisma.user.create({
      data: {
        authUserId: createAuthUserId(),
        name,
        email: normalizedEmail,
        passwordHash: hashPassword(password),
      },
    });

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
      return NextResponse.json({ message: error.errors[0]?.message ?? "Invalid signup data" }, { status: 400 });
    }

    console.error("[AUTH_SIGNUP_ERROR]", error);
    return NextResponse.json({ message: "Unable to create account" }, { status: 500 });
  }
}

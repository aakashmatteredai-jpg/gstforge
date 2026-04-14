import { NextResponse } from "next/server";
import { getCurrentSession } from "../../../../lib/auth";

const apiBaseUrl = process.env.API_INTERNAL_URL ?? "http://localhost:3002";

export async function POST(req: Request) {
  try {
    const session = await getCurrentSession();

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const payload = await req.json();
    const response = await fetch(`${apiBaseUrl}/api/invoice/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...payload,
        userId: session.userId,
        authUserId: session.authUserId,
        email: session.email,
      }),
      cache: "no-store",
    });

    const data = await response.text();

    return new NextResponse(data, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("Content-Type") ?? "application/json",
      },
    });
  } catch (error) {
    console.error("[FRONTEND_INVOICE_PROXY_ERROR]", error);
    return NextResponse.json({ message: "Unable to reach invoice API" }, { status: 502 });
  }
}

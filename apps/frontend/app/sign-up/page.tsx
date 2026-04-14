import { redirect } from "next/navigation";
import { AuthForm } from "../../components/auth/auth-form";
import { getCurrentSession } from "../../lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function SignUpPage() {
  const session = await getCurrentSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto grid min-h-[80vh] max-w-6xl items-center gap-8 md:grid-cols-[0.95fr_1.05fr]">
        <section className="flex justify-center order-2 md:order-1">
          <AuthForm mode="sign-up" />
        </section>
        <section className="order-1 rounded-[32px] bg-[radial-gradient(circle_at_top,#f59e0b,transparent_30%),linear-gradient(135deg,#1e1b4b,#111827_52%,#0f172a)] p-10 text-white shadow-2xl md:order-2">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Create Account</p>
          <h1 className="mt-6 max-w-lg text-5xl font-black leading-tight">
            Build your GST workspace with native Next.js signup.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-slate-300">
            Account creation, dashboard access, and API-backed invoicing now run through your own app routes and session cookies.
          </p>
        </section>
      </div>
    </main>
  );
}

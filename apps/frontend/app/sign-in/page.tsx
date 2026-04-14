import { redirect } from "next/navigation";
import { AuthForm } from "../../components/auth/auth-form";
import { getCurrentSession } from "../../lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function SignInPage() {
  const session = await getCurrentSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto grid min-h-[80vh] max-w-6xl items-center gap-8 md:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-[32px] bg-[radial-gradient(circle_at_top,#60a5fa,transparent_32%),linear-gradient(135deg,#020617,#0f172a_48%,#111827)] p-10 text-white shadow-2xl">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Next.js Auth</p>
          <h1 className="mt-6 max-w-lg text-5xl font-black leading-tight">
            Sign in with app-owned auth, not a third-party widget.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-slate-300">
            Your session is now handled by Next.js API routes and secure cookies, while the dashboard and invoice actions stay fully dynamic.
          </p>
        </section>
        <section className="flex justify-center">
          <AuthForm mode="sign-in" />
        </section>
      </div>
    </main>
  );
}

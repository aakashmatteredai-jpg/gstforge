import { redirect } from "next/navigation";
import UserDashboard from "../../components/layout/dashboard";
import { getCurrentSession } from "../../lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashPage() {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/sign-in");
  }

  return <UserDashboard session={session} />;
}

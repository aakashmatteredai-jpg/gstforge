import { redirect } from "next/navigation";
import UserDashboard from "../../components/layout/dashboard";
import { getCurrentUser } from "../../lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/sign-in");
  }

  return (
    <UserDashboard
      session={currentUser.session}
      initialBusinessDetails={currentUser.user.businessDetails as any}
      initialCredits={currentUser.user.credits}
    />
  );
}

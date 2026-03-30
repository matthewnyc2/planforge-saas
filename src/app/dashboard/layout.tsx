import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { DashboardNav } from "@/components/dashboard-nav";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col lg:flex-row min-h-screen">
        <DashboardNav />
        <main className="flex-1 overflow-auto">
          <div className="p-6 sm:p-8 lg:p-10">{children}</div>
        </main>
      </div>
    </div>
  );
}

import { redirect } from "next/navigation";
import { getAdminUser } from "@courseadvice/auth/admin";
import { SidebarInset, SidebarProvider } from "@courseadvice/ui/sidebar";
import { AdminSidebar } from "@/components/admin-sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAdminUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <SidebarProvider>
      <AdminSidebar role={user.role} />
      <SidebarInset>
        <main className="flex flex-1 flex-col gap-4 p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getAdminUser } from "@courseadvice/auth/admin";
import { SidebarInset, SidebarProvider } from "@courseadvice/ui/sidebar";
import { AdminSidebar } from "@/components/admin-sidebar";

/** Public route prefixes that do not require an authenticated admin user. */
const PUBLIC_PREFIXES = ["/sign-in", "/sign-up"];

export async function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();

  // Next.js sets x-matched-path to the matched route pattern.
  // We also check x-invoke-path and x-url as fallbacks.
  const matchedPath =
    headersList.get("x-matched-path") ??
    headersList.get("x-invoke-path") ??
    headersList.get("x-url") ??
    "";

  const isPublic = PUBLIC_PREFIXES.some((prefix) =>
    matchedPath.startsWith(prefix)
  );

  if (isPublic) {
    return <>{children}</>;
  }

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

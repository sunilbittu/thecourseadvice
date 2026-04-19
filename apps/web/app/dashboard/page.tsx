export const dynamic = "force-dynamic";

import DashboardClient from "./dashboard-client";
import { getDashboardData } from "@courseadvice/db/queries";
import { getAuth } from "@courseadvice/auth";

export default async function DashboardPage() {
  const { userId } = await getAuth();
  const data = await getDashboardData(userId ?? "1");
  return <DashboardClient data={data} />;
}

import { DashboardData } from "@/lib/types";
import DashboardClient from "./dashboard-client";
import dashboardData from "@/lib/data/dashboard.json";

export default async function DashboardPage() {
  const data = dashboardData as DashboardData;
  return <DashboardClient data={data} />;
}

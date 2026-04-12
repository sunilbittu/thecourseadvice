import { DashboardData } from "@/lib/types";
import DashboardClient from "./dashboard-client";

async function getDashboard(): Promise<DashboardData> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/dashboard`, { cache: "no-store" });
  return res.json();
}

export default async function DashboardPage() {
  const data = await getDashboard();
  return <DashboardClient data={data} />;
}

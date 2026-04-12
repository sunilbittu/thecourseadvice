import { AnalyticsData } from "@/lib/types";
import AnalyticsClient from "./analytics-client";

async function getAnalytics(): Promise<AnalyticsData> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/institution/analytics`, { cache: "no-store" });
  return res.json();
}

export default async function AnalyticsPage() {
  const data = await getAnalytics();
  return <AnalyticsClient data={data} />;
}

import { AnalyticsData } from "@/lib/types";
import AnalyticsClient from "./analytics-client";
import analyticsData from "@/lib/data/analytics.json";

export default async function AnalyticsPage() {
  const data = analyticsData as AnalyticsData;
  return <AnalyticsClient data={data} />;
}

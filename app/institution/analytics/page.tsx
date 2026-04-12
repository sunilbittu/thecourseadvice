export const dynamic = "force-dynamic";

import AnalyticsClient from "./analytics-client";
import { getAnalyticsData } from "@/lib/db/queries";

export default async function AnalyticsPage() {
  const data = await getAnalyticsData("1");
  return <AnalyticsClient data={data} />;
}

import { InstitutionDashboardData } from "@/lib/types";
import InstitutionClient from "./institution-client";
import institutionDashboardData from "@/lib/data/institution-dashboard.json";

export default async function InstitutionDashboardPage() {
  const data = institutionDashboardData as InstitutionDashboardData;
  return <InstitutionClient data={data} />;
}

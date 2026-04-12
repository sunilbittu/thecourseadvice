import { InstitutionDashboardData } from "@/lib/types";
import InstitutionClient from "./institution-client";

async function getInstitutionData(): Promise<InstitutionDashboardData> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/institution`, { cache: "no-store" });
  return res.json();
}

export default async function InstitutionDashboardPage() {
  const data = await getInstitutionData();
  return <InstitutionClient data={data} />;
}

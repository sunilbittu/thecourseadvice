export const dynamic = "force-dynamic";

import InstitutionClient from "./institution-client";
import { getInstitutionDashboard } from "@courseadvice/db/queries";

export default async function InstitutionDashboardPage() {
  const data = await getInstitutionDashboard("1");
  return <InstitutionClient data={data} />;
}

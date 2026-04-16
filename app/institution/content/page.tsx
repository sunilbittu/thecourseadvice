export const dynamic = "force-dynamic";

import { getContentCRMData } from "@/lib/db/queries";
import ContentCRMClient from "./content-crm-client";

export default async function ContentCRMPage() {
  const data = await getContentCRMData("1");
  return <ContentCRMClient data={data} />;
}

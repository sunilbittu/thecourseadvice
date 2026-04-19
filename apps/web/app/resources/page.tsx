export const dynamic = "force-dynamic";

import ResourcesClient from "./resources-client";
import { getResourcesData } from "@courseadvice/db/queries";

export default async function ResourcesPage() {
  const data = await getResourcesData();
  return <ResourcesClient data={data} />;
}

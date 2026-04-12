import { ResourcesData } from "@/lib/types";
import ResourcesClient from "./resources-client";
import resourcesData from "@/lib/data/resources.json";

export default async function ResourcesPage() {
  const data = resourcesData as ResourcesData;
  return <ResourcesClient data={data} />;
}

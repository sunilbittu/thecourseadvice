import { ResourcesData } from "@/lib/types";
import ResourcesClient from "./resources-client";

async function getResources(): Promise<ResourcesData> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/resources`, { cache: "no-store" });
  return res.json();
}

export default async function ResourcesPage() {
  const data = await getResources();
  return <ResourcesClient data={data} />;
}

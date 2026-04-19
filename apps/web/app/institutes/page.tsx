import institutesData from "@/lib/data/institutes.json";
import InstitutesClient from "./institutes-client";

export default function InstitutesPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <InstitutesClient institutes={institutesData as any} />;
}

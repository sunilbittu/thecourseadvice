import institutes from "@/lib/data/institutes.json";
import InstitutesClient from "./institutes-client";

export default function InstitutesPage() {
  return <InstitutesClient institutes={institutes} />;
}

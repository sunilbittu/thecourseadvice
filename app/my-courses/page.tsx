import { DashboardData } from "@/lib/types";
import MyCoursesClient from "./my-courses-client";

async function getDashboard(): Promise<DashboardData> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/dashboard`, { cache: "no-store" });
  return res.json();
}

export default async function MyCoursesPage() {
  const data = await getDashboard();
  return <MyCoursesClient data={data} />;
}

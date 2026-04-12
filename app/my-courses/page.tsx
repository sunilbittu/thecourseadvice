import { DashboardData } from "@/lib/types";
import MyCoursesClient from "./my-courses-client";
import dashboardData from "@/lib/data/dashboard.json";

export default async function MyCoursesPage() {
  const data = dashboardData as DashboardData;
  return <MyCoursesClient data={data} />;
}

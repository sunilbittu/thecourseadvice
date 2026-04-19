export const dynamic = "force-dynamic";

import MyCoursesClient from "./my-courses-client";
import { getDashboardData } from "@courseadvice/db/queries";
import { getAuth } from "@courseadvice/auth";

export default async function MyCoursesPage() {
  const { userId } = await getAuth();
  const data = await getDashboardData(userId ?? "1");
  return <MyCoursesClient data={data} />;
}

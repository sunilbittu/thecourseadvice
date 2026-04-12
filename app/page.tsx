import { Course, Category, Institution } from "@/lib/types";
import HomeClient from "./home-client";
import coursesData from "@/lib/data/courses.json";
import categoriesData from "@/lib/data/categories.json";
import institutionsData from "@/lib/data/institutions.json";

export default async function HomePage() {
  const courses = coursesData as Course[];
  const categories = categoriesData as Category[];
  const institutions = institutionsData as Institution[];

  return <HomeClient courses={courses} categories={categories} institutions={institutions} />;
}

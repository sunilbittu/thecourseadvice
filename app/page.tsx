import Link from "next/link";
import { Course, Category, Institution } from "@/lib/types";
import HomeClient from "./home-client";

async function getCourses(): Promise<Course[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/courses`, { cache: "no-store" });
  return res.json();
}

async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/categories`, { cache: "no-store" });
  return res.json();
}

async function getInstitutions(): Promise<Institution[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/institutions`, { cache: "no-store" });
  return res.json();
}

export default async function HomePage() {
  const [courses, categories, institutions] = await Promise.all([
    getCourses(),
    getCategories(),
    getInstitutions(),
  ]);

  return <HomeClient courses={courses} categories={categories} institutions={institutions} />;
}

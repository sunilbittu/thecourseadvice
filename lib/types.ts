export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  instructor: string;
  price: number;
  rating: number;
  reviewCount: number;
  studentCount: number;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  language: string;
  delivery: "Online" | "In-Person" | "Hybrid";
  certification: boolean;
  image: string;
  institution: string;
  curriculum: CurriculumModule[];
  perks: string[];
}

export interface CurriculumModule {
  title: string;
  duration: string;
  lessons: number;
}

export interface Institution {
  id: string;
  name: string;
  logo: string;
  location: string;
  courseCount: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  courseCount: number;
  image: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "institution-admin";
  avatar: string;
  bio: string;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  enrolledCourses: string[];
  shortlist: string[];
}

export interface DashboardData {
  currentCourse: {
    id: string;
    title: string;
    progress: number;
    nextLesson: string;
  };
  studyHours: number;
  certificates: number;
  purchasedCourses: {
    id: string;
    title: string;
    progress: number;
    instructor: string;
    image: string;
  }[];
  shortlist: {
    id: string;
    title: string;
    price: number;
    instructor: string;
    image: string;
  }[];
  recommended: {
    id: string;
    title: string;
    price: number;
    rating: number;
    image: string;
  }[];
}

export interface InstitutionDashboardData {
  totalLeads: number;
  activeCourses: number;
  interestedStudents: number;
  recentLeads: {
    id: string;
    name: string;
    email: string;
    course: string;
    date: string;
    status: "new" | "contacted" | "enrolled";
  }[];
  myCourses: {
    id: string;
    title: string;
    students: number;
    revenue: number;
    status: "active" | "draft" | "archived";
  }[];
  monthlyGoal: {
    target: number;
    current: number;
  };
}

export interface AnalyticsData {
  kpis: {
    totalViews: number;
    totalLeads: number;
    conversionRate: number;
    avgTimeOnPage: string;
  };
  interestOverTime: {
    month: string;
    leads: number;
    views: number;
  }[];
  deliveryPreference: {
    type: string;
    percentage: number;
  }[];
  topLocations: {
    city: string;
    country: string;
    leads: number;
  }[];
  coursePerformance: {
    id: string;
    title: string;
    views: number;
    leads: number;
    conversion: number;
    trend: "up" | "down" | "stable";
  }[];
}

export interface ResourcesData {
  categories: {
    id: string;
    name: string;
    description: string;
    assetCount: number;
  }[];
  featuredAssets: {
    id: string;
    title: string;
    type: "guide" | "template" | "video" | "tool";
    description: string;
    image: string;
    downloadUrl: string;
  }[];
  scholarlyTools: {
    id: string;
    name: string;
    description: string;
    icon: string;
    url: string;
  }[];
}

import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import { AuthProvider } from "@courseadvice/auth/provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const manrope = Manrope({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "CourseAdvice Admin",
  description: "Admin CMS for CourseAdvice",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <html
        lang="en"
        className={`${inter.variable} ${manrope.variable} h-full antialiased`}
      >
        <body className="min-h-full bg-background text-foreground">
          {children}
        </body>
      </html>
    </AuthProvider>
  );
}

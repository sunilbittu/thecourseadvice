import Link from "next/link";

const footerLinks = {
  explore: [
    { label: "All Courses", href: "/" },
    { label: "Categories", href: "/" },
    { label: "Institutions", href: "/" },
    { label: "Resources", href: "/resources" },
  ],
  students: [
    { label: "Dashboard", href: "/dashboard" },
    { label: "My Courses", href: "/my-courses" },
    { label: "Shortlist", href: "/my-courses" },
    { label: "Profile", href: "/settings/profile" },
  ],
  institutions: [
    { label: "Dashboard", href: "/institution" },
    { label: "Analytics", href: "/institution/analytics" },
    { label: "Create Course", href: "/institution" },
    { label: "Manage Leads", href: "/institution" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-primary text-white mt-auto">
      {/* CTA Banner */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.07]">
          <div className="absolute top-1/2 left-1/4 w-[600px] h-[600px] rounded-full bg-surface-tint blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-secondary-container blur-[100px]" />
        </div>
        <div className="max-w-[1920px] mx-auto px-12 py-20 relative">
          <div className="max-w-2xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/50 mb-4">
              Start Your Journey
            </p>
            <h2 className="font-heading text-[2.5rem] font-extrabold leading-[1.1] tracking-[-0.02em] mb-4">
              Discover courses that shape
              <br />
              your future
            </h2>
            <p className="text-white/60 text-lg leading-relaxed mb-8 max-w-lg">
              Join thousands of learners finding their perfect program from world-class institutions.
            </p>
            <div className="flex gap-4">
              <Link
                href="/"
                className="inline-flex items-center px-8 py-4 bg-white text-primary font-heading font-bold text-sm rounded-xl hover:bg-white/90 transition-all duration-300 hover:-translate-y-0.5"
              >
                Explore Courses
              </Link>
              <Link
                href="/institution"
                className="inline-flex items-center px-8 py-4 border border-white/20 text-white font-heading font-bold text-sm rounded-xl hover:bg-white/10 transition-all duration-300"
              >
                For Institutions
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Links Grid */}
      <div className="border-t border-white/10">
        <div className="max-w-[1920px] mx-auto px-12 py-16">
          <div className="grid grid-cols-12 gap-8">
            {/* Brand */}
            <div className="col-span-12 md:col-span-4 lg:col-span-3">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <span className="text-white font-heading font-extrabold text-lg">C</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-heading font-extrabold text-lg leading-none">
                    CourseAdvice
                  </span>
                  <span className="text-[9px] font-semibold uppercase tracking-[0.25em] text-white/40 leading-none mt-0.5">
                    The Scholarly Perspective
                  </span>
                </div>
              </div>
              <p className="text-white/50 text-sm leading-relaxed max-w-xs">
                A premium digital curator for academic discovery. Connecting learners with world-class institutions worldwide.
              </p>
            </div>

            {/* Explore */}
            <div className="col-span-6 md:col-span-2 lg:col-span-2 lg:col-start-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-5">
                Explore
              </p>
              <ul className="space-y-3">
                {footerLinks.explore.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 hover:text-white transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Students */}
            <div className="col-span-6 md:col-span-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-5">
                Students
              </p>
              <ul className="space-y-3">
                {footerLinks.students.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 hover:text-white transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Institutions */}
            <div className="col-span-6 md:col-span-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-5">
                Institutions
              </p>
              <ul className="space-y-3">
                {footerLinks.institutions.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 hover:text-white transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-[1920px] mx-auto px-12 py-6 flex items-center justify-between">
          <p className="text-xs text-white/30">
            &copy; {new Date().getFullYear()} CourseAdvice. All rights reserved.
          </p>
          <div className="flex gap-6">
            <span className="text-xs text-white/30 hover:text-white/60 cursor-pointer transition-colors">Privacy</span>
            <span className="text-xs text-white/30 hover:text-white/60 cursor-pointer transition-colors">Terms</span>
            <span className="text-xs text-white/30 hover:text-white/60 cursor-pointer transition-colors">Contact</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

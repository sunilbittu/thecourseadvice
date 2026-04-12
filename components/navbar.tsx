"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Search, ChevronDown } from "lucide-react";

const navLinks = [
  { label: "Courses", href: "/", },
  { label: "Dashboard", href: "/dashboard" },
  { label: "My Courses", href: "/my-courses" },
  { label: "Resources", href: "/resources" },
  { label: "Institution", href: "/institution" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "glass shadow-editorial py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-[1920px] mx-auto px-8 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-surface-tint to-primary flex items-center justify-center">
              <span className="text-white font-heading font-extrabold text-lg">C</span>
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-extrabold text-on-surface text-lg leading-none tracking-tight">
                CourseAdvice
              </span>
              <span className="text-[9px] font-semibold uppercase tracking-[0.25em] text-on-surface-variant leading-none mt-0.5">
                The Scholarly Perspective
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                    isActive
                      ? "text-surface-tint bg-surface-tint/8"
                      : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-surface-tint rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            <button className="p-2.5 rounded-xl hover:bg-surface-container-high transition-colors text-on-surface-variant hover:text-on-surface">
              <Search className="w-[18px] h-[18px]" />
            </button>
            <Link
              href="/settings/profile"
              className="flex items-center gap-2 pl-3 pr-4 py-2 rounded-xl hover:bg-surface-container-low transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary-container to-surface-tint" />
              <span className="text-sm font-medium text-on-surface">Profile</span>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-xl hover:bg-surface-container-high transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ease-out ${
            mobileOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-8 pb-6 pt-2 space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? "text-surface-tint bg-surface-tint/8"
                      : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Spacer */}
      <div className="h-20" />
    </>
  );
}

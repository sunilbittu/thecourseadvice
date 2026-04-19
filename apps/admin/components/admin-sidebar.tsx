"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Building2,
  Tag,
  FileText,
  Palette,
  Settings,
  Users,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@courseadvice/ui/sidebar";

type AdminRole = "superadmin" | "institution-admin";

interface NavItem {
  label: string;
  icon: React.ElementType;
  path: string;
  roles: AdminRole[];
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/",
    roles: ["superadmin", "institution-admin"],
  },
  {
    label: "Courses",
    icon: BookOpen,
    path: "/courses",
    roles: ["superadmin", "institution-admin"],
  },
  {
    label: "Institutions",
    icon: Building2,
    path: "/institutions",
    roles: ["superadmin", "institution-admin"],
  },
  {
    label: "Categories",
    icon: Tag,
    path: "/categories",
    roles: ["superadmin"],
  },
  {
    label: "Resources",
    icon: FileText,
    path: "/resources",
    roles: ["superadmin"],
  },
  {
    label: "Content",
    icon: Palette,
    path: "/content",
    roles: ["superadmin"],
  },
  {
    label: "Settings",
    icon: Settings,
    path: "/settings",
    roles: ["superadmin"],
  },
  {
    label: "Users",
    icon: Users,
    path: "/users",
    roles: ["superadmin"],
  },
];

interface AdminSidebarProps {
  role: AdminRole;
}

export function AdminSidebar({ role }: AdminSidebarProps) {
  const pathname = usePathname();

  const visibleItems = navItems.filter((item) => item.roles.includes(role));

  return (
    <Sidebar>
      <SidebarHeader className="px-4 py-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="TheCourseAdvice"
            width={160}
            height={44}
            className="h-8 w-auto"
            priority
          />
          <span className="text-xs text-muted-foreground leading-none capitalize">
            {role}
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleItems.map((item) => {
                const isActive =
                  item.path === "/"
                    ? pathname === "/"
                    : pathname === item.path ||
                      pathname.startsWith(item.path + "/");
                const Icon = item.icon;

                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      isActive={isActive}
                      render={<Link href={item.path} />}
                    >
                      <Icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

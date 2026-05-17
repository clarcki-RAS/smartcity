"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { AlertTriangle, BarChart3, LayoutDashboard, LogOut, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { clearTokens } from "@/lib/api";

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const mainMenu = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Signalements", href: "/admin/signalements", icon: AlertTriangle },
    { label: "Statistiques", href: "/admin/statistiques", icon: BarChart3 },
    { label: "Gestion des Utilisateurs", href: "/admin/utilisateurs", icon: Users },
  ];

  return (
    <Sidebar variant="inset" className="bg-white border-r">
      <SidebarContent className="px-2 py-4">
        <div className="px-4 pb-6 flex items-center gap-2">
          <Image src="/images/logo-rounded.png" alt="SmartCity" width={50} height={50} priority />
          <span className="text-lg mb-2 font-semibold text-slate-900">Smartcity</span>
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="mt-2 space-y-1">
              {mainMenu.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      asChild
                      className={`group h-10 px-4 rounded-lg transition-all ${
                        isActive
                          ? "bg-slate-200 text-slate-900 font-semibold"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 hover:font-semibold"
                      }`}
                    >
                      <Link href={item.href}>
                        <item.icon className={`h-4 w-4 ${isActive ? "text-slate-900" : "text-slate-500 group-hover:text-slate-900"}`} />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenuButton
          onClick={() => {
            clearTokens();
            router.push("/login");
          }}
          className="group h-10 px-4 rounded-lg text-red-600 transition-all hover:bg-red-50 hover:font-semibold"
        >
          <LogOut className="h-4 w-4" />
          <span>Déconnexion</span>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}
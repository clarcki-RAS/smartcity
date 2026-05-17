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
import { ClipboardList, Home, LogOut, MapPinned } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { clearTokens } from "@/lib/api";

export function CivilSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const menu = [
    { label: "Accueil", href: "/civil", icon: Home },
    { label: "Mes signalements", href: "/civil/signalements", icon: ClipboardList },
    { label: "Cartographie", href: "/civil/cartographie", icon: MapPinned },
  ];

  return (
    <Sidebar variant="inset" className="bg-white border-r">
      <SidebarContent className="px-2 py-4">
        <div className="px-4 pb-6 flex items-center gap-2">
          <Image src="/images/logo-rounded.png" alt="SmartCity" width={50} height={50} priority />
          <span className="text-lg pb-3 font-semibold text-slate-900">SmartCity</span>
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menu.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.href}>
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

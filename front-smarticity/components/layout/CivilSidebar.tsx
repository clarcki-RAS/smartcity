'use client';

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

import { Home, MapPin, LogOut } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function CivilSidebar() {
  return (
    <Sidebar variant="inset" className="bg-white border-r">
      <SidebarContent className="px-2 py-4">

        {/* LOGO */}
        <div className="px-4 pb-6 flex items-center gap-2">
          <Image
            src="/images/logo-rounded.png"
            alt="SmartCity"
            width={50}
            height={50}
            priority
          />
          <span className="text-lg pb-3 font-semibold text-slate-900">
            SmartCyti
          </span>
        </div>

        {/* MENU */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="
                    group h-10 px-4 rounded-lg
                    text-slate-600
                    transition-all
                    hover:bg-slate-100
                    hover:text-slate-900
                    hover:font-semibold
                  "
                >
                  <Link href="/civil">
                    <Home className="h-4 w-4 text-slate-500 group-hover:text-slate-900" />
                    <span>Accueil</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="
                    group h-10 px-4 rounded-lg
                    text-slate-600
                    transition-all
                    hover:bg-slate-100
                    hover:text-slate-900
                    hover:font-semibold
                  "
                >
                  <Link href="/civil/carte">
                    <MapPin className="h-4 w-4 text-slate-500 group-hover:text-slate-900" />
                    <span>Carte des signalements</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>

      {/* FOOTER */}
      <SidebarFooter>
        <SidebarMenuButton
          className="
            group h-10 px-4 rounded-lg
            text-red-600
            transition-all
            hover:bg-red-50
            hover:font-semibold
          "
        >
          <LogOut className="h-4 w-4" />
          <span>Déconnexion</span>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}

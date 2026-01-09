import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { CivilSidebar } from "@/components/layout/CivilSidebar";

export default function CivilLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <CivilSidebar />
      <SidebarInset className="bg-slate-100 p-6">
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}

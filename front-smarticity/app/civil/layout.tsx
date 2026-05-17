import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { CivilSidebar } from "@/components/layout/CivilSidebar";

export default function CivilLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <CivilSidebar />
        <SidebarInset className="flex-1 bg-slate-100 p-6 md:p-8">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

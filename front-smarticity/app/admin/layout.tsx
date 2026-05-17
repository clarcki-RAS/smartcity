import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
          <SidebarInset className="flex-1 bg-slate-100 p-6 md:p-8">
            <div className="mx-auto w-full max-w-full">{children}</div>
          </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

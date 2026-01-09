import { AdminHeader } from "@/components/admin/adminHeader";
import { StatsCards } from "@/components/admin/StatsCard";
import { RecentReportsTable } from "@/components/admin/RecentReportsTable";

export default function AdminPage() {
  return (
    <div style={{ marginLeft: 280 }} className="space-y-5">
      <AdminHeader />
      <StatsCards />
      <RecentReportsTable />
    </div>
  );
}

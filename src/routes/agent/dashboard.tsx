import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout, agentNav } from "@/components/layouts";
import { ApplicationsTable, NotificationsView, useScopedApps } from "@/components/application-views";
import { Card, SectionTitle, Stat } from "@/components/ui-kit";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/agent/dashboard")({
  head: () => ({
    meta: [
      { title: "Agent Dashboard | MapleLeaf Education" },
      { name: "description", content: "งานที่ต้องดำเนินการของเอเจนต์: ใบสมัครใหม่ ใบสมัครที่ต้องแก้ไข Offer และการชำระเงิน" },
      { property: "og:title", content: "Agent Dashboard | MapleLeaf Education" },
      { property: "og:description", content: "ระบบแสดงเฉพาะงานที่เอเจนต์ต้องทำ ไม่ต้องค้นหาเอง" },
    ],
  }),
  component: AgentDashboard,
});

function AgentDashboard() {
  const apps = useScopedApps("agent");
  const { unread } = useStore();

  const neu = apps.filter((a) => a.status === "รอตรวจสอบ");
  const fix = apps.filter((a) => a.status === "ส่งกลับให้แก้ไข");
  const sent = apps.filter((a) => a.status === "ส่งให้ College แล้ว");
  const offers = apps.filter((a) => a.status === "ออก Offer แล้ว");
  const pays = apps.filter((a) => a.payments.some((p) => p.status === "รอตรวจสอบการชำระเงิน"));

  return (
    <DashboardLayout nav={agentNav} title="Agent Dashboard">
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Stat label="รอตรวจสอบ" value={neu.length} tone="text-primary" />
        <Stat label="ส่งกลับให้แก้ไข" value={fix.length} />
        <Stat label="ส่งให้ College แล้ว" value={sent.length} />
        <Stat label="Offer รอส่งนักเรียน" value={offers.length} />
        <Stat label="Payment รอตรวจ" value={pays.length} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div>
            <SectionTitle title="งานที่ต้องดำเนินการ — Application ใหม่" desc="ระบบดึงมาให้แล้ว ไม่ต้องค้นหาเอง" />
            <ApplicationsTable role="agent" apps={neu} />
          </div>
          <div>
            <SectionTitle title="Offer / Invoice ที่ต้องส่งต่อให้นักเรียน" />
            <ApplicationsTable role="agent" apps={offers} />
          </div>
          <div>
            <SectionTitle title="Payment ที่ต้องตรวจสอบหลักฐาน" />
            <ApplicationsTable role="agent" apps={pays} />
          </div>
          <div>
            <SectionTitle title="Application ที่ส่งกลับให้นักเรียนแก้ไข" />
            <ApplicationsTable role="agent" apps={fix} />
          </div>
        </div>
        <div className="space-y-6">
          <Card>
            <p className="font-semibold">สรุปงานวันนี้</p>
            <p className="mt-2 text-sm text-muted-foreground">
              มีงานรอดำเนินการ {neu.length + offers.length + pays.length} รายการ และแจ้งเตือนใหม่ {unread} รายการ
            </p>
          </Card>
          <div>
            <SectionTitle title="การแจ้งเตือน" />
            <NotificationsView />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

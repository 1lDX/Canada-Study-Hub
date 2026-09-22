import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout, studentNav } from "@/components/layouts";
import { ApplicationsTable, useScopedApps } from "@/components/application-views";
import { SectionTitle } from "@/components/ui-kit";

export const Route = createFileRoute("/student/applications/")({
  head: () => ({
    meta: [
      { title: "ใบสมัครของฉัน | MapleLeaf Education" },
      { name: "description", content: "รายการใบสมัครหลักสูตรทั้งหมดและสถานะล่าสุดของแต่ละใบสมัคร" },
      { property: "og:title", content: "ใบสมัครของฉัน | MapleLeaf Education" },
      { property: "og:description", content: "ติดตามสถานะใบสมัครได้เองโดยไม่ต้องสอบถามเอเจนต์" },
    ],
  }),
  component: MyApplications,
});

function MyApplications() {
  const apps = useScopedApps("student");
  return (
    <DashboardLayout nav={studentNav} title="My Applications">
      <SectionTitle title="ใบสมัครทั้งหมด" desc={`${apps.length} รายการ`} />
      <ApplicationsTable role="student" apps={apps} />
    </DashboardLayout>
  );
}

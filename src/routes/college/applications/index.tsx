import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardLayout, collegeNav } from "@/components/layouts";
import { ApplicationsTable, useScopedApps } from "@/components/application-views";
import { Button, SectionTitle } from "@/components/ui-kit";
import { STATUSES } from "@/lib/data";

export const Route = createFileRoute("/college/applications/")({
  head: () => ({
    meta: [
      { title: "Applications (College) | MapleLeaf Education" },
      { name: "description", content: "รายการใบสมัครทั้งหมดที่เอเจนต์ดูแล พร้อมสถานะและผลตรวจเอกสาร" },
      { property: "og:title", content: "Applications (College) | MapleLeaf Education" },
      { property: "og:description", content: "จัดการใบสมัครของนักเรียนทั้งหมดในที่เดียว" },
    ],
  }),
  component: CollegeApplications,
});

function CollegeApplications() {
  const apps = useScopedApps("college");
  const [filter, setFilter] = useState<string>("");
  const list = filter ? apps.filter((a) => a.status === filter) : apps;
  return (
    <DashboardLayout nav={collegeNav} title="Applications">
      <SectionTitle title="ใบสมัครทั้งหมด" desc={`${list.length} รายการ`} />
      <div className="mb-4 flex flex-wrap gap-2">
        <Button size="sm" variant={filter ? "outline" : "primary"} onClick={() => setFilter("")}>
          ทั้งหมด
        </Button>
        {STATUSES.map((s) => (
          <Button key={s} size="sm" variant={filter === s ? "primary" : "outline"} onClick={() => setFilter(s)}>
            {s}
          </Button>
        ))}
      </div>
      <ApplicationsTable role="college" apps={list} />
    </DashboardLayout>
  );
}

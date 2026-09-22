import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardLayout, agentNav } from "@/components/layouts";
import { ApplicationsTable, useScopedApps } from "@/components/application-views";
import { Button, SectionTitle } from "@/components/ui-kit";
import { STATUSES } from "@/lib/data";

export const Route = createFileRoute("/agent/applications/")({
  head: () => ({
    meta: [
      { title: "Applications (Agent) | MapleLeaf Education" },
      { name: "description", content: "รายการใบสมัครทั้งหมดที่เอเจนต์ดูแล พร้อมสถานะและผลตรวจเอกสาร" },
      { property: "og:title", content: "Applications (Agent) | MapleLeaf Education" },
      { property: "og:description", content: "จัดการใบสมัครของนักเรียนทั้งหมดในที่เดียว" },
    ],
  }),
  component: AgentApplications,
});

function AgentApplications() {
  const apps = useScopedApps("agent");
  const [filter, setFilter] = useState<string>("");
  const list = filter ? apps.filter((a) => a.status === filter) : apps;
  return (
    <DashboardLayout nav={agentNav} title="Applications">
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
      <ApplicationsTable role="agent" apps={list} />
    </DashboardLayout>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { CollegeDashboardView } from "@/components/role-pages";

export const Route = createFileRoute("/college/dashboard")({
  head: () => ({
    meta: [
      { title: "College Dashboard | MapleLeaf Education" },
      { name: "description", content: "งานที่ College ต้องดำเนินการ" },
      { property: "og:title", content: "College Dashboard | MapleLeaf Education" },
      { property: "og:description", content: "งานที่ College ต้องดำเนินการ" },
    ],
  }),
  component: () => <CollegeDashboardView  />,
});

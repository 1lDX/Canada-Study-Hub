import { createFileRoute } from "@tanstack/react-router";
import { DocumentsPage } from "@/components/role-pages";

export const Route = createFileRoute("/agent/documents")({
  head: () => ({
    meta: [
      { title: "Documents (agent) | MapleLeaf Education" },
      { name: "description", content: "เอกสารของใบสมัครพร้อมผลตรวจความครบอัตโนมัติ" },
      { property: "og:title", content: "Documents (agent) | MapleLeaf Education" },
      { property: "og:description", content: "เอกสารของใบสมัครพร้อมผลตรวจความครบอัตโนมัติ" },
    ],
  }),
  component: () => <DocumentsPage role="agent" />,
});

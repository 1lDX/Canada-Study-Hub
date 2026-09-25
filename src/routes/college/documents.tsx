import { createFileRoute } from "@tanstack/react-router";
import { DocumentsPage } from "@/components/role-pages";

export const Route = createFileRoute("/college/documents")({
  head: () => ({
    meta: [
      { title: "Documents (college) | MapleLeaf Education" },
      { name: "description", content: "เอกสารของใบสมัครพร้อมผลตรวจความครบอัตโนมัติ" },
      { property: "og:title", content: "Documents (college) | MapleLeaf Education" },
      { property: "og:description", content: "เอกสารของใบสมัครพร้อมผลตรวจความครบอัตโนมัติ" },
    ],
  }),
  component: () => <DocumentsPage role="college" />,
});

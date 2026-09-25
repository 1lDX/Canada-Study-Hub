import { createFileRoute } from "@tanstack/react-router";
import { NotificationsPage } from "@/components/role-pages";

export const Route = createFileRoute("/agent/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications (agent) | MapleLeaf Education" },
      { name: "description", content: "การแจ้งเตือนภายในระบบ" },
      { property: "og:title", content: "Notifications (agent) | MapleLeaf Education" },
      { property: "og:description", content: "การแจ้งเตือนภายในระบบ" },
    ],
  }),
  component: () => <NotificationsPage role="agent" />,
});

import { createFileRoute } from "@tanstack/react-router";
import { NotificationsPage } from "@/components/role-pages";

export const Route = createFileRoute("/college/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications (college) | MapleLeaf Education" },
      { name: "description", content: "การแจ้งเตือนภายในระบบ" },
      { property: "og:title", content: "Notifications (college) | MapleLeaf Education" },
      { property: "og:description", content: "การแจ้งเตือนภายในระบบ" },
    ],
  }),
  component: () => <NotificationsPage role="college" />,
});

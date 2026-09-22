import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout, studentNav } from "@/components/layouts";
import { NotificationsView } from "@/components/application-views";

export const Route = createFileRoute("/student/notifications")({
  head: () => ({
    meta: [
      { title: "การแจ้งเตือน | MapleLeaf Education" },
      { name: "description", content: "การแจ้งเตือนภายในระบบเกี่ยวกับใบสมัคร Offer Invoice และการชำระเงิน" },
      { property: "og:title", content: "การแจ้งเตือน | MapleLeaf Education" },
      { property: "og:description", content: "ไม่ต้องคอยถามสถานะ ระบบแจ้งให้คุณทราบทุกขั้นตอน" },
    ],
  }),
  component: () => (
    <DashboardLayout nav={studentNav} title="Notifications">
      <NotificationsView />
    </DashboardLayout>
  ),
});

import { createFileRoute } from "@tanstack/react-router";
import { PaymentsPage } from "@/components/role-pages";

export const Route = createFileRoute("/agent/payments")({
  head: () => ({
    meta: [
      { title: "Payments (agent) | MapleLeaf Education" },
      { name: "description", content: "ตรวจสอบและยืนยันการชำระเงินของนักเรียน" },
      { property: "og:title", content: "Payments (agent) | MapleLeaf Education" },
      { property: "og:description", content: "ตรวจสอบและยืนยันการชำระเงินของนักเรียน" },
    ],
  }),
  component: () => <PaymentsPage role="agent" />,
});

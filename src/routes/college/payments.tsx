import { createFileRoute } from "@tanstack/react-router";
import { PaymentsPage } from "@/components/role-pages";

export const Route = createFileRoute("/college/payments")({
  head: () => ({
    meta: [
      { title: "Payments (college) | MapleLeaf Education" },
      { name: "description", content: "ตรวจสอบและยืนยันการชำระเงินของนักเรียน" },
      { property: "og:title", content: "Payments (college) | MapleLeaf Education" },
      { property: "og:description", content: "ตรวจสอบและยืนยันการชำระเงินของนักเรียน" },
    ],
  }),
  component: () => <PaymentsPage role="college" />,
});

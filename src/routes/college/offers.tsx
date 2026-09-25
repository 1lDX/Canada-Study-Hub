import { createFileRoute } from "@tanstack/react-router";
import { OffersPage } from "@/components/role-pages";

export const Route = createFileRoute("/college/offers")({
  head: () => ({
    meta: [
      { title: "Offers & Invoices (college) | MapleLeaf Education" },
      { name: "description", content: "จัดการ Offer Letter และ Invoice ของใบสมัคร" },
      { property: "og:title", content: "Offers & Invoices (college) | MapleLeaf Education" },
      { property: "og:description", content: "จัดการ Offer Letter และ Invoice ของใบสมัคร" },
    ],
  }),
  component: () => <OffersPage role="college" />,
});

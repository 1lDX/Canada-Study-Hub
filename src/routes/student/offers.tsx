import { useStore } from "@/lib/store";
import { createFileRoute } from "@tanstack/react-router";
import { ALink } from "@/components/link";
import { DashboardLayout, studentNav } from "@/components/layouts";
import { OfferInvoiceCard, useScopedApps } from "@/components/application-views";
import { Card, Empty, SectionTitle } from "@/components/ui-kit";

export const Route = createFileRoute("/student/offers")({
  head: () => ({
    meta: [
      { title: "Offer & Invoice | MapleLeaf Education" },
      { name: "description", content: "ดาวน์โหลด Offer Letter และ Invoice ที่คอลเลจออกให้สำหรับใบสมัครของคุณ" },
      { property: "og:title", content: "Offer & Invoice | MapleLeaf Education" },
      { property: "og:description", content: "เอกสารตอบรับและใบแจ้งหนี้ของคุณอยู่ในระบบทั้งหมด" },
    ],
  }),
  component: StudentOffers,
});

function StudentOffers() {
  const { db: storeDb } = useStore();
  const courseOf = (id: string) => storeDb.courses.find((c) => c.id === id);
  const apps = useScopedApps("student").filter((a) => a.offer?.sentToStudent || a.invoice?.sentToStudent);
  return (
    <DashboardLayout nav={studentNav} title="Offer & Invoice">
      <SectionTitle title="เอกสารจาก College" desc="เอกสารที่ Agent ส่งถึงคุณผ่านระบบ" />
      {!apps.length && <Empty>ยังไม่มี Offer หรือ Invoice ส่งถึงคุณ</Empty>}
      <div className="space-y-4">
        {apps.map((a) => (
          <Card key={a.id}>
            <p className="font-semibold">
              {a.id} · {courseOf(a.courseId)?.name}
            </p>
            <div className="mt-3">
              <OfferInvoiceCard app={a} />
            </div>
            <ALink to={`/student/applications/${a.id}`} className="mt-3 inline-block text-sm font-medium text-primary hover:underline">
              ไปหน้าใบสมัครเพื่อชำระเงิน →
            </ALink>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}

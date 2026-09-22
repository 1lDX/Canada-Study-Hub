import { createFileRoute } from "@tanstack/react-router";
import { ALink } from "@/components/link";
import { DashboardLayout, studentNav } from "@/components/layouts";
import { courseOf, useScopedApps } from "@/components/application-views";
import { Empty, SectionTitle, StatusBadge, Table } from "@/components/ui-kit";
import { money } from "@/lib/data";

export const Route = createFileRoute("/student/payments")({
  head: () => ({
    meta: [
      { title: "การชำระเงิน | MapleLeaf Education" },
      { name: "description", content: "ประวัติการแจ้งชำระเงินค่าเรียนและสถานะการตรวจสอบของเอเจนต์และคอลเลจ" },
      { property: "og:title", content: "การชำระเงิน | MapleLeaf Education" },
      { property: "og:description", content: "ติดตามสถานะการชำระเงินค่าเรียนของคุณ" },
    ],
  }),
  component: StudentPayments,
});

function StudentPayments() {
  const apps = useScopedApps("student");
  const rows = apps.flatMap((a) => a.payments.map((p) => ({ app: a, p })));
  return (
    <DashboardLayout nav={studentNav} title="Payment">
      <SectionTitle title="รายการชำระเงิน" desc="ระบบตรวจยอดเงินกับ Invoice ให้อัตโนมัติก่อนส่งให้ Agent ตรวจสอบหลักฐาน" />
      {!rows.length ? (
        <Empty>ยังไม่มีรายการชำระเงิน</Empty>
      ) : (
        <Table head={["Payment", "Application", "หลักสูตร", "จำนวนเงิน", "วันที่ชำระ", "สถานะ", ""]}>
          {rows.map(({ app, p }) => (
            <tr key={p.id}>
              <td className="px-4 py-3 font-medium">{p.id}</td>
              <td className="px-4 py-3">{app.id}</td>
              <td className="px-4 py-3">{courseOf(app.courseId)?.name}</td>
              <td className="px-4 py-3">{money(p.amount)}</td>
              <td className="px-4 py-3">{p.paidDate}</td>
              <td className="px-4 py-3">
                <StatusBadge status={p.status} />
                {p.note && <p className="mt-1 text-xs text-destructive">{p.note}</p>}
              </td>
              <td className="px-4 py-3 text-right">
                <ALink to={`/student/applications/${app.id}`} className="text-xs font-medium text-primary hover:underline">
                  เปิดใบสมัคร
                </ALink>
              </td>
            </tr>
          ))}
        </Table>
      )}
    </DashboardLayout>
  );
}

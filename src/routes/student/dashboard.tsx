import { createFileRoute } from "@tanstack/react-router";
import { ALink } from "@/components/link";
import { DashboardLayout, studentNav } from "@/components/layouts";
import { ApplicationsTable, NotificationsView, Row, useScopedApps } from "@/components/application-views";
import { Badge, Card, Empty, LinkButton, SectionTitle, Stat } from "@/components/ui-kit";
import { COURSES, meetsLevel, money } from "@/lib/data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/student/dashboard")({
  head: () => ({
    meta: [
      { title: "Student Dashboard | MapleLeaf Education" },
      { name: "description", content: "ภาพรวมหลักสูตรที่แนะนำ ใบสมัคร เอกสาร และการชำระเงินของนักเรียน" },
      { property: "og:title", content: "Student Dashboard | MapleLeaf Education" },
      { property: "og:description", content: "ติดตามสถานะใบสมัครเรียนต่อแคนาดาของคุณ" },
    ],
  }),
  component: StudentDashboard,
});

function StudentDashboard() {
  const { me, myTest, myInterests, unread } = useStore();
  const apps = useScopedApps("student");
  const test = myTest();
  const interests = myInterests();

  const recommended = COURSES.filter(
    (c) =>
      !interests ||
      ((!interests.city || c.city === interests.city) &&
        (!interests.field || c.field === interests.field) &&
        c.tuition <= (interests.budget || Infinity)),
  ).slice(0, 3);
  const eligible = COURSES.filter((c) => meetsLevel(test?.level, c.level));

  return (
    <DashboardLayout nav={studentNav} title={`สวัสดี ${me?.firstname ?? ""}`}>
      {!test && (
        <Card className="mb-6 border-warning/50 bg-warning/10">
          <p className="font-semibold">คุณมีผลสอบภาษาแล้วหรือยัง?</p>
          <p className="mt-1 text-sm text-muted-foreground">
            ถ้ายังไม่มี ให้กรอกความสนใจเพื่อดูหลักสูตรที่เหมาะกับคุณ แต่จะยังสมัครหลักสูตรไม่ได้จนกว่าจะมีผลสอบภาษา
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <LinkButton to="/student/language-test" size="sm">
              ฉันมีผลสอบภาษา
            </LinkButton>
            <LinkButton to="/student/interests" size="sm" variant="outline">
              ยังไม่มีผลสอบ — กรอกความสนใจ
            </LinkButton>
          </div>
        </Card>
      )}

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="ใบสมัครทั้งหมด" value={apps.length} />
        <Stat label="ระดับภาษา" value={test?.level ?? "ยังไม่มี"} tone={test ? "text-success" : "text-destructive"} />
        <Stat label="หลักสูตรที่สมัครได้" value={eligible.length} />
        <Stat label="แจ้งเตือนใหม่" value={unread} tone={unread ? "text-primary" : ""} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div>
            <SectionTitle
              title="ใบสมัครของฉัน"
              action={
                <LinkButton to="/student/applications" size="sm" variant="outline">
                  ดูทั้งหมด
                </LinkButton>
              }
            />
            <ApplicationsTable role="student" apps={apps} />
          </div>

          <div>
            <SectionTitle
              title="หลักสูตรที่แนะนำสำหรับคุณ"
              desc="จับคู่จากความสนใจที่คุณกรอกไว้"
              action={
                <LinkButton to="/student/courses" size="sm" variant="outline">
                  ดูทั้งหมด
                </LinkButton>
              }
            />
            {!recommended.length ? (
              <Empty>ยังไม่มีหลักสูตรที่ตรงกับความสนใจ ลองปรับข้อมูลความสนใจของคุณ</Empty>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {recommended.map((c) => {
                  const ok = meetsLevel(test?.level, c.level);
                  return (
                    <Card key={c.id}>
                      <div className="flex items-start justify-between gap-2">
                        <Badge tone="primary">{c.type}</Badge>
                        <Badge tone={ok ? "success" : "danger"}>{ok ? "สมัครได้" : `ต้องการ ${c.level}`}</Badge>
                      </div>
                      <p className="mt-3 font-semibold">{c.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {c.college} · {c.city}
                      </p>
                      <p className="mt-2 text-sm">
                        {c.duration} · {money(c.tuition)}
                      </p>
                      <ALink to={`/courses/${c.id}`} className="mt-3 inline-block text-sm font-medium text-primary hover:underline">
                        รายละเอียด →
                      </ALink>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <p className="mb-3 font-semibold">ข้อมูลส่วนตัว</p>
            <dl className="space-y-1 text-sm">
              <Row k="ชื่อ" v={`${me?.firstname} ${me?.lastname}`} />
              <Row k="Email" v={me?.email ?? "-"} />
              <Row k="เมืองที่สนใจ" v={interests?.city ?? "-"} />
              <Row k="งบประมาณ" v={interests?.budget ? money(interests.budget) : "-"} />
              <Row k="ผลสอบภาษา" v={test ? `${test.testType} ${test.score} (${test.level})` : "ยังไม่มี"} />
            </dl>
          </Card>
          <div>
            <SectionTitle title="การแจ้งเตือน" />
            <NotificationsView />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

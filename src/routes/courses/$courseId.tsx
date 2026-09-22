import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicLayout } from "@/components/layouts";
import { Row } from "@/components/application-views";
import { Badge, Card, Empty, SectionTitle } from "@/components/ui-kit";
import { COURSES, money } from "@/lib/data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/courses/$courseId")({
  head: () => ({
    meta: [
      { title: "รายละเอียดหลักสูตร | MapleLeaf Education" },
      { name: "description", content: "ค่าเรียน ระยะเวลา ระดับภาษาที่ต้องการ และรายละเอียดของหลักสูตรในแคนาดา" },
      { property: "og:title", content: "รายละเอียดหลักสูตร | MapleLeaf Education" },
      { property: "og:description", content: "ดูข้อมูลหลักสูตรและตรวจว่าคุณสมัครได้หรือยัง" },
    ],
  }),
  component: CourseDetail,
});

function CourseDetail() {
  const { courseId } = Route.useParams();
  const { me, myTest, canApply } = useStore();
  const course = COURSES.find((c) => c.id === courseId);

  if (!course)
    return (
      <PublicLayout>
        <div className="container-page py-16">
          <Empty>ไม่พบหลักสูตรนี้</Empty>
        </div>
      </PublicLayout>
    );

  const test = me?.role === "student" ? myTest() : undefined;
  const eligible = me?.role === "student" ? canApply(course.id) : false;

  return (
    <PublicLayout>
      <div className="container-page py-10">
        <Link to="/courses" className="text-sm text-primary hover:underline">
          ← กลับไปหน้าหลักสูตร
        </Link>
        <div className="mt-4 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SectionTitle title={course.name} desc={`${course.college} · ${course.city}`} />
            <Card>
              <p className="text-sm leading-relaxed text-muted-foreground">{course.description}</p>
              <dl className="mt-4 space-y-1 text-sm">
                <Row k="ประเภทหลักสูตร" v={course.type} />
                <Row k="สาขา" v={course.field} />
                <Row k="ระยะเวลา" v={course.duration} />
                <Row k="ค่าเรียน" v={money(course.tuition)} />
                <Row k="ระดับภาษาที่ต้องการ" v={course.level} />
                <Row k="รอบเปิดเรียน" v={course.intake} />
              </dl>
            </Card>
          </div>
          <div className="space-y-4">
            <Card>
              <p className="font-semibold">สถานะการสมัครของคุณ</p>
              {!me && (
                <>
                  <p className="mt-2 text-sm text-muted-foreground">เข้าสู่ระบบเพื่อตรวจสอบว่าคุณสมัครหลักสูตรนี้ได้หรือไม่</p>
                  <Link
                    to="/login"
                    className="mt-3 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                  >
                    Login
                  </Link>
                </>
              )}
              {me?.role === "student" && (
                <div className="mt-2 space-y-2">
                  {!test && <Badge tone="warning">ยังไม่มีผลสอบภาษา — ยังสมัครไม่ได้</Badge>}
                  {test && (
                    <p className="text-sm text-muted-foreground">
                      ระดับภาษาของคุณ: <strong>{test.level}</strong> · หลักสูตรต้องการ <strong>{course.level}</strong>
                    </p>
                  )}
                  {eligible ? <Badge tone="success">สามารถสมัครได้</Badge> : <Badge tone="danger">ยังไม่สามารถสมัครได้</Badge>}
                  {eligible ? (
                    <Link
                      to={`/student/apply/${course.id}`}
                      className="mt-2 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                    >
                      สมัครหลักสูตรนี้
                    </Link>
                  ) : (
                    <Link
                      to="/student/language-test"
                      className="mt-2 inline-flex rounded-lg border border-border px-4 py-2 text-sm font-medium"
                    >
                      กรอก/อัปเดตผลสอบภาษา
                    </Link>
                  )}
                </div>
              )}
              {me && me.role !== "student" && (
                <p className="mt-2 text-sm text-muted-foreground">บัญชี {me.role} ใช้สำหรับดูแลใบสมัคร ไม่ได้ใช้สมัครเรียน</p>
              )}
            </Card>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}

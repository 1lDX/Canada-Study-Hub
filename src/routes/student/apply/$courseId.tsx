import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardLayout, studentNav } from "@/components/layouts";
import { Row } from "@/components/application-views";
import { Badge, Button, Card, Empty, Field, FileInput, LinkButton } from "@/components/ui-kit";
import { COURSES, DOC_TYPES, money } from "@/lib/data";
import { useStore, type Doc } from "@/lib/store";

export const Route = createFileRoute("/student/apply/$courseId")({
  head: () => ({
    meta: [
      { title: "สมัครหลักสูตร | MapleLeaf Education" },
      { name: "description", content: "อัปโหลดเอกสารที่จำเป็นและส่งใบสมัครหลักสูตรในแคนาดา" },
      { property: "og:title", content: "สมัครหลักสูตร | MapleLeaf Education" },
      { property: "og:description", content: "ระบบตรวจความครบของเอกสารก่อนส่งใบสมัครให้เอเจนต์" },
    ],
  }),
  component: ApplyPage,
});

function ApplyPage() {
  const { courseId } = Route.useParams();
  const { canApply, createApplication, myTest } = useStore();
  const navigate = useNavigate();
  const course = COURSES.find((c) => c.id === courseId);
  const [files, setFiles] = useState<Record<string, string>>({});
  const test = myTest();

  if (!course)
    return (
      <DashboardLayout nav={studentNav} title="Apply">
        <Empty>ไม่พบหลักสูตรนี้</Empty>
      </DashboardLayout>
    );

  if (!canApply(course.id))
    return (
      <DashboardLayout nav={studentNav} title="Apply">
        <Card className="max-w-xl">
          <Badge tone="danger">ยังไม่สามารถสมัครได้</Badge>
          <p className="mt-3 text-sm text-muted-foreground">
            หลักสูตร {course.name} ต้องการระดับภาษา <strong>{course.level}</strong> แต่ระดับของคุณคือ{" "}
            <strong>{test?.level ?? "ยังไม่มีผลสอบ"}</strong>
          </p>
          <LinkButton to="/student/language-test" className="mt-4" size="sm">
            อัปเดตผลสอบภาษา
          </LinkButton>
        </Card>
      </DashboardLayout>
    );

  const missing = DOC_TYPES.filter((d) => d.required && !files[d.key]);
  const submit = () => {
    const docs: Doc[] = Object.entries(files).map(([key, fileName]) => ({
      key,
      fileName,
      uploadedAt: new Date().toISOString(),
    }));
    const app = createApplication(course.id, docs);
    navigate({ to: `/student/applications/${app.id}` as never });
  };

  return (
    <DashboardLayout nav={studentNav} title="สมัครหลักสูตร">
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <p className="font-semibold">อัปโหลดเอกสารที่จำเป็น</p>
          <p className="mt-1 text-sm text-muted-foreground">
            ระบบจะตรวจความครบของเอกสารอัตโนมัติ คุณจะส่งใบสมัครได้เมื่ออัปโหลดเอกสารบังคับครบทุกรายการ
          </p>
          <div className="mt-4 space-y-4">
            {DOC_TYPES.map((d) => (
              <Field key={d.key} label={`${d.label}${d.required ? " *" : " (ไม่บังคับ)"}`}>
                <FileInput onFile={(n) => setFiles((p) => ({ ...p, [d.key]: n }))} value={files[d.key]} />
              </Field>
            ))}
          </div>
        </Card>
        <div className="space-y-4">
          <Card>
            <p className="mb-3 font-semibold">หลักสูตรที่เลือก</p>
            <dl className="space-y-1 text-sm">
              <Row k="Course" v={course.name} />
              <Row k="College" v={course.college} />
              <Row k="เมือง" v={course.city} />
              <Row k="ระยะเวลา" v={course.duration} />
              <Row k="ค่าเรียน" v={money(course.tuition)} />
              <Row k="ระดับภาษาที่ต้องการ" v={course.level} />
            </dl>
          </Card>
          <Card>
            <p className="mb-2 font-semibold">ผลตรวจสอบเอกสาร</p>
            {missing.length ? (
              <>
                <Badge tone="danger">เอกสารยังไม่ครบ</Badge>
                <ul className="mt-2 space-y-1 text-sm text-destructive">
                  {missing.map((m) => (
                    <li key={m.key}>ขาด {m.label}</li>
                  ))}
                </ul>
              </>
            ) : (
              <Badge tone="success">เอกสารครบถ้วน พร้อมส่งใบสมัคร</Badge>
            )}
            <Button className="mt-4 w-full" disabled={missing.length > 0} onClick={submit}>
              Submit Application
            </Button>
            <p className="mt-2 text-xs text-muted-foreground">
              เมื่อส่งแล้ว ระบบจะบันทึกวันเวลาและแจ้งเตือน Agent ให้ตรวจสอบทันที
            </p>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

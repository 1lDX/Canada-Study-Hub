import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ALink } from "@/components/link";
import { DashboardLayout, studentNav } from "@/components/layouts";
import { Badge, Card, Empty, LinkButton, SectionTitle } from "@/components/ui-kit";
import { COURSES, meetsLevel, money } from "@/lib/data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/student/courses")({
  head: () => ({
    meta: [
      { title: "หลักสูตรที่แนะนำ | MapleLeaf Education" },
      { name: "description", content: "หลักสูตรที่ตรงกับความสนใจของคุณ พร้อมสถานะว่าสมัครได้หรือยัง" },
      { property: "og:title", content: "หลักสูตรที่แนะนำ | MapleLeaf Education" },
      { property: "og:description", content: "ระบบจับคู่หลักสูตรจากเมือง สาขา งบประมาณ และระดับภาษาของคุณ" },
    ],
  }),
  component: StudentCourses,
});

function StudentCourses() {
  const { myInterests, myTest } = useStore();
  const i = myInterests();
  const test = myTest();
  const [onlyEligible, setOnlyEligible] = useState(false);

  const scored = COURSES.map((c) => {
    let match = 0;
    if (i) {
      if (c.city === i.city) match += 25;
      if (c.type === i.type) match += 20;
      if (c.field === i.field) match += 20;
      if (c.duration === i.duration) match += 15;
      if (c.tuition <= i.budget) match += 20;
    }
    return { c, match: i ? match : 0, eligible: meetsLevel(test?.level, c.level) };
  })
    .sort((a, b) => b.match - a.match)
    .filter((x) => (onlyEligible ? x.eligible : true));

  return (
    <DashboardLayout nav={studentNav} title="Courses">
      {!i && (
        <Card className="mb-6 border-warning/50 bg-warning/10">
          <p className="font-semibold">ยังไม่ได้กรอกความสนใจ</p>
          <p className="mt-1 text-sm text-muted-foreground">กรอกข้อมูลเพื่อให้ระบบแนะนำหลักสูตรที่ตรงกับคุณ</p>
          <LinkButton to="/student/interests" size="sm" className="mt-3">
            กรอกความสนใจ
          </LinkButton>
        </Card>
      )}
      {!test && (
        <Card className="mb-6 border-destructive/40 bg-destructive/5">
          <p className="font-semibold">ยังไม่มีผลสอบภาษา</p>
          <p className="mt-1 text-sm text-muted-foreground">
            คุณดูหลักสูตรและระดับภาษาที่ต้องการได้ แต่จะยังสมัครไม่ได้จนกว่าจะบันทึกผลสอบภาษา
          </p>
          <LinkButton to="/student/language-test" size="sm" className="mt-3">
            กรอกผลสอบภาษา
          </LinkButton>
        </Card>
      )}

      <SectionTitle
        title="หลักสูตรที่ระบบแนะนำ"
        desc={`เรียงตามความตรงกับความสนใจของคุณ · ระดับภาษาของคุณ: ${test?.level ?? "ยังไม่มี"}`}
        action={
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={onlyEligible} onChange={(e) => setOnlyEligible(e.target.checked)} />
            แสดงเฉพาะที่สมัครได้
          </label>
        }
      />

      {!scored.length ? (
        <Empty>ไม่พบหลักสูตรที่ตรงตามเงื่อนไข</Empty>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {scored.map(({ c, match, eligible }) => (
            <Card key={c.id} className="flex flex-col">
              <div className="flex items-start justify-between gap-2">
                <Badge tone="primary">{c.type}</Badge>
                {!!match && <Badge tone="info">ตรง {match}%</Badge>}
              </div>
              <p className="mt-3 font-semibold">{c.name}</p>
              <p className="text-sm text-muted-foreground">
                {c.college} · {c.city}
              </p>
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{c.description}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <Badge>{c.duration}</Badge>
                <Badge>{money(c.tuition)}</Badge>
                <Badge>{c.field}</Badge>
              </div>
              <div className="mt-3">
                {eligible ? (
                  <Badge tone="success">สามารถสมัครได้ (ต้องการ {c.level})</Badge>
                ) : (
                  <Badge tone="danger">ยังไม่สามารถสมัครได้ — ต้องการระดับ {c.level}</Badge>
                )}
              </div>
              <div className="mt-4 flex gap-2">
                <ALink
                  to={`/courses/${c.id}`}
                  className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-accent"
                >
                  รายละเอียด
                </ALink>
                {eligible && (
                  <ALink
                    to={`/student/apply/${c.id}`}
                    className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary-dark"
                  >
                    สมัครหลักสูตรนี้
                  </ALink>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

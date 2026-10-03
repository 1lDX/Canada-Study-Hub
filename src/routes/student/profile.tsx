import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout, studentNav } from "@/components/layouts";
import { ChangePasswordCard, EditProfileCard } from "@/components/account-settings";
import { Row } from "@/components/application-views";
import { Card, LinkButton } from "@/components/ui-kit";
import { money } from "@/lib/data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/student/profile")({
  head: () => ({
    meta: [
      { title: "โปรไฟล์นักเรียน | MapleLeaf Education" },
      { name: "description", content: "ข้อมูลส่วนตัว ความสนใจการเรียน และผลสอบภาษาของนักเรียน" },
      { property: "og:title", content: "โปรไฟล์นักเรียน | MapleLeaf Education" },
      { property: "og:description", content: "จัดการข้อมูลส่วนตัวและข้อมูลการเรียนของคุณ" },
    ],
  }),
  component: Profile,
});

function Profile() {
  const { me, myInterests, myTest } = useStore();
  const i = myInterests();
  const t = myTest();
  return (
    <DashboardLayout nav={studentNav} title="Profile">
      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <p className="mb-3 font-semibold">ข้อมูลบัญชี</p>
          <dl className="space-y-1 text-sm">
            <Row k="ชื่อ" v={me?.firstname ?? "-"} />
            <Row k="นามสกุล" v={me?.lastname ?? "-"} />
            <Row k="Email" v={me?.email ?? "-"} />
            <Row k="Role" v={me?.role ?? "-"} />
            <Row k="Password" v="••••••••" />
          </dl>
        </Card>
        <Card>
          <p className="mb-3 font-semibold">ความสนใจการเรียน</p>
          {i ? (
            <dl className="space-y-1 text-sm">
              <Row k="เมือง" v={i.city} />
              <Row k="ประเภทหลักสูตร" v={i.type} />
              <Row k="สาขา" v={i.field} />
              <Row k="ระยะเวลา" v={i.duration} />
              <Row k="งบประมาณ" v={money(i.budget)} />
              <Row k="ระดับการศึกษา" v={i.education} />
              <Row k="เป้าหมาย" v={i.goal} />
            </dl>
          ) : (
            <p className="text-sm text-muted-foreground">ยังไม่ได้กรอกข้อมูลความสนใจ</p>
          )}
          <LinkButton to="/student/interests" size="sm" variant="outline" className="mt-3">
            แก้ไขความสนใจ
          </LinkButton>
        </Card>
        <Card>
          <p className="mb-3 font-semibold">ผลสอบภาษา</p>
          {t ? (
            <dl className="space-y-1 text-sm">
              <Row k="ประเภทการสอบ" v={t.testType} />
              <Row k="คะแนน" v={t.score} />
              <Row k="ระดับภาษา" v={t.level} />
              <Row k="วันที่สอบ" v={t.testDate} />
              <Row k="วันหมดอายุ" v={t.expiryDate ?? "-"} />
              <Row k="ไฟล์ผลสอบ" v={t.fileName} />
            </dl>
          ) : (
            <p className="text-sm text-muted-foreground">ยังไม่มีผลสอบภาษาในระบบ</p>
          )}
          <LinkButton to="/student/language-test" size="sm" variant="outline" className="mt-3">
            จัดการผลสอบภาษา
          </LinkButton>
        </Card>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <EditProfileCard />
        <ChangePasswordCard />
      </div>
    </DashboardLayout>
  );
}

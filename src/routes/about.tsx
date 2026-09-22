import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "@/components/layouts";
import { Card, SectionTitle } from "@/components/ui-kit";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "เกี่ยวกับเรา | MapleLeaf Education" },
      { name: "description", content: "ทีมที่ปรึกษาการศึกษาต่อประเทศแคนาดา ดูแลนักเรียนไทยตั้งแต่เลือกหลักสูตรถึงวันเดินทาง" },
      { property: "og:title", content: "เกี่ยวกับเรา | MapleLeaf Education" },
      { property: "og:description", content: "เอเจนซี่เรียนต่อแคนาดาที่ทำงานร่วมกับคอลเลจโดยตรง" },
    ],
  }),
  component: About,
});

function About() {
  return (
    <PublicLayout>
      <div className="container-page py-12">
        <SectionTitle title="เกี่ยวกับ MapleLeaf Education" desc="ที่ปรึกษาการศึกษาต่อประเทศแคนาดา" />
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <p className="text-sm leading-relaxed text-muted-foreground">
              เราช่วยนักเรียนไทยเลือกหลักสูตรในแคนาดาที่เหมาะกับพื้นฐานภาษา งบประมาณ และเป้าหมายอาชีพ
              ทำงานร่วมกับคอลเลจพาร์ตเนอร์โดยตรง และยื่นเอกสารผ่านระบบออนไลน์ทั้งหมด
              เพื่อลดความผิดพลาดและลดเวลารอ
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              ระบบของเราตรวจระดับภาษาและความครบถ้วนของเอกสารให้อัตโนมัติ นักเรียนเห็นสถานะใบสมัครของตัวเองได้ตลอดเวลา
              ส่วนทีมที่ปรึกษาโฟกัสกับการตรวจความถูกต้องและให้คำแนะนำ
            </p>
          </Card>
          <Card>
            <p className="font-semibold">สิ่งที่เราดูแล</p>
            <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
              {[
                "แนะแนวหลักสูตรและคอลเลจ",
                "ตรวจเอกสารก่อนยื่น",
                "ประสานงานกับคอลเลจ",
                "ติดตาม Offer และ Invoice",
                "ให้คำแนะนำเรื่องการชำระเงิน",
                "เตรียมตัวก่อนเดินทาง",
              ].map((x) => (
                <li key={x}>• {x}</li>
              ))}
            </ul>
          </Card>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            ["ความโปร่งใส", "นักเรียนเห็นสถานะทุกขั้นตอนในระบบ"],
            ["ความแม่นยำ", "ระบบตรวจเงื่อนไขภาษาและเอกสารอัตโนมัติ"],
            ["ความรวดเร็ว", "ส่งเอกสารถึงคอลเลจโดยไม่ต้องผ่านอีเมล"],
          ].map(([t, d]) => (
            <Card key={t}>
              <p className="font-semibold">{t}</p>
              <p className="mt-1 text-sm text-muted-foreground">{d}</p>
            </Card>
          ))}
        </div>
      </div>
    </PublicLayout>
  );
}

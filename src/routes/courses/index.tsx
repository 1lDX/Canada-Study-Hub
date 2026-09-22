import { ALink } from "@/components/link";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PublicLayout } from "@/components/layouts";
import { Badge, Card, Field, SectionTitle, inputClass } from "@/components/ui-kit";
import { CITIES, COURSES, COURSE_TYPES, FIELDS, money } from "@/lib/data";

export const Route = createFileRoute("/courses/")({
  head: () => ({
    meta: [
      { title: "หลักสูตรในแคนาดา | MapleLeaf Education" },
      { name: "description", content: "ค้นหาหลักสูตร Diploma, Certificate และคอร์สภาษาในเมืองต่าง ๆ ของแคนาดา" },
      { property: "og:title", content: "หลักสูตรในแคนาดา | MapleLeaf Education" },
      { property: "og:description", content: "เปรียบเทียบค่าเรียน ระยะเวลา และระดับภาษาที่ต้องการของแต่ละหลักสูตร" },
    ],
  }),
  component: CoursesPage,
});

function CoursesPage() {
  const [city, setCity] = useState("");
  const [type, setType] = useState("");
  const [field, setField] = useState("");
  const [q, setQ] = useState("");

  const list = COURSES.filter(
    (c) =>
      (!city || c.city === city) &&
      (!type || c.type === type) &&
      (!field || c.field === field) &&
      (!q || (c.name + c.college).toLowerCase().includes(q.toLowerCase())),
  );

  return (
    <PublicLayout>
      <div className="container-page py-10">
        <SectionTitle title="หลักสูตรทั้งหมด" desc={`พบ ${list.length} หลักสูตร`} />
        <Card className="mb-6">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="ค้นหา">
              <input className={inputClass} value={q} onChange={(e) => setQ(e.target.value)} placeholder="ชื่อหลักสูตร / คอลเลจ" />
            </Field>
            <Field label="เมือง">
              <select className={inputClass} value={city} onChange={(e) => setCity(e.target.value)}>
                <option value="">ทั้งหมด</option>
                {CITIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label="ประเภทหลักสูตร">
              <select className={inputClass} value={type} onChange={(e) => setType(e.target.value)}>
                <option value="">ทั้งหมด</option>
                {COURSE_TYPES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label="สาขา">
              <select className={inputClass} value={field} onChange={(e) => setField(e.target.value)}>
                <option value="">ทั้งหมด</option>
                {FIELDS.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>
          </div>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {list.map((c) => (
            <Card key={c.id} className="flex flex-col">
              <div className="flex items-start justify-between gap-2">
                <Badge tone="primary">{c.type}</Badge>
                <Badge tone="info">ต้องการ {c.level}</Badge>
              </div>
              <h3 className="mt-3 text-lg font-semibold">{c.name}</h3>
              <p className="text-sm text-muted-foreground">
                {c.college} · {c.city}
              </p>
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{c.description}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <Badge>{c.duration}</Badge>
                <Badge>{money(c.tuition)}</Badge>
                <Badge>{c.field}</Badge>
              </div>
              <ALink
                to={`/courses/${c.id}`}
                className="mt-4 inline-flex w-fit rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-dark"
              >
                ดูรายละเอียด
              </ALink>
            </Card>
          ))}
        </div>
      </div>
    </PublicLayout>
  );
}

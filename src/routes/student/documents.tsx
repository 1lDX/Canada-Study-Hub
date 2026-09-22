import { createFileRoute } from "@tanstack/react-router";
import { ALink } from "@/components/link";
import { DashboardLayout, studentNav } from "@/components/layouts";
import { courseOf, useScopedApps } from "@/components/application-views";
import { Badge, Card, Empty, FileInput, SectionTitle } from "@/components/ui-kit";
import { DOC_TYPES } from "@/lib/data";
import { missingDocs, useStore } from "@/lib/store";

export const Route = createFileRoute("/student/documents")({
  head: () => ({
    meta: [
      { title: "เอกสารของฉัน | MapleLeaf Education" },
      { name: "description", content: "ตรวจสอบและอัปโหลดเอกสารของแต่ละใบสมัคร ระบบบอกว่าเอกสารใดยังขาด" },
      { property: "og:title", content: "เอกสารของฉัน | MapleLeaf Education" },
      { property: "og:description", content: "จัดการเอกสารการสมัครเรียนต่อแคนาดาในที่เดียว" },
    ],
  }),
  component: StudentDocuments,
});

function StudentDocuments() {
  const apps = useScopedApps("student");
  const { uploadDoc } = useStore();

  return (
    <DashboardLayout nav={studentNav} title="Documents">
      <SectionTitle title="เอกสารตามใบสมัคร" desc="ระบบตรวจความครบของเอกสารให้อัตโนมัติ" />
      {!apps.length && <Empty>ยังไม่มีใบสมัคร จึงยังไม่มีรายการเอกสาร</Empty>}
      <div className="space-y-4">
        {apps.map((app) => {
          const miss = missingDocs(app.docs);
          const c = courseOf(app.courseId);
          return (
            <Card key={app.id}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-semibold">
                    {app.id} · {c?.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{c?.college}</p>
                </div>
                {miss.length ? <Badge tone="danger">ขาด {miss.join(", ")}</Badge> : <Badge tone="success">เอกสารครบ</Badge>}
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {DOC_TYPES.map((d) => (
                  <div key={d.key} className="rounded-lg border border-border p-3">
                    <p className="text-sm font-medium">
                      {d.label} {d.required && <span className="text-destructive">*</span>}
                    </p>
                    <FileInput
                      value={app.docs.find((x) => x.key === d.key)?.fileName}
                      onFile={(n) => uploadDoc(app.id, { key: d.key, fileName: n, uploadedAt: new Date().toISOString() })}
                    />
                  </div>
                ))}
              </div>
              <ALink to={`/student/applications/${app.id}`} className="mt-3 inline-block text-sm font-medium text-primary hover:underline">
                ดูใบสมัคร →
              </ALink>
            </Card>
          );
        })}
      </div>
    </DashboardLayout>
  );
}

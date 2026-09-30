import { DashboardLayout, agentNav, collegeNav } from "@/components/layouts";
import {
  ApplicationsTable,
  AutoChecks,
  DocsList,
  IssueOfferForm,
  NoteAction,
  NotificationsView,
  OfferInvoiceCard,
  PaymentsCard,
  StudentSummary,
  Timeline,
  useCourseOf,
  useScopedApps,
} from "@/components/application-views";
import { Button, Card, Empty, SectionTitle, Stat, StatusBadge } from "@/components/ui-kit";
import { formatDate } from "@/lib/data";
import { useStore, type Application } from "@/lib/store";
import { ALink } from "@/components/link";

type R = "agent" | "college";
const navOf = (r: R) => (r === "agent" ? agentNav : collegeNav);

function AppBlock({ role, app, children }: { role: R; app: Application; children: React.ReactNode }) {
  const courseOf = useCourseOf();
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <ALink to={`/${role}/applications/${app.id}`} className="font-semibold text-primary hover:underline">
          {app.id}
        </ALink>
        <span className="text-sm text-muted-foreground">{courseOf(app.courseId)?.name}</span>
        <StatusBadge status={app.status} />
      </div>
      {children}
    </div>
  );
}

export function DocumentsPage({ role }: { role: R }) {
  const apps = useScopedApps(role);
  return (
    <DashboardLayout nav={navOf(role)} title="Documents">
      <SectionTitle title="เอกสารของแต่ละใบสมัคร" desc="ระบบตรวจความครบให้อัตโนมัติ — ความถูกต้องยังต้องตรวจโดยเจ้าหน้าที่" />
      {!apps.length ? (
        <Empty>ยังไม่มีเอกสาร</Empty>
      ) : (
        <div className="space-y-8">
          {apps.map((a) => (
            <AppBlock key={a.id} role={role} app={a}>
              <DocsList app={a} />
            </AppBlock>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

export function OffersPage({ role }: { role: R }) {
  const courseOf = useCourseOf();
  const apps = useScopedApps(role);
  const { act } = useStore();
  const toIssue = apps.filter((a) => a.status === "ส่งให้ College แล้ว");
  const issued = apps.filter((a) => a.offer);
  return (
    <DashboardLayout nav={navOf(role)} title="Offers & Invoices">
      {role === "college" && (
        <div className="mb-8">
          <SectionTitle title="รอออก Offer" desc={`${toIssue.length} รายการ`} />
          {!toIssue.length ? (
            <Empty>ไม่มีใบสมัครที่รอออก Offer</Empty>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">
              {toIssue.map((a) => (
                <AppBlock key={a.id} role={role} app={a}>
                  <IssueOfferForm appId={a.id} amount={courseOf(a.courseId)?.tuition ?? 0} />
                </AppBlock>
              ))}
            </div>
          )}
        </div>
      )}
      <SectionTitle title="Offer & Invoice ที่ออกแล้ว" />
      {!issued.length ? (
        <Empty>ยังไม่มี Offer</Empty>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {issued.map((a) => (
            <AppBlock key={a.id} role={role} app={a}>
              <OfferInvoiceCard app={a} />
              {role === "agent" && a.status === "ออก Offer แล้ว" && (
                <Button onClick={() => act(a.id, "agent_forward_docs")}>ส่งให้นักเรียน</Button>
              )}
            </AppBlock>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

export function PaymentsPage({ role }: { role: R }) {
  const apps = useScopedApps(role).filter((a) => a.payments.length);
  const { act } = useStore();
  return (
    <DashboardLayout nav={navOf(role)} title="Payments">
      <SectionTitle title="การชำระเงิน" desc="ระบบตรวจยอดให้ตรงกับ Invoice อัตโนมัติ — หลักฐานจริงตรวจโดยเจ้าหน้าที่" />
      {!apps.length ? (
        <Empty>ยังไม่มีการชำระเงิน</Empty>
      ) : (
        <div className="space-y-8">
          {apps.map((a) => {
            const p = a.payments[0];
            return (
              <AppBlock key={a.id} role={role} app={a}>
                <PaymentsCard app={a} />
                <div className="flex flex-wrap gap-2">
                  {role === "agent" && p?.status === "รอตรวจสอบการชำระเงิน" && (
                    <>
                      <Button variant="success" onClick={() => act(a.id, "agent_verify_payment")}>
                        ยืนยันและส่งให้ College
                      </Button>
                      <NoteAction label="ส่งกลับให้แก้ไข" variant="danger" onSubmit={(note) => act(a.id, "agent_reject_payment", { note })} />
                    </>
                  )}
                  {role === "college" && p?.status === "Agent ตรวจแล้ว" && (
                    <Button variant="success" onClick={() => act(a.id, "college_confirm_payment")}>
                      ยืนยันการชำระเงิน
                    </Button>
                  )}
                </div>
              </AppBlock>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}

export function NotificationsPage({ role }: { role: R }) {
  return (
    <DashboardLayout nav={navOf(role)} title="Notifications">
      <NotificationsView />
    </DashboardLayout>
  );
}

export function CollegeDashboardView() {
  const apps = useScopedApps("college");
  const { unread } = useStore();
  const neu = apps.filter((a) => a.status === "ส่งให้ College แล้ว");
  const pay = apps.filter((a) => a.payments[0]?.status === "Agent ตรวจแล้ว");
  const prep = apps.filter((a) => a.status === "เตรียมรับนักเรียน");
  return (
    <DashboardLayout nav={collegeNav} title="College Dashboard">
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Application ใหม่" value={neu.length} tone="text-primary" />
        <Stat label="รอยืนยัน Payment" value={pay.length} />
        <Stat label="เตรียมรับนักเรียน" value={prep.length} />
        <Stat label="แจ้งเตือนใหม่" value={unread} />
      </div>
      <SectionTitle title="งานที่ต้องดำเนินการ" />
      <ApplicationsTable role="college" apps={[...neu, ...pay, ...prep]} />
    </DashboardLayout>
  );
}

export function CollegeAppDetailView({ appId }: { appId: string }) {
  const courseOf = useCourseOf();
  const { db, act } = useStore();
  const app = db.applications.find((a) => a.id === appId && !!a.collegeId);
  if (!app)
    return (
      <DashboardLayout nav={collegeNav} title="Application">
        <Empty>ไม่พบใบสมัครนี้ หรือยังไม่ถูกส่งมาที่ College</Empty>
      </DashboardLayout>
    );
  const p = app.payments[0];
  return (
    <DashboardLayout nav={collegeNav} title={`Application ${app.id}`}>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <StatusBadge status={app.status} />
        <span className="text-sm text-muted-foreground">ส่งเมื่อ {formatDate(app.submittedAt)}</span>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <StudentSummary app={app} />
          <AutoChecks app={app} />
          <DocsList app={app} />
          <OfferInvoiceCard app={app} />
          <PaymentsCard app={app} />
        </div>
        <div className="space-y-6">
          {app.status === "ส่งให้ College แล้ว" && (
            <>
              <IssueOfferForm appId={app.id} amount={courseOf(app.courseId)?.tuition ?? 0} />
              <Card>
                <NoteAction label="ส่งกลับขอข้อมูลเพิ่มเติม" variant="danger" onSubmit={(note) => act(app.id, "college_request_info", { note })} />
              </Card>
            </>
          )}
          {p?.status === "Agent ตรวจแล้ว" && (
            <Card>
              <Button variant="success" onClick={() => act(app.id, "college_confirm_payment")}>
                ยืนยันการชำระเงิน
              </Button>
            </Card>
          )}
          {app.status === "เตรียมรับนักเรียน" && (
            <Card>
              <Button onClick={() => act(app.id, "complete")}>ปิดเคส: เสร็จสิ้น</Button>
            </Card>
          )}
          <Timeline app={app} />
        </div>
      </div>
    </DashboardLayout>
  );
}

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { COURSES, DOC_TYPES, meetsLevel, type Status } from "./data";

export type Role = "student" | "agent" | "college";

export type Account = {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: Role;
  org?: string;
};

export type Interests = {
  city: string;
  type: string;
  field: string;
  duration: string;
  budget: number;
  education: string;
  goal: string;
};

export type LanguageTest = {
  testType: string;
  score: string;
  level: string;
  testDate: string;
  expiryDate?: string;
  fileName: string;
};

export type Doc = { key: string; fileName: string; uploadedAt: string };

export type Payment = {
  id: string;
  amount: number;
  paidDate: string;
  fileName: string;
  status: "รอตรวจสอบการชำระเงิน" | "ส่งกลับให้แก้ไข" | "Agent ตรวจแล้ว" | "ชำระเงินแล้ว";
  note?: string;
};

export type Application = {
  id: string;
  studentId: string;
  courseId: string;
  agentId: string;
  collegeId?: string;
  status: Status;
  submittedAt: string;
  docs: Doc[];
  history: { status: Status | string; at: string; by: string; note?: string }[];
  offer?: { fileName: string; at: string; sentToStudent?: boolean };
  invoice?: { fileName: string; amount: number; dueDate: string; at: string; sentToStudent?: boolean };
  payments: Payment[];
};

export type Notification = {
  id: string;
  accountId: string;
  title: string;
  body: string;
  at: string;
  read: boolean;
};

type DB = {
  accounts: Account[];
  interests: Record<string, Interests>;
  tests: Record<string, LanguageTest>;
  applications: Application[];
  notifications: Notification[];
  sessionId: string | null;
};

const AGENT_ID = "a1";
const COLLEGE_ID = "g1";

const seed = (): DB => ({
  accounts: [
    { id: "s1", firstname: "Nutnicha", lastname: "K.", email: "student@demo.com", password: "123456", role: "student" },
    { id: AGENT_ID, firstname: "Alex", lastname: "Agent", email: "agent@demo.com", password: "123456", role: "agent", org: "MapleLeaf Education" },
    { id: COLLEGE_ID, firstname: "Maple Ridge", lastname: "Admissions", email: "college@demo.com", password: "123456", role: "college", org: "Maple Ridge College" },
  ],
  interests: {
    s1: { city: "Toronto", type: "Diploma", field: "Business", duration: "2 years", budget: 18000, education: "ปริญญาตรี", goal: "ทำงานและขอ PR ในแคนาดา" },
  },
  tests: {
    s1: { testType: "IELTS", score: "6.0", level: "B2", testDate: "2026-02-10", expiryDate: "2028-02-10", fileName: "ielts-result.pdf" },
  },
  applications: [
    {
      id: "AP-1001",
      studentId: "s1",
      courseId: "c1",
      agentId: AGENT_ID,
      status: "รอตรวจสอบ",
      submittedAt: "2026-09-18T09:20:00.000Z",
      docs: DOC_TYPES.filter((d) => d.required).map((d) => ({ key: d.key, fileName: `${d.key}.pdf`, uploadedAt: "2026-09-18T09:10:00.000Z" })),
      history: [{ status: "รอตรวจสอบ", at: "2026-09-18T09:20:00.000Z", by: "Student" }],
      payments: [],
    },
  ],
  notifications: [
    { id: "n1", accountId: AGENT_ID, title: "Application ใหม่", body: "AP-1001 รอการตรวจสอบ", at: "2026-09-18T09:20:00.000Z", read: false },
    { id: "n2", accountId: "s1", title: "ส่ง Application แล้ว", body: "AP-1001 ถูกส่งให้ Agent เรียบร้อย", at: "2026-09-18T09:20:00.000Z", read: false },
  ],
  sessionId: null,
});

const KEY = "maple-portal-db-v1";

type Ctx = {
  db: DB;
  me: Account | null;
  login: (email: string, password: string) => Account | null;
  register: (a: Omit<Account, "id" | "role"> & { role?: Role }) => { ok: boolean; error?: string };
  logout: () => void;
  saveInterests: (i: Interests) => void;
  saveTest: (t: LanguageTest) => void;
  myTest: () => LanguageTest | undefined;
  myInterests: () => Interests | undefined;
  canApply: (courseId: string) => boolean;
  createApplication: (courseId: string, docs: Doc[]) => Application;
  uploadDoc: (appId: string, doc: Doc) => void;
  act: (appId: string, action: AppAction, payload?: any) => void;
  markRead: (id?: string) => void;
  unread: number;
};

export type AppAction =
  | "agent_return"
  | "student_resubmit"
  | "agent_send_college"
  | "college_request_info"
  | "college_issue_offer"
  | "agent_forward_docs"
  | "student_pay"
  | "agent_reject_payment"
  | "agent_verify_payment"
  | "college_confirm_payment"
  | "complete";

const StoreContext = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [db, setDb] = useState<DB>(seed);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setDb(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(KEY, JSON.stringify(db));
  }, [db, hydrated]);

  const me = db.accounts.find((a) => a.id === db.sessionId) ?? null;

  const notify = (d: DB, accountId: string, title: string, body: string) => {
    d.notifications = [
      { id: "n" + Math.random().toString(36).slice(2, 9), accountId, title, body, at: new Date().toISOString(), read: false },
      ...d.notifications,
    ];
  };

  const update = (fn: (d: DB) => void) =>
    setDb((prev) => {
      const d: DB = JSON.parse(JSON.stringify(prev));
      fn(d);
      return d;
    });

  const setStatus = (d: DB, app: Application, status: Status, by: string, note?: string) => {
    app.status = status;
    app.history.push({ status, at: new Date().toISOString(), by, note });
  };

  const value: Ctx = useMemo(() => {
    const myTest = () => (me ? db.tests[me.id] : undefined);
    const myInterests = () => (me ? db.interests[me.id] : undefined);

    return {
      db,
      me,
      login: (email, password) => {
        const found = db.accounts.find((a) => a.email.toLowerCase() === email.toLowerCase() && a.password === password);
        if (found) update((d) => void (d.sessionId = found.id));
        return found ?? null;
      },
      register: (a) => {
        if (db.accounts.some((x) => x.email.toLowerCase() === a.email.toLowerCase()))
          return { ok: false, error: "อีเมลนี้ถูกใช้แล้ว" };
        const id = "s" + Math.random().toString(36).slice(2, 8);
        update((d) => {
          d.accounts.push({ ...a, id, role: a.role ?? "student" });
          d.sessionId = id;
        });
        return { ok: true };
      },
      logout: () => update((d) => void (d.sessionId = null)),
      saveInterests: (i) => update((d) => void (me && (d.interests[me.id] = i))),
      saveTest: (t) => update((d) => void (me && (d.tests[me.id] = t))),
      myTest,
      myInterests,
      canApply: (courseId) => {
        const course = COURSES.find((c) => c.id === courseId);
        const t = myTest();
        return !!course && meetsLevel(t?.level, course.level);
      },
      createApplication: (courseId, docs) => {
        const id = "AP-" + Math.floor(1000 + Math.random() * 9000);
        const app: Application = {
          id,
          studentId: me!.id,
          courseId,
          agentId: AGENT_ID,
          status: "รอตรวจสอบ",
          submittedAt: new Date().toISOString(),
          docs,
          history: [{ status: "รอตรวจสอบ", at: new Date().toISOString(), by: "Student" }],
          payments: [],
        };
        update((d) => {
          d.applications.unshift(app);
          notify(d, AGENT_ID, "Application ใหม่", `${id} รอการตรวจสอบ`);
          notify(d, me!.id, "ส่ง Application แล้ว", `${id} ถูกส่งให้ Agent เรียบร้อย`);
        });
        return app;
      },
      uploadDoc: (appId, doc) =>
        update((d) => {
          const app = d.applications.find((a) => a.id === appId);
          if (!app) return;
          app.docs = [...app.docs.filter((x) => x.key !== doc.key), doc];
        }),
      act: (appId, action, payload) =>
        update((d) => {
          const app = d.applications.find((a) => a.id === appId);
          if (!app) return;
          const student = app.studentId;
          switch (action) {
            case "agent_return":
              setStatus(d, app, "ส่งกลับให้แก้ไข", "Agent", payload?.note);
              notify(d, student, "ต้องแก้ไข Application", `${app.id}: ${payload?.note ?? "กรุณาตรวจสอบเอกสาร"}`);
              break;
            case "student_resubmit":
              setStatus(d, app, "รอตรวจสอบ", "Student");
              notify(d, app.agentId, "Student แก้ไข Application", `${app.id} ถูกส่งกลับมาตรวจสอบอีกครั้ง`);
              break;
            case "agent_send_college":
              app.collegeId = COLLEGE_ID;
              setStatus(d, app, "ส่งให้ College แล้ว", "Agent");
              notify(d, COLLEGE_ID, "Application ใหม่จาก Agent", `${app.id} ถูกส่งมาให้ College ตรวจสอบ`);
              notify(d, student, "Application ผ่านการตรวจสอบ", `${app.id} ถูกส่งให้ College แล้ว`);
              break;
            case "college_request_info":
              setStatus(d, app, "ส่งกลับให้แก้ไข", "College", payload?.note);
              notify(d, app.agentId, "College ขอข้อมูลเพิ่มเติม", `${app.id}: ${payload?.note ?? ""}`);
              notify(d, student, "ต้องแก้ไข Application", `${app.id}: ${payload?.note ?? ""}`);
              break;
            case "college_issue_offer":
              app.offer = { fileName: payload.offerFile, at: new Date().toISOString() };
              app.invoice = {
                fileName: payload.invoiceFile,
                amount: payload.amount,
                dueDate: payload.dueDate,
                at: new Date().toISOString(),
              };
              setStatus(d, app, "ออก Offer แล้ว", "College");
              notify(d, app.agentId, "College อัปโหลด Offer & Invoice", `${app.id} พร้อมส่งต่อให้นักเรียน`);
              break;
            case "agent_forward_docs":
              if (app.offer) app.offer.sentToStudent = true;
              if (app.invoice) app.invoice.sentToStudent = true;
              setStatus(d, app, "รอชำระเงิน", "Agent");
              app.history.push({ status: "ส่งเอกสารให้นักเรียนแล้ว", at: new Date().toISOString(), by: "Agent" });
              notify(d, student, "มี Offer และ Invoice", `${app.id}: ดาวน์โหลดเอกสารและชำระเงินได้แล้ว`);
              break;
            case "student_pay": {
              const p: Payment = {
                id: "PM-" + Math.floor(100 + Math.random() * 900),
                amount: payload.amount,
                paidDate: payload.paidDate,
                fileName: payload.fileName,
                status: "รอตรวจสอบการชำระเงิน",
              };
              app.payments.unshift(p);
              setStatus(d, app, "รอตรวจสอบการชำระเงิน", "Student");
              notify(d, app.agentId, "Student ส่ง Payment", `${app.id} ยอด ${payload.amount} รอตรวจสอบ`);
              break;
            }
            case "agent_reject_payment": {
              const p = app.payments[0];
              if (p) {
                p.status = "ส่งกลับให้แก้ไข";
                p.note = payload?.note;
              }
              setStatus(d, app, "รอชำระเงิน", "Agent", payload?.note);
              notify(d, student, "Payment มีปัญหา", `${app.id}: ${payload?.note ?? "หลักฐานไม่ถูกต้อง"}`);
              break;
            }
            case "agent_verify_payment": {
              const p = app.payments[0];
              if (p) p.status = "Agent ตรวจแล้ว";
              setStatus(d, app, "รอตรวจสอบการชำระเงิน", "Agent");
              notify(d, COLLEGE_ID, "Agent ส่งข้อมูล Payment", `${app.id} รอ College ยืนยัน`);
              notify(d, student, "Payment ผ่านการตรวจสอบ", `${app.id} ส่งให้ College ยืนยันแล้ว`);
              break;
            }
            case "college_confirm_payment": {
              const p = app.payments[0];
              if (p) p.status = "ชำระเงินแล้ว";
              setStatus(d, app, "ชำระเงินแล้ว", "College");
              app.history.push({ status: "เตรียมรับนักเรียน", at: new Date().toISOString(), by: "College" });
              app.status = "เตรียมรับนักเรียน";
              notify(d, student, "ชำระเงินเรียบร้อย", `${app.id} College กำลังเตรียมรับนักเรียน`);
              notify(d, app.agentId, "College ยืนยันการชำระเงิน", `${app.id} เตรียมรับนักเรียน`);
              break;
            }
            case "complete":
              setStatus(d, app, "เสร็จสิ้น", "College");
              notify(d, student, "ขั้นตอนเสร็จสิ้น", `${app.id} เสร็จสมบูรณ์ ขอให้เดินทางปลอดภัย`);
              notify(d, app.agentId, "Application เสร็จสิ้น", `${app.id} ปิดเคสเรียบร้อย`);
              break;
          }
        }),
      markRead: (id) =>
        update((d) => {
          d.notifications = d.notifications.map((n) =>
            n.accountId === me?.id && (!id || n.id === id) ? { ...n, read: true } : n,
          );
        }),
      unread: db.notifications.filter((n) => n.accountId === me?.id && !n.read).length,
    };
  }, [db, me]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}

export function missingDocs(docs: Doc[]) {
  return DOC_TYPES.filter((d) => d.required && !docs.some((x) => x.key === d.key)).map((d) => d.label);
}

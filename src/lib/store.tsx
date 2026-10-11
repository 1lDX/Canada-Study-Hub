"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { createDemoState } from "@/lib/demo-data";
import { isExpired, isLanguageEligible } from "@/lib/domain";
import type {
  AppState,
  Application,
  Cefr,
  Course,
  LanguageResult,
  LanguageTestType,
  Role,
  StudyInterest,
  User,
} from "@/lib/types";

const DATA_KEY = "mapleleaf-demo-data-v1";
const USER_KEY = "mapleleaf-demo-user-v1";

const uid = (prefix: string) =>
  `${prefix}-${typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Date.now()}`;
const now = () => new Date().toISOString();

type LanguageInput = {
  testType: LanguageTestType;
  scoreValue: number;
  scoreScale: string;
  testDate: string;
  proofName: string;
  proofSize: number;
};

type Store = {
  state: AppState;
  currentUser?: User;
  hydrated: boolean;
  login: (email: string, password: string) => User | undefined;
  register: (input: Pick<User, "firstName" | "lastName" | "email" | "password">) => string | null;
  logout: () => void;
  resetDemo: () => void;
  updateProfile: (firstName: string, lastName: string, organization: string) => void;
  changePassword: (oldPassword: string, newPassword: string) => string | null;
  saveInterests: (interest: Omit<StudyInterest, "studentId">) => void;
  submitLanguage: (input: LanguageInput) => void;
  reviewLanguage: (id: string, approved: boolean, cefr?: Cefr, expiresAt?: string, reason?: string) => string | null;
  addCourse: (course: Omit<Course, "id" | "collegeId">) => void;
  updateCourse: (id: string, course: Omit<Course, "id" | "collegeId">) => void;
  toggleCourse: (id: string) => void;
  deleteCourse: (id: string) => void;
  applyCourse: (courseId: string) => string | null;
  uploadDocument: (applicationId: string, type: string, fileName: string) => void;
  submitApplication: (id: string) => string | null;
  claimApplication: (id: string) => string | null;
  returnToStudent: (id: string, reason: string) => string | null;
  sendToCollege: (id: string) => string | null;
  collegeReturn: (id: string, reason: string) => string | null;
  issueOffer: (id: string, offerName: string, invoiceName: string, amount: number, dueDate: string) => string | null;
  forwardOffer: (id: string) => string | null;
  submitPayment: (id: string, amount: number, paidAt: string, proofName: string) => string | null;
  reviewPayment: (id: string, approved: boolean, reason?: string) => string | null;
  confirmPayment: (id: string) => string | null;
  advanceApplication: (id: string) => string | null;
  markRead: (id: string) => void;
  markAllRead: () => void;
};

const StoreContext = createContext<Store | null>(null);

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(createDemoState);
  const [currentUserId, setCurrentUserId] = useState<string>();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(DATA_KEY);
      const userId = localStorage.getItem(USER_KEY);
      if (saved) setState(JSON.parse(saved) as AppState);
      if (userId) setCurrentUserId(userId);
    } catch {
      localStorage.removeItem(DATA_KEY);
      localStorage.removeItem(USER_KEY);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(DATA_KEY, JSON.stringify(state));
  }, [hydrated, state]);

  useEffect(() => {
    if (!hydrated || !state.languageResults.some((item) => item.status === "verified" && isExpired(item.expiresAt))) return;
    setState((previous) => ({
      ...previous,
      languageResults: previous.languageResults.map((item) =>
        item.status === "verified" && isExpired(item.expiresAt) ? { ...item, status: "expired" as const } : item,
      ),
    }));
  }, [hydrated, state.languageResults]);

  const currentUser = state.users.find((user) => user.id === currentUserId);
  const setSession = (id?: string) => {
    setCurrentUserId(id);
    if (id) localStorage.setItem(USER_KEY, id);
    else localStorage.removeItem(USER_KEY);
  };

  const login: Store["login"] = (email, password) => {
    const user = state.users.find(
      (item) => item.email.toLowerCase() === email.trim().toLowerCase() && item.password === password,
    );
    if (user) setSession(user.id);
    return user;
  };

  const register: Store["register"] = (input) => {
    if (state.users.some((user) => user.email.toLowerCase() === input.email.trim().toLowerCase()))
      return "Email นี้ถูกใช้งานแล้ว";
    const user: User = {
      id: uid("student"),
      ...input,
      email: input.email.trim().toLowerCase(),
      role: "student",
      organization: "MapleLeaf Education",
    };
    setState((previous) => ({ ...previous, users: [...previous.users, user] }));
    setSession(user.id);
    return null;
  };

  const logout = () => setSession();
  const resetDemo = () => {
    setState(createDemoState());
    setSession();
  };

  const updateProfile: Store["updateProfile"] = (firstName, lastName, organization) => {
    if (!currentUser) return;
    setState((previous) => ({
      ...previous,
      users: previous.users.map((user) =>
        user.id === currentUser.id ? { ...user, firstName, lastName, organization } : user,
      ),
    }));
  };

  const changePassword: Store["changePassword"] = (oldPassword, newPassword) => {
    if (!currentUser || currentUser.password !== oldPassword) return "รหัสผ่านเดิมไม่ถูกต้อง";
    if (newPassword.length < 8) return "รหัสผ่านใหม่ต้องมีอย่างน้อย 8 ตัวอักษร";
    setState((previous) => ({
      ...previous,
      users: previous.users.map((user) =>
        user.id === currentUser.id ? { ...user, password: newPassword } : user,
      ),
    }));
    return null;
  };

  const saveInterests: Store["saveInterests"] = (interest) => {
    if (!currentUser || currentUser.role !== "student") return;
    setState((previous) => ({
      ...previous,
      interests: [
        ...previous.interests.filter((item) => item.studentId !== currentUser.id),
        { ...interest, studentId: currentUser.id },
      ],
    }));
  };

  const submitLanguage: Store["submitLanguage"] = (input) => {
    if (!currentUser || currentUser.role !== "student") return;
    const result: LanguageResult = {
      id: uid("language"),
      studentId: currentUser.id,
      ...input,
      status: "pending_verification",
      submittedAt: now(),
    };
    setState((previous) => {
      const agents = previous.users.filter((user) => user.role === "agent");
      return {
        ...previous,
        languageResults: [
          ...previous.languageResults.filter((item) => item.studentId !== currentUser.id),
          result,
        ],
        notifications: [
          ...previous.notifications,
          ...agents.map((agent) => ({
            id: uid("notification"),
            userId: agent.id,
            title: "มีผลภาษารอตรวจสอบ",
            message: `${currentUser.firstName} ส่งผล ${input.testType}`,
            href: "/portal/documents",
            createdAt: now(),
          })),
        ],
      };
    });
  };

  const reviewLanguage: Store["reviewLanguage"] = (id, approved, cefr, expiresAt, reason) => {
    if (!currentUser || currentUser.role !== "agent") return "ไม่มีสิทธิ์ดำเนินการ";
    if (approved && !cefr) return "กรุณาเลือกระดับ CEFR";
    if (!approved && !reason?.trim()) return "กรุณากรอกเหตุผลที่ส่งกลับ";
    setState((previous) => {
      const result = previous.languageResults.find((item) => item.id === id);
      if (!result) return previous;
      return {
        ...previous,
        languageResults: previous.languageResults.map((item) =>
          item.id === id
            ? {
                ...item,
                status: approved ? "verified" : "rejected",
                verifiedCefr: approved ? cefr : undefined,
                expiresAt: approved && expiresAt ? expiresAt : undefined,
                verifiedBy: currentUser.id,
                verifiedAt: now(),
                rejectionReason: approved ? undefined : reason?.trim(),
              }
            : item,
        ),
        notifications: [
          ...previous.notifications,
          {
            id: uid("notification"),
            userId: result.studentId,
            title: approved ? "ผลภาษาได้รับการยืนยัน" : "ผลภาษาต้องแก้ไข",
            message: approved ? `ระดับภาษาที่ตรวจสอบแล้ว: ${cefr}` : reason!.trim(),
            href: "/portal/language-test",
            createdAt: now(),
          },
        ],
      };
    });
    return null;
  };

  const addCourse: Store["addCourse"] = (input) => {
    if (!currentUser?.collegeId || currentUser.role !== "college") return;
    setState((previous) => ({
      ...previous,
      courses: [...previous.courses, { ...input, id: uid("course"), collegeId: currentUser.collegeId! }],
    }));
  };
  const updateCourse: Store["updateCourse"] = (id, input) => {
    if (!currentUser?.collegeId || currentUser.role !== "college") return;
    setState((previous) => ({
      ...previous,
      courses: previous.courses.map((course) =>
        course.id === id && course.collegeId === currentUser.collegeId ? { ...input, id, collegeId: currentUser.collegeId } : course,
      ),
    }));
  };
  const toggleCourse: Store["toggleCourse"] = (id) => {
    if (!currentUser?.collegeId) return;
    setState((previous) => ({
      ...previous,
      courses: previous.courses.map((course) =>
        course.id === id && course.collegeId === currentUser.collegeId
          ? { ...course, active: !course.active }
          : course,
      ),
    }));
  };
  const deleteCourse: Store["deleteCourse"] = (id) => {
    if (!currentUser?.collegeId) return;
    setState((previous) => ({
      ...previous,
      courses: previous.courses.filter(
        (course) => course.id !== id || course.collegeId !== currentUser.collegeId,
      ),
    }));
  };

  const applyCourse: Store["applyCourse"] = (courseId) => {
    if (!currentUser || currentUser.role !== "student") return null;
    const course = state.courses.find((item) => item.id === courseId);
    const result = state.languageResults.find((item) => item.studentId === currentUser.id);
    if (!course || !isLanguageEligible(result, course.requiredCefr)) return null;
    const existing = state.applications.find(
      (item) => item.studentId === currentUser.id && item.courseId === courseId && item.status !== "completed",
    );
    if (existing) return existing.id;
    const application: Application = {
      id: uid("application"),
      studentId: currentUser.id,
      courseId,
      collegeId: course.collegeId,
      status: "draft",
      createdAt: now(),
      documents: course.requirements.map((type) => ({ type, required: true, reviewStatus: "missing" })),
      events: [],
    };
    setState((previous) => ({ ...previous, applications: [...previous.applications, application] }));
    return application.id;
  };

  const uploadDocument: Store["uploadDocument"] = (applicationId, type, fileName) => {
    if (!currentUser) return;
    setState((previous) => ({
      ...previous,
      applications: previous.applications.map((application) =>
        application.id === applicationId && application.studentId === currentUser.id
          ? {
              ...application,
              documents: application.documents.map((document) =>
                document.type === type
                  ? { ...document, fileName, uploadedAt: now(), reviewStatus: "uploaded" }
                  : document,
              ),
            }
          : application,
      ),
    }));
  };

  function event(application: Application, action: string, role: Role, actorId: string, reason?: string) {
    return {
      id: uid("event"),
      action,
      actorId,
      actorRole: role,
      createdAt: now(),
      reason,
      status: application.status,
    };
  }

  const submitApplication: Store["submitApplication"] = (id) => {
    if (!currentUser || currentUser.role !== "student") return "ไม่มีสิทธิ์ดำเนินการ";
    const application = state.applications.find((item) => item.id === id && item.studentId === currentUser.id);
    if (!application) return "ไม่พบ Application";
    if (application.documents.some((document) => document.required && !document.fileName)) return "กรุณาอัปโหลดเอกสารให้ครบ";
    const course = state.courses.find((item) => item.id === application.courseId)!;
    const language = state.languageResults.find((item) => item.studentId === currentUser.id);
    if (!isLanguageEligible(language, course.requiredCefr)) return "ผลภาษายังไม่ผ่านเกณฑ์";
    setState((previous) => ({
      ...previous,
      applications: previous.applications.map((item) =>
        item.id === id
          ? {
              ...item,
              status: "pending_agent_review",
              submittedAt: now(),
              events: [...item.events, event({ ...item, status: "pending_agent_review" }, "Student ส่ง Application", currentUser.role, currentUser.id)],
            }
          : item,
      ),
      notifications: [
        ...previous.notifications,
        ...previous.users.filter((user) => user.role === "agent").map((agent) => ({
          id: uid("notification"), userId: agent.id, title: "มี Application ใหม่", message: course.name,
          href: `/portal/applications/${id}`, createdAt: now(),
        })),
      ],
    }));
    return null;
  };

  const claimApplication: Store["claimApplication"] = (id) => {
    if (!currentUser || currentUser.role !== "agent") return "ไม่มีสิทธิ์ดำเนินการ";
    const application = state.applications.find((item) => item.id === id);
    if (!application) return "ไม่พบ Application";
    if (application.agentId && application.agentId !== currentUser.id) return "Agent คนอื่นรับเคสนี้แล้ว";
    setState((previous) => ({
      ...previous,
      applications: previous.applications.map((item) => item.id === id ? { ...item, agentId: currentUser.id, events: [...item.events, event(item, "Agent รับเคส", currentUser.role, currentUser.id)] } : item),
    }));
    return null;
  };

  const transition = (
    id: string,
    nextStatus: Application["status"],
    action: string,
    recipientIds: string[],
    reason?: string,
  ) => {
    if (!currentUser) return;
    setState((previous) => ({
      ...previous,
      applications: previous.applications.map((item) =>
        item.id === id
          ? {
              ...item,
              status: nextStatus,
              events: [...item.events, event({ ...item, status: nextStatus }, action, currentUser.role, currentUser.id, reason)],
            }
          : item,
      ),
      notifications: [
        ...previous.notifications,
        ...recipientIds.map((userId) => ({
          id: uid("notification"), userId, title: action, message: reason || "มีการอัปเดตสถานะ Application",
          href: `/portal/applications/${id}`, createdAt: now(),
        })),
      ],
    }));
  };

  const returnToStudent: Store["returnToStudent"] = (id, reason) => {
    if (!currentUser || currentUser.role !== "agent") return "ไม่มีสิทธิ์ดำเนินการ";
    if (!reason.trim()) return "กรุณากรอกเหตุผล";
    const application = state.applications.find((item) => item.id === id);
    if (!application) return "ไม่พบ Application";
    if (application.agentId !== currentUser.id) return "กรุณากดรับเคสก่อนส่ง College";
    transition(id, "needs_student_revision", "ส่งกลับให้ Student แก้ไข", [application.studentId], reason.trim());
    return null;
  };

  const sendToCollege: Store["sendToCollege"] = (id) => {
    if (!currentUser || currentUser.role !== "agent") return "ไม่มีสิทธิ์ดำเนินการ";
    const application = state.applications.find((item) => item.id === id);
    if (!application) return "ไม่พบ Application";
    if (application.agentId !== currentUser.id) return "กรุณากดรับเคสก่อนส่ง College";
    const recipients = state.users.filter((user) => user.role === "college" && user.collegeId === application.collegeId).map((user) => user.id);
    transition(id, "sent_to_college", "ส่ง Application ให้ College", recipients);
    return null;
  };

  const collegeReturn: Store["collegeReturn"] = (id, reason) => {
    if (!currentUser || currentUser.role !== "college") return "ไม่มีสิทธิ์ดำเนินการ";
    if (!reason.trim()) return "กรุณากรอกเหตุผล";
    const application = state.applications.find((item) => item.id === id);
    if (!application?.agentId) return "Application ยังไม่มี Agent";
    transition(id, "needs_agent_revision", "College ขอข้อมูลเพิ่มเติม", [application.agentId], reason.trim());
    return null;
  };

  const issueOffer: Store["issueOffer"] = (id, offerName, invoiceName, amount, dueDate) => {
    if (!currentUser || currentUser.role !== "college") return "ไม่มีสิทธิ์ดำเนินการ";
    if (!offerName || !invoiceName || amount <= 0 || !dueDate) return "กรุณากรอก Offer และ Invoice ให้ครบ";
    const application = state.applications.find((item) => item.id === id);
    if (!application?.agentId) return "Application ยังไม่มี Agent";
    const agentId = application.agentId;
    setState((previous) => ({
      ...previous,
      applications: previous.applications.map((item) => item.id === id ? {
        ...item,
        status: "offer_issued",
        offer: { fileName: offerName, createdAt: now() },
        invoice: { fileName: invoiceName, amountCad: amount, dueDate, createdAt: now() },
        events: [...item.events, event({ ...item, status: "offer_issued" }, "College ออก Offer และ Invoice", currentUser.role, currentUser.id)],
      } : item),
      notifications: [...previous.notifications, {
        id: uid("notification"), userId: agentId, title: "College ออก Offer และ Invoice",
        message: `Invoice CAD ${amount.toLocaleString()}`, href: `/portal/applications/${id}`, createdAt: now(),
      }],
    }));
    return null;
  };

  const forwardOffer: Store["forwardOffer"] = (id) => {
    if (!currentUser || currentUser.role !== "agent") return "ไม่มีสิทธิ์ดำเนินการ";
    const application = state.applications.find((item) => item.id === id);
    if (!application?.offer || !application.invoice) return "ยังไม่มี Offer หรือ Invoice";
    setState((previous) => ({
      ...previous,
      applications: previous.applications.map((item) => item.id === id ? {
        ...item, status: "awaiting_payment",
        offer: { ...item.offer!, forwardedAt: now() }, invoice: { ...item.invoice!, forwardedAt: now() },
        events: [
          ...item.events,
          event({ ...item, status: "documents_sent" }, "Agent ส่ง Offer และ Invoice ให้ Student", currentUser.role, currentUser.id),
          event({ ...item, status: "awaiting_payment" }, "รอ Student ชำระเงิน", currentUser.role, currentUser.id),
        ],
      } : item),
      notifications: [...previous.notifications, {
        id: uid("notification"), userId: application.studentId, title: "มี Offer และ Invoice ใหม่",
        message: "กรุณาตรวจสอบเอกสารและชำระเงิน", href: "/portal/offers", createdAt: now(),
      }],
    }));
    return null;
  };

  const submitPayment: Store["submitPayment"] = (id, amount, paidAt, proofName) => {
    if (!currentUser || currentUser.role !== "student") return "ไม่มีสิทธิ์ดำเนินการ";
    const application = state.applications.find((item) => item.id === id && item.studentId === currentUser.id);
    if (!application?.invoice) return "ไม่พบ Invoice";
    if (amount !== application.invoice.amountCad) return `ยอดต้องตรงกับ Invoice: CAD ${application.invoice.amountCad.toLocaleString()}`;
    if (!paidAt || !proofName) return "กรุณากรอกข้อมูลและอัปโหลดหลักฐานให้ครบ";
    setState((previous) => ({
      ...previous,
      applications: previous.applications.map((item) => item.id === id ? {
        ...item, status: "payment_under_review",
        payment: { amountCad: amount, paidAt, proofName, status: "pending_agent" },
        events: [...item.events, event({ ...item, status: "payment_under_review" }, "Student ส่งหลักฐานการชำระเงิน", currentUser.role, currentUser.id)],
      } : item),
      notifications: [...previous.notifications, ...(application.agentId ? [{
        id: uid("notification"), userId: application.agentId, title: "มี Payment รอตรวจ",
        message: proofName, href: `/portal/applications/${id}`, createdAt: now(),
      }] : [])],
    }));
    return null;
  };

  const reviewPayment: Store["reviewPayment"] = (id, approved, reason) => {
    if (!currentUser || currentUser.role !== "agent") return "ไม่มีสิทธิ์ดำเนินการ";
    if (!approved && !reason?.trim()) return "กรุณากรอกเหตุผล";
    const application = state.applications.find((item) => item.id === id);
    if (!application?.payment) return "ไม่พบ Payment";
    if (approved) {
      const recipients = state.users.filter((user) => user.role === "college" && user.collegeId === application.collegeId).map((user) => user.id);
      setState((previous) => ({
        ...previous,
        applications: previous.applications.map((item) => item.id === id ? { ...item, payment: { ...item.payment!, status: "pending_college", rejectionReason: undefined }, events: [...item.events, event(item, "Agent ยืนยัน Payment และส่ง College", currentUser.role, currentUser.id)] } : item),
        notifications: [...previous.notifications, ...recipients.map((userId) => ({
          id: uid("notification"), userId, title: "Payment รอยืนยัน", message: "Agent ยืนยันหลักฐานแล้ว",
          href: `/portal/applications/${id}`, createdAt: now(),
        }))],
      }));
    } else {
      setState((previous) => ({
        ...previous,
        applications: previous.applications.map((item) => item.id === id ? { ...item, status: "awaiting_payment", payment: { ...item.payment!, status: "needs_revision", rejectionReason: reason!.trim() }, events: [...item.events, event({ ...item, status: "awaiting_payment" }, "ส่ง Payment กลับให้ Student", currentUser.role, currentUser.id, reason!.trim())] } : item),
        notifications: [...previous.notifications, {
          id: uid("notification"), userId: application.studentId, title: "Payment ต้องแก้ไข",
          message: reason!.trim(), href: "/portal/payments", createdAt: now(),
        }],
      }));
    }
    return null;
  };

  const confirmPayment: Store["confirmPayment"] = (id) => {
    if (!currentUser || currentUser.role !== "college") return "ไม่มีสิทธิ์ดำเนินการ";
    const application = state.applications.find((item) => item.id === id);
    if (application?.payment?.status !== "pending_college") return "Payment ยังไม่ผ่าน Agent";
    setState((previous) => ({
      ...previous,
      applications: previous.applications.map((item) => item.id === id ? {
        ...item, status: "paid", payment: { ...item.payment!, status: "confirmed" },
        events: [...item.events, event({ ...item, status: "paid" }, "College ยืนยันการชำระเงิน", currentUser.role, currentUser.id)],
      } : item),
      notifications: [...previous.notifications, {
        id: uid("notification"), userId: application.studentId, title: "ชำระเงินแล้ว",
        message: "College ยืนยันการชำระเงินเรียบร้อย", href: `/portal/applications/${id}`, createdAt: now(),
      }],
    }));
    return null;
  };

  const advanceApplication: Store["advanceApplication"] = (id) => {
    if (!currentUser || currentUser.role !== "college") return "ไม่มีสิทธิ์ดำเนินการ";
    const application = state.applications.find((item) => item.id === id);
    if (!application || !["paid", "preparing_student"].includes(application.status)) return "สถานะไม่พร้อมดำเนินการ";
    const next = application.status === "paid" ? "preparing_student" : "completed";
    transition(id, next, next === "preparing_student" ? "เตรียมรับ Student" : "ปิดเคสเสร็จสิ้น", [application.studentId]);
    return null;
  };

  const markRead = (id: string) => {
    if (!currentUser) return;
    setState((previous) => ({
      ...previous,
      notifications: previous.notifications.map((item) => item.id === id && item.userId === currentUser.id ? { ...item, readAt: now() } : item),
    }));
  };
  const markAllRead = () => {
    if (!currentUser) return;
    setState((previous) => ({
      ...previous,
      notifications: previous.notifications.map((item) => item.userId === currentUser.id ? { ...item, readAt: item.readAt || now() } : item),
    }));
  };

  const value = useMemo<Store>(() => ({
    state, currentUser, hydrated, login, register, logout, resetDemo, updateProfile, changePassword,
    saveInterests, submitLanguage, reviewLanguage, addCourse, updateCourse, toggleCourse, deleteCourse, applyCourse,
    uploadDocument, submitApplication, claimApplication, returnToStudent, sendToCollege, collegeReturn,
    issueOffer, forwardOffer, submitPayment, reviewPayment, confirmPayment, advanceApplication,
    markRead, markAllRead,
  }), [state, currentUser, hydrated]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useAppStore() {
  const value = useContext(StoreContext);
  if (!value) throw new Error("useAppStore must be used inside AppStoreProvider");
  return value;
}

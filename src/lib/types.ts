export type Role = "student" | "agent" | "college";
export type Cefr = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
export type LanguageTestType =
  | "IELTS"
  | "TOEFL iBT"
  | "Duolingo English Test"
  | "CELPIP"
  | "PTE Academic";
export type LanguageStatus =
  | "pending_verification"
  | "verified"
  | "rejected"
  | "expired";
export type ApplicationStatus =
  | "draft"
  | "pending_agent_review"
  | "needs_student_revision"
  | "sent_to_college"
  | "needs_agent_revision"
  | "offer_issued"
  | "documents_sent"
  | "awaiting_payment"
  | "payment_under_review"
  | "paid"
  | "preparing_student"
  | "completed";

export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: Role;
  organization: string;
  collegeId?: string;
  isDemo?: boolean;
}

export interface StudyInterest {
  studentId: string;
  city: string;
  courseType: string;
  field: string;
  durationMonths: number;
  budgetCad: number;
  educationLevel: string;
  goal: string;
}

export interface LanguageResult {
  id: string;
  studentId: string;
  testType: LanguageTestType;
  scoreValue: number;
  scoreScale: string;
  testDate: string;
  proofName: string;
  proofSize: number;
  status: LanguageStatus;
  verifiedCefr?: Cefr;
  expiresAt?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  rejectionReason?: string;
  submittedAt: string;
}

export interface College {
  id: string;
  name: string;
  city: string;
}

export interface Course {
  id: string;
  collegeId: string;
  name: string;
  city: string;
  type: string;
  field: string;
  durationMonths: number;
  tuitionCad: number;
  requiredCefr: Cefr;
  minEducation: string;
  description: string;
  active: boolean;
  requirements: string[];
}

export interface ApplicationDocument {
  type: string;
  required: boolean;
  fileName?: string;
  uploadedAt?: string;
  reviewStatus: "missing" | "uploaded" | "accepted" | "rejected";
  reviewReason?: string;
}

export interface ApplicationEvent {
  id: string;
  action: string;
  actorId: string;
  actorRole: Role;
  createdAt: string;
  reason?: string;
  status: ApplicationStatus;
}

export interface Offer {
  fileName: string;
  createdAt: string;
  forwardedAt?: string;
}

export interface Invoice {
  fileName: string;
  amountCad: number;
  dueDate: string;
  createdAt: string;
  forwardedAt?: string;
}

export interface Payment {
  amountCad: number;
  paidAt: string;
  proofName: string;
  status: "pending_agent" | "needs_revision" | "pending_college" | "confirmed";
  rejectionReason?: string;
}

export interface Application {
  id: string;
  studentId: string;
  courseId: string;
  collegeId: string;
  agentId?: string;
  status: ApplicationStatus;
  createdAt: string;
  submittedAt?: string;
  documents: ApplicationDocument[];
  events: ApplicationEvent[];
  offer?: Offer;
  invoice?: Invoice;
  payment?: Payment;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  href: string;
  createdAt: string;
  readAt?: string;
}

export interface AppState {
  users: User[];
  colleges: College[];
  courses: Course[];
  interests: StudyInterest[];
  languageResults: LanguageResult[];
  applications: Application[];
  notifications: Notification[];
}

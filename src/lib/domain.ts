import type {
  Cefr,
  Course,
  LanguageResult,
  LanguageTestType,
  StudyInterest,
} from "@/lib/types";

const cefrOrder: Cefr[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

export function isExpired(date?: string, now = new Date()) {
  return Boolean(date && new Date(`${date}T23:59:59`).getTime() < now.getTime());
}

export function isLanguageEligible(
  result: LanguageResult | undefined,
  required: Cefr,
  now = new Date(),
) {
  if (!result || result.status !== "verified" || !result.verifiedCefr) return false;
  if (isExpired(result.expiresAt, now)) return false;
  return cefrOrder.indexOf(result.verifiedCefr) >= cefrOrder.indexOf(required);
}

export function courseMatchScore(course: Course, interest?: StudyInterest) {
  if (!interest) return 0;
  let score = 0;
  if (course.city === interest.city) score += 20;
  if (course.type === interest.courseType) score += 20;
  if (course.field === interest.field) score += 20;
  if (course.durationMonths === interest.durationMonths) score += 15;
  if (course.tuitionCad <= interest.budgetCad) score += 15;
  if (course.minEducation === interest.educationLevel) score += 10;
  return score;
}

export function validateLanguageScore(
  testType: LanguageTestType,
  score: number,
  scale: string,
) {
  if (!Number.isFinite(score)) return "กรุณากรอกคะแนนเป็นตัวเลข";
  const step = (value: number, size: number) =>
    Math.abs(value / size - Math.round(value / size)) < 1e-9;

  if (testType === "IELTS" && (score < 0 || score > 9 || !step(score, 0.5)))
    return "IELTS ต้องอยู่ระหว่าง 0–9 และเพิ่มครั้งละ 0.5";
  if (testType === "TOEFL iBT" && scale === "0-120" && (!Number.isInteger(score) || score < 0 || score > 120))
    return "TOEFL iBT 0–120 ต้องเป็นจำนวนเต็ม";
  if (testType === "TOEFL iBT" && scale === "1-6" && (score < 1 || score > 6 || !step(score, 0.5)))
    return "TOEFL iBT 1–6 ต้องเพิ่มครั้งละ 0.5";
  if (testType === "Duolingo English Test" && (score < 10 || score > 160 || !step(score, 5)))
    return "Duolingo ต้องอยู่ระหว่าง 10–160 และเพิ่มครั้งละ 5";
  if (testType === "CELPIP" && (!Number.isInteger(score) || score < 0 || score > 12))
    return "CELPIP ต้องอยู่ระหว่าง 0–12";
  if (testType === "PTE Academic" && (!Number.isInteger(score) || score < 10 || score > 90))
    return "PTE Academic ต้องอยู่ระหว่าง 10–90";
  return null;
}

export function money(amount: number) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function dateTime(value?: string) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function labelDuration(months: number) {
  if (months < 12) return `${months} months`;
  const years = months / 12;
  return `${years} year${years > 1 ? "s" : ""}`;
}

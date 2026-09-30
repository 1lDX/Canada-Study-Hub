export const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
export type Level = (typeof LEVELS)[number];

export function levelIndex(l: string) {
  return LEVELS.indexOf(l as Level);
}
export function meetsLevel(student: string | undefined, required: string) {
  if (!student) return false;
  return levelIndex(student) >= levelIndex(required);
}

export const CITIES = ["Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa", "Halifax"];
export const COURSE_TYPES = ["Language Program", "Certificate", "Diploma", "Postgraduate Diploma", "Bachelor Degree"];
export const FIELDS = ["Business", "Information Technology", "Hospitality", "Healthcare", "Design", "Engineering"];
export const DURATIONS = ["3 months", "6 months", "1 year", "2 years"];

export const DOC_TYPES = [
  { key: "passport", label: "Passport", required: true },
  { key: "transcript", label: "Transcript", required: true },
  { key: "certificate", label: "Certificate", required: true },
  { key: "language_test", label: "Language Test", required: true },
  { key: "photo", label: "รูปถ่าย / Photo", required: true },
  { key: "extra", label: "เอกสารเพิ่มเติม / Additional", required: false },
] as const;

export const STATUSES = [
  "รอตรวจสอบ",
  "ส่งกลับให้แก้ไข",
  "ส่งให้ College แล้ว",
  "ออก Offer แล้ว",
  "ส่งเอกสารให้นักเรียนแล้ว",
  "รอชำระเงิน",
  "รอตรวจสอบการชำระเงิน",
  "ชำระเงินแล้ว",
  "เตรียมรับนักเรียน",
  "เสร็จสิ้น",
] as const;
export type Status = (typeof STATUSES)[number];

export const TIMELINE: Status[] = [
  "รอตรวจสอบ",
  "ส่งให้ College แล้ว",
  "ออก Offer แล้ว",
  "ส่งเอกสารให้นักเรียนแล้ว",
  "รอชำระเงิน",
  "รอตรวจสอบการชำระเงิน",
  "ชำระเงินแล้ว",
  "เตรียมรับนักเรียน",
  "เสร็จสิ้น",
];

export type Course = {
  id: string;
  name: string;
  college: string;
  city: string;
  type: string;
  field: string;
  duration: string;
  tuition: number;
  level: Level;
  intake: string;
  description: string;
};

export const COURSES: Course[] = [
  {
    id: "c1",
    name: "Business Administration – Marketing",
    college: "Maple Ridge College",
    city: "Toronto",
    type: "Diploma",
    field: "Business",
    duration: "2 years",
    tuition: 15800,
    level: "B2",
    intake: "Jan / May / Sep",
    description:
      "หลักสูตรบริหารธุรกิจเน้นการตลาดดิจิทัล มี Co-op 4 เดือน และเตรียมพร้อมสู่ Post-Graduation Work Permit",
  },
  {
    id: "c2",
    name: "General English Program",
    college: "Vancouver Language Institute",
    city: "Vancouver",
    type: "Language Program",
    field: "Business",
    duration: "3 months",
    tuition: 4200,
    level: "A1",
    intake: "ทุกเดือน",
    description: "หลักสูตรภาษาอังกฤษทั่วไป 25 ชั่วโมง/สัปดาห์ เหมาะสำหรับผู้เริ่มต้นและปรับพื้นฐานก่อนเข้าคอลเลจ",
  },
  {
    id: "c3",
    name: "Computer Programming & Analysis",
    college: "St. Lawrence Institute of Technology",
    city: "Ottawa",
    type: "Diploma",
    field: "Information Technology",
    duration: "2 years",
    tuition: 17400,
    level: "B2",
    intake: "Jan / Sep",
    description: "เขียนโปรแกรมเว็บและระบบฐานข้อมูล พร้อมโปรเจกต์จริงร่วมกับบริษัทเทคโนโลยีในออตตาวา",
  },
  {
    id: "c4",
    name: "Hospitality & Tourism Management",
    college: "Rockies Hospitality College",
    city: "Calgary",
    type: "Certificate",
    field: "Hospitality",
    duration: "1 year",
    tuition: 11200,
    level: "B1",
    intake: "Feb / Aug",
    description: "หลักสูตรการโรงแรมและท่องเที่ยว มีฝึกงานในรีสอร์ตเขตเทือกเขาร็อกกี",
  },
  {
    id: "c5",
    name: "Practical Nursing Assistant",
    college: "Halifax Health College",
    city: "Halifax",
    type: "Diploma",
    field: "Healthcare",
    duration: "2 years",
    tuition: 18900,
    level: "C1",
    intake: "Sep",
    description: "หลักสูตรผู้ช่วยพยาบาลที่ได้รับการรับรอง มีชั่วโมงปฏิบัติงานในโรงพยาบาลรัฐ",
  },
  {
    id: "c6",
    name: "Graphic & Interactive Design",
    college: "Montreal School of Design",
    city: "Montreal",
    type: "Certificate",
    field: "Design",
    duration: "1 year",
    tuition: 12600,
    level: "B1",
    intake: "Jan / Sep",
    description: "ออกแบบกราฟิกและ UI/UX พร้อมสร้าง Portfolio ระดับมืออาชีพ",
  },
  {
    id: "c7",
    name: "Project Management (Postgraduate)",
    college: "Maple Ridge College",
    city: "Toronto",
    type: "Postgraduate Diploma",
    field: "Business",
    duration: "1 year",
    tuition: 16300,
    level: "B2",
    intake: "Jan / May",
    description: "หลักสูตรต่อยอดสำหรับผู้จบปริญญาตรี เตรียมสอบ CAPM/PMP",
  },
  {
    id: "c8",
    name: "Mechanical Engineering Technician",
    college: "St. Lawrence Institute of Technology",
    city: "Ottawa",
    type: "Diploma",
    field: "Engineering",
    duration: "2 years",
    tuition: 16800,
    level: "B1",
    intake: "Sep",
    description: "ช่างเทคนิควิศวกรรมเครื่องกล เรียนการเขียนแบบ CAD และงานปฏิบัติในโรงงาน",
  },
  {
    id: "c9",
    name: "Academic English Pathway",
    college: "Maple Ridge College",
    city: "Toronto",
    type: "Language Program",
    field: "Business",
    duration: "6 months",
    tuition: 6800,
    level: "A2",
    intake: "ทุก 8 สัปดาห์",
    description: "ปรับพื้นฐานภาษาอังกฤษเชิงวิชาการ จบแล้วเข้าเรียน Diploma ได้โดยไม่ต้องสอบ IELTS",
  },
];

export const TEST_TYPES = ["IELTS", "TOEFL iBT", "Duolingo English Test", "CELPIP", "PTE Academic"];

export const PAYMENT_STATUSES = [
  "รอตรวจสอบการชำระเงิน",
  "ส่ງກັບໃຫ້ແກ້ໄຂ",
  "Agent ກວດແລ້ວ",
  "ຊຳລະເງິນແລ້ວ",
] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export function money(n: number) {
  return "CA$ " + n.toLocaleString("en-CA");
}

export function formatDate(iso?: string) {
  if (!iso) return "-";
  return new Date(iso).toLocaleString("th-TH", { dateStyle: "medium", timeStyle: "short" });
}

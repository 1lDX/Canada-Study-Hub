"use client";
import Link from "next/link";
import { Footer, PublicNav } from "@/components/public-nav";
import { Badge, Card } from "@/components/ui";
import { labelDuration, money } from "@/lib/domain";
import { useAppStore } from "@/lib/store";

export function PublicCourses({ id }: { id?: string }) {
  const { state, hydrated } = useAppStore();
  if (!hydrated) return null;
  if (id) {
    const course=state.courses.find(c=>c.id===id); if(!course) return <><PublicNav/><main className="section"><div className="container">ไม่พบหลักสูตร</div></main></>;
    const college=state.colleges.find(c=>c.id===course.collegeId);
    return <><PublicNav/><main className="section"><div className="container details-grid"><div><div className="eyebrow">{course.type}</div><h1>{course.name}</h1><p className="muted">{college?.name} · {course.city}</p><Card><h3>รายละเอียดหลักสูตร</h3><p>{course.description}</p><div className="key-value"><div>ระยะเวลา</div><b>{labelDuration(course.durationMonths)}</b><div>ค่าเรียน</div><b>{money(course.tuitionCad)}</b><div>ระดับภาษา</div><b>{course.requiredCefr}</b><div>การศึกษาขั้นต่ำ</div><b>{course.minEducation}</b></div></Card></div><Card><h3>เอกสารที่ต้องใช้</h3>{course.requirements.map(x=><p key={x}>✓ {x}</p>)}<Link className="button button-primary" href="/register">สมัครเรียน</Link></Card></div></main><Footer/></>;
  }
  return <><PublicNav/><main className="section"><div className="container"><div className="eyebrow">Programs in Canada</div><h1>ค้นหา Course ที่เหมาะกับคุณ</h1><p className="muted">เข้าสู่ระบบเพื่อดู Match Score และ eligibility เฉพาะบุคคล</p><div className="course-grid">{state.courses.filter(c=>c.active).map(c=><Card className="course-card" key={c.id}><div><Badge tone="red">{c.type}</Badge></div><h3>{c.name}</h3><div className="muted">{state.colleges.find(x=>x.id===c.collegeId)?.name} · {c.city}</div><p>{c.description}</p><div className="course-meta"><Badge>{labelDuration(c.durationMonths)}</Badge><Badge>{money(c.tuitionCad)}</Badge><Badge>{c.field}</Badge><Badge tone="blue">CEFR {c.requiredCefr}</Badge></div><div className="course-actions"><Link href={`/courses/${c.id}`} className="button button-secondary">รายละเอียด</Link></div></Card>)}</div></div></main><Footer/></>;
}

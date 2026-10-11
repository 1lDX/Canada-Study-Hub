"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Brand } from "@/components/public-nav";
import { Button, Card, Field } from "@/components/ui";
import { useAppStore } from "@/lib/store";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const { login, register } = useAppStore();
  const [error, setError] = useState("");
  const [email, setEmail] = useState(mode === "login" ? "student@demo.com" : "");
  const [password, setPassword] = useState(mode === "login" ? "123456" : "");
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setError("");
    if (mode === "login") {
      const user = login(email, password);
      if (!user) return setError("Email หรือรหัสผ่านไม่ถูกต้อง");
      router.push("/portal/dashboard");
    } else {
      const data = new FormData(e.currentTarget);
      const message = register({ firstName:String(data.get("firstName")), lastName:String(data.get("lastName")), email, password });
      if (message) return setError(message);
      router.push("/portal/dashboard");
    }
  }
  return <div className="auth-shell"><section className="auth-story"><Brand/><div><div className="eyebrow" style={{color:"#ffd3da"}}>MapleLeaf Portal</div><h1 style={{fontSize:"clamp(2.5rem,5vw,5rem)"}}>ทุกขั้นตอน<br/>ชัดเจนกว่าเดิม</h1><p>Course Match • Application • Documents • Offer • Payment</p></div><small>ระบบ Pilot — ห้ามใช้ข้อมูลส่วนบุคคลจริง</small></section><section className="auth-panel"><Card className="auth-card"><div className="eyebrow">{mode === "login" ? "Welcome back" : "Create student account"}</div><h2>{mode === "login" ? "เข้าสู่ระบบ" : "สมัครสมาชิก"}</h2>{error && <div className="toast">{error}</div>}<form onSubmit={submit}>{mode === "register" && <div className="form-grid"><Field label="ชื่อ"><input name="firstName" required/></Field><Field label="นามสกุล"><input name="lastName" required/></Field></div>}<Field label="Email"><input type="email" value={email} onChange={e=>setEmail(e.target.value)} required/></Field><Field label="รหัสผ่าน" hint={mode === "register" ? "อย่างน้อย 6 ตัวอักษร" : undefined}><input type="password" minLength={6} value={password} onChange={e=>setPassword(e.target.value)} required/></Field><Button style={{width:"100%"}}>{mode === "login" ? "เข้าสู่ระบบ" : "สร้างบัญชี Student"}</Button></form>{mode === "login" && <div className="demo-accounts"><b>Demo accounts — password 123456</b><br/>student@demo.com<br/>agent@demo.com<br/>college@demo.com</div>}<p className="muted" style={{fontSize:13,marginTop:16}}>{mode === "login" ? <>ยังไม่มีบัญชี? <Link className="accent" href="/register">สมัครสมาชิก</Link></> : <>มีบัญชีแล้ว? <Link className="accent" href="/login">เข้าสู่ระบบ</Link></>}</p><Link href="/" className="muted" style={{fontSize:12}}>← กลับหน้าหลัก</Link></Card></section></div>;
}

import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useStore } from "@/lib/store";
import { Button, Card, Field, inputClass } from "./ui-kit";

export function EditProfileCard() {
  const { me } = useStore();
  const [f, setF] = useState({ firstname: me?.firstname ?? "", lastname: me?.lastname ?? "", org: me?.org ?? "" });
  const [saving, setSaving] = useState(false);
  if (!me) return null;
  const save = async () => {
    if (!f.firstname.trim() || !f.lastname.trim()) return toast.error("กรุณากรอกชื่อและนามสกุล");
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ firstname: f.firstname.trim().slice(0, 100), lastname: f.lastname.trim().slice(0, 100), org: f.org.trim().slice(0, 150) || null })
      .eq("id", me.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("บันทึกข้อมูลแล้ว");
    setTimeout(() => window.location.reload(), 600);
  };
  return (
    <Card>
      <p className="mb-3 font-semibold">แก้ไขข้อมูลส่วนตัว</p>
      <div className="space-y-3">
        <Field label="ชื่อ"><input className={inputClass} value={f.firstname} onChange={(e) => setF({ ...f, firstname: e.target.value })} /></Field>
        <Field label="นามสกุล"><input className={inputClass} value={f.lastname} onChange={(e) => setF({ ...f, lastname: e.target.value })} /></Field>
        {me.role !== "student" && (
          <Field label="หน่วยงาน"><input className={inputClass} value={f.org} onChange={(e) => setF({ ...f, org: e.target.value })} /></Field>
        )}
        <Field label="Email" hint="ไม่สามารถเปลี่ยนอีเมลได้"><input className={inputClass} value={me.email} disabled /></Field>
        <Button onClick={save} disabled={saving}>{saving ? "กำลังบันทึก..." : "บันทึก"}</Button>
      </div>
    </Card>
  );
}

export function ChangePasswordCard() {
  const { me } = useStore();
  const [f, setF] = useState({ current: "", next: "", confirm: "" });
  const [saving, setSaving] = useState(false);
  if (!me) return null;
  const save = async () => {
    if (!f.current) return toast.error("กรุณากรอกรหัสผ่านเดิม");
    if (f.next.length < 8) return toast.error("รหัสผ่านใหม่ต้องมีอย่างน้อย 8 ตัวอักษร");
    if (f.next !== f.confirm) return toast.error("รหัสผ่านใหม่และการยืนยันไม่ตรงกัน");
    if (f.next === f.current) return toast.error("รหัสผ่านใหม่ต้องไม่ซ้ำกับรหัสเดิม");
    setSaving(true);
    const check = await supabase.auth.signInWithPassword({ email: me.email, password: f.current });
    if (check.error) {
      setSaving(false);
      return toast.error("รหัสผ่านเดิมไม่ถูกต้อง");
    }
    const { error } = await supabase.auth.updateUser({ password: f.next });
    setSaving(false);
    if (error) return toast.error(error.message);
    setF({ current: "", next: "", confirm: "" });
    toast.success("เปลี่ยนรหัสผ่านเรียบร้อย");
  };
  return (
    <Card>
      <p className="mb-3 font-semibold">เปลี่ยนรหัสผ่าน</p>
      <div className="space-y-3">
        <Field label="รหัสผ่านเดิม"><input type="password" className={inputClass} value={f.current} onChange={(e) => setF({ ...f, current: e.target.value })} /></Field>
        <Field label="รหัสผ่านใหม่" hint="อย่างน้อย 8 ตัวอักษร"><input type="password" className={inputClass} value={f.next} onChange={(e) => setF({ ...f, next: e.target.value })} /></Field>
        <Field label="ยืนยันรหัสผ่านใหม่"><input type="password" className={inputClass} value={f.confirm} onChange={(e) => setF({ ...f, confirm: e.target.value })} /></Field>
        <Button onClick={save} disabled={saving}>{saving ? "กำลังบันทึก..." : "เปลี่ยนรหัสผ่าน"}</Button>
      </div>
    </Card>
  );
}

import { ALink } from "@/components/link";
import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useStore, type Role } from "@/lib/store";
import { Card } from "./ui-kit";

export function RoleGuard({ role, children }: { role: Role; children: ReactNode }) {
  const { me, loading } = useStore();
  if (loading)
    return (
      <div className="grid min-h-screen place-items-center px-4">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  if (!me)
    return (
      <div className="grid min-h-screen place-items-center px-4">
        <Card className="max-w-md text-center">
          <h2 className="text-xl font-semibold">กรุณาเข้าสู่ระบบ</h2>
          <p className="mt-2 text-sm text-muted-foreground">ต้อง Login ก่อนจึงจะเข้าใช้งานส่วนนี้ได้</p>
          <ALink
            to="/login"
            className="mt-4 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            ไปหน้า Login
          </ALink>
        </Card>
      </div>
    );
  if (me.role !== role)
    return (
      <div className="grid min-h-screen place-items-center px-4">
        <Card className="max-w-md text-center">
          <h2 className="text-xl font-semibold">ไม่มีสิทธิ์เข้าถึง</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            บัญชีของคุณเป็น {me.role} จึงเข้าหน้าของ {role} ไม่ได้
          </p>
          <ALink
            to={`/${me.role}/dashboard`}
            className="mt-4 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            ไป Dashboard ของฉัน
          </ALink>
        </Card>
      </div>
    );
  return <>{children}</>;
}

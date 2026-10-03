import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout, collegeNav } from "@/components/layouts";
import { ChangePasswordCard, EditProfileCard } from "@/components/account-settings";

export const Route = createFileRoute("/college/profile")({
  head: () => ({
    meta: [
      { title: "โปรไฟล์ College | MapleLeaf Education" },
      { name: "description", content: "แก้ไขข้อมูลส่วนตัวและเปลี่ยนรหัสผ่านของ College" },
      { property: "og:title", content: "โปรไฟล์ College | MapleLeaf Education" },
      { property: "og:description", content: "แก้ไขข้อมูลส่วนตัวและเปลี่ยนรหัสผ่านของ College" },
    ],
  }),
  component: () => (
    <DashboardLayout nav={collegeNav} title="Profile">
      <div className="grid gap-4 lg:grid-cols-2">
        <EditProfileCard />
        <ChangePasswordCard />
      </div>
    </DashboardLayout>
  ),
});

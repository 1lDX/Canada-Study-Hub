import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout, agentNav } from "@/components/layouts";
import { ChangePasswordCard, EditProfileCard } from "@/components/account-settings";

export const Route = createFileRoute("/agent/profile")({
  head: () => ({
    meta: [
      { title: "โปรไฟล์ Agent | MapleLeaf Education" },
      { name: "description", content: "แก้ไขข้อมูลส่วนตัวและเปลี่ยนรหัสผ่านของ Agent" },
      { property: "og:title", content: "โปรไฟล์ Agent | MapleLeaf Education" },
      { property: "og:description", content: "แก้ไขข้อมูลส่วนตัวและเปลี่ยนรหัสผ่านของ Agent" },
    ],
  }),
  component: () => (
    <DashboardLayout nav={agentNav} title="Profile">
      <div className="grid gap-4 lg:grid-cols-2">
        <EditProfileCard />
        <ChangePasswordCard />
      </div>
    </DashboardLayout>
  ),
});

import { Outlet, createFileRoute } from "@tanstack/react-router";
import { RoleGuard } from "@/components/guard";

export const Route = createFileRoute("/student")({
  component: () => (
    <RoleGuard role="student">
      <Outlet />
    </RoleGuard>
  ),
});

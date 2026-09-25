import { Outlet, createFileRoute } from "@tanstack/react-router";
import { RoleGuard } from "@/components/guard";

export const Route = createFileRoute("/college")({
  component: () => (
    <RoleGuard role="college">
      <Outlet />
    </RoleGuard>
  ),
});

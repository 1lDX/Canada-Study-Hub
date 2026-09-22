import { Outlet, createFileRoute } from "@tanstack/react-router";
import { RoleGuard } from "@/components/guard";

export const Route = createFileRoute("/agent")({
  component: () => (
    <RoleGuard role="agent">
      <Outlet />
    </RoleGuard>
  ),
});

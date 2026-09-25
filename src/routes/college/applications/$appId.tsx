import { createFileRoute } from "@tanstack/react-router";
import { CollegeAppDetailView } from "@/components/role-pages";

export const Route = createFileRoute("/college/applications/$appId")({
  head: () => ({
    meta: [
      { title: "Application Details (College) | MapleLeaf Education" },
      { name: "description", content: "ตรวจสอบข้อมูลนักเรียน เอกสาร และออก Offer" },
      { property: "og:title", content: "Application Details (College) | MapleLeaf Education" },
      { property: "og:description", content: "ตรวจสอบข้อมูลนักเรียน เอกสาร และออก Offer" },
    ],
  }),
  component: Page,
});

function Page() {
  const { appId } = Route.useParams();
  return <CollegeAppDetailView appId={appId} />;
}

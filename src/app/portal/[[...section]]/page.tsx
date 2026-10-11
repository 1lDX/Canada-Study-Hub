import { PortalApp } from "@/components/portal-app";
export default async function Portal({params}:{params:Promise<{section?:string[]}>}) { const p=await params; return <PortalApp path={p.section||["dashboard"]}/>; }

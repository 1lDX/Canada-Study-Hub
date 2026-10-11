import type { Metadata } from "next";
import "./globals.css";
import { AppStoreProvider } from "@/lib/store";

export const metadata: Metadata = { title: "MapleLeaf Education", description: "Study in Canada with confidence" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="th"><body><AppStoreProvider>{children}</AppStoreProvider></body></html>;
}

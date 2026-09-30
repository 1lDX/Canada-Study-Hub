import { supabase } from "@/integrations/supabase/client";

export const MAX_UPLOAD_MB = 8;
export const ALLOWED_EXTENSIONS = ["pdf", "jpg", "jpeg", "png"];

/** Client-side guard rail: the same rules are enforced by Storage policies and the server functions. */
export function validateFile(file: File): string | null {
  const ext = extensionOf(file.name);
  if (!ALLOWED_EXTENSIONS.includes(ext)) return "รองรับเฉพาะไฟล์ PDF, JPG หรือ PNG";
  if (file.size === 0) return "ไฟล์ที่เลือกว่างเปล่า";
  if (file.size > MAX_UPLOAD_MB * 1024 * 1024) return `ไฟล์ต้องมีขนาดไม่เกิน ${MAX_UPLOAD_MB} MB`;
  return null;
}

export function extensionOf(name: string) {
  const parts = name.split(".");
  return (parts.at(-1) ?? "pdf").toLowerCase();
}

/** Files picked before an application exists are held here until the student submits. */
export const stagingPath = (userId: string, key: string) => `${userId}/staging/${key}.${extensionOf(key)}`;

export const appDocPath = (applicationId: string, key: string, originalName: string) =>
  `${applicationId}/${key}.${extensionOf(originalName)}`;

export async function uploadFile(bucket: string, path: string, file: File) {
  const problem = validateFile(file);
  if (problem) throw new Error(problem);
  const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
  if (error) throw new Error(`อัปโหลด ${file.name} ไม่สำเร็จ: ${error.message}`);
  return path;
}

export async function removeFile(bucket: string, path: string) {
  await supabase.storage.from(bucket).remove([path]);
}

/** Private buckets: a short-lived signed URL is created for the signed-in user, then the browser downloads it. */
export async function downloadStoredFile(bucket: string, path: string, fileName: string) {
  if (!path) throw new Error("ยังไม่มีไฟล์ของรายการนี้ในระบบ");
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, 300, { download: fileName || "document" });
  if (error || !data) throw new Error(`ดาวน์โหลด ${fileName} ไม่สำเร็จ${error ? `: ${error.message}` : ""}`);
  const link = document.createElement("a");
  link.href = data.signedUrl;
  link.download = fileName || "document";
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

/** Opens a stored file in a new tab (used for previews of offers/invoices). */
export async function openStoredFile(bucket: string, path: string) {
  if (!path) throw new Error("ยังไม่มีไฟล์ของรายการนี้ในระบบ");
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, 300);
  if (error || !data) throw new Error("เปิดไฟล์ไม่สำเร็จ");
  window.open(data.signedUrl, "_blank", "noopener");
}

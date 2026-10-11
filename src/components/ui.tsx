import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Button({ className, variant = "primary", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" | "danger" }) {
  return <button className={cn("button", `button-${variant}`, className)} {...props} />;
}

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("card", className)} {...props} />;
}

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "red" | "green" | "amber" | "blue" }) {
  return <span className={cn("badge", `badge-${tone}`)}>{children}</span>;
}

export function Empty({ title, description }: { title: string; description?: string }) {
  return <div className="empty"><div className="empty-icon">✦</div><strong>{title}</strong>{description && <p>{description}</p>}</div>;
}

export function Field({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: ReactNode }) {
  return <label className="field"><span>{label}</span>{children}{hint && <small>{hint}</small>}{error && <small className="error">{error}</small>}</label>;
}

export function Stat({ label, value, accent }: { label: string; value: string | number; accent?: boolean }) {
  return <Card className="stat"><span>{label}</span><strong className={accent ? "accent" : ""}>{value}</strong></Card>;
}

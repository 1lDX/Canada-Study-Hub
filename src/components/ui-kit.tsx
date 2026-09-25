import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]", className)}>
      {children}
    </div>
  );
}

export function SectionTitle({ title, desc, action }: { title: string; desc?: string; action?: ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        {desc && <p className="mt-1 text-sm text-muted-foreground">{desc}</p>}
      </div>
      {action}
    </div>
  );
}

type BtnProps = {
  children: ReactNode;
  variant?: "primary" | "outline" | "ghost" | "danger" | "success";
  size?: "sm" | "md";
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
};

const btnBase =
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:pointer-events-none disabled:opacity-50";
const btnVariants = {
  primary: "bg-primary text-primary-foreground hover:bg-primary-dark",
  outline: "border border-border bg-card text-foreground hover:bg-accent",
  ghost: "text-foreground hover:bg-accent",
  danger: "bg-destructive text-destructive-foreground hover:opacity-90",
  success: "bg-success text-success-foreground hover:opacity-90",
};

export function Button({ children, variant = "primary", size = "md", className, ...rest }: BtnProps) {
  return (
    <button
      {...rest}
      type={rest.type ?? "button"}
      className={cn(btnBase, btnVariants[variant], size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2.5 text-sm", className)}
    >
      {children}
    </button>
  );
}

export function LinkButton({
  to,
  children,
  variant = "primary",
  size = "md",
  className,
}: {
  to: string;
  children: ReactNode;
  variant?: keyof typeof btnVariants;
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <Link
      to={to}
      className={cn(btnBase, btnVariants[variant], size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2.5 text-sm", className)}
    >
      {children}
    </Link>
  );
}

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
}

export const inputClass =
  "w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/25";

export function Badge({
  children,
  tone = "muted",
}: {
  children: ReactNode;
  tone?: "muted" | "success" | "warning" | "danger" | "info" | "primary";
}) {
  const tones = {
    muted: "bg-muted text-muted-foreground",
    success: "bg-success/12 text-success",
    warning: "bg-warning/20 text-warning-foreground",
    danger: "bg-destructive/12 text-destructive",
    info: "bg-info/12 text-info",
    primary: "bg-primary/10 text-primary",
  };
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium", tones[tone])}>
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const tone =
    status === "เสร็จสิ้น" || status === "ชำระเงินแล้ว" || status === "เตรียมรับนักเรียน"
      ? "success"
      : status === "ส่งกลับให้แก้ไข"
        ? "danger"
        : status === "รอตรวจสอบ" || status.startsWith("รอ")
          ? "warning"
          : "info";
  return <Badge tone={tone as never}>{status}</Badge>;
}

export function Stat({ label, value, tone }: { label: string; value: ReactNode; tone?: string }) {
  return (
    <Card className="p-4">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={cn("mt-1 text-2xl font-semibold", tone)}>{value}</p>
    </Card>
  );
}

export function Table({ head, children }: { head: string[]; children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
      <table className="w-full min-w-[640px] text-sm">
        <thead className="bg-surface text-left text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            {head.map((h) => (
              <th key={h} className="px-4 py-3 font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">{children}</tbody>
      </table>
    </div>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-surface px-6 py-10 text-center text-sm text-muted-foreground">
      {children}
    </div>
  );
}

export function FileInput({ onFile, value }: { onFile: (name: string) => void; value?: string | undefined }) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-dashed border-border bg-surface px-3 py-3">
      <input
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (!f) return;
          if (f.size > 8 * 1024 * 1024) {
            alert("ไฟล์ต้องไม่เกิน 8 MB");
            return;
          }
          onFile(f.name);
        }}
        className="text-xs"
      />
      {value && <Badge tone="success">อัปโหลดแล้ว: {value}</Badge>}
    </div>
  );
}

import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

/** Internal link that accepts a plain string path (paths are built dynamically). */
export function ALink({
  to,
  className,
  onClick,
  children,
}: {
  to: string;
  className?: string;
  onClick?: () => void;
  children: ReactNode;
}) {
  return (
    <Link to={to as never} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}

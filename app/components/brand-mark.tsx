import Link from "next/link";
import { Layers3 } from "lucide-react";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      href="/"
      className="brand-link focus-ring"
      aria-label="CampusGig home"
    >
      <span className="brand-icon" aria-hidden="true">
        <Layers3 size={compact ? 17 : 19} strokeWidth={2.2} />
      </span>
      <span className={compact ? "text-base font-bold" : "text-lg font-bold"}>
        CampusGig
      </span>
    </Link>
  );
}

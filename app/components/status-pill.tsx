import { Check, Clock3, FileCheck2, ShieldCheck, X } from "lucide-react";

type StatusTone = "success" | "pending" | "neutral" | "danger" | "proof";

const iconMap = {
  success: Check,
  pending: Clock3,
  neutral: FileCheck2,
  danger: X,
  proof: ShieldCheck,
};

export function StatusPill({ label, tone = "neutral" }: { label: string; tone?: StatusTone }) {
  const Icon = iconMap[tone];
  return (
    <span className={`status-pill status-${tone}`}>
      <Icon size={13} strokeWidth={2.3} aria-hidden="true" />
      {label}
    </span>
  );
}

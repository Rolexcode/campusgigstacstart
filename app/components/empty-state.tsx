import Link from "next/link";
import { Inbox } from "lucide-react";

export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="empty-state">
      <span className="empty-icon" aria-hidden="true">
        <Inbox size={24} />
      </span>
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="max-w-md text-sm leading-6 text-muted">{description}</p>
      {actionLabel && actionHref ? (
        <Link className="btn btn-secondary mt-2" href={actionHref}>
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}

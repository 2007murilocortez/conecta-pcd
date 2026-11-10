import { cn } from "cn";

type EmptyStateProps = {
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
};

export function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <div
      role="status"
      className={cn(
        "rounded-[1.25rem] border border-dashed border-border bg-card px-6 py-10 text-center",
        className,
      )}
    >
      <p className="mb-2 text-lg font-semibold text-primary-dark">{title}</p>
      <p className="mx-auto mb-0 max-w-lg text-neutral-600">{description}</p>
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}

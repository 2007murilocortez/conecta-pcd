import { cn } from "cn";

const TONES = {
  success: "bg-[var(--success-surface)] text-[var(--success-text)]",
  info: "bg-brand-light text-primary-dark",
  warning: "bg-[#FFF6E8] text-warning",
  danger: "bg-[#FDECEC] text-danger",
  neutral: "bg-neutral-100 text-neutral-900",
} as const;

type StatusBadgeProps = {
  children: React.ReactNode;
  tone?: keyof typeof TONES;
  className?: string;
};

export function applicationStatusTone(status: string): keyof typeof TONES {
  if (status === "aprovado") return "success";
  if (status === "rejeitado") return "danger";
  if (status === "entrevista") return "info";
  if (status === "em_analise") return "warning";
  return "neutral";
}

export function StatusBadge({ children, tone = "neutral", className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex min-h-8 items-center rounded-full px-3 text-sm font-medium",
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

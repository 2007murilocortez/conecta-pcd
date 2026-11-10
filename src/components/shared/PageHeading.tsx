import { cn } from "cn";

type PageHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
};

export function PageHeading({
  eyebrow,
  title,
  description,
  actions,
  className,
}: PageHeadingProps) {
  return (
    <div className={cn("mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="max-w-2xl">
        {eyebrow ? (
          <p className="mb-2 text-sm font-medium text-primary">{eyebrow}</p>
        ) : null}
        <h1 className="text-primary-dark text-[clamp(1.8rem,3vw,2.5rem)] leading-tight">{title}</h1>
        {description ? <p className="mt-2 mb-0 text-neutral-600">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

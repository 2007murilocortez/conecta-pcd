import { cn } from "cn";

type PageShellProps = {
  children: React.ReactNode;
  width?: "narrow" | "default" | "wide";
  className?: string;
};

const WIDTH = {
  narrow: "max-w-3xl",
  default: "max-w-5xl",
  wide: "max-w-6xl",
} as const;

export function PageShell({ children, width = "default", className }: PageShellProps) {
  return (
    <div className={cn("mx-auto w-full px-4 py-8 sm:py-10 lg:py-12", WIDTH[width], className)}>
      {children}
    </div>
  );
}

import { cn } from "cn";

export function OrbitalBackdrop({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <span className="absolute -top-24 right-[-4rem] size-[28rem] rounded-full border-[18px] border-[#56B5EA]/25" />
      <span className="absolute top-16 right-16 size-3 rounded-full bg-[#56B5EA]/70" />
      <span className="absolute top-36 right-40 size-2 rounded-full bg-primary/40" />
      <span className="absolute bottom-10 right-[28%] size-[18rem] rounded-full border-[10px] border-primary/10" />
    </div>
  );
}

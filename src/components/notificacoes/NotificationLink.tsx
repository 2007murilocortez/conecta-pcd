"use client";

import Link from "next/link";
import { markNotificationRead } from "@/lib/actions/notifications";

export function NotificationLink({
  id,
  href,
  children,
}: {
  id: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-primary underline underline-offset-4 focus-visible:outline-offset-1"
      onClick={() => {
        void markNotificationRead(id);
      }}
    >
      {children}
    </Link>
  );
}

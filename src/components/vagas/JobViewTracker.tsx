"use client";

import { useEffect } from "react";
import { rememberJobView } from "@/lib/actions/jobs";

export function JobViewTracker({ jobId }: { jobId: string }) {
  useEffect(() => {
    void rememberJobView(jobId);
  }, [jobId]);

  return null;
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { completeCourse, enrollInCourse } from "@/lib/actions/courses";
import { courseStatusLabel } from "@/lib/constants/courses";

export function CourseEnrollmentActions({
  courseId,
  status,
}: {
  courseId: string;
  status: "em_andamento" | "concluido" | null;
}) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function enroll() {
    setPending(true);
    const result = await enrollInCourse({ course_id: courseId });
    setPending(false);
    setMessage(result.error ?? "Inscrição registrada como em andamento.");
    if (!result.error) router.refresh();
  }

  async function complete() {
    setPending(true);
    const result = await completeCourse({ course_id: courseId });
    setPending(false);
    setMessage(result.error ?? "Curso marcado como concluído.");
    if (!result.error) router.refresh();
  }

  return (
    <div className="space-y-2">
      {status ? (
        <p>
          Situação: <strong>{courseStatusLabel(status)}</strong>
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        {!status ? (
          <Button type="button" onClick={enroll} disabled={pending}>
            {pending ? "Inscrevendo…" : "Inscrever-se"}
          </Button>
        ) : null}
        {status === "em_andamento" ? (
          <Button type="button" onClick={complete} disabled={pending}>
            {pending ? "Salvando…" : "Marcar como concluído"}
          </Button>
        ) : null}
      </div>

      <div aria-live="polite" className="sr-only">
        {message}
      </div>
      {message ? <p role="status">{message}</p> : null}
    </div>
  );
}

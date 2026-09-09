import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CourseEnrollmentActions } from "@/components/cursos/CourseEnrollmentActions";
import { ACCESSIBILITY_NEEDS } from "@/lib/constants/profile";
import { ACCESSIBILITY_RESOURCES, labelFor } from "@/lib/constants/jobs";
import type { CourseCard as CourseCardData } from "@/lib/actions/courses";

const EXTRA_FEATURE_LABELS: Record<string, string> = {
  certificado: "Certificado",
  audiodescricao: "Audiodescrição",
};

function featureLabel(feature: string) {
  return (
    ACCESSIBILITY_NEEDS.find((item) => item.value === feature)?.label ??
    EXTRA_FEATURE_LABELS[feature] ??
    labelFor(ACCESSIBILITY_RESOURCES, feature)
  );
}

export function CourseCard({ course }: { course: CourseCardData }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{course.title}</CardTitle>
        <p className="text-neutral-600">
          {course.provider ?? "Instituição"}
          {course.category ? ` · ${course.category}` : ""}
          {course.is_free ? " · Gratuito" : " · Consulte valores no site do curso"}
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {course.description ? <p>{course.description}</p> : null}
        {course.accessibility_features && course.accessibility_features.length > 0 ? (
          <ul className="flex flex-wrap gap-2" aria-label="Recursos de acessibilidade do curso">
            {course.accessibility_features.map((feature) => (
              <li
                key={feature}
                className="rounded-full bg-secondary/10 px-3 py-1 text-sm text-secondary"
              >
                {ACCESSIBILITY_NEEDS.find((item) => item.value === feature)?.label ??
                  labelFor(ACCESSIBILITY_RESOURCES, feature)}
              </li>
            ))}
          </ul>
        ) : null}
        {course.url ? (
          <p>
            <a
              href={course.url}
              target="_blank"
              rel="noreferrer"
              className="text-primary underline underline-offset-4"
            >
              Abrir curso no site oficial
              <span className="sr-only"> (abre em nova aba)</span>
            </a>
          </p>
        ) : null}
      </CardContent>
      <CardFooter>
        <CourseEnrollmentActions courseId={course.id} status={course.enrollmentStatus} />
      </CardFooter>
    </Card>
  );
}

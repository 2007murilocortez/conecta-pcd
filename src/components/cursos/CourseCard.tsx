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
    <Card className="h-full">
      <CardHeader>
        <p className="text-sm font-medium text-primary">{course.provider ?? "Instituição"}</p>
        <CardTitle className="text-lg text-primary-dark">{course.title}</CardTitle>
        <p className="mb-0 text-neutral-600">
          {course.category ? `${course.category} · ` : ""}
          {course.is_free ? "Gratuito" : "Consulte valores no site do curso"}
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {course.description ? <p>{course.description}</p> : null}
        {course.accessibility_features && course.accessibility_features.length > 0 ? (
          <ul className="flex flex-wrap gap-2" aria-label="Recursos de acessibilidade do curso">
            {course.accessibility_features.map((feature) => (
              <li
                key={feature}
                className="rounded-full bg-success-surface px-3 py-1 text-sm font-medium text-success-text"
              >
                {featureLabel(feature)}
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

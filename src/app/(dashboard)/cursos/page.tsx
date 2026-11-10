import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CourseCard } from "@/components/cursos/CourseCard";
import { CourseFilters } from "@/components/cursos/CourseFilters";
import { EmptyState, PageHeading, PageShell } from "@/components/shared";
import { listCourses } from "@/lib/actions/courses";

export const dynamic = "force-dynamic";

export default async function CursosPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const params = await searchParams;
  const category = params.categoria?.trim() || undefined;
  const result = await listCourses(category);

  return (
    <PageShell width="wide">
      <PageHeading
        eyebrow="Capacitação"
        title="Cursos"
        description="Capacitação curada em fontes oficiais. A inscrição aqui só marca o andamento no seu perfil — o curso em si acontece no site da instituição."
      />

      <CourseFilters category={category} categories={result.categories} />

      {result.error ? <p role="alert">{result.error}</p> : null}

      {result.data.length === 0 ? (
        <EmptyState
          title="Nenhum curso nesta categoria"
          description="Se a lista inteira estiver vazia, o catálogo ainda não foi aplicado no banco. Tente ver todas as categorias."
          action={
            category ? (
              <Button asChild variant="outline">
                <Link href="/cursos">Ver todos</Link>
              </Button>
            ) : undefined
          }
        />
      ) : (
        <ul className="mt-8 grid gap-4 md:grid-cols-2">
          {result.data.map((course) => (
            <li key={course.id}>
              <CourseCard course={course} />
            </li>
          ))}
        </ul>
      )}
    </PageShell>
  );
}

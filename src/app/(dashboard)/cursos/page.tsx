import { CourseCard } from "@/components/cursos/CourseCard";
import { CourseFilters } from "@/components/cursos/CourseFilters";
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
    <div className="mx-auto w-full max-w-5xl space-y-8 px-4 py-12">
      <div>
        <h1 className="text-primary">Cursos</h1>
        <p>
          Capacitação curada em fontes oficiais. A inscrição aqui só marca o
          andamento no seu perfil — o curso em si acontece no site da instituição.
        </p>
      </div>

      <CourseFilters category={category} categories={result.categories} />

      {result.error ? <p role="alert">{result.error}</p> : null}

      {result.data.length === 0 ? (
        <p role="status" className="rounded-md border border-border bg-neutral-100 p-4">
          Nenhum curso nesta categoria ainda. Se a lista inteira estiver vazia,
          o seed de `supabase/seed.sql` ainda não foi aplicado no banco.
        </p>
      ) : (
        <ul className="space-y-4">
          {result.data.map((course) => (
            <li key={course.id}>
              <CourseCard course={course} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

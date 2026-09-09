import { Button } from "@/components/ui/button";

export function CourseFilters({
  category,
  categories,
}: {
  category?: string;
  categories: string[];
}) {
  return (
    <form method="get" className="space-y-4 rounded-xl border border-border p-4">
      <fieldset>
        <legend className="mb-2 font-medium">Categoria</legend>
        <div className="flex flex-wrap gap-3">
          <label className="flex min-h-11 items-center gap-2">
            <input type="radio" name="categoria" value="" defaultChecked={!category} />
            Todas
          </label>
          {categories.map((item) => (
            <label key={item} className="flex min-h-11 items-center gap-2">
              <input
                type="radio"
                name="categoria"
                value={item}
                defaultChecked={category === item}
              />
              {item}
            </label>
          ))}
        </div>
      </fieldset>
      <Button type="submit">Filtrar</Button>
    </form>
  );
}

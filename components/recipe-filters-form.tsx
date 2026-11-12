import Form from "next/form";
import Link from "next/link";
import {
  RECIPE_CATEGORIES,
  RECIPE_DIFFICULTIES,
} from "@/lib/recipes";

interface RecipeFiltersFormProps {
  query: string;
  category: string;
  difficulty: string;
  action?: string;
}

const fieldClassName =
  "h-11 w-full rounded-xl border border-[#e6dccb] bg-white px-3 text-[#1f1a14] outline-none focus:border-[#9a3412] focus:ring-2 focus:ring-[#9a3412]/30";

export function RecipeFiltersForm({
  query,
  category,
  difficulty,
  action = "/recipes",
}: RecipeFiltersFormProps) {
  const hasFilters = Boolean(query || category || difficulty);

  return (
    <Form
      action={action}
      className="mt-8 space-y-4"
      role="search"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label htmlFor="recipe-search" className="sr-only">
          Search recipes
        </label>
        <input
          id="recipe-search"
          name="q"
          type="search"
          defaultValue={query}
          placeholder="Search by title or ingredient"
          maxLength={80}
          className={`flex-1 ${fieldClassName} placeholder:text-[#5c5348]/70`}
        />
        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="inline-flex h-11 items-center rounded-full bg-[#9a3412] px-5 text-sm font-medium text-white hover:bg-[#7c2a0e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9a3412]"
          >
            Search
          </button>
          {hasFilters ? (
            <Link
              href={action}
              className="text-sm font-medium text-[#5c5348] underline-offset-4 hover:text-[#1f1a14] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9a3412]"
            >
              Clear
            </Link>
          ) : null}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="recipe-category" className="block text-sm font-medium">
            Category
          </label>
          <select
            id="recipe-category"
            name="category"
            defaultValue={category}
            className={fieldClassName}
          >
            <option value="">All categories</option>
            {RECIPE_CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="recipe-difficulty"
            className="block text-sm font-medium"
          >
            Difficulty
          </label>
          <select
            id="recipe-difficulty"
            name="difficulty"
            defaultValue={difficulty}
            className={`${fieldClassName} capitalize`}
          >
            <option value="">All difficulties</option>
            {RECIPE_DIFFICULTIES.map((item) => (
              <option key={item} value={item} className="capitalize">
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>
    </Form>
  );
}

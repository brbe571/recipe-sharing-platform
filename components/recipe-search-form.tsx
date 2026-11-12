import Form from "next/form";
import Link from "next/link";

interface RecipeSearchFormProps {
  query: string;
  action?: string;
}

export function RecipeSearchForm({
  query,
  action = "/dashboard",
}: RecipeSearchFormProps) {
  return (
    <Form
      action={action}
      className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
      role="search"
    >
      <label htmlFor="recipe-search" className="sr-only">
        Search recipes
      </label>
      <input
        id="recipe-search"
        name="q"
        type="search"
        defaultValue={query}
        placeholder="Search by title, category, difficulty, or ingredient"
        maxLength={80}
        className="h-11 w-full flex-1 rounded-xl border border-[#e6dccb] bg-white px-3 text-[#1f1a14] outline-none placeholder:text-[#5c5348]/70 focus:border-[#9a3412] focus:ring-2 focus:ring-[#9a3412]/30"
      />
      <div className="flex items-center gap-3">
        <button
          type="submit"
          className="inline-flex h-11 items-center rounded-full bg-[#9a3412] px-5 text-sm font-medium text-white hover:bg-[#7c2a0e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9a3412]"
        >
          Search
        </button>
        {query ? (
          <Link
            href={action}
            className="text-sm font-medium text-[#5c5348] underline-offset-4 hover:text-[#1f1a14] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9a3412]"
          >
            Clear
          </Link>
        ) : null}
      </div>
    </Form>
  );
}

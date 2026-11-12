import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { AppHeader } from "@/components/app-header";
import { GuestHeader } from "@/components/guest-header";
import { RecipesBrowseSkeleton } from "@/components/loading-skeletons";
import { RecipeCard } from "@/components/recipe-card";
import { RecipeFiltersForm } from "@/components/recipe-filters-form";
import {
  buildRecipeSearchOrFilter,
  isRecipeCategory,
  isRecipeDifficulty,
  normalizeRecipeSearchQuery,
  RECIPE_LIST_SELECT,
  type RecipeListItem,
} from "@/lib/recipes";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Recipes · Recipe Share",
  description: "Browse recipes shared by the Recipe Share community.",
};

export const instant = false;

interface RecipesPageProps {
  searchParams: Promise<{
    q?: string | string[];
    category?: string | string[];
    difficulty?: string | string[];
  }>;
}

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

async function RecipesBrowseContent({
  searchParams,
}: {
  searchParams: RecipesPageProps["searchParams"];
}) {
  await connection();
  const params = await searchParams;
  const query = normalizeRecipeSearchQuery(params.q);
  const categoryRaw = firstParam(params.category)?.trim() ?? "";
  const difficultyRaw = firstParam(params.difficulty)?.trim() ?? "";
  const category = isRecipeCategory(categoryRaw) ? categoryRaw : "";
  const difficulty = isRecipeDifficulty(difficultyRaw) ? difficultyRaw : "";
  const searchFilter = buildRecipeSearchOrFilter(query);
  const hasFilters = Boolean(query || category || difficulty);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let recipesQuery = supabase
    .from("recipes")
    .select(RECIPE_LIST_SELECT)
    .order("created_at", { ascending: false });

  if (searchFilter) {
    recipesQuery = recipesQuery.or(searchFilter);
  }

  if (category) {
    recipesQuery = recipesQuery.eq("category", category);
  }

  if (difficulty) {
    recipesQuery = recipesQuery.eq("difficulty", difficulty);
  }

  const { data, error } = await recipesQuery;
  const recipes = (data ?? []) as RecipeListItem[];

  return (
    <>
      {user ? <AppHeader /> : <GuestHeader />}

      <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-10 sm:py-14">
        <p className="text-sm font-medium tracking-wide text-[#9a3412]">
          Community kitchen
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          All recipes
        </h1>
        <p className="mt-3 max-w-2xl text-[#5c5348]">
          Anyone can browse these dishes. Only the cook who shared a recipe can
          edit or delete it.
        </p>

        <RecipeFiltersForm
          query={query}
          category={category}
          difficulty={difficulty}
        />

        {hasFilters ? (
          <p className="mt-4 text-sm text-[#5c5348]">
            Showing
            {query ? (
              <>
                {" "}
                results for{" "}
                <span className="font-medium text-[#1f1a14]">“{query}”</span>
              </>
            ) : (
              " filtered recipes"
            )}
            {category ? (
              <>
                {" "}
                in{" "}
                <span className="font-medium text-[#1f1a14]">{category}</span>
              </>
            ) : null}
            {difficulty ? (
              <>
                {" "}
                ·{" "}
                <span className="font-medium capitalize text-[#1f1a14]">
                  {difficulty}
                </span>
              </>
            ) : null}
          </p>
        ) : null}

        {error ? (
          <p className="mt-10 text-sm text-[#9a3412]" role="alert">
            Could not load recipes: {error.message}
          </p>
        ) : null}

        {recipes.length === 0 && !error ? (
          <div className="mt-10 rounded-2xl border border-dashed border-[#e6dccb] bg-[#fffdf9] px-6 py-10 text-center">
            <h2 className="text-lg font-semibold tracking-tight">
              {hasFilters ? "No matching recipes" : "No recipes yet"}
            </h2>
            <p className="mt-2 text-sm text-[#5c5348]">
              {hasFilters
                ? "Try a different search or clear the filters."
                : "Be the first to share a dish."}
            </p>
            {hasFilters ? (
              <Link
                href="/recipes"
                className="mt-5 inline-flex h-10 items-center rounded-full border border-[#e6dccb] px-4 text-sm font-medium text-[#9a3412] hover:border-[#9a3412]"
              >
                Clear filters
              </Link>
            ) : null}
          </div>
        ) : (
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recipes.map((recipe) => (
              <li key={recipe.id}>
                <RecipeCard recipe={recipe} />
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}

export default function RecipesPage({ searchParams }: RecipesPageProps) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-[#f6f1e8] font-sans text-[#1f1a14]">
      <Suspense fallback={<RecipesBrowseSkeleton />}>
        <RecipesBrowseContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

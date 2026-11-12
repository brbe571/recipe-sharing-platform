import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { AppHeader } from "@/components/app-header";
import { DeleteRecipeButton } from "@/components/delete-recipe-button";
import { DashboardSkeleton } from "@/components/loading-skeletons";
import { RecipeCard } from "@/components/recipe-card";
import { RecipeSearchForm } from "@/components/recipe-search-form";
import {
  buildRecipeSearchOrFilter,
  normalizeRecipeSearchQuery,
  RECIPE_LIST_SELECT,
  type RecipeListItem,
} from "@/lib/recipes";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Dashboard · Recipe Share",
  description: "Browse recipes shared by other cooks and manage your own.",
};

// Auth + Supabase session checks use the current time; allow request-time rendering.
export const instant = false;

interface DashboardPageProps {
  searchParams: Promise<{ q?: string | string[] }>;
}

async function DashboardContent({
  searchParams,
}: {
  searchParams: DashboardPageProps["searchParams"];
}) {
  await connection();
  const params = await searchParams;
  const query = normalizeRecipeSearchQuery(params.q);
  const searchFilter = buildRecipeSearchOrFilter(query);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  let communityQuery = supabase
    .from("recipes")
    .select(RECIPE_LIST_SELECT)
    .neq("user_id", user.id)
    .order("created_at", { ascending: false });

  let myRecipesQuery = supabase
    .from("recipes")
    .select(RECIPE_LIST_SELECT)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (searchFilter) {
    communityQuery = communityQuery.or(searchFilter);
    myRecipesQuery = myRecipesQuery.or(searchFilter);
  }

  const [communityResult, myRecipesResult] = await Promise.all([
    communityQuery,
    myRecipesQuery,
  ]);

  const communityRecipes = (communityResult.data ?? []) as RecipeListItem[];
  const myRecipes = (myRecipesResult.data ?? []) as RecipeListItem[];
  const loadError = communityResult.error || myRecipesResult.error;
  const hasSearch = Boolean(query);

  return (
    <>
      <AppHeader />

      <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-10 sm:py-14">
        <p className="text-sm font-medium tracking-wide text-[#9a3412]">
          Your kitchen feed
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Dashboard
        </h1>
        <p className="mt-3 max-w-2xl text-[#5c5348]">
          Add your own recipes and browse dishes from other cooks.
        </p>

        <RecipeSearchForm query={query} />

        {hasSearch ? (
          <p className="mt-4 text-sm text-[#5c5348]">
            Showing results for{" "}
            <span className="font-medium text-[#1f1a14]">“{query}”</span>
          </p>
        ) : null}

        {loadError ? (
          <p className="mt-10 text-sm text-[#9a3412]" role="alert">
            Could not load recipes: {loadError.message}
          </p>
        ) : null}

        <section className="mt-12" aria-labelledby="my-recipes-heading">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2
                id="my-recipes-heading"
                className="text-2xl font-semibold tracking-tight"
              >
                My recipes
              </h2>
              <p className="mt-1 text-sm text-[#5c5348]">
                Recipes you have shared.
              </p>
            </div>
            <Link
              href="/recipes/new"
              className="text-sm font-medium text-[#9a3412] underline-offset-4 hover:underline"
            >
              Create a recipe
            </Link>
          </div>

          {myRecipes.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-[#e6dccb] bg-[#fffdf9] px-6 py-10 text-center">
              <h3 className="text-lg font-semibold tracking-tight">
                {hasSearch ? "No matching recipes" : "No recipes yet"}
              </h3>
              <p className="mt-2 text-sm text-[#5c5348]">
                {hasSearch
                  ? "Try a different search, or clear the filter to see all of your recipes."
                  : "Start by adding your first dish."}
              </p>
              {hasSearch ? (
                <Link
                  href="/dashboard"
                  className="mt-5 inline-flex h-10 items-center rounded-full border border-[#e6dccb] px-4 text-sm font-medium text-[#9a3412] hover:border-[#9a3412]"
                >
                  Clear search
                </Link>
              ) : (
                <Link
                  href="/recipes/new"
                  className="mt-5 inline-flex h-10 items-center rounded-full bg-[#9a3412] px-4 text-sm font-medium text-white hover:bg-[#7c2a0e]"
                >
                  New recipe
                </Link>
              )}
            </div>
          ) : (
            <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {myRecipes.map((recipe) => (
                <li key={recipe.id} className="flex flex-col gap-3">
                  <RecipeCard recipe={recipe} showAuthor={false} />
                  <div className="flex flex-wrap items-center gap-3 px-1">
                    <Link
                      href={`/recipes/${recipe.id}/edit`}
                      className="inline-flex h-9 items-center rounded-full bg-[#9a3412] px-3 text-sm font-medium text-white hover:bg-[#7c2a0e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9a3412]"
                    >
                      Edit
                    </Link>
                    <DeleteRecipeButton
                      recipeId={recipe.id}
                      recipeTitle={recipe.title}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="mt-14" aria-labelledby="community-recipes-heading">
          <h2
            id="community-recipes-heading"
            className="text-2xl font-semibold tracking-tight"
          >
            From other cooks
          </h2>
          <p className="mt-1 text-sm text-[#5c5348]">
            Open any dish to cook along. Only each recipe&apos;s author can edit
            or delete it.
          </p>

          {communityRecipes.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-[#e6dccb] bg-[#fffdf9] px-6 py-10 text-center">
              <h3 className="text-lg font-semibold tracking-tight">
                {hasSearch
                  ? "No matching community recipes"
                  : "No community recipes yet"}
              </h3>
              <p className="mt-2 text-sm text-[#5c5348]">
                {hasSearch
                  ? "Try another term, or clear the search to browse everything."
                  : "When other people upload recipes, they will show up here."}
              </p>
            </div>
          ) : (
            <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {communityRecipes.map((recipe) => (
                <li key={recipe.id}>
                  <RecipeCard recipe={recipe} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </>
  );
}

export default function DashboardPage({ searchParams }: DashboardPageProps) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-[#f6f1e8] font-sans text-[#1f1a14]">
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

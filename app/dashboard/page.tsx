import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { RecipeCard } from "@/components/recipe-card";
import { SignOutButton } from "@/components/sign-out-button";
import type { RecipeListItem } from "@/lib/recipes";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Dashboard · Recipe Share",
  description: "Browse recipes shared by other cooks and manage your own.",
};

// Auth + Supabase session checks use the current time; allow request-time rendering.
export const instant = false;

async function DashboardContent() {
  await connection();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const recipeSelect =
    "id, title, cooking_time, difficulty, category, created_at, user_id, profiles(username, full_name)";

  const [communityResult, myRecipesResult] = await Promise.all([
    supabase
      .from("recipes")
      .select(recipeSelect)
      .neq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("recipes")
      .select(recipeSelect)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  const communityRecipes = (communityResult.data ?? []) as RecipeListItem[];
  const myRecipes = (myRecipesResult.data ?? []) as RecipeListItem[];
  const loadError = communityResult.error || myRecipesResult.error;

  return (
    <>
      <header className="border-b border-[#e6dccb]">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-5 py-4">
          <Link href="/dashboard" className="text-lg font-semibold tracking-tight">
            Recipe Share
          </Link>
          <nav aria-label="Primary" className="flex items-center gap-5 text-sm">
            <Link
              href="/recipes/new"
              className="inline-flex h-9 items-center rounded-full bg-[#9a3412] px-4 text-sm font-medium text-white hover:bg-[#7c2a0e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9a3412]"
            >
              New recipe
            </Link>
            <SignOutButton />
          </nav>
        </div>
      </header>

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
                No recipes yet
              </h3>
              <p className="mt-2 text-sm text-[#5c5348]">
                Start by adding your first dish.
              </p>
              <Link
                href="/recipes/new"
                className="mt-5 inline-flex h-10 items-center rounded-full bg-[#9a3412] px-4 text-sm font-medium text-white hover:bg-[#7c2a0e]"
              >
                New recipe
              </Link>
            </div>
          ) : (
            <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {myRecipes.map((recipe) => (
                <li key={recipe.id}>
                  <RecipeCard recipe={recipe} showAuthor={false} />
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
            Dishes shared by the Recipe Share community.
          </p>

          {communityRecipes.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-[#e6dccb] bg-[#fffdf9] px-6 py-10 text-center">
              <h3 className="text-lg font-semibold tracking-tight">
                No community recipes yet
              </h3>
              <p className="mt-2 text-sm text-[#5c5348]">
                When other people upload recipes, they will show up here.
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

export default function DashboardPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-[#f6f1e8] font-sans text-[#1f1a14]">
      <Suspense
        fallback={
          <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-10 sm:py-14">
            <p className="text-sm text-[#5c5348]">Loading dashboard...</p>
          </main>
        }
      >
        <DashboardContent />
      </Suspense>
    </div>
  );
}

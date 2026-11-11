import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { SignOutButton } from "@/components/sign-out-button";
import { getAuthorName, type RecipeDetail } from "@/lib/recipes";
import { createClient } from "@/lib/supabase/server";

interface RecipePageProps {
  params: Promise<{ id: string }>;
}

export const instant = false;

export async function generateMetadata({
  params,
}: RecipePageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("recipes")
    .select("title")
    .eq("id", id)
    .maybeSingle();

  return {
    title: data?.title
      ? `${data.title} · Recipe Share`
      : "Recipe · Recipe Share",
  };
}

async function RecipeDetailContent({ id }: { id: string }) {
  await connection();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("recipes")
    .select(
      "id, title, ingredients, instructions, cooking_time, difficulty, category, created_at, user_id, profiles(username, full_name)",
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    notFound();
  }

  const recipe = data as RecipeDetail;
  const author = getAuthorName(recipe.profiles);
  const isOwner = user?.id === recipe.user_id;

  return (
    <>
      <header className="border-b border-[#e6dccb]">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-5 py-4">
          <Link href="/dashboard" className="text-lg font-semibold tracking-tight">
            Recipe Share
          </Link>
          <nav aria-label="Primary" className="flex items-center gap-5 text-sm">
            <Link
              href="/dashboard"
              className="rounded-sm text-[#5c5348] underline-offset-4 hover:text-[#1f1a14] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9a3412]"
            >
              Dashboard
            </Link>
            {user ? (
              <>
                <Link
                  href="/recipes/new"
                  className="inline-flex h-9 items-center rounded-full bg-[#9a3412] px-4 text-sm font-medium text-white hover:bg-[#7c2a0e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9a3412]"
                >
                  New recipe
                </Link>
                <SignOutButton />
              </>
            ) : (
              <Link
                href="/login"
                className="rounded-sm text-[#5c5348] underline-offset-4 hover:text-[#1f1a14] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9a3412]"
              >
                Log in
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-10 sm:py-14">
        <p className="text-xs font-medium tracking-wide text-[#9a3412] uppercase">
          {recipe.category}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          {recipe.title}
        </h1>
        <p className="mt-3 text-[#5c5348]">
          by {author}
          {isOwner ? " (you)" : ""}
          <span aria-hidden="true"> · </span>
          <span className="sr-only">, </span>
          {recipe.cooking_time} min
          <span aria-hidden="true"> · </span>
          <span className="sr-only">, </span>
          {recipe.difficulty}
        </p>

        <section className="mt-10" aria-labelledby="ingredients-heading">
          <h2
            id="ingredients-heading"
            className="text-xl font-semibold tracking-tight"
          >
            Ingredients
          </h2>
          <p className="mt-3 whitespace-pre-wrap text-[#5c5348] leading-7">
            {recipe.ingredients}
          </p>
        </section>

        <section className="mt-10" aria-labelledby="instructions-heading">
          <h2
            id="instructions-heading"
            className="text-xl font-semibold tracking-tight"
          >
            Instructions
          </h2>
          <p className="mt-3 whitespace-pre-wrap text-[#5c5348] leading-7">
            {recipe.instructions}
          </p>
        </section>
      </main>
    </>
  );
}

export default async function RecipePage({ params }: RecipePageProps) {
  const { id } = await params;

  return (
    <div className="flex min-h-full flex-1 flex-col bg-[#f6f1e8] font-sans text-[#1f1a14]">
      <Suspense
        fallback={
          <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-10 sm:py-14">
            <p className="text-sm text-[#5c5348]">Loading recipe...</p>
          </main>
        }
      >
        <RecipeDetailContent id={id} />
      </Suspense>
    </div>
  );
}

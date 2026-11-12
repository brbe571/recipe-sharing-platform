import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { AppHeader } from "@/components/app-header";
import { DeleteRecipeButton } from "@/components/delete-recipe-button";
import { GuestHeader } from "@/components/guest-header";
import { RecipeDetailSkeleton } from "@/components/loading-skeletons";
import { RecipeComments } from "@/components/recipe-comments";
import { RecipeLikeButton } from "@/components/recipe-like-button";
import {
  getAuthorName,
  RECIPE_DETAIL_SELECT,
  type RecipeDetail,
} from "@/lib/recipes";
import { COMMENT_LIST_SELECT, type RecipeComment } from "@/lib/social";
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

  const recipeResult = await supabase
    .from("recipes")
    .select(RECIPE_DETAIL_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (recipeResult.error || !recipeResult.data) {
    notFound();
  }

  const recipe = recipeResult.data as RecipeDetail;

  const [likesCountResult, likedByUserResult, commentsResult] =
    await Promise.all([
      supabase
        .from("recipe_likes")
        .select("*", { count: "exact", head: true })
        .eq("recipe_id", id),
      user
        ? supabase
            .from("recipe_likes")
            .select("recipe_id")
            .eq("recipe_id", id)
            .eq("user_id", user.id)
            .maybeSingle()
        : Promise.resolve({ data: null, error: null }),
      supabase
        .from("recipe_comments")
        .select(COMMENT_LIST_SELECT)
        .eq("recipe_id", id)
        .order("created_at", { ascending: true }),
    ]);

  const likeCount = likesCountResult.count ?? 0;
  const likedByCurrentUser = Boolean(likedByUserResult.data);
  const comments = (commentsResult.data ?? []) as RecipeComment[];
  const author = getAuthorName(recipe.profiles);
  const isOwner = user?.id === recipe.user_id;

  return (
    <>
      {user ? <AppHeader /> : <GuestHeader />}

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

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <RecipeLikeButton
            recipeId={recipe.id}
            likeCount={likeCount}
            likedByCurrentUser={likedByCurrentUser}
            isAuthenticated={Boolean(user)}
          />
          {isOwner ? (
            <>
              <Link
                href={`/recipes/${recipe.id}/edit`}
                className="inline-flex h-10 items-center rounded-full bg-[#9a3412] px-4 text-sm font-medium text-white hover:bg-[#7c2a0e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9a3412]"
              >
                Edit recipe
              </Link>
              <DeleteRecipeButton
                recipeId={recipe.id}
                recipeTitle={recipe.title}
              />
            </>
          ) : null}
        </div>

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

        <RecipeComments
          recipeId={recipe.id}
          comments={comments}
          currentUserId={user?.id ?? null}
        />
      </main>
    </>
  );
}

export default async function RecipePage({ params }: RecipePageProps) {
  const { id } = await params;

  return (
    <div className="flex min-h-full flex-1 flex-col bg-[#f6f1e8] font-sans text-[#1f1a14]">
      <Suspense fallback={<RecipeDetailSkeleton />}>
        <RecipeDetailContent id={id} />
      </Suspense>
    </div>
  );
}

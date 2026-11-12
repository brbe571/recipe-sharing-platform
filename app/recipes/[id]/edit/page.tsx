import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { AppHeader } from "@/components/app-header";
import { RecipeFormSkeleton } from "@/components/loading-skeletons";
import { RecipeForm } from "@/components/recipe-form";
import { RECIPE_DETAIL_SELECT, type RecipeDetail } from "@/lib/recipes";
import { createClient } from "@/lib/supabase/server";

interface EditRecipePageProps {
  params: Promise<{ id: string }>;
}

export const instant = false;

export async function generateMetadata({
  params,
}: EditRecipePageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("recipes")
    .select("title")
    .eq("id", id)
    .maybeSingle();

  return {
    title: data?.title
      ? `Edit ${data.title} · Recipe Share`
      : "Edit recipe · Recipe Share",
  };
}

async function EditRecipeContent({ id }: { id: string }) {
  await connection();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data, error } = await supabase
    .from("recipes")
    .select(RECIPE_DETAIL_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    notFound();
  }

  const recipe = data as RecipeDetail;

  if (recipe.user_id !== user.id) {
    redirect(`/recipes/${id}`);
  }

  return (
    <>
      <AppHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-10 sm:py-14">
        <p className="text-sm font-medium tracking-wide text-[#9a3412]">
          Update your dish
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Edit recipe
        </h1>
        <p className="mt-3 max-w-2xl text-[#5c5348]">
          Change the details for{" "}
          <span className="font-medium text-[#1f1a14]">{recipe.title}</span>.
        </p>
        <p className="mt-2 text-sm">
          <Link
            href={`/recipes/${recipe.id}`}
            className="font-medium text-[#9a3412] underline-offset-4 hover:underline"
          >
            Back to recipe
          </Link>
        </p>
        <RecipeForm
          mode="edit"
          recipeId={recipe.id}
          initialValues={{
            title: recipe.title,
            ingredients: recipe.ingredients,
            instructions: recipe.instructions,
            cooking_time: recipe.cooking_time,
            difficulty: recipe.difficulty,
            category: recipe.category,
          }}
        />
      </main>
    </>
  );
}

export default async function EditRecipePage({ params }: EditRecipePageProps) {
  const { id } = await params;

  return (
    <div className="flex min-h-full flex-1 flex-col bg-[#f6f1e8] font-sans text-[#1f1a14]">
      <Suspense
        fallback={<RecipeFormSkeleton titleWidthClassName="w-40" />}
      >
        <EditRecipeContent id={id} />
      </Suspense>
    </div>
  );
}

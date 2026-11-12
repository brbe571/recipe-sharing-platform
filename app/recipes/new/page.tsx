import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { AppHeader } from "@/components/app-header";
import { RecipeFormSkeleton } from "@/components/loading-skeletons";
import { RecipeForm } from "@/components/recipe-form";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "New recipe · Recipe Share",
  description: "Add a new recipe to Recipe Share.",
};

export const instant = false;

async function NewRecipeContent() {
  await connection();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <>
      <AppHeader showNewRecipe={false} />

      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-10 sm:py-14">
        <p className="text-sm font-medium tracking-wide text-[#9a3412]">
          Share a dish
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Create a recipe
        </h1>
        <p className="mt-3 max-w-2xl text-[#5c5348]">
          Write down the ingredients and steps so others can cook it too.
        </p>
        <RecipeForm />
      </main>
    </>
  );
}

export default function NewRecipePage() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-[#f6f1e8] font-sans text-[#1f1a14]">
      <Suspense fallback={<RecipeFormSkeleton />}>
        <NewRecipeContent />
      </Suspense>
    </div>
  );
}

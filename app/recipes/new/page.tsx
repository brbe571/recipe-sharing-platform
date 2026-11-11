import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { RecipeForm } from "@/components/recipe-form";
import { SignOutButton } from "@/components/sign-out-button";
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
            <SignOutButton />
          </nav>
        </div>
      </header>

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
      <Suspense
        fallback={
          <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-10 sm:py-14">
            <p className="text-sm text-[#5c5348]">Loading form...</p>
          </main>
        }
      >
        <NewRecipeContent />
      </Suspense>
    </div>
  );
}

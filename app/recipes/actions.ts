"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  isRecipeCategory,
  isRecipeDifficulty,
} from "@/lib/recipes";
import { createClient } from "@/lib/supabase/server";

export interface CreateRecipeState {
  error: string | null;
}

export async function createRecipe(
  _prevState: CreateRecipeState,
  formData: FormData,
): Promise<CreateRecipeState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const title = String(formData.get("title") ?? "").trim();
  const ingredients = String(formData.get("ingredients") ?? "").trim();
  const instructions = String(formData.get("instructions") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const difficulty = String(formData.get("difficulty") ?? "").trim();
  const cookingTimeRaw = String(formData.get("cooking_time") ?? "").trim();
  const cookingTime = Number.parseInt(cookingTimeRaw, 10);

  if (!title || !ingredients || !instructions || !category) {
    return { error: "Please fill in all required fields." };
  }

  if (!isRecipeCategory(category)) {
    return { error: "Please choose a valid category." };
  }

  if (!isRecipeDifficulty(difficulty)) {
    return { error: "Please choose a valid difficulty." };
  }

  if (!Number.isFinite(cookingTime) || cookingTime <= 0) {
    return { error: "Cooking time must be a positive number of minutes." };
  }

  const { data, error } = await supabase
    .from("recipes")
    .insert({
      user_id: user.id,
      title,
      ingredients,
      instructions,
      cooking_time: cookingTime,
      difficulty,
      category,
    })
    .select("id")
    .single();

  if (error || !data) {
    return {
      error: error?.message ?? "Could not create recipe. Please try again.",
    };
  }

  revalidatePath("/dashboard");
  revalidatePath(`/recipes/${data.id}`);
  redirect(`/recipes/${data.id}`);
}

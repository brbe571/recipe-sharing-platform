"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  isRecipeCategory,
  isRecipeDifficulty,
} from "@/lib/recipes";
import { createClient } from "@/lib/supabase/server";

export interface RecipeFormState {
  error: string | null;
}

function parseRecipeForm(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const ingredients = String(formData.get("ingredients") ?? "").trim();
  const instructions = String(formData.get("instructions") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const difficulty = String(formData.get("difficulty") ?? "").trim();
  const cookingTimeRaw = String(formData.get("cooking_time") ?? "").trim();
  const cookingTime = Number.parseInt(cookingTimeRaw, 10);

  if (!title || !ingredients || !instructions || !category) {
    return { error: "Please fill in all required fields." as const };
  }

  if (!isRecipeCategory(category)) {
    return { error: "Please choose a valid category." as const };
  }

  if (!isRecipeDifficulty(difficulty)) {
    return { error: "Please choose a valid difficulty." as const };
  }

  if (!Number.isFinite(cookingTime) || cookingTime <= 0) {
    return {
      error: "Cooking time must be a positive number of minutes." as const,
    };
  }

  return {
    values: {
      title,
      ingredients,
      instructions,
      cooking_time: cookingTime,
      difficulty,
      category,
    },
  };
}

export async function createRecipe(
  _prevState: RecipeFormState,
  formData: FormData,
): Promise<RecipeFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const parsed = parseRecipeForm(formData);
  if ("error" in parsed) {
    return { error: parsed.error ?? "Invalid form data." };
  }

  const { data, error } = await supabase
    .from("recipes")
    .insert({
      user_id: user.id,
      ...parsed.values,
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

export async function updateRecipe(
  recipeId: string,
  _prevState: RecipeFormState,
  formData: FormData,
): Promise<RecipeFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const parsed = parseRecipeForm(formData);
  if ("error" in parsed) {
    return { error: parsed.error ?? "Invalid form data." };
  }

  const { data, error } = await supabase
    .from("recipes")
    .update(parsed.values)
    .eq("id", recipeId)
    .eq("user_id", user.id)
    .select("id")
    .maybeSingle();

  if (error) {
    return {
      error: error.message || "Could not update recipe. Please try again.",
    };
  }

  if (!data) {
    return { error: "Recipe not found or you do not have permission to edit it." };
  }

  revalidatePath("/dashboard");
  revalidatePath(`/recipes/${recipeId}`);
  revalidatePath(`/recipes/${recipeId}/edit`);
  redirect(`/recipes/${recipeId}`);
}

export async function deleteRecipe(formData: FormData) {
  const recipeId = String(formData.get("recipeId") ?? "").trim();

  if (!recipeId) {
    redirect("/dashboard");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data, error } = await supabase
    .from("recipes")
    .delete()
    .eq("id", recipeId)
    .eq("user_id", user.id)
    .select("id");

  if (error || !data?.length) {
    redirect(`/recipes/${recipeId}?error=delete_failed`);
  }

  revalidatePath("/dashboard");
  revalidatePath(`/recipes/${recipeId}`);
  redirect("/dashboard");
}

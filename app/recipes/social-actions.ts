"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { COMMENT_MAX_LENGTH } from "@/lib/social";
import { createClient } from "@/lib/supabase/server";

export interface CommentFormState {
  error: string | null;
}

export async function toggleRecipeLike(formData: FormData) {
  const recipeId = String(formData.get("recipeId") ?? "").trim();

  if (!recipeId) {
    redirect("/recipes");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=/recipes/${recipeId}`);
  }

  const { data: existing, error: existingError } = await supabase
    .from("recipe_likes")
    .select("recipe_id")
    .eq("recipe_id", recipeId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existingError) {
    redirect(`/recipes/${recipeId}?error=like_failed`);
  }

  if (existing) {
    const { error } = await supabase
      .from("recipe_likes")
      .delete()
      .eq("recipe_id", recipeId)
      .eq("user_id", user.id);

    if (error) {
      redirect(`/recipes/${recipeId}?error=like_failed`);
    }
  } else {
    const { error } = await supabase.from("recipe_likes").insert({
      recipe_id: recipeId,
      user_id: user.id,
    });

    if (error) {
      redirect(`/recipes/${recipeId}?error=like_failed`);
    }
  }

  revalidatePath(`/recipes/${recipeId}`);
}

export async function createRecipeComment(
  _prevState: CommentFormState,
  formData: FormData,
): Promise<CommentFormState> {
  const recipeId = String(formData.get("recipeId") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();

  if (!recipeId) {
    return { error: "Recipe not found." };
  }

  if (!body) {
    return { error: "Please write a comment before posting." };
  }

  if (body.length > COMMENT_MAX_LENGTH) {
    return {
      error: `Comments must be ${COMMENT_MAX_LENGTH} characters or fewer.`,
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=/recipes/${recipeId}`);
  }

  const { error } = await supabase.from("recipe_comments").insert({
    recipe_id: recipeId,
    user_id: user.id,
    body,
  });

  if (error) {
    return {
      error: error.message || "Could not post comment. Please try again.",
    };
  }

  revalidatePath(`/recipes/${recipeId}`);
  redirect(`/recipes/${recipeId}`);
}

export async function deleteRecipeComment(formData: FormData) {
  const recipeId = String(formData.get("recipeId") ?? "").trim();
  const commentId = String(formData.get("commentId") ?? "").trim();

  if (!recipeId || !commentId) {
    redirect(recipeId ? `/recipes/${recipeId}` : "/recipes");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=/recipes/${recipeId}`);
  }

  const { data, error } = await supabase
    .from("recipe_comments")
    .delete()
    .eq("id", commentId)
    .eq("user_id", user.id)
    .select("id");

  if (error || !data?.length) {
    redirect(`/recipes/${recipeId}?error=comment_delete_failed`);
  }

  revalidatePath(`/recipes/${recipeId}`);
  redirect(`/recipes/${recipeId}`);
}

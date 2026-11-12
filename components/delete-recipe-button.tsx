"use client";

import { useFormStatus } from "react-dom";
import { deleteRecipe } from "@/app/recipes/actions";

function DeleteSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-10 items-center rounded-full border border-[#e6dccb] px-4 text-sm font-medium text-[#9a3412] hover:border-[#9a3412] hover:bg-[#9a3412]/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9a3412] disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? "Deleting..." : "Delete"}
    </button>
  );
}

interface DeleteRecipeButtonProps {
  recipeId: string;
  recipeTitle: string;
}

export function DeleteRecipeButton({
  recipeId,
  recipeTitle,
}: DeleteRecipeButtonProps) {
  return (
    <form
      action={deleteRecipe}
      onSubmit={(event) => {
        const confirmed = window.confirm(
          `Delete “${recipeTitle}”? This cannot be undone.`,
        );

        if (!confirmed) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="recipeId" value={recipeId} />
      <DeleteSubmitButton />
    </form>
  );
}

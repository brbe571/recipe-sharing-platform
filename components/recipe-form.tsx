"use client";

import { useActionState } from "react";
import {
  createRecipe,
  updateRecipe,
  type RecipeFormState,
} from "@/app/recipes/actions";
import {
  RECIPE_CATEGORIES,
  RECIPE_DIFFICULTIES,
  type RecipeCategory,
  type RecipeDifficulty,
} from "@/lib/recipes";

export interface RecipeFormValues {
  title: string;
  ingredients: string;
  instructions: string;
  cooking_time: number;
  difficulty: RecipeDifficulty | string;
  category: RecipeCategory | string;
}

interface RecipeFormProps {
  mode?: "create" | "edit";
  recipeId?: string;
  initialValues?: Partial<RecipeFormValues>;
}

const initialState: RecipeFormState = {
  error: null,
};

const fieldClassName =
  "w-full rounded-xl border border-[#e6dccb] bg-white px-3 text-[#1f1a14] outline-none focus:border-[#9a3412] focus:ring-2 focus:ring-[#9a3412]/30";

export function RecipeForm({
  mode = "create",
  recipeId,
  initialValues,
}: RecipeFormProps) {
  const action =
    mode === "edit" && recipeId
      ? updateRecipe.bind(null, recipeId)
      : createRecipe;

  const [state, formAction, isPending] = useActionState(action, initialState);
  const isEdit = mode === "edit";

  return (
    <form action={formAction} className="mt-8 space-y-5">
      <div className="space-y-2">
        <label htmlFor="title" className="block text-sm font-medium">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          maxLength={120}
          defaultValue={initialValues?.title ?? ""}
          className={`h-11 ${fieldClassName}`}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div className="space-y-2">
          <label htmlFor="category" className="block text-sm font-medium">
            Category
          </label>
          <select
            id="category"
            name="category"
            required
            defaultValue={initialValues?.category ?? ""}
            className={`h-11 ${fieldClassName}`}
          >
            <option value="" disabled>
              Select category
            </option>
            {RECIPE_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="difficulty" className="block text-sm font-medium">
            Difficulty
          </label>
          <select
            id="difficulty"
            name="difficulty"
            required
            defaultValue={initialValues?.difficulty ?? ""}
            className={`h-11 ${fieldClassName}`}
          >
            <option value="" disabled>
              Select difficulty
            </option>
            {RECIPE_DIFFICULTIES.map((difficulty) => (
              <option key={difficulty} value={difficulty}>
                {difficulty}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="cooking_time" className="block text-sm font-medium">
            Cooking time (minutes)
          </label>
          <input
            id="cooking_time"
            name="cooking_time"
            type="number"
            min={1}
            step={1}
            required
            defaultValue={initialValues?.cooking_time ?? ""}
            className={`h-11 ${fieldClassName}`}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="ingredients" className="block text-sm font-medium">
          Ingredients
        </label>
        <textarea
          id="ingredients"
          name="ingredients"
          required
          rows={6}
          defaultValue={initialValues?.ingredients ?? ""}
          placeholder={"1 cup flour\n2 eggs\n1 tsp salt"}
          className={`py-3 ${fieldClassName}`}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="instructions" className="block text-sm font-medium">
          Instructions
        </label>
        <textarea
          id="instructions"
          name="instructions"
          required
          rows={8}
          defaultValue={initialValues?.instructions ?? ""}
          placeholder={"1. Preheat the oven.\n2. Mix the dry ingredients."}
          className={`py-3 ${fieldClassName}`}
        />
      </div>

      {state.error ? (
        <p className="text-sm text-[#9a3412]" role="alert">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex h-11 items-center justify-center rounded-full bg-[#9a3412] px-5 text-sm font-medium text-white hover:bg-[#7c2a0e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9a3412] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? "Saving..." : isEdit ? "Save changes" : "Save recipe"}
      </button>
    </form>
  );
}

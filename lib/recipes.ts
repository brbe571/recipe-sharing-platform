export const RECIPE_DIFFICULTIES = ["easy", "medium", "hard"] as const;
export const RECIPE_CATEGORIES = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Dessert",
  "Snack",
  "Soup",
  "Pasta",
  "Seafood",
  "Baking",
  "Other",
] as const;

export type RecipeDifficulty = (typeof RECIPE_DIFFICULTIES)[number];
export type RecipeCategory = (typeof RECIPE_CATEGORIES)[number];

export interface ProfileSummary {
  username: string;
  full_name: string | null;
}

export interface RecipeListItem {
  id: string;
  title: string;
  cooking_time: number;
  difficulty: string;
  category: string;
  created_at: string;
  user_id: string;
  profiles: ProfileSummary | ProfileSummary[] | null;
}

export interface RecipeDetail extends RecipeListItem {
  ingredients: string;
  instructions: string;
}

export function getAuthorName(
  profiles: ProfileSummary | ProfileSummary[] | null | undefined,
) {
  const profile = Array.isArray(profiles) ? profiles[0] : profiles;
  return profile?.full_name?.trim() || profile?.username || "Another cook";
}

export function isRecipeDifficulty(value: string): value is RecipeDifficulty {
  return RECIPE_DIFFICULTIES.includes(value as RecipeDifficulty);
}

export function isRecipeCategory(value: string): value is RecipeCategory {
  return RECIPE_CATEGORIES.includes(value as RecipeCategory);
}

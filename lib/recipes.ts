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

/** Disambiguate author embed — likes/comments also link recipes ↔ profiles. */
export const RECIPE_LIST_SELECT =
  "id, title, cooking_time, difficulty, category, created_at, user_id, profiles!recipes_user_id_fkey(username, full_name)" as const;

export const RECIPE_DETAIL_SELECT =
  "id, title, cooking_time, difficulty, category, created_at, user_id, ingredients, instructions, profiles!recipes_user_id_fkey(username, full_name)" as const;

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

export function normalizeRecipeSearchQuery(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) {
    return "";
  }

  return raw.trim().replace(/\s+/g, " ").slice(0, 80);
}

/** PostgREST `.or()` filter for case-insensitive recipe text search. */
export function buildRecipeSearchOrFilter(query: string) {
  const term = normalizeRecipeSearchQuery(query)
    .replace(/[%_,."()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!term) {
    return null;
  }

  const pattern = `%${term}%`;
  return [
    `title.ilike."${pattern}"`,
    `category.ilike."${pattern}"`,
    `difficulty.ilike."${pattern}"`,
    `ingredients.ilike."${pattern}"`,
  ].join(",");
}

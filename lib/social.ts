import type { ProfileSummary } from "@/lib/recipes";

export const COMMENT_MAX_LENGTH = 1000;

/** Disambiguate comment author embed from other recipe ↔ profile links. */
export const COMMENT_LIST_SELECT =
  "id, recipe_id, user_id, body, created_at, profiles!recipe_comments_user_id_fkey(username, full_name)" as const;

export interface RecipeComment {
  id: string;
  recipe_id: string;
  user_id: string;
  body: string;
  created_at: string;
  profiles: ProfileSummary | ProfileSummary[] | null;
}

export function formatCommentTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

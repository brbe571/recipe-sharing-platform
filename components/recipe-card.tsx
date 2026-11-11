import Link from "next/link";
import { getAuthorName, type RecipeListItem } from "@/lib/recipes";

interface RecipeCardProps {
  recipe: RecipeListItem;
  showAuthor?: boolean;
}

export function RecipeCard({ recipe, showAuthor = true }: RecipeCardProps) {
  const author = getAuthorName(recipe.profiles);

  return (
    <Link
      href={`/recipes/${recipe.id}`}
      className="flex h-full flex-col rounded-2xl border border-[#e6dccb] bg-white p-5 transition-colors hover:border-[#9a3412]/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9a3412]"
    >
      <p className="text-xs font-medium tracking-wide text-[#9a3412] uppercase">
        {recipe.category}
      </p>
      <h2 className="mt-2 text-lg font-semibold tracking-tight">{recipe.title}</h2>
      {showAuthor ? (
        <p className="mt-1 text-sm text-[#5c5348]">by {author}</p>
      ) : null}
      <p className="mt-4 text-sm text-[#5c5348]">
        {recipe.cooking_time} min
        <span aria-hidden="true"> · </span>
        <span className="sr-only">, </span>
        {recipe.difficulty}
      </p>
    </Link>
  );
}

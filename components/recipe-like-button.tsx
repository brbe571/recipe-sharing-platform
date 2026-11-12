"use client";

import Link from "next/link";
import { useFormStatus } from "react-dom";
import { toggleRecipeLike } from "@/app/recipes/social-actions";

function LikeSubmitButton({
  likedByCurrentUser,
  likeCount,
}: {
  likedByCurrentUser: boolean;
  likeCount: number;
}) {
  const { pending } = useFormStatus();
  const label = likedByCurrentUser ? "Unlike" : "Like";

  return (
    <button
      type="submit"
      disabled={pending}
      aria-pressed={likedByCurrentUser}
      className={`inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9a3412] disabled:cursor-not-allowed disabled:opacity-70 ${
        likedByCurrentUser
          ? "border-[#9a3412] bg-[#9a3412] text-white hover:bg-[#7c2a0e]"
          : "border-[#e6dccb] text-[#9a3412] hover:border-[#9a3412] hover:bg-[#9a3412]/5"
      }`}
    >
      <span aria-hidden="true">{likedByCurrentUser ? "♥" : "♡"}</span>
      <span>{pending ? "Saving..." : label}</span>
      <span className="tabular-nums">{likeCount}</span>
    </button>
  );
}

interface RecipeLikeButtonProps {
  recipeId: string;
  likeCount: number;
  likedByCurrentUser: boolean;
  isAuthenticated: boolean;
}

export function RecipeLikeButton({
  recipeId,
  likeCount,
  likedByCurrentUser,
  isAuthenticated,
}: RecipeLikeButtonProps) {
  if (!isAuthenticated) {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <p className="inline-flex h-10 items-center rounded-full border border-[#e6dccb] px-4 text-sm text-[#5c5348]">
          <span aria-hidden="true" className="mr-2">
            ♡
          </span>
          {likeCount} {likeCount === 1 ? "like" : "likes"}
        </p>
        <Link
          href={`/login?next=/recipes/${recipeId}`}
          className="text-sm font-medium text-[#9a3412] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9a3412]"
        >
          Log in to like
        </Link>
      </div>
    );
  }

  return (
    <form action={toggleRecipeLike}>
      <input type="hidden" name="recipeId" value={recipeId} />
      <LikeSubmitButton
        likedByCurrentUser={likedByCurrentUser}
        likeCount={likeCount}
      />
    </form>
  );
}

"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  createRecipeComment,
  deleteRecipeComment,
  type CommentFormState,
} from "@/app/recipes/social-actions";
import { getAuthorName } from "@/lib/recipes";
import {
  COMMENT_MAX_LENGTH,
  formatCommentTime,
  type RecipeComment,
} from "@/lib/social";

const initialState: CommentFormState = {
  error: null,
};

function CommentSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-10 items-center rounded-full bg-[#9a3412] px-4 text-sm font-medium text-white hover:bg-[#7c2a0e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9a3412] disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? "Posting..." : "Post comment"}
    </button>
  );
}

function DeleteCommentButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="text-sm font-medium text-[#9a3412] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9a3412] disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? "Deleting..." : "Delete"}
    </button>
  );
}

interface RecipeCommentsProps {
  recipeId: string;
  comments: RecipeComment[];
  currentUserId: string | null;
}

export function RecipeComments({
  recipeId,
  comments,
  currentUserId,
}: RecipeCommentsProps) {
  const [state, formAction] = useActionState(createRecipeComment, initialState);

  return (
    <section className="mt-14" aria-labelledby="comments-heading">
      <h2
        id="comments-heading"
        className="text-xl font-semibold tracking-tight"
      >
        Comments
      </h2>
      <p className="mt-1 text-sm text-[#5c5348]">
        {comments.length === 0
          ? "No comments yet."
          : `${comments.length} ${comments.length === 1 ? "comment" : "comments"}`}
      </p>

      {currentUserId ? (
        <form action={formAction} className="mt-6 space-y-3">
          <input type="hidden" name="recipeId" value={recipeId} />
          <label htmlFor="comment-body" className="block text-sm font-medium">
            Add a comment
          </label>
          <textarea
            id="comment-body"
            name="body"
            required
            rows={4}
            maxLength={COMMENT_MAX_LENGTH}
            placeholder="Share a tip, question, or how it turned out"
            className="w-full rounded-xl border border-[#e6dccb] bg-white px-3 py-2 text-[#1f1a14] outline-none placeholder:text-[#5c5348]/70 focus:border-[#9a3412] focus:ring-2 focus:ring-[#9a3412]/30"
          />
          {state.error ? (
            <p className="text-sm text-[#9a3412]" role="alert">
              {state.error}
            </p>
          ) : null}
          <CommentSubmitButton />
        </form>
      ) : (
        <p className="mt-6 text-sm text-[#5c5348]">
          <Link
            href={`/login?next=/recipes/${recipeId}`}
            className="font-medium text-[#9a3412] underline-offset-4 hover:underline"
          >
            Log in
          </Link>{" "}
          to leave a comment.
        </p>
      )}

      {comments.length > 0 ? (
        <ul className="mt-8 space-y-6">
          {comments.map((comment) => {
            const author = getAuthorName(comment.profiles);
            const canDelete = currentUserId === comment.user_id;

            return (
              <li key={comment.id} className="border-t border-[#e6dccb] pt-6">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-sm font-medium text-[#1f1a14]">{author}</p>
                  <p className="text-xs text-[#5c5348]">
                    {formatCommentTime(comment.created_at)}
                  </p>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-[#5c5348] leading-7">
                  {comment.body}
                </p>
                {canDelete ? (
                  <form
                    action={deleteRecipeComment}
                    className="mt-3"
                    onSubmit={(event) => {
                      const confirmed = window.confirm(
                        "Delete this comment? This cannot be undone.",
                      );
                      if (!confirmed) {
                        event.preventDefault();
                      }
                    }}
                  >
                    <input type="hidden" name="recipeId" value={recipeId} />
                    <input type="hidden" name="commentId" value={comment.id} />
                    <DeleteCommentButton />
                  </form>
                ) : null}
              </li>
            );
          })}
        </ul>
      ) : null}
    </section>
  );
}

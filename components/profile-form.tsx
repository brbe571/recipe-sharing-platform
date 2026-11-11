"use client";

import { useActionState } from "react";
import {
  updateProfile,
  type UpdateProfileState,
} from "@/app/profile/actions";

interface ProfileFormProps {
  username: string;
  fullName: string;
  bio: string;
}

const initialState: UpdateProfileState = {
  error: null,
  success: null,
};

const fieldClassName =
  "w-full rounded-xl border border-[#e6dccb] bg-white px-3 text-[#1f1a14] outline-none focus:border-[#9a3412] focus:ring-2 focus:ring-[#9a3412]/30";

export function ProfileForm({ username, fullName, bio }: ProfileFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateProfile,
    initialState,
  );

  return (
    <form action={formAction} className="mt-8 space-y-5">
      <div className="space-y-2">
        <label htmlFor="username" className="block text-sm font-medium">
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          required
          minLength={3}
          maxLength={30}
          defaultValue={username}
          pattern="[A-Za-z0-9_]{3,30}"
          className={`h-11 ${fieldClassName}`}
        />
        <p className="text-xs text-[#5c5348]">
          3–30 characters. Letters, numbers, and underscores only.
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="full_name" className="block text-sm font-medium">
          Full name
        </label>
        <input
          id="full_name"
          name="full_name"
          type="text"
          maxLength={80}
          defaultValue={fullName}
          className={`h-11 ${fieldClassName}`}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="bio" className="block text-sm font-medium">
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={5}
          maxLength={280}
          defaultValue={bio}
          placeholder="Tell people a little about how you cook."
          className={`py-3 ${fieldClassName}`}
        />
        <p className="text-xs text-[#5c5348]">Up to 280 characters.</p>
      </div>

      {state.error ? (
        <p className="text-sm text-[#9a3412]" role="alert">
          {state.error}
        </p>
      ) : null}

      {state.success ? (
        <p className="text-sm text-[#3f6212]" role="status">
          {state.success}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex h-11 items-center justify-center rounded-full bg-[#9a3412] px-5 text-sm font-medium text-white hover:bg-[#7c2a0e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9a3412] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? "Saving..." : "Save profile"}
      </button>
    </form>
  );
}

"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface AuthFormProps {
  mode: "login" | "signup";
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(() => {
    if (mode === "login" && searchParams.get("error") === "auth_callback_failed") {
      return "Email confirmation failed. Please try logging in or signing up again.";
    }

    return null;
  });
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isLogin = mode === "login";
  const title = isLogin ? "Log in" : "Create an account";
  const submitLabel = isLogin ? "Log in" : "Sign up";
  const alternateHref = isLogin ? "/signup" : "/login";
  const alternatePrompt = isLogin
    ? "Need an account?"
    : "Already have an account?";
  const alternateLabel = isLogin ? "Sign up" : "Log in";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setInfoMessage(null);

    if (!isLogin && password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }

    setIsSubmitting(true);
    const supabase = createClient();

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setErrorMessage(error.message);
          return;
        }

        router.push("/dashboard");
        router.refresh();
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        },
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      if (data.session) {
        router.push("/dashboard");
        router.refresh();
        return;
      }

      setInfoMessage("Check your email to confirm your account before logging in.");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-2 text-[#5c5348]">
        {isLogin
          ? "Welcome back. Sign in to keep cooking and sharing."
          : "Join Recipe Share to save and share your favorite dishes."}
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-11 w-full rounded-xl border border-[#e6dccb] bg-white px-3 text-[#1f1a14] outline-none focus:border-[#9a3412] focus:ring-2 focus:ring-[#9a3412]/30"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete={isLogin ? "current-password" : "new-password"}
            required
            minLength={6}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="h-11 w-full rounded-xl border border-[#e6dccb] bg-white px-3 text-[#1f1a14] outline-none focus:border-[#9a3412] focus:ring-2 focus:ring-[#9a3412]/30"
          />
        </div>

        {!isLogin ? (
          <div className="space-y-2">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium"
            >
              Confirm password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="h-11 w-full rounded-xl border border-[#e6dccb] bg-white px-3 text-[#1f1a14] outline-none focus:border-[#9a3412] focus:ring-2 focus:ring-[#9a3412]/30"
            />
          </div>
        ) : null}

        {errorMessage ? (
          <p className="text-sm text-[#9a3412]" role="alert">
            {errorMessage}
          </p>
        ) : null}

        {infoMessage ? (
          <p className="text-sm text-[#3f6212]" role="status">
            {infoMessage}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-11 w-full items-center justify-center rounded-full bg-[#9a3412] px-5 text-sm font-medium text-white hover:bg-[#7c2a0e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9a3412] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Please wait..." : submitLabel}
        </button>
      </form>

      <p className="mt-6 text-sm text-[#5c5348]">
        {alternatePrompt}{" "}
        <Link
          href={alternateHref}
          className="font-medium text-[#9a3412] underline-offset-4 hover:underline"
        >
          {alternateLabel}
        </Link>
      </p>
    </div>
  );
}

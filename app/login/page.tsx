import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth-form";
import { AuthFormSkeleton } from "@/components/loading-skeletons";

export const metadata: Metadata = {
  title: "Log in · Recipe Share",
  description: "Log in to Recipe Share to save and share recipes.",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-[#f6f1e8] font-sans text-[#1f1a14]">
      <header className="border-b border-[#e6dccb]">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-5 py-4">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            Recipe Share
          </Link>
          <Link
            href="/signup"
            className="rounded-sm text-sm text-[#5c5348] underline-offset-4 hover:text-[#1f1a14] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9a3412]"
          >
            Sign up
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 items-start px-5 py-16 sm:py-24">
        <Suspense fallback={<AuthFormSkeleton />}>
          <AuthForm mode="login" />
        </Suspense>
      </main>
    </div>
  );
}

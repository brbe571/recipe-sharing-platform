import Link from "next/link";
import { SignOutButton } from "@/components/sign-out-button";

interface AppHeaderProps {
  showNewRecipe?: boolean;
}

export function AppHeader({ showNewRecipe = true }: AppHeaderProps) {
  return (
    <header className="border-b border-[#e6dccb]">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-5 py-4">
        <Link href="/dashboard" className="text-lg font-semibold tracking-tight">
          Recipe Share
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-5 text-sm">
          <Link
            href="/profile"
            className="rounded-sm text-[#5c5348] underline-offset-4 hover:text-[#1f1a14] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9a3412]"
          >
            Profile
          </Link>
          {showNewRecipe ? (
            <Link
              href="/recipes/new"
              className="inline-flex h-9 items-center rounded-full bg-[#9a3412] px-4 text-sm font-medium text-white hover:bg-[#7c2a0e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9a3412]"
            >
              New recipe
            </Link>
          ) : null}
          <SignOutButton />
        </nav>
      </div>
    </header>
  );
}

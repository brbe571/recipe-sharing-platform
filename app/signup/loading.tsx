import Link from "next/link";
import { AuthFormSkeleton } from "@/components/loading-skeletons";

export default function SignupLoading() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-[#f6f1e8] font-sans text-[#1f1a14]">
      <header className="border-b border-[#e6dccb]">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-5 py-4">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            Recipe Share
          </Link>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-5xl flex-1 items-start px-5 py-16 sm:py-24">
        <AuthFormSkeleton />
      </main>
    </div>
  );
}
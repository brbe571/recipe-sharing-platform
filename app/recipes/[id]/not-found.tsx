import Link from "next/link";

export default function RecipeNotFound() {
  return (
    <div className="flex min-h-full flex-1 flex-col items-start justify-center bg-[#f6f1e8] px-5 py-16 font-sans text-[#1f1a14]">
      <div className="mx-auto w-full max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight">Recipe not found</h1>
        <p className="mt-3 text-[#5c5348]">
          That recipe may have been removed or the link is incorrect.
        </p>
        <Link
          href="/dashboard"
          className="mt-8 inline-flex h-11 items-center rounded-full bg-[#9a3412] px-5 text-sm font-medium text-white hover:bg-[#7c2a0e]"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
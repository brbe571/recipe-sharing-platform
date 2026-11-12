import type { ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";

function PageShell({
  children,
  maxWidthClassName = "max-w-5xl",
}: {
  children: ReactNode;
  maxWidthClassName?: string;
}) {
  return (
    <main
      className={`mx-auto w-full ${maxWidthClassName} flex-1 px-5 py-10 sm:py-14`}
      aria-busy="true"
      aria-live="polite"
    >
      <span className="sr-only">Loading...</span>
      {children}
    </main>
  );
}

function HeaderSkeleton() {
  return (
    <div className="border-b border-[#e6dccb]">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-5 py-4">
        <Skeleton className="h-6 w-32" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-9 w-24 rounded-full" />
        </div>
      </div>
    </div>
  );
}

function RecipeCardSkeleton() {
  return (
    <div className="rounded-2xl border border-[#e6dccb] bg-white p-5">
      <Skeleton className="h-3 w-16" />
      <Skeleton className="mt-3 h-5 w-3/4" />
      <Skeleton className="mt-2 h-4 w-1/2" />
      <Skeleton className="mt-5 h-4 w-2/3" />
    </div>
  );
}

function RecipeGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }, (_, index) => (
        <li key={index}>
          <RecipeCardSkeleton />
        </li>
      ))}
    </ul>
  );
}

function FormFieldsSkeleton({ fields = 4 }: { fields?: number }) {
  return (
    <div className="mt-8 space-y-5">
      {Array.from({ length: fields }, (_, index) => (
        <div key={index} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-11 w-full" />
        </div>
      ))}
      <Skeleton className="h-11 w-36 rounded-full" />
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <>
      <HeaderSkeleton />
      <PageShell>
        <Skeleton className="h-4 w-28" />
        <Skeleton className="mt-3 h-9 w-48" />
        <Skeleton className="mt-3 h-5 w-full max-w-xl" />
        <Skeleton className="mt-8 h-11 w-full" />
        <Skeleton className="mt-12 h-7 w-36" />
        <Skeleton className="mt-2 h-4 w-48" />
        <RecipeGridSkeleton count={3} />
        <Skeleton className="mt-14 h-7 w-44" />
        <Skeleton className="mt-2 h-4 w-64" />
        <RecipeGridSkeleton count={3} />
      </PageShell>
    </>
  );
}

export function RecipesBrowseSkeleton() {
  return (
    <>
      <HeaderSkeleton />
      <PageShell>
        <Skeleton className="h-4 w-32" />
        <Skeleton className="mt-3 h-9 w-40" />
        <Skeleton className="mt-3 h-5 w-full max-w-xl" />
        <Skeleton className="mt-8 h-11 w-full" />
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-11 w-full" />
        </div>
        <RecipeGridSkeleton count={6} />
      </PageShell>
    </>
  );
}

export function RecipeDetailSkeleton() {
  return (
    <>
      <HeaderSkeleton />
      <PageShell maxWidthClassName="max-w-3xl">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="mt-3 h-9 w-3/4" />
        <Skeleton className="mt-3 h-5 w-1/2" />
        <div className="mt-10 space-y-3">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/5" />
        </div>
        <div className="mt-10 space-y-3">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </PageShell>
    </>
  );
}

export function RecipeFormSkeleton({
  titleWidthClassName = "w-48",
}: {
  titleWidthClassName?: string;
}) {
  return (
    <>
      <HeaderSkeleton />
      <PageShell maxWidthClassName="max-w-3xl">
        <Skeleton className="h-4 w-28" />
        <Skeleton className={`mt-3 h-9 ${titleWidthClassName}`} />
        <Skeleton className="mt-3 h-5 w-full max-w-xl" />
        <FormFieldsSkeleton fields={5} />
      </PageShell>
    </>
  );
}

export function ProfileSkeleton() {
  return (
    <>
      <HeaderSkeleton />
      <PageShell maxWidthClassName="max-w-3xl">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="mt-3 h-9 w-44" />
        <Skeleton className="mt-3 h-5 w-full max-w-xl" />
        <FormFieldsSkeleton fields={3} />
      </PageShell>
    </>
  );
}

export function AuthFormSkeleton() {
  return (
    <div className="w-full max-w-md" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading form...</span>
      <Skeleton className="h-8 w-40" />
      <Skeleton className="mt-3 h-5 w-64" />
      <div className="mt-8 space-y-5">
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-11 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-11 w-full" />
        </div>
        <Skeleton className="h-11 w-full rounded-full" />
      </div>
    </div>
  );
}

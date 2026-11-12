import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { AppHeader } from "@/components/app-header";
import { ProfileSkeleton } from "@/components/loading-skeletons";
import { ProfileForm } from "@/components/profile-form";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Profile · Recipe Share",
  description: "Edit your Recipe Share profile details.",
};

export const instant = false;

async function ProfileContent() {
  await connection();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("username, full_name, bio")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    return (
      <>
        <AppHeader />
        <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-10 sm:py-14">
          <p className="text-sm text-[#9a3412]" role="alert">
            Could not load profile: {error.message}
          </p>
        </main>
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <AppHeader />
        <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-10 sm:py-14">
          <p className="text-sm text-[#9a3412]" role="alert">
            No profile found for this account yet.
          </p>
        </main>
      </>
    );
  }

  return (
    <>
      <AppHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-10 sm:py-14">
        <p className="text-sm font-medium tracking-wide text-[#9a3412]">
          Your account
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Edit profile
        </h1>
        <p className="mt-3 max-w-2xl text-[#5c5348]">
          Update the details other cooks see next to your recipes.
        </p>
        <ProfileForm
          username={profile.username}
          fullName={profile.full_name ?? ""}
          bio={profile.bio ?? ""}
        />
      </main>
    </>
  );
}

export default function ProfilePage() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-[#f6f1e8] font-sans text-[#1f1a14]">
      <Suspense fallback={<ProfileSkeleton />}>
        <ProfileContent />
      </Suspense>
    </div>
  );
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export interface UpdateProfileState {
  error: string | null;
  success: string | null;
}

export async function updateProfile(
  _prevState: UpdateProfileState,
  formData: FormData,
): Promise<UpdateProfileState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const username = String(formData.get("username") ?? "")
    .trim()
    .toLowerCase();
  const fullName = String(formData.get("full_name") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();

  if (!username) {
    return { error: "Username is required.", success: null };
  }

  if (!/^[a-z0-9_]{3,30}$/.test(username)) {
    return {
      error:
        "Username must be 3–30 characters and use only letters, numbers, or underscores.",
      success: null,
    };
  }

  if (fullName.length > 80) {
    return { error: "Full name must be 80 characters or fewer.", success: null };
  }

  if (bio.length > 280) {
    return { error: "Bio must be 280 characters or fewer.", success: null };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      username,
      full_name: fullName || null,
      bio: bio || null,
    })
    .eq("id", user.id);

  if (error) {
    if (error.code === "23505") {
      return {
        error: "That username is already taken. Please choose another.",
        success: null,
      };
    }

    return {
      error: error.message || "Could not update profile. Please try again.",
      success: null,
    };
  }

  revalidatePath("/profile");
  revalidatePath("/dashboard");

  return { error: null, success: "Profile saved." };
}

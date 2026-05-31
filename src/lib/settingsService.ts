import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/currentUser";

export async function loadUserProfile() {
const user =
  await getCurrentUser();

if (!user) {
return null;
}

const { data } =
await supabase
.from("profiles")
.select("*")
.eq("id", user.id)
.maybeSingle();

return data;
}

export async function saveUserProfile(
profile: Record<string, any>
) {
const user =
  await getCurrentUser();

if (!user) {
return;
}

await supabase
.from("profiles")
.update(profile)
.eq("id", user.id);
}

export async function deleteUserAccount() {
const user =
  await getCurrentUser();

if (!user) {
return;
}

await supabase
.from("listings")
.delete()
.eq("owner_id", user.id);

await supabase
.from("profiles")
.delete()
.eq("id", user.id);

await supabase.auth.signOut();
}

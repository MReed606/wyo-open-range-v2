import { supabase } from "@/lib/supabase";

export async function loadUserProfile() {
const {
data: { user },
} = await supabase.auth.getUser();

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
const {
data: { user },
} = await supabase.auth.getUser();

if (!user) {
return;
}

await supabase
.from("profiles")
.update(profile)
.eq("id", user.id);
}

export async function deleteUserAccount() {
const {
data: { user },
} = await supabase.auth.getUser();

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

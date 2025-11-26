import { supabase } from "./supabase";

export async function registerUser(email: string, password: string, username: string, fullName: string) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;

  const user = data.user;
  const { error: insertError } = await supabase
    .from("users")
    .insert([{ auth_id: user?.id, username, full_name: fullName, role_id: 2 }]);

  if (insertError) throw insertError;
  return user;
}

export async function loginUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data.user;
}
import { supabase } from '../supabase';

export async function getAuthUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
}

export async function getUserByAuthId(authId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('user_id, auth_id')
    .eq('auth_id', authId)
    .single();
  
  return { user: data, error };
}

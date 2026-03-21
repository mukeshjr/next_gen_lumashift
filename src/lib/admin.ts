import { createClient } from '@/lib/supabase/server';
import type { UserRole } from '@/types';

interface AdminCheckResult {
  authorized: boolean;
  userId: string | null;
  role: UserRole;
  error?: string;
}

/**
 * Check if the current user is an admin.
 * Use in Server Components and API routes.
 */
export async function checkAdmin(): Promise<AdminCheckResult> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { authorized: false, userId: null, role: 'user', error: 'Not authenticated' };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const role = (profile?.role as UserRole) ?? 'user';

  if (role !== 'admin') {
    return { authorized: false, userId: user.id, role, error: 'Insufficient permissions' };
  }

  return { authorized: true, userId: user.id, role };
}

/**
 * Get user role by ID
 */
export async function getUserRole(userId: string): Promise<UserRole> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();

  return (data?.role as UserRole) ?? 'user';
}

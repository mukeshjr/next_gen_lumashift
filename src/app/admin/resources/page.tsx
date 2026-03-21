import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { checkAdmin } from '@/lib/admin';
import ResourceAdmin from '@/components/admin/ResourceAdmin';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Resource Admin — LumaShift',
  description: 'Generate and manage AI-powered cybersecurity resources',
};

export default async function AdminResourcesPage() {
  const adminCheck = await checkAdmin();
  if (!adminCheck.userId) {
    redirect('/auth/login?redirectTo=/admin/resources');
  }
  if (!adminCheck.authorized) {
    redirect('/dashboard');
  }

  const supabase = await createClient();

  // Fetch existing generated resources
  const { data: resources } = await supabase
    .from('generated_resources')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <ResourceAdmin
      initialResources={resources ?? []}
      userId={adminCheck.userId!}
    />
  );
}

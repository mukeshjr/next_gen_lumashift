import type { Metadata } from 'next';
import { RoleCompare } from '@/components/compare/RoleCompare';

export const metadata: Metadata = {
  title: 'Compare Cybersecurity Roles',
  description:
    'Compare cybersecurity roles side-by-side — responsibilities, skills, tools, certifications, salary, and growth paths. Find the right path for your career.',
};

export default function CompareRolesPage() {
  return (
    <div className="bg-background min-h-screen">
      {/* Hero */}
      <section className="py-20 bg-muted border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="section-tag mx-auto w-fit">Role Comparison Tool</span>
          <h1 className="section-title mt-4">
            Compare Cybersecurity Roles Side by Side
          </h1>
          <p className="section-subtitle mt-4 mx-auto">
            Not sure whether to go into SOC, GRC, or Cloud Security? Compare up to 3 roles
            across responsibilities, skills, tools, certifications, salary, and more.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <RoleCompare />
      </div>
    </div>
  );
}

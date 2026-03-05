import Link from 'next/link';
import { Shield, AlertTriangle } from 'lucide-react';

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-red-100 dark:bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={36} className="text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          Authentication Failed
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          The login link may have expired or already been used. Please request a new one.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/auth/login" className="btn-primary">
            <Shield size={16} /> Try Again
          </Link>
          <Link href="/" className="btn-secondary">
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

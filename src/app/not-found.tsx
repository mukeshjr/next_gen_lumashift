import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background">
      <div className="text-center px-4">
        <p className="text-8xl font-black text-orange-500 mb-4">404</p>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
          Page Not Found
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button variant="brand" size="brand-default">
              <ArrowLeft size={16} /> Back to Home
            </Button>
          </Link>
          <Link href="/contact">
            <Button variant="brandOutline" size="brand-default">
              Contact Us
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

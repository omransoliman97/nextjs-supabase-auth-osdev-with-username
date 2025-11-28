import { ThemeToggle } from '@/components/ThemeToggle';
import Link from 'next/link';

export default function ErrorPage({
  searchParams,
}: {
  searchParams: { message?: string };
}) {

  // This where take the "message" parameter and show it unless if its null ( nothing ) will return this text.
  const errorMessage = searchParams.message || 
    "We couldn't verify your request. The link may have expired or already been used.";

  return (
    <>
    <ThemeToggle />
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="space-y-4 text-center">
          {/* Error Icon */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full  animate-pulse">
            <svg
              className="h-12 w-12 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-bold text-muted-foreground">
            Oops! Something went wrong
          </h1>

          {/* Description */}
          <p className="text-lg text-gray-600">
            {errorMessage}
          </p>

          {/* Help text */}
          <div className="rounded-lg p-4 text-sm text-muted-foreground">
            <p className="font-semibold mb-2">Need help?</p>
            <ul className="space-y-1 text-left list-disc list-inside">
              <li>Check if the link has expired</li>
              <li>Request a new verification email</li>
              <li>Contact support if the problem persists</li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">

          <Link
            href="/"
            className="flex w-full items-center justify-center text-sm text-muted-foreground transition-colors duration-300 cursor-pointer"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
    </>
  );
}
'use client'
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import Link from 'next/link'


export default function NotFound() {
  return (
    <>
    <ThemeToggle />
    <div className="flex w-full min-h-screen items-center justify-center transition-all duration-300  p-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="space-y-4">
          {/* 404 */}
          <div className="mx-auto flex items-center justify-center">
            <span className="text-4xl font-bold text-muted-foreground">404</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-bold text-muted-foreground">
            Page Not Found
          </h1>

          {/* Description */}
          <p className="text-lg text-muted-foreground">
            Sorry, we couldn't find the page you're looking for.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex space-y-3 items-center justify-center">

          <Button
            onClick={() => window.history.back()}
            className="rounded-lg text-sm  shadow-sm cursor-pointer"
          >
            Go Back
          </Button>
        </div>
      <Link
            href="/"
            className="flex w-full items-center justify-center text-sm text-muted-foreground transition-colors duration-300 cursor-pointer"
          >
            ← Back to Home
          </Link>
      </div>
    </div>
    </>
  );
}
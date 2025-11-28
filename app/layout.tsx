import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Toaster } from '@/components/ui/sonner';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Next.js Supabase Auth from OSDEV with username",
  description: "A preconfigured Next.js project with Supabase authentication setup by OSDEV.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* The theme provider */}
        <ThemeProvider attribute="class" enableSystem defaultTheme="system">
        {children}

        {/* The Toaster */}
        <Toaster position="top-right" richColors 
        toastOptions={{
            style: {
              zIndex: 9999,
                    },
         }} 
        expand={true} // This will expand toasts to show descriptions
        visibleToasts={5} // This will expand toasts for 3 seconds
        /> 
        </ThemeProvider>
      </body>
    </html>
  );
}

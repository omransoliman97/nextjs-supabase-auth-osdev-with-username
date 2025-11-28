# Setup Instructions

Complete guide to set up the Supabase Custom Auth Template with username support.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Environment Setup](#environment-setup)
- [Supabase Configuration](#supabase-configuration)
- [Database Setup](#database-setup)
- [Dependencies Installation](#dependencies-installation)
- [Project Structure](#project-structure)
- [Running the Project](#running-the-project)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

- Node.js 18.0 or higher
- npm or yarn package manager
- Supabase account ([Create one here](https://supabase.com))
- Basic knowledge of Next.js and React

---

## Quick Start
```bash
# 1. Clone the repository
git clone <your-repo-url>
cd <project-name>

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# 4. Run development server
npm run dev
```

---

## Environment Setup

Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**Where to find these:**
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to Settings → API
4. Copy the Project URL and anon/public key

---

## Supabase Configuration

### 1. Create a New Supabase Project
- Go to [Supabase Dashboard](https://supabase.com/dashboard)
- Click "New Project"
- Fill in project details and create

### 2. Configure Auth Providers (Optional)
If you want to use OAuth providers (Google, GitHub, etc.):
- Go to Authentication → Providers
- Enable desired providers
- Add OAuth credentials from respective platforms

### 3. Configure Email Templates
- Go to Authentication → Email Templates
- Update "Confirm Signup" template (see `EmailConfirmSignUp.md` in IMPORTANT folder)
- Update "Reset Password" template (see `EmailResetPassword.md` in IMPORTANT folder)

### 4. Set Site URL and Redirect URLs
- Go to Authentication → URL Configuration
- Add your site URL: `http://localhost:3000` (development)
- Add redirect URLs:
  - `http://localhost:3000/auth/callback`
  - `http://localhost:3000/auth/confirm`
  - Add production URLs when deploying

---

## Database Setup

### 1. Create Profiles Table

Run this SQL in your Supabase SQL Editor:
```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
```

### 2. Create the `handle_new_user` Function

Copy the entire function from `DatabaseProfilesHandler.md` (in the IMPORTANT folder) and run it in the SQL Editor. This function:
- Automatically creates a profile when a user signs up
- Handles missing names (defaults to "new" and "user")
- Generates unique usernames
- Works with all auth providers (email, OAuth, etc.)

### 3. Create Database Trigger
```sql
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

### 4. Set Up RLS Policies

Run the policy from `PublicCanViewUsername.md`:
```sql
-- Public can view usernames
CREATE POLICY "Public can view usernames" ON profiles
FOR SELECT
USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
FOR UPDATE
USING (auth.uid() = id);
```

---

## Dependencies Installation

### 1. Supabase Client
```bash
npm install @supabase/supabase-js @supabase/ssr
```
📚 [Documentation](https://supabase.com/docs/guides/auth/server-side/creating-a-client)

### 2. shadcn/ui Components

**Initial Setup:**
```bash
npx shadcn@latest init
```
📚 [Setup Guide](https://ui.shadcn.com/docs/installation/next)

**Install All Components:**
```bash
npx shadcn@latest add alert button card input label sonner
```

**Or install individually:**
- Alert: `npx shadcn@latest add alert`
- Button: `npx shadcn@latest add button`
- Card: `npx shadcn@latest add card`
- Input: `npx shadcn@latest add input`
- Label: `npx shadcn@latest add label`
- Sonner: `npx shadcn@latest add sonner`

**Or use interactive mode:**
```bash
npx shadcn@latest add
```
This opens an interactive UI to select multiple components at once.

### 3. React Icons
```bash
npm install react-icons
```
📚 [Icons Library](https://react-icons.github.io/react-icons/)

### 4. Animation Package
```bash
npm install tw-animate-css
```

---

## Project Structure

### Core Files

#### Supabase Utilities (`utils/supabase/`)
- `client.ts` - Client-side Supabase client
- `server.ts` - Server-side Supabase client
- `middleware.ts` - Middleware utilities

📚 [Creating a Client Guide](https://supabase.com/docs/guides/auth/server-side/creating-a-client)

#### Middleware (`middleware.ts`)
Handles auth state and redirects. Located in the root directory.

#### Auth Functions (`lib/`)
- `auth-functions.ts` - All auth operations (login, signup, logout, password reset, OAuth providers)
- `auth-utils.ts` - Helper functions to prevent unauthorized access
- `auth-utils-client.ts` - Client-side utilities to fetch user profiles

### For Client-Side Auth Protection

If you need to protect client-side pages and redirect unauthenticated users:

**File:** `hooks/useAuthRedirectClient.ts`

This hook checks if the user is logged in on the client side and redirects to the home page (`/`) if they're not authenticated.

**Usage:**
```typescript

  useCheckAndRedirectIfLoggedIn();

```

**Note:** This hook runs on the client side only. For server-side protection, use the utilities in `lib/auth-utils.ts`.

### Pages Overview

#### Auth Pages (`app/(auth)/`)
- `login/` - Login page
- `signup/` - Signup page with username
- `forgot-password/` - Request password reset link
- `reset-password/` - Update password page

#### Auth Callback Pages (`app/(auth)/auth/`)
- `callback/` - OAuth callback handler (redirects to `/home` after successful login)
- `confirm/` - Email confirmation handler
- `confirmed/` - Confirmation success page (redirects to `/login` after 5 seconds)

**Note:** Update redirect URLs in these pages according to your project structure.

#### Error Pages
- `app/error/` - Custom error page (accepts `message` query parameter)
- `app/not-found/` - 404 page

### Components

- `LoginForm.tsx` - Complete login form with validation
- `SignupForm.tsx` - Signup form with username field
- `RequestResetForm.tsx` - Password reset request form
- `UpdatePasswordForm.tsx` - New password form
- `ProvidersButtons.tsx` - OAuth provider buttons (Google, GitHub, etc.)
- `ThemeToggle.tsx` - Dark/Light mode toggle

**Tip:** You can move provider buttons directly into `LoginForm.tsx` if you only want specific providers.

### Layout (`app/layout.tsx`)
Contains:
- `ThemeProvider` - For dark/light theme support
- `Toaster` - For toast notifications (Sonner)

---

## Running the Project

### Development
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) (or the URL shown in your terminal)

### Build for Production
```bash
npm run build
npm start
```

### Deploy on Vercel
1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variables
5. Deploy

📚 [Next.js Deployment Docs](https://nextjs.org/docs/app/building-your-application/deploying)

---

## Troubleshooting

### Common Issues

**❌ "Invalid API key" error**
- Double-check your `.env.local` file
- Make sure you're using the anon/public key, not the service role key
- Restart the dev server after changing environment variables

**❌ User profile not created after signup**
- Verify the `handle_new_user` function exists in your database
- Check if the trigger `on_auth_user_created` is active
- Look at Supabase logs for errors

**❌ OAuth providers not working**
- Ensure redirect URLs are configured in Supabase
- Verify OAuth credentials in Authentication → Providers
- Check that callback URL matches: `your-domain/auth/callback`

**❌ Username already exists**
- The system automatically handles duplicates by appending random numbers
- If this fails, check the `handle_new_user` function logs

**❌ Email confirmation not working**
- Verify email templates are configured correctly
- Check Site URL in Supabase settings
- Ensure redirect URLs include `/auth/confirm`

### Getting Help

- Check all comments in the code - each file is documented
- Review the [Supabase Documentation](https://supabase.com/docs)
- Check [Next.js Documentation](https://nextjs.org/docs)

---

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [React Icons](https://react-icons.github.io/react-icons/)

---

**Note:** All code files include detailed comments explaining functionality. Read through them for deeper understanding of the implementation.
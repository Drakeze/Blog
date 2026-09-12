'use client';

import { ClerkProvider, useUser } from '@clerk/nextjs';
import { ThemeProvider } from 'next-themes';
import posthog from 'posthog-js';
import { useEffect, useRef } from 'react';
import { Toaster } from 'sonner';

function PostHogIdentity() {
  const { user, isSignedIn } = useUser();
  const userId = user?.id;
  const wasSignedIn = useRef(false);

  useEffect(() => {
    if (isSignedIn && user) {
      // Keyed on userId, not the `user` object - Clerk hands back a fresh
      // reference on many re-renders and we don't want to re-identify each time.
      posthog.identify(user.id, {
        email: user.primaryEmailAddress?.emailAddress,
        name: user.fullName ?? user.username ?? undefined,
      });
      wasSignedIn.current = true;
    } else if (isSignedIn === false && wasSignedIn.current) {
      // Only reset on an actual sign-out - not on every anonymous page load,
      // which would throw away the anon distinct_id and break funnel stitching.
      posthog.reset();
      wasSignedIn.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn, userId]);
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      signInUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL ?? '/sign-in'}
      signUpUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL ?? '/sign-up'}
      localization={{
        signUp: {
          start: {
            title: 'Subscribe to Thinking Out Loud',
            subtitle: 'Create an account to comment and follow along',
            actionText: 'Already have an account?',
            actionLink: 'Sign in',
          },
        },
        signIn: {
          start: {
            title: 'Welcome back',
            subtitle: 'Sign in to Thinking Out Loud',
            actionText: 'New here?',
            actionLink: 'Create an account',
          },
        },
      }}
    >
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <PostHogIdentity />
        {children}
        <Toaster richColors position="top-right" />
      </ThemeProvider>
    </ClerkProvider>
  );
}

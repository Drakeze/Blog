import { SignIn } from '@clerk/nextjs';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Sign in', robots: { index: false } };

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-16">
      <SignIn />
    </div>
  );
}

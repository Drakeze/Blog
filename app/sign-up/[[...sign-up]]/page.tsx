import { SignUp } from '@clerk/nextjs';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Sign up', robots: { index: false } };

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-16">
      <SignUp />
    </div>
  );
}

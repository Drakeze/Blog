import { SignIn } from "@clerk/nextjs"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { authConfig } from "@/lib/env"

export default function SignInPage() {
  const adminConfigReady = authConfig.clerkEnabled && authConfig.hasAdminAllowlist

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      {adminConfigReady ? (
        <SignIn
          path="/sign-in"
          routing="path"
          fallbackRedirectUrl="/admin"
          appearance={{
            elements: {
              card: "shadow-xl border border-border rounded-3xl",
              rootBox: "w-full",
            },
          }}
        />
      ) : (
        <Card className="w-full max-w-lg rounded-3xl border-border shadow-lg">
          <CardHeader className="space-y-2">
            <CardTitle className="font-serif text-2xl">Clerk needs one more step</CardTitle>
            <CardDescription>
              Add your Clerk keys and configure an explicit admin allowlist before the admin panel can be used.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` are both required.</p>
            <p>
              Set `CLERK_ADMIN_EMAILS` and/or `CLERK_ADMIN_USER_IDS` so only approved accounts can access `/admin`.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

"use client"

import { SignOutButton } from "@clerk/nextjs"

import { Button } from "@/components/ui/button"

export function LogoutButton() {
  return (
    <SignOutButton redirectUrl="/sign-in">
      <Button variant="ghost" size="sm" className="rounded-full px-3">
        Sign out
      </Button>
    </SignOutButton>
  )
}

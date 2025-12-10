"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"

type BackButtonProps = {
  href?: string
  label?: string
}

export function BackButton({ href = "/admin/posts", label = "Back" }: BackButtonProps) {
  const router = useRouter()

  if (href) {
    return (
      <Button asChild variant="ghost" size="sm" className="rounded-full">
        <Link href={href} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          <span>{label}</span>
        </Link>
      </Button>
    )
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="rounded-full"
      onClick={() => router.back()}
    >
      <ArrowLeft className="h-4 w-4" />
      <span>{label}</span>
    </Button>
  )
}

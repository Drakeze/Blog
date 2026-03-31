import { redirect } from "next/navigation"

type LegacyEditRedirectProps = {
  params: Promise<{ id: string }>
}

export default async function LegacyEditRedirect({ params }: LegacyEditRedirectProps) {
  const { id } = await params
  redirect(`/admin/edit/${id}`)
}
